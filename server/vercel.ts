import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerStripeRoutes } from "./stripe";
import { registerSendGridWebhook } from "./sendgridWebhook";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";

const app = express();

// Stripe webhook MUST be registered BEFORE express.json() for raw body signature verification
registerStripeRoutes(app);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

registerSendGridWebhook(app);

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
