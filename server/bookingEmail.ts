/**
 * Booking Confirmation Email
 * Sends a branded confirmation email to the customer after booking an appointment.
 * Uses SendGrid for delivery (falls back silently if not configured).
 */

import { sendSingleEmail } from "./sendgridService";

interface BookingConfirmationData {
  firstName: string;
  lastName: string;
  email: string;
  consultationType: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  company?: string | null;
  appointmentId: number;
}

/**
 * Send a booking confirmation email to the customer.
 * Returns true if sent successfully, false otherwise.
 */
export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
  // Format date for display (e.g., "25 March 2026")
  const dateObj = new Date(data.date + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1B2A; color: #fff; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1B3A5C, #0D1B2A); padding: 32px;">
        <h1 style="margin: 0; font-size: 24px; color: #00C3FF;">Booking Confirmed</h1>
        <p style="margin: 8px 0 0; color: #8B9EB7; font-size: 15px;">Your consultation has been scheduled</p>
      </div>
      <div style="padding: 32px;">
        <p style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
          Hi ${data.firstName}, thank you for booking a consultation with Sponsor ComplIANS. Here are your appointment details:
        </p>
        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #8B9EB7; font-size: 14px; width: 140px; vertical-align: top;">Consultation</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px; font-weight: 600;">${data.consultationType}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8B9EB7; font-size: 14px; vertical-align: top;">Date</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8B9EB7; font-size: 14px; vertical-align: top;">Time</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px;">${data.startTime} – ${data.endTime} (${data.timezone})</td>
            </tr>
            ${data.company ? `
            <tr>
              <td style="padding: 10px 0; color: #8B9EB7; font-size: 14px; vertical-align: top;">Company</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px;">${data.company}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 10px 0; color: #8B9EB7; font-size: 14px; vertical-align: top;">Reference</td>
              <td style="padding: 10px 0; color: #00C3FF; font-size: 14px;">#APT-${data.appointmentId}</td>
            </tr>
          </table>
        </div>
        <div style="background: rgba(0,195,255,0.1); border-left: 3px solid #00C3FF; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
          <p style="margin: 0; color: #CBD5E1; font-size: 14px; line-height: 1.6;">
            <strong style="color: #00C3FF;">What to prepare:</strong><br/>
            Please have your sponsor licence number and any relevant Home Office correspondence ready for the consultation.
          </p>
        </div>
        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6; margin: 0;">
          Need to reschedule or cancel? Please contact us at 
          <a href="tel:02036186968" style="color: #00C3FF; text-decoration: none;">020 3618 6968</a> or reply to this email.
        </p>
      </div>
      <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.1); color: #5A7A9A; font-size: 12px;">
        <p style="margin: 0;">Sponsor ComplIANS — UK Sponsor Licence Compliance</p>
        <p style="margin: 4px 0 0;">020 3618 6968 | info@sponsorcomplians.com</p>
      </div>
    </div>
  `;

  try {
    const result = await sendSingleEmail({
      to: data.email,
      subject: `Booking Confirmed — ${data.consultationType} on ${formattedDate}`,
      htmlContent,
      fromName: "Sponsor ComplIANS",
      fromEmail: "bookings@sponsorcomplians.com",
      replyTo: "info@sponsorcomplians.com",
    });

    if (result.success) {
      console.log(`[Booking Email] Confirmation sent to ${data.email} (messageId: ${result.messageId})`);
    } else {
      console.warn(`[Booking Email] Failed to send confirmation to ${data.email}: ${result.error}`);
    }
    return result.success;
  } catch (err) {
    console.error("[Booking Email] Error sending confirmation:", err);
    return false;
  }
}
