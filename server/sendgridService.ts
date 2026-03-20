/**
 * SendGrid Email Service
 * Handles single sends, batch sends, and email delivery for campaigns.
 * Uses @sendgrid/mail for transactional and campaign emails.
 */
import sgMail from "@sendgrid/mail";
import sgClient from "@sendgrid/client";
import * as ecDb from "./emailCampaignDb";
import { getDb } from "./db";
import { campaignRecipients, campaigns } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Initialise SendGrid with API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  sgClient.setApiKey(SENDGRID_API_KEY);
}

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface EmailRecipient {
  contactId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

interface SendCampaignOptions {
  campaignId: number;
  subject: string;
  htmlContent: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  previewText?: string;
  recipients: EmailRecipient[];
}

interface SendSingleEmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Wraps HTML content with unsubscribe footer and tracking pixel placeholder.
 * SendGrid automatically handles open/click tracking when enabled in account settings.
 */
function wrapHtmlContent(html: string, previewText?: string): string {
  const previewHtml = previewText
    ? `<div style="display:none;font-size:1px;color:#f5f7fa;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title></title>
</head>
<body style="margin:0;padding:0;background-color:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
  ${previewHtml}
  ${html}
  <div style="text-align:center;padding:20px;font-size:12px;color:#999;">
    <p>You received this email from Sponsor ComplIANS.</p>
    <p><a href="{{{unsubscribe}}}" style="color:#999;">Unsubscribe</a> | <a href="{{{unsubscribe_preferences}}}" style="color:#999;">Manage Preferences</a></p>
  </div>
</body>
</html>`;
}

/**
 * Replace personalisation tokens in HTML content.
 * Supported tokens: {{first_name}}, {{last_name}}, {{company}}, {{email}}
 */
function personaliseContent(html: string, recipient: EmailRecipient): string {
  return html
    .replace(/\{\{first_name\}\}/gi, recipient.firstName || "there")
    .replace(/\{\{last_name\}\}/gi, recipient.lastName || "")
    .replace(/\{\{company\}\}/gi, recipient.company || "")
    .replace(/\{\{email\}\}/gi, recipient.email || "")
    .replace(/\{\{full_name\}\}/gi, `${recipient.firstName || ""} ${recipient.lastName || ""}`.trim() || "there");
}

// ═══════════════════════════════════════════════════════════════
// SEND FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Send a single email (for transactional or test sends).
 */
export async function sendSingleEmail(opts: SendSingleEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!SENDGRID_API_KEY) {
    return { success: false, error: "SendGrid API key not configured" };
  }

  try {
    const [response] = await sgMail.send({
      to: opts.to,
      from: { email: opts.fromEmail, name: opts.fromName },
      replyTo: opts.replyTo ? { email: opts.replyTo } : undefined,
      subject: opts.subject,
      html: opts.htmlContent,
    });

    return {
      success: response.statusCode >= 200 && response.statusCode < 300,
      messageId: response.headers["x-message-id"] as string,
    };
  } catch (err: any) {
    console.error("[SendGrid] Single email error:", err?.response?.body || err.message);
    return { success: false, error: err?.response?.body?.errors?.[0]?.message || err.message };
  }
}

/**
 * Send a campaign to a list of recipients using SendGrid batch sending.
 * Processes in batches of 1000 (SendGrid API limit per request).
 * Updates campaign and recipient statuses in the database.
 */
export async function sendCampaign(opts: SendCampaignOptions): Promise<{
  success: boolean;
  totalSent: number;
  totalFailed: number;
  errors: string[];
}> {
  if (!SENDGRID_API_KEY) {
    return { success: false, totalSent: 0, totalFailed: opts.recipients.length, errors: ["SendGrid API key not configured"] };
  }

  const db = await getDb();
  if (!db) {
    return { success: false, totalSent: 0, totalFailed: opts.recipients.length, errors: ["Database not available"] };
  }

  // Update campaign status to "sending"
  await db.update(campaigns).set({ status: "sending" } as any).where(eq(campaigns.id, opts.campaignId));

  const wrappedHtml = wrapHtmlContent(opts.htmlContent, opts.previewText);
  const BATCH_SIZE = 1000;
  let totalSent = 0;
  let totalFailed = 0;
  const errors: string[] = [];

  // Process recipients in batches
  for (let i = 0; i < opts.recipients.length; i += BATCH_SIZE) {
    const batch = opts.recipients.slice(i, i + BATCH_SIZE);

    // Build personalised messages for each recipient
    const messages = batch.map((recipient) => ({
      to: { email: recipient.email, name: `${recipient.firstName || ""} ${recipient.lastName || ""}`.trim() || undefined },
      from: { email: opts.fromEmail, name: opts.fromName },
      replyTo: opts.replyTo ? { email: opts.replyTo } : undefined,
      subject: opts.subject,
      html: personaliseContent(wrappedHtml, recipient),
      customArgs: {
        campaign_id: String(opts.campaignId),
        contact_id: String(recipient.contactId),
      },
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true },
      },
    }));

    try {
      // sgMail.send with an array sends as batch (multiple individual emails)
      await sgMail.send(messages as any);

      // Mark recipients as sent
      for (const recipient of batch) {
        await db.update(campaignRecipients)
          .set({ status: "sent", sentAt: new Date() } as any)
          .where(
            and(
              eq(campaignRecipients.campaignId, opts.campaignId),
              eq(campaignRecipients.contactId, recipient.contactId)
            )
          );
      }
      totalSent += batch.length;
    } catch (err: any) {
      console.error(`[SendGrid] Batch send error (batch ${Math.floor(i / BATCH_SIZE) + 1}):`, err?.response?.body || err.message);
      const errorMsg = err?.response?.body?.errors?.[0]?.message || err.message;
      errors.push(errorMsg);

      // Mark batch recipients as failed
      for (const recipient of batch) {
        await db.update(campaignRecipients)
          .set({ status: "failed" } as any)
          .where(
            and(
              eq(campaignRecipients.campaignId, opts.campaignId),
              eq(campaignRecipients.contactId, recipient.contactId)
            )
          );
      }
      totalFailed += batch.length;
    }

    // Small delay between batches to respect rate limits
    if (i + BATCH_SIZE < opts.recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Update campaign status and stats
  const finalStatus = totalFailed === opts.recipients.length ? "draft" : "sent";
  await db.update(campaigns).set({
    status: finalStatus,
    sentAt: new Date(),
    totalSent,
  } as any).where(eq(campaigns.id, opts.campaignId));

  return {
    success: totalSent > 0,
    totalSent,
    totalFailed,
    errors,
  };
}

