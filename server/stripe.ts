import Stripe from "stripe";
import express, { type Express, type Request, type Response } from "express";
import { JOB_PRODUCTS, type ProductKey } from "./products";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

/**
 * Register Stripe routes on the Express app.
 * MUST be called BEFORE express.json() middleware.
 */
export function registerStripeRoutes(app: Express) {
  // ─── Webhook (raw body required for signature verification) ───
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const jobId = session.metadata?.job_id;
            const tier = session.metadata?.tier as string;
            const productKey = session.metadata?.product_key as string;

            if (jobId && tier) {
              const product = JOB_PRODUCTS[productKey as ProductKey];
              const durationDays = product?.durationDays || 60;
              const expiresAt = new Date();
              expiresAt.setDate(expiresAt.getDate() + durationDays);

              await db.updateJob(parseInt(jobId), {
                tier: tier as any,
                status: "active",
                isFeatured: tier === "premium" || tier === "managed",
                stripePaymentId: session.payment_intent as string,
                expiresAt,
              });

              await db.createNotification({
                type: "system",
                title: `Job Upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
                message: `Job #${jobId} has been upgraded to the ${tier} tier. Payment: ${session.amount_total ? `£${(session.amount_total / 100).toFixed(2)}` : "N/A"}.`,
              });

              await notifyOwner({
                title: `💳 Job Listing Payment — ${tier.toUpperCase()}`,
                content: `Job #${jobId} upgraded to ${tier}\nAmount: £${session.amount_total ? (session.amount_total / 100).toFixed(2) : "N/A"}\nCustomer: ${session.customer_email || "N/A"}\nPayment Intent: ${session.payment_intent}`,
              }).catch(() => {});
            }
            break;
          }

          case "payment_intent.succeeded": {
            console.log(`[Stripe Webhook] Payment succeeded: ${(event.data.object as any).id}`);
            break;
          }

          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Error processing event:", err);
      }

      res.json({ received: true });
    }
  );

  // ─── Create Checkout Session (JSON body, so this goes after express.json in practice,
  //      but we register it here and it will work because express.json is applied globally after) ───
  app.post("/api/stripe/checkout", express.json(), async (req: Request, res: Response) => {
    try {
      const { productKey, jobId, email, name } = req.body;

      if (!productKey || !JOB_PRODUCTS[productKey as ProductKey]) {
        return res.status(400).json({ error: "Invalid product key" });
      }

      const product = JOB_PRODUCTS[productKey as ProductKey];
      const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, "") || "";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        currency: "gbp",
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.priceInPence,
            },
            quantity: 1,
          },
        ],
        customer_email: email || undefined,
        allow_promotion_codes: true,
        metadata: {
          job_id: jobId?.toString() || "",
          tier: product.tier,
          product_key: productKey,
          customer_name: name || "",
        },
        client_reference_id: jobId?.toString() || "",
        success_url: `${origin}/jobs?payment=success&tier=${product.tier}`,
        cancel_url: `${origin}/advertise?payment=cancelled`,
      });

      res.json({ url: session.url });
    } catch (err: any) {
      console.error("[Stripe Checkout] Error creating session:", err);
      res.status(500).json({ error: err.message || "Failed to create checkout session" });
    }
  });
}
