import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * CRM Feature Tests
 * Tests for avatar upload routes, contact/company update with avatarUrl,
 * and deals pipeline routes.
 */

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@sponsorcomplians.com",
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

function createNonAdminContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
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

describe("CRM Features", () => {
  describe("contacts.update with avatarUrl", () => {
    it("accepts avatarUrl in the update schema", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // First create a contact
      const { id } = await caller.contacts.create({
        firstName: "Avatar",
        lastName: "Test",
        email: `avatar-test-${Date.now()}@example.com`,
        source: "manual",
      });

      // Update with avatarUrl
      const result = await caller.contacts.update({
        id,
        avatarUrl: "https://example.com/avatar.jpg",
      });
      expect(result).toEqual({ success: true });

      // Verify the update persisted
      const contact = await caller.contacts.getById({ id });
      expect((contact as any).avatarUrl).toBe("https://example.com/avatar.jpg");

      // Clean up
      await caller.contacts.delete({ id });
    });

    it("allows setting avatarUrl to null", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const { id } = await caller.contacts.create({
        firstName: "NullAvatar",
        lastName: "Test",
        email: `null-avatar-${Date.now()}@example.com`,
        source: "manual",
      });

      await caller.contacts.update({ id, avatarUrl: "https://example.com/pic.jpg" });
      await caller.contacts.update({ id, avatarUrl: null });

      const contact = await caller.contacts.getById({ id });
      expect((contact as any).avatarUrl).toBeNull();

      await caller.contacts.delete({ id });
    });
  });

  describe("companies.update with avatarUrl", () => {
    it("accepts avatarUrl in the update schema", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const { id } = await caller.companies.create({ name: `AvatarCo-${Date.now()}` });

      const result = await caller.companies.update({
        id,
        avatarUrl: "https://example.com/logo.png",
      });
      expect(result).toEqual({ success: true });

      const company = await caller.companies.getById({ id });
      expect((company as any).avatarUrl).toBe("https://example.com/logo.png");

      await caller.companies.delete({ id });
    });
  });

  describe("deals pipeline", () => {
    it("creates a deal with product and probability", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a company first
      const { id: companyId } = await caller.companies.create({ name: `DealTestCo-${Date.now()}` });

      const { id: dealId } = await caller.deals.create({
        title: "Test Pipeline Deal",
        companyId,
        value: 250000,
        stage: "lead",
        product: "compliance_audit",
        probability: 25,
      });

      expect(dealId).toBeGreaterThan(0);

      // Verify deal data
      const deals = await caller.deals.list({ limit: 100 });
      const deal = (deals as any).items.find((d: any) => d.id === dealId);
      expect(deal).toBeDefined();
      expect(deal.product).toBe("compliance_audit");
      expect(deal.probability).toBe(25);

      // Clean up
      await caller.deals.delete({ id: dealId });
      await caller.companies.delete({ id: companyId });
    });

    it("updates deal stage and probability", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const { id: companyId } = await caller.companies.create({ name: `StageTestCo-${Date.now()}` });
      const { id: dealId } = await caller.deals.create({
        title: "Stage Move Test",
        companyId,
        value: 100000,
        stage: "lead",
        probability: 10,
      });

      // Move to qualified
      await caller.deals.update({ id: dealId, stage: "qualified", probability: 50 });

      const deals = await caller.deals.list({ limit: 100 });
      const deal = (deals as any).items.find((d: any) => d.id === dealId);
      expect(deal.stage).toBe("qualified");
      expect(deal.probability).toBe(50);

      // Clean up
      await caller.deals.delete({ id: dealId });
      await caller.companies.delete({ id: companyId });
    });
  });

  describe("access control", () => {
    it("blocks non-admin from uploading contact avatar", async () => {
      const ctx = createNonAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.contacts.uploadAvatar({
          id: 1,
          fileBase64: "dGVzdA==",
          contentType: "image/png",
          fileName: "test.png",
        })
      ).rejects.toThrow();
    });

    it("blocks non-admin from uploading company avatar", async () => {
      const ctx = createNonAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.companies.uploadAvatar({
          id: 1,
          fileBase64: "dGVzdA==",
          contentType: "image/png",
          fileName: "test.png",
        })
      ).rejects.toThrow();
    });
  });

  describe("contact stats", () => {
    it("returns stats object with total count", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const stats = await caller.contacts.stats();
      expect(stats).toBeDefined();
      expect(typeof (stats as any).total).toBe("number");
    });
  });
});
