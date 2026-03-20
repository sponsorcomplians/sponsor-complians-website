import { publicProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import * as db from "./db";
import { sendBookingConfirmation } from "./bookingEmail";

export const bookingRouter = router({
  // PUBLIC: Get consultation types
  getConsultationTypes: publicProcedure.query(async () => {
    return db.getConsultationTypes(true);
  }),

  // PUBLIC: Get available dates for a month
  getAvailableDates: publicProcedure
    .input(z.object({
      year: z.number(),
      month: z.number().min(1).max(12),
      consultationTypeId: z.number(),
    }))
    .query(async ({ input }) => {
      const ct = await db.getConsultationTypeById(input.consultationTypeId);
      const duration = ct?.durationMinutes ?? 30;
      return db.getAvailableDates(input.year, input.month, duration);
    }),

  // PUBLIC: Get available time slots for a specific date
  getAvailableSlots: publicProcedure
    .input(z.object({
      date: z.string(),
      consultationTypeId: z.number(),
    }))
    .query(async ({ input }) => {
      const ct = await db.getConsultationTypeById(input.consultationTypeId);
      const duration = ct?.durationMinutes ?? 30;
      return db.getAvailableSlots(input.date, duration);
    }),

  // PUBLIC: Get booking settings (welcome message, etc.)
  getSettings: publicProcedure.query(async () => {
    const settings = await db.getBookingSettings();
    return {
      welcomeMessage: settings?.welcomeMessage ?? "",
      slotDurationMinutes: settings?.slotDurationMinutes ?? 30,
      maxAdvanceDays: settings?.maxAdvanceDays ?? 30,
    };
  }),

  // PUBLIC: Create a new appointment booking
  book: publicProcedure
    .input(z.object({
      consultationTypeId: z.number(),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      company: z.string().optional(),
      urgencyType: z.string().optional(),
      notes: z.string().optional(),
      timezone: z.string().optional(),
      source: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Get consultation type
      const ct = await db.getConsultationTypeById(input.consultationTypeId);
      if (!ct) throw new TRPCError({ code: "NOT_FOUND", message: "Consultation type not found" });

      // Double-booking prevention: re-check availability
      const slots = await db.getAvailableSlots(input.date, ct.durationMinutes);
      const slotExists = slots.some(s => s.startTime === input.startTime && s.endTime === input.endTime);
      if (!slotExists) {
        throw new TRPCError({ code: "CONFLICT", message: "This time slot is no longer available. Please select another time." });
      }

      // Create the appointment
      const id = await db.createAppointment({
        consultationTypeId: input.consultationTypeId,
        consultationTypeName: ct.name,
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        timezone: input.timezone ?? "Europe/London",
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone ?? null,
        company: input.company ?? null,
        urgencyType: input.urgencyType ?? null,
        notes: input.notes ?? null,
        status: "confirmed",
        source: (input.source as any) ?? "website",
        confirmationSentAt: new Date(),
      });

      // Auto-create contact record if one doesn't exist for this email
      try {
        const existingContacts = await db.getContacts({ search: input.email, limit: 1 });
        if (existingContacts.items.length === 0) {
          await db.createContact({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone ?? null,
            company: input.company ?? null,
            source: "consultation" as any,
            status: "new" as any,
            tags: "consultation-booking",
          });
          console.log(`[Booking] Auto-created contact for ${input.email}`);
        }
      } catch (e) { console.warn("[Booking] Auto-create contact failed:", e); }

      // Auto-create company record if company name provided and doesn't exist
      if (input.company) {
        try {
          const existingCompanies = await db.getCompanies({ search: input.company, limit: 1 });
          const exactMatch = existingCompanies.items.some(
            (c: any) => c.name.toLowerCase() === input.company!.toLowerCase()
          );
          if (!exactMatch) {
            await db.createCompany({ name: input.company });
            console.log(`[Booking] Auto-created company: ${input.company}`);
          }
        } catch (e) { console.warn("[Booking] Auto-create company failed:", e); }
      }

      // Send confirmation email to customer
      try {
        await sendBookingConfirmation({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          consultationType: ct.name,
          date: input.date,
          startTime: input.startTime,
          endTime: input.endTime,
          timezone: input.timezone ?? "Europe/London",
          company: input.company,
          appointmentId: id,
        });
      } catch (e) { console.warn("[Booking] Confirmation email failed:", e); }

      // Track in lead scoring
      try {
        await db.trackVisitorEvent({
          sessionId: input.email,
          email: input.email,
          eventType: "consultation_book",
          eventValue: ct.name,
          pageUrl: "/book-consultation",
        });
      } catch (e) { console.warn("[Booking] Lead scoring failed:", e); }

      // Notify owner
      try {
        const isUrgent = input.urgencyType === "home_office_email";
        await notifyOwner({
          title: isUrgent ? "\u{1F6A8} URGENT Consultation Booked" : "\u{1F4C5} New Consultation Booked",
          content: `${input.firstName} ${input.lastName} (${input.email}) booked a ${ct.name} on ${input.date} at ${input.startTime}.${input.company ? ` Company: ${input.company}` : ""}${input.urgencyType ? ` Urgency: ${input.urgencyType}` : ""}${input.notes ? `\nNotes: ${input.notes}` : ""}`,
        });
      } catch (e) { console.warn("[Booking] Owner notification failed:", e); }

      return { id, status: "confirmed", date: input.date, startTime: input.startTime, endTime: input.endTime, consultationType: ct.name };
    }),

  // PUBLIC: Cancel an appointment (by client)
  cancel: publicProcedure
    .input(z.object({
      id: z.number(),
      email: z.string().email(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const appt = await db.getAppointmentById(input.id);
      if (!appt) throw new TRPCError({ code: "NOT_FOUND", message: "Appointment not found" });
      if (appt.email !== input.email) throw new TRPCError({ code: "FORBIDDEN", message: "Email does not match" });
      if (appt.status === "cancelled") throw new TRPCError({ code: "BAD_REQUEST", message: "Already cancelled" });
      await db.updateAppointment(input.id, {
        status: "cancelled",
        cancelledBy: "client",
        cancellationReason: input.reason ?? null,
      });
      return { success: true };
    }),

  // ADMIN: Get all appointments
  list: adminProcedure
    .input(z.object({
      status: z.string().optional(),
      date: z.string().optional(),
      upcoming: z.boolean().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getAppointments(input ?? {});
    }),

  // ADMIN: Get appointment stats
  stats: adminProcedure.query(async () => {
    return db.getAppointmentStats();
  }),

  // ADMIN: Update appointment status
  updateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
      adminNotes: z.string().optional(),
      outcome: z.string().optional(),
      cancellationReason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const data: any = { status: input.status };
      if (input.adminNotes) data.adminNotes = input.adminNotes;
      if (input.outcome) data.outcome = input.outcome;
      if (input.status === "cancelled") {
        data.cancelledBy = "admin";
        data.cancellationReason = input.cancellationReason ?? "Cancelled by admin";
      }
      await db.updateAppointment(input.id, data);
      return { success: true };
    }),

  // ADMIN: Get popular time slots
  popularSlots: adminProcedure.query(async () => {
    return db.getPopularTimeSlots();
  }),

  // ADMIN: Manage availability slots
  getAvailability: adminProcedure.query(async () => {
    return db.getAllAvailabilitySlots();
  }),

  createAvailability: adminProcedure
    .input(z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.createAvailabilitySlot({ ...input, isActive: true });
      return { id };
    }),

  updateAvailability: adminProcedure
    .input(z.object({
      id: z.number(),
      isActive: z.boolean().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateAvailabilitySlot(id, data);
      return { success: true };
    }),

  deleteAvailability: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteAvailabilitySlot(input.id);
      return { success: true };
    }),

  // ADMIN: Manage blocked dates
  getBlockedDates: adminProcedure.query(async () => {
    return db.getBlockedDates();
  }),

  addBlockedDate: adminProcedure
    .input(z.object({
      date: z.string(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.createBlockedDate(input);
      return { id };
    }),

  removeBlockedDate: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteBlockedDate(input.id);
      return { success: true };
    }),

  // ADMIN: Booking settings
  getBookingSettings: adminProcedure.query(async () => {
    return db.getBookingSettings();
  }),

  updateBookingSettings: adminProcedure
    .input(z.object({
      slotDurationMinutes: z.number().optional(),
      bufferMinutes: z.number().optional(),
      maxDailyBookings: z.number().optional(),
      minAdvanceHours: z.number().optional(),
      maxAdvanceDays: z.number().optional(),
      confirmationEmailEnabled: z.boolean().optional(),
      reminderEmailEnabled: z.boolean().optional(),
      reminderHoursBefore: z.number().optional(),
      welcomeMessage: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await db.updateBookingSettings(input);
      return { success: true };
    }),

  // ADMIN: Manage consultation types
  getAllConsultationTypes: adminProcedure.query(async () => {
    return db.getConsultationTypes(false);
  }),

  createConsultationType: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      durationMinutes: z.number().optional(),
      color: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.createConsultationType({ ...input, isActive: true });
      return { id };
    }),

  updateConsultationType: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      durationMinutes: z.number().optional(),
      color: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateConsultationType(id, data);
      return { success: true };
    }),

  deleteConsultationType: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteConsultationType(input.id);
      return { success: true };
    }),
});
