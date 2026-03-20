/**
 * SendGrid Webhook Handler
 * Registers the /api/sendgrid/webhook endpoint for processing
 * email delivery events (opens, clicks, bounces, unsubscribes).
 */
import type { Express, Request, Response } from "express";
import { processWebhookEvents } from "./sendgridService";

export function registerSendGridWebhook(app: Express) {
  // SendGrid sends events as JSON array via POST
  app.post("/api/sendgrid/webhook", async (req: Request, res: Response) => {
    try {
      const events = req.body;

      if (!Array.isArray(events)) {
        console.warn("[SendGrid Webhook] Received non-array body, ignoring");
        return res.status(200).json({ ok: true });
      }

      console.log(`[SendGrid Webhook] Received ${events.length} events`);

      const result = await processWebhookEvents(events);
      console.log(`[SendGrid Webhook] Processed: ${result.processed}, Errors: ${result.errors}`);

      // Always return 200 to prevent SendGrid from retrying
      return res.status(200).json({
        ok: true,
        processed: result.processed,
        errors: result.errors,
      });
    } catch (err) {
      console.error("[SendGrid Webhook] Fatal error:", err);
      // Still return 200 to prevent infinite retries
      return res.status(200).json({ ok: true, error: "Internal processing error" });
    }
  });

  console.log("[SendGrid] Webhook endpoint registered at /api/sendgrid/webhook");
}
