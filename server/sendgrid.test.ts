import { describe, expect, it } from "vitest";

/**
 * SendGrid API Key Validation Test
 * Verifies the SENDGRID_API_KEY env var is set and valid by calling
 * the SendGrid API to check the authenticated user/scopes.
 */
describe("SendGrid Integration", () => {
  it("should have SENDGRID_API_KEY environment variable set", () => {
    const key = process.env.SENDGRID_API_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(key!.startsWith("SG.")).toBe(true);
  });

  it("should authenticate successfully with SendGrid API", async () => {
    const key = process.env.SENDGRID_API_KEY;
    if (!key) {
      throw new Error("SENDGRID_API_KEY not set");
    }

    const response = await fetch("https://api.sendgrid.com/v3/scopes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });

    // 200 = valid key with scopes returned
    // 401 = invalid key
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("scopes");
    expect(Array.isArray(data.scopes)).toBe(true);
    // Verify we have mail.send scope (required for sending emails)
    expect(data.scopes).toContain("mail.send");
  });

  it("should have required SendGrid scopes for full email campaign functionality", async () => {
    const key = process.env.SENDGRID_API_KEY;
    if (!key) throw new Error("SENDGRID_API_KEY not set");

    const response = await fetch("https://api.sendgrid.com/v3/scopes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const scopes: string[] = data.scopes;

    // Required scopes for email campaigns
    const requiredScopes = ["mail.send"];
    for (const scope of requiredScopes) {
      expect(scopes).toContain(scope);
    }
  });

  it("should verify the sendgridService module exports expected functions", async () => {
    const service = await import("./sendgridService");
    expect(typeof service.sendSingleEmail).toBe("function");
    expect(typeof service.sendCampaign).toBe("function");
    expect(typeof service.sendTestEmail).toBe("function");
    expect(typeof service.verifyApiKey).toBe("function");
    expect(typeof service.processWebhookEvents).toBe("function");
  });

  it("should verify API key via the verifyApiKey function", async () => {
    const { verifyApiKey } = await import("./sendgridService");
    const result = await verifyApiKey();
    expect(result).toHaveProperty("valid");
    expect(result.valid).toBe(true);
    expect(result).toHaveProperty("scopes");
    expect(Array.isArray(result.scopes)).toBe(true);
  });

  it("should handle webhook events array processing", async () => {
    const { processWebhookEvents } = await import("./sendgridService");
    // Empty events should process without errors
    const result = await processWebhookEvents([]);
    expect(result).toHaveProperty("processed");
    expect(result).toHaveProperty("errors");
    expect(result.processed).toBe(0);
    expect(result.errors).toBe(0);
  });

  it("should handle webhook events with unknown event types gracefully", async () => {
    const { processWebhookEvents } = await import("./sendgridService");
    const events = [
      { event: "unknown_event_type", email: "test@example.com", timestamp: Date.now() / 1000 },
    ];
    const result = await processWebhookEvents(events);
    // Should not throw, just skip unknown events
    expect(result).toHaveProperty("processed");
    expect(result).toHaveProperty("errors");
  });

  it("should export sendgridWebhook registration function", async () => {
    const webhook = await import("./sendgridWebhook");
    expect(typeof webhook.registerSendGridWebhook).toBe("function");
  });
});
