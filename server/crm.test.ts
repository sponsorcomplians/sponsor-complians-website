import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("CRM Backend Routes", () => {
  describe("dashboard.stats", () => {
    it("returns stats for admin users", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const stats = await caller.dashboard.stats();
      expect(stats).toHaveProperty("contacts");
      expect(stats).toHaveProperty("subscribers");
      expect(stats).toHaveProperty("submissions");
      expect(stats).toHaveProperty("signups");
      expect(stats).toHaveProperty("downloads");
      expect(stats).toHaveProperty("pageViews");
      expect(typeof stats.contacts).toBe("number");
      expect(typeof stats.subscribers).toBe("number");
    });
  });

  describe("submissions.submit", () => {
    it("accepts a valid contact form submission", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.submissions.submit({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        message: "I need help with compliance.",
      });
      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });
  });

  describe("subscribers.subscribe", () => {
    it("accepts a valid newsletter subscription", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.subscribers.subscribe({
        email: `test-${Date.now()}@example.com`,
        source: "newsletter_page",
      });
      expect(result).toHaveProperty("success", true);
    });
  });

  describe("signups.register", () => {
    it("accepts a valid hub signup", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.signups.register({
        firstName: "Jane",
        lastName: "Smith",
        email: `jane-${Date.now()}@example.com`,
        company: "Test Corp",
        source: "signup_page",
      });
      expect(result).toHaveProperty("success", true);
    });
  });

  describe("tracking.trackView", () => {
    it("records a page view", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.tracking.trackView({
        path: "/test-page",
        referrer: "https://google.com",
      });
      expect(result).toHaveProperty("success", true);
    });
  });

  describe("tracking.stats", () => {
    it("returns visitor stats for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const stats = await caller.tracking.stats({ days: 7 });
      expect(stats).toHaveProperty("totalViews");
      expect(stats).toHaveProperty("uniqueVisitors");
      expect(stats).toHaveProperty("topPages");
      expect(typeof stats.totalViews).toBe("number");
    });
  });

  describe("contacts.list", () => {
    it("returns contacts list for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.contacts.list({ limit: 10 });
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  describe("notifications.list", () => {
    it("returns notifications for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.notifications.list({});
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("unreadCount");
      expect(Array.isArray(result.items)).toBe(true);
    });
  });
});
