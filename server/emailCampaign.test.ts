import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Email Campaign Router Tests
 * Tests the tRPC procedures for the email campaign system.
 * Uses admin context since all email campaign routes require admin access.
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

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("emailCampaign router", () => {
  let adminCaller: ReturnType<typeof appRouter.createCaller>;
  let userCaller: ReturnType<typeof appRouter.createCaller>;
  let unauthCaller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    adminCaller = appRouter.createCaller(createAdminContext());
    userCaller = appRouter.createCaller(createNonAdminContext());
    unauthCaller = appRouter.createCaller(createUnauthContext());
  });

  // ─── Access Control ───
  describe("access control", () => {
    it("should deny unauthenticated access to campaigns.list", async () => {
      await expect(unauthCaller.emailCampaign.campaigns.list()).rejects.toThrow();
    });

    it("should deny non-admin access to campaigns.list", async () => {
      await expect(userCaller.emailCampaign.campaigns.list()).rejects.toThrow();
    });

    it("should deny unauthenticated access to templates.list", async () => {
      await expect(unauthCaller.emailCampaign.templates.list()).rejects.toThrow();
    });

    it("should deny non-admin access to templates.list", async () => {
      await expect(userCaller.emailCampaign.templates.list()).rejects.toThrow();
    });

    it("should deny unauthenticated access to lists.list", async () => {
      await expect(unauthCaller.emailCampaign.lists.list()).rejects.toThrow();
    });

    it("should deny unauthenticated access to automations.list", async () => {
      await expect(unauthCaller.emailCampaign.automations.list()).rejects.toThrow();
    });

    it("should deny unauthenticated access to dailyEmail.list", async () => {
      await expect(unauthCaller.emailCampaign.dailyEmail.list()).rejects.toThrow();
    });

    it("should deny unauthenticated access to contentSources.list", async () => {
      await expect(unauthCaller.emailCampaign.contentSources.list()).rejects.toThrow();
    });

    it("should deny unauthenticated access to settings.get", async () => {
      await expect(unauthCaller.emailCampaign.settings.get()).rejects.toThrow();
    });
  });

  // ─── Campaigns ───
  describe("campaigns", () => {
    it("should list campaigns for admin", async () => {
      const result = await adminCaller.emailCampaign.campaigns.list();
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.items)).toBe(true);
      expect(typeof result.total).toBe("number");
    });

    it("should list campaigns with filters", async () => {
      const result = await adminCaller.emailCampaign.campaigns.list({
        limit: 10,
        offset: 0,
        status: "draft",
      });
      expect(result).toHaveProperty("items");
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("should create a campaign", async () => {
      const result = await adminCaller.emailCampaign.campaigns.create({
        name: "Test Campaign",
        subject: "Test Subject Line",
        fromName: "Sponsor ComplIANS",
        fromEmail: "hello@sponsorcomplians.com",
      });
      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should get a campaign by id", async () => {
      // First create one
      const created = await adminCaller.emailCampaign.campaigns.create({
        name: "Fetch Test Campaign",
      });
      const campaign = await adminCaller.emailCampaign.campaigns.getById({ id: created.id });
      expect(campaign).not.toBeNull();
      expect(campaign?.name).toBe("Fetch Test Campaign");
    });

    it("should update a campaign", async () => {
      const created = await adminCaller.emailCampaign.campaigns.create({
        name: "Update Test",
      });
      const result = await adminCaller.emailCampaign.campaigns.update({
        id: created.id,
        name: "Updated Campaign Name",
        subject: "Updated Subject",
      });
      expect(result).toEqual({ success: true });

      const updated = await adminCaller.emailCampaign.campaigns.getById({ id: created.id });
      expect(updated?.name).toBe("Updated Campaign Name");
      expect(updated?.subject).toBe("Updated Subject");
    });

    it("should delete a campaign", async () => {
      const created = await adminCaller.emailCampaign.campaigns.create({
        name: "Delete Test",
      });
      const result = await adminCaller.emailCampaign.campaigns.delete({ id: created.id });
      expect(result).toEqual({ success: true });
    });

    it("should get campaign analytics", async () => {
      const analytics = await adminCaller.emailCampaign.campaigns.analytics();
      expect(analytics).toHaveProperty("totalSent");
      expect(analytics).toHaveProperty("totalOpened");
      expect(analytics).toHaveProperty("totalClicked");
      expect(analytics).toHaveProperty("totalBounced");
      expect(analytics).toHaveProperty("campaignCount");
    });
  });

  // ─── Templates ───
  describe("templates", () => {
    it("should list templates for admin", async () => {
      const result = await adminCaller.emailCampaign.templates.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create a template", async () => {
      const result = await adminCaller.emailCampaign.templates.create({
        name: "Test Template",
        category: "newsletter",
        contentHtml: "<h1>Hello</h1>",
      });
      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should get a template by id", async () => {
      const created = await adminCaller.emailCampaign.templates.create({
        name: "Fetch Template",
        category: "promotional",
      });
      const template = await adminCaller.emailCampaign.templates.getById({ id: created.id });
      expect(template).not.toBeNull();
      expect(template?.name).toBe("Fetch Template");
    });

    it("should update a template", async () => {
      const created = await adminCaller.emailCampaign.templates.create({
        name: "Update Template",
        category: "newsletter",
      });
      const result = await adminCaller.emailCampaign.templates.update({
        id: created.id,
        name: "Updated Template Name",
      });
      expect(result).toEqual({ success: true });
    });

    it("should duplicate a template", async () => {
      const created = await adminCaller.emailCampaign.templates.create({
        name: "Original Template",
        category: "newsletter",
        contentHtml: "<p>Content</p>",
      });
      const duplicated = await adminCaller.emailCampaign.templates.duplicate({ id: created.id });
      expect(duplicated).toHaveProperty("id");
      expect(duplicated.id).not.toBe(created.id);
    });

    it("should delete a template", async () => {
      const created = await adminCaller.emailCampaign.templates.create({
        name: "Delete Template",
        category: "newsletter",
      });
      const result = await adminCaller.emailCampaign.templates.delete({ id: created.id });
      expect(result).toEqual({ success: true });
    });
  });

  // ─── Contact Lists ───
  describe("lists", () => {
    it("should list contact lists for admin", async () => {
      const result = await adminCaller.emailCampaign.lists.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create a contact list", async () => {
      const result = await adminCaller.emailCampaign.lists.create({
        name: "Test List",
        description: "A test contact list",
      });
      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should get a list by id", async () => {
      const created = await adminCaller.emailCampaign.lists.create({
        name: "Fetch List",
      });
      const list = await adminCaller.emailCampaign.lists.getById({ id: created.id });
      expect(list).not.toBeNull();
      expect(list?.name).toBe("Fetch List");
    });

    it("should update a list", async () => {
      const created = await adminCaller.emailCampaign.lists.create({
        name: "Update List",
      });
      const result = await adminCaller.emailCampaign.lists.update({
        id: created.id,
        name: "Updated List Name",
      });
      expect(result).toEqual({ success: true });
    });

    it("should delete a list", async () => {
      const created = await adminCaller.emailCampaign.lists.create({
        name: "Delete List",
      });
      const result = await adminCaller.emailCampaign.lists.delete({ id: created.id });
      expect(result).toEqual({ success: true });
    });
  });

  // ─── Automations ───
  describe("automations", () => {
    it("should list automations for admin", async () => {
      const result = await adminCaller.emailCampaign.automations.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create an automation", async () => {
      const result = await adminCaller.emailCampaign.automations.create({
        name: "Test Automation",
        trigger: "contact_created",
      });
      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should update an automation", async () => {
      const created = await adminCaller.emailCampaign.automations.create({
        name: "Update Automation",
        trigger: "contact_created",
      });
      const result = await adminCaller.emailCampaign.automations.update({
        id: created.id,
        name: "Updated Automation",
      });
      expect(result).toEqual({ success: true });
    });

    it("should toggle automation status", async () => {
      const created = await adminCaller.emailCampaign.automations.create({
        name: "Toggle Automation",
        trigger: "contact_created",
      });
      // toggleStatus may not exist, use update instead
      const result = await adminCaller.emailCampaign.automations.update({
        id: created.id,
        status: "active",
      });
      expect(result).toEqual({ success: true });
    });

    it("should delete an automation", async () => {
      const created = await adminCaller.emailCampaign.automations.create({
        name: "Delete Automation",
        trigger: "contact_created",
      });
      const result = await adminCaller.emailCampaign.automations.delete({ id: created.id });
      expect(result).toEqual({ success: true });
    });
  });

  // ─── Daily Email ───
  describe("dailyEmail", () => {
    it("should list daily email drafts", async () => {
      const result = await adminCaller.emailCampaign.dailyEmail.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should list daily email drafts with filters", async () => {
      const result = await adminCaller.emailCampaign.dailyEmail.list({ limit: 5 });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ─── Content Sources ───
  describe("contentSources", () => {
    it("should list content sources", async () => {
      const result = await adminCaller.emailCampaign.contentSources.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create a content source", async () => {
      const result = await adminCaller.emailCampaign.contentSources.create({
        name: "Test RSS Feed",
        type: "rss",
        url: "https://example.com/feed.xml",
      });
      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should delete a content source", async () => {
      const created = await adminCaller.emailCampaign.contentSources.create({
        name: "Delete Source",
        type: "manual",
      });
      const result = await adminCaller.emailCampaign.contentSources.delete({ id: created.id });
      expect(result).toEqual({ success: true });
    });
  });

  // ─── Settings ───
  describe("settings", () => {
    it("should list all email settings", async () => {
      const result = await adminCaller.emailCampaign.settings.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should get a specific email setting", async () => {
      // First set a setting
      await adminCaller.emailCampaign.settings.set({
        key: "test_setting",
        value: "test_value",
      });
      const result = await adminCaller.emailCampaign.settings.get({ key: "test_setting" });
      expect(result).toBeDefined();
    });

    it("should set an email setting", async () => {
      const result = await adminCaller.emailCampaign.settings.set({
        key: "test_setting_2",
        value: "test_value_2",
      });
      expect(result).toEqual({ success: true });
    });
  });

  // ─── Tags ───
  describe("tags", () => {
    it("should list tags", async () => {
      const result = await adminCaller.emailCampaign.tags.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create a tag", async () => {
      const result = await adminCaller.emailCampaign.tags.create({
        name: "Test Tag",
        color: "#ff0000",
      });
      expect(result).toHaveProperty("id");
    });
  });

  // ─── Notes ───
  describe("notes", () => {
    it("should list notes for a contact", async () => {
      const result = await adminCaller.emailCampaign.notes.list({ contactId: 1 });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ─── Tasks ───
  describe("tasks", () => {
    it("should list all tasks", async () => {
      const result = await adminCaller.emailCampaign.tasks.listAll();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should list tasks for a contact", async () => {
      const result = await adminCaller.emailCampaign.tasks.listForContact({ contactId: 1 });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ─── Deals ───
  describe("deals", () => {
    it("should list deals", async () => {
      const result = await adminCaller.emailCampaign.deals.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ─── Input Validation ───
  describe("input validation", () => {
    it("should reject campaign creation with empty name", async () => {
      await expect(
        adminCaller.emailCampaign.campaigns.create({ name: "" })
      ).rejects.toThrow();
    });

    it("should reject template creation with empty name", async () => {
      await expect(
        adminCaller.emailCampaign.templates.create({ name: "", category: "newsletter" })
      ).rejects.toThrow();
    });

    it("should reject list creation with empty name", async () => {
      await expect(
        adminCaller.emailCampaign.lists.create({ name: "" })
      ).rejects.toThrow();
    });

    it("should reject automation creation with empty name", async () => {
      await expect(
        adminCaller.emailCampaign.automations.create({ name: "", trigger: "contact_created" })
      ).rejects.toThrow();
    });

    it("should reject content source creation with empty name", async () => {
      await expect(
        adminCaller.emailCampaign.contentSources.create({ name: "", type: "rss" })
      ).rejects.toThrow();
    });

    it("should set a setting with a key", async () => {
      const result = await adminCaller.emailCampaign.settings.set({ key: "from_name", value: "Test" });
      expect(result).toEqual({ success: true });
    });
  });
});