/**
 * Send a test email for campaign preview.
 */
export async function sendTestEmail(opts: {
  to: string;
  subject: string;
  htmlContent: string;
  fromName: string;
  fromEmail: string;
  previewText?: string;
}): Promise<{ success: boolean; error?: string }> {
  const wrappedHtml = wrapHtmlContent(opts.htmlContent, opts.previewText);

  return sendSingleEmail({
    to: opts.to,
    subject: `[TEST] ${opts.subject}`,
    htmlContent: wrappedHtml,
    fromName: opts.fromName,
    fromEmail: opts.fromEmail,
  });
}

// ═══════════════════════════════════════════════════════════════
// WEBHOOK PROCESSING
// ═══════════════════════════════════════════════════════════════

interface SendGridEvent {
  event: string;
  email: string;
  timestamp: number;
  sg_event_id: string;
  sg_message_id: string;
  campaign_id?: string;
  contact_id?: string;
  url?: string;
  useragent?: string;
  ip?: string;
  reason?: string;
  status?: string;
  type?: string;
}

/**
 * Process incoming SendGrid webhook events.
 * Maps SendGrid events to our campaign event types.
 */
export async function processWebhookEvents(events: SendGridEvent[]): Promise<{ processed: number; errors: number }> {
  let processed = 0;
  let errorCount = 0;

  for (const event of events) {
    try {
      const campaignId = event.campaign_id ? parseInt(event.campaign_id) : null;
      const contactId = event.contact_id ? parseInt(event.contact_id) : null;

      if (!campaignId || !contactId) {
        // Skip events without campaign/contact tracking
        continue;
      }

      // Map SendGrid event types to our event types
      let eventType: "open" | "click" | "bounce" | "unsubscribe" | "complaint" | null = null;
      const metadata: Record<string, any> = {};

      switch (event.event) {
        case "open":
          eventType = "open";
          metadata.userAgent = event.useragent;
          metadata.ip = event.ip;
          break;
        case "click":
          eventType = "click";
          metadata.url = event.url;
          metadata.userAgent = event.useragent;
          metadata.ip = event.ip;
          break;
        case "bounce":
        case "dropped":
          eventType = "bounce";
          metadata.reason = event.reason;
          metadata.status = event.status;
          metadata.type = event.type;
          // Update recipient status to bounced
          const db1 = await getDb();
          if (db1) {
            await db1.update(campaignRecipients)
              .set({ status: "bounced" } as any)
              .where(
                and(
                  eq(campaignRecipients.campaignId, campaignId),
                  eq(campaignRecipients.contactId, contactId)
                )
              );
          }
          break;
        case "unsubscribe":
        case "group_unsubscribe":
          eventType = "unsubscribe";
          break;
        case "spamreport":
          eventType = "complaint";
          break;
        case "delivered":
          // Update recipient status to delivered
          const db2 = await getDb();
          if (db2) {
            await db2.update(campaignRecipients)
              .set({ status: "delivered" } as any)
              .where(
                and(
                  eq(campaignRecipients.campaignId, campaignId),
                  eq(campaignRecipients.contactId, contactId)
                )
              );
          }
          // Don't record as a separate event, just update status
          processed++;
          continue;
        default:
          // Ignore other event types (processed, deferred, etc.)
          continue;
      }

      if (eventType) {
        await ecDb.recordCampaignEvent({
          campaignId,
          contactId,
          type: eventType,
          metadata,
        } as any);
        processed++;
      }
    } catch (err) {
      console.error("[SendGrid Webhook] Error processing event:", err);
      errorCount++;
    }
  }

  return { processed, errors: errorCount };
}

/**
 * Verify SendGrid API key is valid and check account status.
 */
export async function verifyApiKey(): Promise<{ valid: boolean; scopes?: string[]; error?: string }> {
  if (!SENDGRID_API_KEY) {
    return { valid: false, error: "SendGrid API key not configured" };
  }

  try {
    const [response, body] = await sgClient.request({
      url: "/v3/scopes",
      method: "GET",
    });

    return {
      valid: response.statusCode === 200,
      scopes: (body as any)?.scopes,
    };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}
