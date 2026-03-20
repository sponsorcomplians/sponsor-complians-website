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

describe("contacts.list", () => {
  it("returns contacts list with items and total for admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contacts.list({});

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.items)).toBe(true);
    expect(typeof result.total).toBe("number");
  });

  it("supports pagination with limit and offset", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contacts.list({ limit: 10, offset: 0 });

    expect(result.items.length).toBeLessThanOrEqual(10);
    expect(result).toHaveProperty("total");
  });

  it("supports search filter", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contacts.list({ search: "test-nonexistent-xyz" });

    expect(result.items.length).toBe(0);
  });

  it("supports source filter", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contacts.list({ source: "other" });

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    // All returned items should have source "other"
    for (const item of result.items) {
      expect(item.source).toBe("other");
    }
  });

  it("supports status filter", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contacts.list({ status: "new" });

    expect(result).toHaveProperty("items");
    for (const item of result.items) {
      expect(item.status).toBe("new");
    }
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.contacts.list({})).rejects.toThrow();
  });
});

describe("contacts.stats", () => {
  it("returns contact statistics for admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contacts.stats();

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("bySource");
    expect(result).toHaveProperty("byStatus");
    expect(result).toHaveProperty("recentCount");
    expect(typeof result.total).toBe("number");
    expect(Array.isArray(result.bySource)).toBe(true);
    expect(Array.isArray(result.byStatus)).toBe(true);
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.contacts.stats()).rejects.toThrow();
  });
});

describe("contacts.bulkImport", () => {
  it("imports contacts successfully for admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const uniqueSuffix = Date.now();
    const result = await caller.contacts.bulkImport({
      contacts: [
        {
          firstName: "Test",
          lastName: "Import",
          email: `test-import-${uniqueSuffix}@example.com`,
          company: "Test Corp",
        },
      ],
      skipDuplicates: true,
    });

    expect(result).toHaveProperty("imported");
    expect(result).toHaveProperty("skipped");
    expect(result).toHaveProperty("errors");
    expect(result).toHaveProperty("total");
    expect(result.imported).toBe(1);
    expect(result.errors).toBe(0);
    expect(result.total).toBe(1);

    // Clean up: delete the test contact
    const listResult = await caller.contacts.list({ search: `test-import-${uniqueSuffix}` });
    if (listResult.items.length > 0) {
      await caller.contacts.delete({ id: listResult.items[0].id });
    }
  });

  it("skips duplicates when skipDuplicates is true", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const uniqueSuffix = Date.now();
    const email = `test-dup-${uniqueSuffix}@example.com`;

    // First import
    await caller.contacts.bulkImport({
      contacts: [{ firstName: "Dup", lastName: "Test", email }],
      skipDuplicates: true,
    });

    // Second import — should skip
    const result = await caller.contacts.bulkImport({
      contacts: [{ firstName: "Dup", lastName: "Test", email }],
      skipDuplicates: true,
    });

    expect(result.skipped).toBe(1);
    expect(result.imported).toBe(0);

    // Clean up
    const listResult = await caller.contacts.list({ search: `test-dup-${uniqueSuffix}` });
    if (listResult.items.length > 0) {
      await caller.contacts.delete({ id: listResult.items[0].id });
    }
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contacts.bulkImport({
        contacts: [{ firstName: "Test", lastName: "User", email: "test@example.com" }],
      })
    ).rejects.toThrow();
  });
});
