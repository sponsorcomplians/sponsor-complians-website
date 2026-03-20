import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock nodemailer before importing the module
const mockSendMail = vi.fn().mockResolvedValue({ messageId: "test-123" });
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: mockSendMail,
    })),
  },
}));

describe("Email Notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module cache to pick up env changes
    vi.resetModules();
  });

  it("notifyWebinarRegistration builds correct email content", async () => {
    // Set SMTP env vars so the transporter is created
    process.env.SMTP_HOST = "smtp.test.com";
    process.env.SMTP_USER = "user@test.com";
    process.env.SMTP_PASS = "testpass";
    process.env.SMTP_PORT = "587";

    // Re-import after setting env
    const { notifyWebinarRegistration } = await import("./email");

    const result = await notifyWebinarRegistration({
      fullName: "Jane Smith",
      email: "jane@example.com",
      companyName: "Acme Ltd",
      sponsoredWorkers: "11–50",
      hasSponsorLicence: "Yes",
      eventSlug: "25-march-webinar",
    });

    expect(result).toBe(true);
    expect(mockSendMail).toHaveBeenCalledOnce();

    const call = mockSendMail.mock.calls[0][0];
    expect(call.subject).toContain("Webinar Registration");
    expect(call.subject).toContain("25 March Webinar");
    expect(call.html).toContain("Jane Smith");
    expect(call.html).toContain("jane@example.com");
    expect(call.html).toContain("Acme Ltd");
    expect(call.text).toContain("Jane Smith");
  });

  it("notifyContactFormSubmission builds correct email content", async () => {
    process.env.SMTP_HOST = "smtp.test.com";
    process.env.SMTP_USER = "user@test.com";
    process.env.SMTP_PASS = "testpass";

    const { notifyContactFormSubmission } = await import("./email");

    const result = await notifyContactFormSubmission({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "020 1234 5678",
      company: "Test Corp",
      subject: "Compliance Audit",
      message: "I need help with my sponsor licence compliance.",
    });

    expect(result).toBe(true);
    expect(mockSendMail).toHaveBeenCalledOnce();

    const call = mockSendMail.mock.calls[0][0];
    expect(call.subject).toContain("Contact Form");
    expect(call.subject).toContain("John Doe");
    expect(call.html).toContain("John");
    expect(call.html).toContain("Doe");
    expect(call.html).toContain("john@example.com");
    expect(call.html).toContain("I need help with my sponsor licence compliance.");
    expect(call.text).toContain("Compliance Audit");
  });

  it("returns false when SMTP is not configured", async () => {
    // Clear SMTP env vars
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    const { sendEmailNotification } = await import("./email");

    const result = await sendEmailNotification({
      subject: "Test",
      html: "<p>Test</p>",
    });

    expect(result).toBe(false);
  });
});
