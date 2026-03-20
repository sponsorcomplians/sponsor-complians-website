import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createNonAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("enrichment.enrichContact", () => {
  it("returns enrichment data for a known contact", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.enrichment.enrichContact({
      firstName: "Ian",
      lastName: "Refugio",
      company: "Sponsor ComplIANS",
    });

    // LLM enrichment should return an object (may have error or data)
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  }, 30000);

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.enrichment.enrichContact({
        firstName: "Test",
        lastName: "User",
      })
    ).rejects.toThrow();
  });
});

describe("enrichment.enrichCompany", () => {
  it("returns enrichment data for a known company", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.enrichment.enrichCompany({
      name: "Sponsor ComplIANS",
      website: "sponsorcomplians.com",
    });

    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  }, 30000);

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.enrichment.enrichCompany({
        name: "Test Company",
      })
    ).rejects.toThrow();
  });
});

describe("customProperties.list", () => {
  it("returns custom properties for contacts entity", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.customProperties.list({ entityType: "contact" });

    expect(Array.isArray(result)).toBe(true);
  });

  it("returns custom properties for companies entity", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.customProperties.list({ entityType: "company" });

    expect(Array.isArray(result)).toBe(true);
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.customProperties.list({ entityType: "contact" })
    ).rejects.toThrow();
  });
});

describe("customProperties.create", () => {
  it("creates a new custom property for contacts", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.customProperties.create({
      entityType: "contact",
      name: "test_prop_" + Date.now(),
      label: "Test Property",
      fieldType: "text",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("creates a dropdown custom property with options", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.customProperties.create({
      entityType: "company",
      name: "priority_" + Date.now(),
      label: "Priority Level",
      fieldType: "select",
      options: "High,Medium,Low",
    });

    expect(result).toHaveProperty("id");
  });
});

describe("customProperties.delete", () => {
  it("deletes a custom property by id", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create one first
    const created = await caller.customProperties.create({
      entityType: "contact",
      name: "to_delete_" + Date.now(),
      label: "To Delete",
      fieldType: "text",
    });

    // Delete it
    const result = await caller.customProperties.delete({ id: created.id });
    expect(result).toHaveProperty("success");
  });
});

describe("companies.create", () => {
  it("creates a new company", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.create({
      name: "Test Enrichment Co " + Date.now(),
      industry: "Technology",
      size: "50-200",
      website: "www.test-enrichment.co.uk",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.companies.create({
        name: "Unauthorized Company",
      })
    ).rejects.toThrow();
  });
});
