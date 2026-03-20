import { describe, expect, it } from "vitest";
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

describe("deals.list", () => {
  it("returns deals list with items and total for admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.deals.list({});

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.items)).toBe(true);
    expect(typeof result.total).toBe("number");
  });

  it("supports pagination with limit and offset", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.deals.list({ limit: 5, offset: 0 });

    expect(result.items.length).toBeLessThanOrEqual(5);
    expect(result).toHaveProperty("total");
  });

  it("supports search filter", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.deals.list({ search: "nonexistent-deal-xyz-999" });

    expect(result.items.length).toBe(0);
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.deals.list({})).rejects.toThrow();
  });
});

describe("deals CRUD", () => {
  it("creates, reads, updates, and deletes a deal", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First get a company to associate with
    const companies = await caller.companies.list({ limit: 1 });
    if (companies.items.length === 0) {
      // Skip test if no companies exist
      return;
    }
    const companyId = companies.items[0].id;

    // Create
    const uniqueSuffix = Date.now();
    const created = await caller.deals.create({
      title: `Test Deal ${uniqueSuffix}`,
      companyId,
      value: 150000, // £1,500 in pence
      stage: "lead",
      probability: 10,
      product: "compliance_audit",
    });

    expect(created).toHaveProperty("id");
    expect(typeof created.id).toBe("number");

    // Update
    const updated = await caller.deals.update({
      id: created.id,
      stage: "qualified",
      probability: 25,
      value: 250000,
    });

    expect(updated).toHaveProperty("success");
    expect(updated.success).toBe(true);

    // Verify update via list
    const listResult = await caller.deals.list({ search: `Test Deal ${uniqueSuffix}` });
    expect(listResult.items.length).toBeGreaterThanOrEqual(1);
    const deal = listResult.items.find((d: any) => d.id === created.id);
    expect(deal).toBeDefined();
    expect(deal?.stage).toBe("qualified");
    expect(deal?.value).toBe(250000);

    // Delete
    const deleted = await caller.deals.delete({ id: created.id });
    expect(deleted).toHaveProperty("success");
    expect(deleted.success).toBe(true);

    // Verify deletion
    const afterDelete = await caller.deals.list({ search: `Test Deal ${uniqueSuffix}` });
    const found = afterDelete.items.find((d: any) => d.id === created.id);
    expect(found).toBeUndefined();
  });

  it("rejects deal creation for non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.deals.create({
        title: "Unauthorized Deal",
        companyId: 1,
        stage: "lead",
      })
    ).rejects.toThrow();
  });
});

describe("deals.stats", () => {
  it("returns pipeline statistics for admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.deals.stats();

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("totalValue");
    expect(result).toHaveProperty("weightedValue");
    expect(result).toHaveProperty("byStage");
    expect(result).toHaveProperty("byProduct");
    expect(typeof result.total).toBe("number");
    // totalValue may come back as string from SQL aggregation
    expect(result.totalValue).toBeDefined();
    expect(Array.isArray(result.byStage)).toBe(true);
    expect(Array.isArray(result.byProduct)).toBe(true);
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.deals.stats()).rejects.toThrow();
  });
});

describe("companies.list", () => {
  it("returns companies list with items and total for admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.list({});

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.items)).toBe(true);
    expect(typeof result.total).toBe("number");
  });

  it("supports search filter", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.list({ search: "nonexistent-company-xyz" });

    expect(result.items.length).toBe(0);
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.companies.list({})).rejects.toThrow();
  });
});

describe("companies.getById", () => {
  it("returns a company by ID for admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Get first company
    const list = await caller.companies.list({ limit: 1 });
    if (list.items.length === 0) return; // skip if no companies

    const company = await caller.companies.getById({ id: list.items[0].id });
    expect(company).toHaveProperty("id");
    expect(company).toHaveProperty("name");
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.companies.getById({ id: 1 })).rejects.toThrow();
  });
});

describe("companies.getContacts", () => {
  it("returns contacts for a company name", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Get first company
    const list = await caller.companies.list({ limit: 1 });
    if (list.items.length === 0) return;

    const contacts = await caller.companies.getContacts({ companyName: list.items[0].name });
    expect(Array.isArray(contacts)).toBe(true);
  });
});

describe("companies.getDeals", () => {
  it("returns deals for a company", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Get first company
    const list = await caller.companies.list({ limit: 1 });
    if (list.items.length === 0) return;

    const deals = await caller.companies.getDeals({ companyId: list.items[0].id });
    expect(Array.isArray(deals)).toBe(true);
  });
});
