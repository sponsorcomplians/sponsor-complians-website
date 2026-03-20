import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

// Stripe webhook needs raw body - register before json parser
// (Vercel handles this differently, so we skip raw body here)

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// OAuth routes
import { registerOAuthRoutes } from "../server/_core/oauth";
registerOAuthRoutes(app);

// SendGrid webhook
import("../server/sendgridWebhook").then(({ registerSendGridWebhook }) => {
  registerSendGridWebhook(app);
});

// Stripe routes
import("../server/stripe").then(({ registerStripeRoutes }) => {
  registerStripeRoutes(app);
});

// Booking routes
import("../server/bookingRoutes").then(({ registerBookingRoutes }) => {
  if (registerBookingRoutes) registerBookingRoutes(app);
});

export default app;
