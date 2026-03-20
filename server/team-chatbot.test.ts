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

describe("Team Management Routes", () => {
  describe("team.members", () => {
    it("returns team members list for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const members = await caller.team.members();
      expect(Array.isArray(members)).toBe(true);
    });
  });

  describe("team.invitations", () => {
    it("returns invitations list for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const invitations = await caller.team.invitations();
      expect(Array.isArray(invitations)).toBe(true);
    });
  });

  describe("team.invite", () => {
    it("creates a new team invitation", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.team.invite({
        email: `invite-${Date.now()}@example.com`,
        name: "Test Invitee",
        role: "admin",
      });
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("expiresAt");
      expect(typeof result.id).toBe("number");
      expect(typeof result.token).toBe("string");
      expect(result.token.length).toBe(64); // 32 bytes hex = 64 chars
    });
  });

  describe("team.acceptInvitation", () => {
    it("rejects invalid token", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.team.acceptInvitation({ token: "invalid-token" })).rejects.toThrow("Invalid invitation");
    });

    it("accepts a valid invitation token", async () => {
      const adminCtx = createAdminContext();
      const adminCaller = appRouter.createCaller(adminCtx);
      // Create invitation first
      const invitation = await adminCaller.team.invite({
        email: `accept-${Date.now()}@example.com`,
        name: "Accept Test",
        role: "admin",
      });
      // Accept it
      const publicCtx = createPublicContext();
      const publicCaller = appRouter.createCaller(publicCtx);
      const result = await publicCaller.team.acceptInvitation({ token: invitation.token });
      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("role", "admin");
    });

    it("rejects already accepted invitation", async () => {
      const adminCtx = createAdminContext();
      const adminCaller = appRouter.createCaller(adminCtx);
      const invitation = await adminCaller.team.invite({
        email: `double-${Date.now()}@example.com`,
        name: "Double Accept",
        role: "admin",
      });
      const publicCtx = createPublicContext();
      const publicCaller = appRouter.createCaller(publicCtx);
      await publicCaller.team.acceptInvitation({ token: invitation.token });
      await expect(publicCaller.team.acceptInvitation({ token: invitation.token })).rejects.toThrow("Invitation is accepted");
    });
  });

  describe("team.revokeInvitation", () => {
    it("revokes a pending invitation", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const invitation = await caller.team.invite({
        email: `revoke-${Date.now()}@example.com`,
        name: "Revoke Test",
        role: "admin",
      });
      const result = await caller.team.revokeInvitation({ id: invitation.id });
      expect(result).toHaveProperty("success", true);
    });
  });

  describe("team.removeMember", () => {
    it("prevents removing yourself", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.team.removeMember({ userId: 1 })).rejects.toThrow("Cannot remove yourself");
    });
  });
});

describe("Chatbot Routes", () => {
  describe("chatbot.listConversations", () => {
    it("returns conversations for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.chatbot.listConversations({ limit: 10 });
      expect(result).toHaveProperty("conversations");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.conversations)).toBe(true);
      expect(typeof result.total).toBe("number");
    });
  });

  describe("chatbot.ask", () => {
    it("returns a reply from the chatbot", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.chatbot.ask({
        message: "What services do you offer?",
      });
      expect(result).toHaveProperty("reply");
      expect(result).toHaveProperty("intentTag");
      expect(typeof result.reply).toBe("string");
      expect(result.reply.length).toBeGreaterThan(0);
    });
  });
});
