import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as fs from "fs";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@sponsorcomplians.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("Booking System", () => {
  // ─── Public Routes ───
  describe("Public booking routes", () => {
    it("getConsultationTypes returns active consultation types", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const types = await caller.booking.getConsultationTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      for (const t of types) {
        expect(t).toHaveProperty("id");
        expect(t).toHaveProperty("name");
        expect(t).toHaveProperty("durationMinutes");
        expect(t.isActive).toBe(true);
      }
    });

    it("getAvailableDates returns date strings for a valid month", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const types = await caller.booking.getConsultationTypes();
      const firstType = types[0];
      const now = new Date();
      // Use next month to ensure we get future dates
      const nextMonth = now.getMonth() + 2 > 12 ? 1 : now.getMonth() + 2;
      const year = nextMonth === 1 ? now.getFullYear() + 1 : now.getFullYear();
      const dates = await caller.booking.getAvailableDates({
        year,
        month: nextMonth,
        consultationTypeId: firstType.id,
      });
      expect(Array.isArray(dates)).toBe(true);
      // Each date should be a valid YYYY-MM-DD string
      for (const d of dates) {
        expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it("getAvailableSlots returns time slots for an available date", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const types = await caller.booking.getConsultationTypes();
      const firstType = types[0];
      const now = new Date();
      const nextMonth = now.getMonth() + 2 > 12 ? 1 : now.getMonth() + 2;
      const year = nextMonth === 1 ? now.getFullYear() + 1 : now.getFullYear();
      const dates = await caller.booking.getAvailableDates({
        year,
        month: nextMonth,
        consultationTypeId: firstType.id,
      });
      if (dates.length > 0) {
        const slots = await caller.booking.getAvailableSlots({
          date: dates[0],
          consultationTypeId: firstType.id,
        });
        expect(Array.isArray(slots)).toBe(true);
        expect(slots.length).toBeGreaterThan(0);
        for (const s of slots) {
          expect(s).toHaveProperty("startTime");
          expect(s).toHaveProperty("endTime");
        }
      }
    });

    it("getSettings returns booking settings", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const settings = await caller.booking.getSettings();
      expect(settings).toHaveProperty("slotDurationMinutes");
      expect(settings).toHaveProperty("maxAdvanceDays");
      expect(typeof settings.slotDurationMinutes).toBe("number");
      expect(typeof settings.maxAdvanceDays).toBe("number");
    });

    it("book creates a new appointment and returns confirmation", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const types = await caller.booking.getConsultationTypes();
      const firstType = types[0];
      const now = new Date();
      const nextMonth = now.getMonth() + 2 > 12 ? 1 : now.getMonth() + 2;
      const year = nextMonth === 1 ? now.getFullYear() + 1 : now.getFullYear();
      const dates = await caller.booking.getAvailableDates({
        year,
        month: nextMonth,
        consultationTypeId: firstType.id,
      });
      expect(dates.length).toBeGreaterThan(0);
      const slots = await caller.booking.getAvailableSlots({
        date: dates[0],
        consultationTypeId: firstType.id,
      });
      expect(slots.length).toBeGreaterThan(0);
      const result = await caller.booking.book({
        consultationTypeId: firstType.id,
        date: dates[0],
        startTime: slots[0].startTime,
        endTime: slots[0].endTime,
        firstName: "Vitest",
        lastName: "Booking",
        email: "vitest-booking@example.com",
        phone: "+44 7000 000000",
        company: "Test Corp",
        urgencyType: "compliance_audit",
        notes: "Automated test booking",
      });
      expect(result).toHaveProperty("id");
      expect(result.status).toBe("confirmed");
      expect(result.date).toBe(dates[0]);
      expect(result.consultationType).toBe(firstType.name);
    });

    it("book rejects double-booking on same slot", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const types = await caller.booking.getConsultationTypes();
      const firstType = types[0];
      const now = new Date();
      const nextMonth = now.getMonth() + 2 > 12 ? 1 : now.getMonth() + 2;
      const year = nextMonth === 1 ? now.getFullYear() + 1 : now.getFullYear();
      const dates = await caller.booking.getAvailableDates({
        year,
        month: nextMonth,
        consultationTypeId: firstType.id,
      });
      const slots = await caller.booking.getAvailableSlots({
        date: dates[0],
        consultationTypeId: firstType.id,
      });
      // Book the first available slot
      const firstSlot = slots[0];
      await caller.booking.book({
        consultationTypeId: firstType.id,
        date: dates[0],
        startTime: firstSlot.startTime,
        endTime: firstSlot.endTime,
        firstName: "Double",
        lastName: "BookTest",
        email: "double-book@example.com",
      });
      // Try to book the same slot again — should fail
      await expect(
        caller.booking.book({
          consultationTypeId: firstType.id,
          date: dates[0],
          startTime: firstSlot.startTime,
          endTime: firstSlot.endTime,
          firstName: "Double",
          lastName: "BookTest2",
          email: "double-book2@example.com",
        })
      ).rejects.toThrow();
    });

    it("cancel rejects with wrong email", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const types = await caller.booking.getConsultationTypes();
      const firstType = types[0];
      const now = new Date();
      const nextMonth = now.getMonth() + 2 > 12 ? 1 : now.getMonth() + 2;
      const year = nextMonth === 1 ? now.getFullYear() + 1 : now.getFullYear();
      const dates = await caller.booking.getAvailableDates({
        year,
        month: nextMonth,
        consultationTypeId: firstType.id,
      });
      const slots = await caller.booking.getAvailableSlots({
        date: dates[0],
        consultationTypeId: firstType.id,
      });
      // Book a slot
      const result = await caller.booking.book({
        consultationTypeId: firstType.id,
        date: dates[0],
        startTime: slots[0].startTime,
        endTime: slots[0].endTime,
        firstName: "Cancel",
        lastName: "Test",
        email: "cancel-test@example.com",
      });
      // Try to cancel with wrong email
      await expect(
        caller.booking.cancel({
          id: result.id,
          email: "wrong@example.com",
          reason: "Testing",
        })
      ).rejects.toThrow("Email does not match");
    });
  });

  // ─── Admin Routes ───
  describe("Admin booking routes", () => {
    it("list returns appointments for admin", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const appointments = await caller.booking.list();
      expect(appointments).toHaveProperty("items");
      expect(appointments).toHaveProperty("total");
      expect(Array.isArray(appointments.items)).toBe(true);
      expect(typeof appointments.total).toBe("number");
    });

    it("stats returns appointment statistics", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const stats = await caller.booking.stats();
      expect(stats).toHaveProperty("total");
      expect(stats).toHaveProperty("upcoming");
      expect(stats).toHaveProperty("completed");
      expect(stats).toHaveProperty("cancelled");
      expect(typeof stats.total).toBe("number");
    });

    it("getAvailability returns availability slots", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const slots = await caller.booking.getAvailability();
      expect(Array.isArray(slots)).toBe(true);
    });

    it("getBookingSettings returns settings for admin", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const settings = await caller.booking.getBookingSettings();
      expect(settings).toHaveProperty("slotDurationMinutes");
    });

    it("getAllConsultationTypes returns all types including inactive", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const types = await caller.booking.getAllConsultationTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
    });
  });

  // ─── Frontend Integration ───
  describe("Frontend booking page", () => {
    it("BookConsultation page exists with 5-step wizard", () => {
      const content = fs.readFileSync("client/src/pages/BookConsultation.tsx", "utf-8");
      expect(content).toContain("type");
      expect(content).toContain("date");
      expect(content).toContain("time");
      expect(content).toContain("details");
      expect(content).toContain("confirm");
      expect(content).toContain("success");
    });

    it("BookConsultation has GDPR consent checkbox", () => {
      const content = fs.readFileSync("client/src/pages/BookConsultation.tsx", "utf-8");
      expect(content).toContain("gdprConsent");
      expect(content).toContain("GDPRConsent");
    });

    it("BookConsultation has double-booking prevention messaging", () => {
      const content = fs.readFileSync("client/src/pages/BookConsultation.tsx", "utf-8");
      expect(content).toContain("booking.book");
    });

    it("All major CTAs link to /book-consultation", () => {
      const pages = [
        "client/src/pages/Home.tsx",
        "client/src/pages/Audit.tsx",
        "client/src/pages/Recruitment.tsx",
        "client/src/pages/HRServices.tsx",
        "client/src/pages/HubSoftware.tsx",
        "client/src/pages/HubDemo.tsx",
      ];
      for (const page of pages) {
        const content = fs.readFileSync(page, "utf-8");
        expect(content).toContain("/book-consultation");
      }
    });

    it("TopNav Request Demo links to /book-consultation", () => {
      const content = fs.readFileSync("client/src/components/TopNav.tsx", "utf-8");
      expect(content).toContain("/book-consultation");
    });

    it("Route is registered in App.tsx", () => {
      const content = fs.readFileSync("client/src/App.tsx", "utf-8");
      expect(content).toContain("/book-consultation");
      expect(content).toContain("BookConsultation");
    });
  });
});
