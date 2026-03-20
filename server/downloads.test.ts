import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the storage module
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "lead-magnets/test.pdf", url: "https://cdn.example.com/test.pdf" }),
}));

// Mock the db module
vi.mock("./db", () => ({
  createDownload: vi.fn().mockResolvedValue(1),
  getDownloads: vi.fn().mockResolvedValue([
    { id: 1, title: "Test Guide", description: "A test guide", fileUrl: "https://cdn.example.com/test.pdf", fileType: "pdf", fileSize: "1.2 MB", category: "Compliance Guide", isPublished: true, downloadCount: 5, createdAt: new Date() },
  ]),
  updateDownload: vi.fn().mockResolvedValue(undefined),
  deleteDownload: vi.fn().mockResolvedValue(undefined),
  getDownloadById: vi.fn().mockResolvedValue({ id: 1, title: "Test Guide", fileUrl: "https://cdn.example.com/test.pdf", isPublished: true }),
  getDownloadLogs: vi.fn().mockResolvedValue([]),
  incrementDownloadCount: vi.fn().mockResolvedValue(undefined),
  createDownloadLog: vi.fn().mockResolvedValue(undefined),
  createContact: vi.fn().mockResolvedValue(1),
  createNotification: vi.fn().mockResolvedValue(1),
  getDashboardStats: vi.fn().mockResolvedValue({ contacts: 0, subscribers: 0, submissions: 0, signups: 0, downloads: 0, pageViews: 0 }),
}));

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
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
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
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("downloads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("admin: upload", () => {
    it("uploads a document and creates a download record", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.downloads.upload({
        title: "Right to Work Checklist",
        description: "Essential checklist for RTW verification",
        fileName: "rtw-checklist.pdf",
        fileBase64: Buffer.from("fake pdf content").toString("base64"),
        contentType: "application/pdf",
        fileType: "pdf",
        fileSize: "1.2 MB",
        category: "Checklist",
        isPublished: true,
      });

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("url");
      expect(result.id).toBe(1);
    });
  });

  describe("admin: update", () => {
    it("updates a download record", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.downloads.update({
        id: 1,
        title: "Updated Title",
        category: "Template",
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("admin: delete", () => {
    it("deletes a download record", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.downloads.delete({ id: 1 });

      expect(result).toEqual({ success: true });
    });
  });

  describe("admin: listAll", () => {
    it("returns all downloads including drafts", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.downloads.listAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("title", "Test Guide");
    });
  });

  describe("public: list", () => {
    it("returns published downloads only", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.downloads.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("admin: getById", () => {
    it("returns a single download by ID", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.downloads.getById({ id: 1 });

      expect(result).toHaveProperty("title", "Test Guide");
    });
  });

  describe("admin: logs", () => {
    it("returns download logs", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.downloads.logs({});

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
