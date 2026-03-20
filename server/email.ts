import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL || "admin@sponsorcomplians.com";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "Sponsor ComplIANS <noreply@sponsorcomplians.com>";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

export interface EmailNotification {
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email notification to the admin.
 * Returns true if sent successfully, false if SMTP is not configured or sending failed.
 */
export async function sendEmailNotification(notification: EmailNotification): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    console.warn("[Email] SMTP not configured — skipping email notification. Set SMTP_HOST, SMTP_USER, SMTP_PASS to enable.");
    return false;
  }

  try {
    await transport.sendMail({
      from: SMTP_FROM,
      to: ADMIN_EMAIL,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });
    console.log(`[Email] Notification sent: ${notification.subject}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send notification:", error);
    return false;
  }
}

/**
 * Send a webinar registration notification email.
 */
export async function notifyWebinarRegistration(data: {
  fullName: string;
  email: string;
  companyName?: string;
  sponsoredWorkers?: string;
  hasSponsorLicence?: string;
  eventSlug: string;
}): Promise<boolean> {
  const eventLabels: Record<string, string> = {
    "25-march-webinar": "25 March Webinar — Sponsor Licence Compliance",
    "hub-launch": "Sponsor ComplIANS Hub Launch",
    "new-website-launch": "New Website Launch",
    "sponsorship-files-launch": "The Sponsorship Files Podcast Launch",
  };

  const eventName = eventLabels[data.eventSlug] || data.eventSlug;

  return sendEmailNotification({
    subject: `🎓 New Webinar Registration — ${eventName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1B2A; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1B3A5C, #0D1B2A); padding: 24px 32px;">
          <h1 style="margin: 0; font-size: 20px; color: #00C3FF;">New Webinar Registration</h1>
          <p style="margin: 4px 0 0; color: #8B9EB7; font-size: 14px;">${eventName}</p>
        </div>
        <div style="padding: 24px 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px; width: 140px;">Name</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.fullName}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #00C3FF; font-size: 14px;"><a href="mailto:${data.email}" style="color: #00C3FF; text-decoration: none;">${data.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Company</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.companyName || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Sponsored Workers</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.sponsoredWorkers || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Sponsor Licence</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.hasSponsorLicence || "—"}</td></tr>
          </table>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.1); color: #5A7A9A; font-size: 12px;">
          Sponsor ComplIANS — Automated Notification
        </div>
      </div>
    `,
    text: `New Webinar Registration — ${eventName}\n\nName: ${data.fullName}\nEmail: ${data.email}\nCompany: ${data.companyName || "N/A"}\nSponsored Workers: ${data.sponsoredWorkers || "N/A"}\nSponsor Licence: ${data.hasSponsorLicence || "N/A"}`,
  });
}

/**
 * Send a contact form submission notification email.
 */
export async function notifyContactFormSubmission(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  return sendEmailNotification({
    subject: `📩 New Contact Form — ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1B2A; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1B3A5C, #0D1B2A); padding: 24px 32px;">
          <h1 style="margin: 0; font-size: 20px; color: #00C3FF;">New Contact Form Submission</h1>
          <p style="margin: 4px 0 0; color: #8B9EB7; font-size: 14px;">${data.subject || "General Enquiry"}</p>
        </div>
        <div style="padding: 24px 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px; width: 140px;">Name</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #00C3FF; font-size: 14px;"><a href="mailto:${data.email}" style="color: #00C3FF; text-decoration: none;">${data.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Phone</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.phone || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #8B9EB7; font-size: 14px;">Company</td><td style="padding: 8px 0; color: #fff; font-size: 14px;">${data.company || "—"}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <p style="margin: 0 0 8px; color: #8B9EB7; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
            <p style="margin: 0; color: #fff; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.1); color: #5A7A9A; font-size: 12px;">
          Sponsor ComplIANS — Automated Notification
        </div>
      </div>
    `,
    text: `New Contact Form Submission\n\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone || "N/A"}\nCompany: ${data.company || "N/A"}\nSubject: ${data.subject || "N/A"}\n\nMessage:\n${data.message}`,
  });
}

/**
 * Send video release notification to a subscriber.
 * Returns true if sent successfully, false otherwise.
 */
export async function sendVideoReleaseEmail(data: {
  email: string;
  videoUrl: string;
  unsubscribeUrl: string;
}): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    console.warn("[Email] SMTP not configured — skipping video release email.");
    return false;
  }

  try {
    await transport.sendMail({
      from: SMTP_FROM,
      to: data.email,
      subject: "🎬 Your Hub Product Tour is Ready — Sponsor ComplIANS",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1B2A; color: #fff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1B3A5C, #0D1B2A); padding: 32px;">
            <h1 style="margin: 0; font-size: 24px; color: #00C3FF;">The Hub Product Tour is Live</h1>
            <p style="margin: 8px 0 0; color: #8B9EB7; font-size: 15px;">You signed up for early access — here it is.</p>
          </div>
          <div style="padding: 32px;">
            <p style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
              We've just published the Sponsor ComplIANS Hub product tour. As an early access subscriber, you're the first to see it.
            </p>
            <a href="${data.videoUrl}" style="display: inline-block; background: #00C3FF; color: #0D1B2A; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px;">
              ▶ Watch the Product Tour
            </a>
            <p style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin: 24px 0 0;">
              Want to see it live? <a href="https://sponsorcomplians.com/contact" style="color: #00C3FF; text-decoration: underline;">Book a personalised demo</a> with our team.
            </p>
          </div>
          <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.1); color: #5A7A9A; font-size: 12px;">
            <p style="margin: 0;">Sponsor ComplIANS — UK Sponsor Licence Compliance</p>
            <p style="margin: 4px 0 0;"><a href="${data.unsubscribeUrl}" style="color: #5A7A9A; text-decoration: underline;">Unsubscribe</a> from future emails.</p>
          </div>
        </div>
      `,
      text: `The Hub Product Tour is Live\n\nYou signed up for early access — here it is.\n\nWatch the Product Tour: ${data.videoUrl}\n\nWant to see it live? Book a personalised demo: https://sponsorcomplians.com/contact\n\nUnsubscribe: ${data.unsubscribeUrl}`,
    });
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send video release email to ${data.email}:`, error);
    return false;
  }
}
