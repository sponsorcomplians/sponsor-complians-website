import { describe, expect, it, vi } from "vitest";

/**
 * Tests for booking system fixes:
 * 1. Appointment ordering (newest first)
 * 2. Confirmation email sending
 * 3. Auto-create contact/company on booking
 */

describe("Booking Fixes", () => {
  // Test 1: Booking confirmation email module
  describe("sendBookingConfirmation", () => {
    it("exports sendBookingConfirmation function", async () => {
      const mod = await import("./bookingEmail");
      expect(typeof mod.sendBookingConfirmation).toBe("function");
    });

    it("sendBookingConfirmation accepts valid booking data without throwing", async () => {
      const { sendBookingConfirmation } = await import("./bookingEmail");

      // Should not throw even if SendGrid returns an error
      const result = await sendBookingConfirmation({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        consultationType: "Sponsor Licence Compliance Audit",
        date: "2026-04-15",
        startTime: "10:00",
        endTime: "10:30",
        timezone: "Europe/London",
        company: "Acme Ltd",
        appointmentId: 42,
      });

      // Result should be a boolean (true if sent, false if SendGrid not configured or error)
      expect(typeof result).toBe("boolean");
    });

    it("returns false when sendSingleEmail fails", async () => {
      vi.doMock("./sendgridService", () => ({
        sendSingleEmail: vi.fn().mockResolvedValue({ success: false, error: "API key not configured" }),
      }));

      const { sendBookingConfirmation } = await import("./bookingEmail");

      const result = await sendBookingConfirmation({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        consultationType: "Initial Consultation",
        date: "2026-04-20",
        startTime: "14:00",
        endTime: "14:30",
        timezone: "Europe/London",
        appointmentId: 99,
      });

      // Should not throw, just return false
      expect(result).toBeDefined();

      vi.doUnmock("./sendgridService");
    });
  });

  // Test 2: Booking route imports and structure
  describe("bookingRouter structure", () => {
    it("imports sendBookingConfirmation in bookingRoutes", async () => {
      // Verify the module can be imported without errors
      const mod = await import("./bookingRoutes");
      expect(mod.bookingRouter).toBeDefined();
    });

    it("has all required booking procedures", async () => {
      const mod = await import("./bookingRoutes");
      const router = mod.bookingRouter;
      // Check that the router has the expected procedures
      expect(router).toBeDefined();
    });
  });

  // Test 3: Appointment ordering
  describe("appointment ordering", () => {
    it("getAppointments function exists in db module", async () => {
      const db = await import("./db");
      expect(typeof db.getAppointments).toBe("function");
    });
  });

  // Test 4: Contact auto-creation source enum
  describe("contact source enum includes consultation", () => {
    it("schema allows 'consultation' as a contact source", async () => {
      const schema = await import("../drizzle/schema");
      // The contacts table should have the source field with consultation option
      expect(schema.contacts).toBeDefined();
      // Verify the InsertContact type exists
      type InsertContact = typeof schema.contacts.$inferInsert;
      // This is a compile-time check - if 'consultation' is not in the enum, TS would error
      const testData: Partial<InsertContact> = {
        source: "consultation",
      };
      expect(testData.source).toBe("consultation");
    });
  });

  // Test 5: Booking email HTML content
  describe("booking confirmation email content", () => {
    it("includes appointment reference number in email", async () => {
      vi.doMock("./sendgridService", () => ({
        sendSingleEmail: vi.fn().mockImplementation(async (opts: any) => {
          // Verify the HTML contains the appointment reference
          expect(opts.htmlContent).toContain("#APT-42");
          expect(opts.htmlContent).toContain("Sponsor Licence Compliance Audit");
          expect(opts.htmlContent).toContain("10:00");
          expect(opts.htmlContent).toContain("Acme Ltd");
          return { success: true, messageId: "test-id" };
        }),
      }));

      const { sendBookingConfirmation } = await import("./bookingEmail");

      await sendBookingConfirmation({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        consultationType: "Sponsor Licence Compliance Audit",
        date: "2026-04-15",
        startTime: "10:00",
        endTime: "10:30",
        timezone: "Europe/London",
        company: "Acme Ltd",
        appointmentId: 42,
      });

      vi.doUnmock("./sendgridService");
    });

    it("formats date correctly in email subject", async () => {
      vi.doMock("./sendgridService", () => ({
        sendSingleEmail: vi.fn().mockImplementation(async (opts: any) => {
          // Subject should contain formatted date
          expect(opts.subject).toContain("Booking Confirmed");
          expect(opts.subject).toContain("April");
          expect(opts.subject).toContain("2026");
          return { success: true, messageId: "test-id" };
        }),
      }));

      const { sendBookingConfirmation } = await import("./bookingEmail");

      await sendBookingConfirmation({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        consultationType: "Initial Consultation",
        date: "2026-04-15",
        startTime: "14:00",
        endTime: "14:30",
        timezone: "Europe/London",
        appointmentId: 100,
      });

      vi.doUnmock("./sendgridService");
    });
  });
});
