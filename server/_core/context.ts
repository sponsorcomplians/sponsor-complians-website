import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { createRemoteJWKSet, jwtVerify } from "jose";
import * as db from "../db";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  const issuer = process.env.CLERK_ISSUER_URL || "";
  if (!jwks && issuer) {
    jwks = createRemoteJWKSet(
      new URL(`${issuer}/.well-known/jwks.json`)
    );
  }
  return jwks;
}

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const authHeader = opts.req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const keys = getJWKS();
      const issuer = process.env.CLERK_ISSUER_URL || "";

      if (!keys) {
        console.warn("[Auth] JWKS not available — CLERK_ISSUER_URL:", issuer ? "set" : "MISSING");
      } else {
        const { payload } = await jwtVerify(token, keys, {
          issuer,
        });
        const clerkUserId = payload.sub;
        if (clerkUserId) {
          user = (await db.getUserByOpenId(clerkUserId)) ?? null;
          if (!user) {
            await db.upsertUser({
              openId: clerkUserId,
              name: null,
              email: null,
              loginMethod: "clerk",
              lastSignedIn: new Date(),
            });
            user = (await db.getUserByOpenId(clerkUserId)) ?? null;
          } else {
            await db.upsertUser({
              openId: clerkUserId,
              lastSignedIn: new Date(),
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("[Auth] JWT verification failed:", err);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
