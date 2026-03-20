import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  createWebinarRegistration: vi.fn().mockResolvedValue(42),
  createContact: vi.fn().mockResolvedValue(1),
  createNotification: vi.fn().mockResolvedValue(1),
  getWebinarRegistrations: vi.fn().mockResolvedValue([]),
}));

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { origin: "https://test.example.com" },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("webinar.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a webinar attendee with valid input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.webinar.register({
      fullName: "Jane Smith",
      email: "jane@example.com",
      companyName: "Acme Ltd",
      sponsoredWorkers: "11–50",
      hasSponsorLicence: "Yes",
      eventSlug: "25-march-webinar",
    });

    expect(result).toEqual({ id: 42, success: true });
  });

  it("registers with minimal required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.webinar.register({
      fullName: "John Doe",
      email: "john@example.com",
      eventSlug: "hub-launch",
    });

    expect(result).toEqual({ id: 42, success: true });
  });

  it("rejects registration with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.webinar.register({
        fullName: "Bad Email",
        email: "not-an-email",
        eventSlug: "25-march-webinar",
      })
    ).rejects.toThrow();
  });

  it("rejects registration with empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.webinar.register({
        fullName: "",
        email: "valid@example.com",
        eventSlug: "25-march-webinar",
      })
    ).rejects.toThrow();
  });

  it("rejects registration with missing eventSlug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.webinar.register({
        fullName: "Test User",
        email: "test@example.com",
        eventSlug: "",
      })
    ).rejects.toThrow();
  });
});

describe("webinar.list", () => {
  it("requires admin access", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.webinar.list({})).rejects.toThrow();
  });

  it("returns registrations for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.webinar.list({});
    expect(Array.isArray(result)).toBe(true);
  });
});
