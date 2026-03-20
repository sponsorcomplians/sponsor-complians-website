import dotenv from "dotenv";
dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_API_KEY) {
  console.error("SENDGRID_API_KEY not set");
  process.exit(1);
}

const emailData = {
  personalizations: [
    {
      to: [{ email: "ian@sponsorcomplians.com", name: "Ian" }],
      subject: "Test Email from Sponsor ComplIANS Email Campaign System",
    },
  ],
  from: {
    email: "ian@sponsorcomplians.com",
    name: "Sponsor ComplIANS",
  },
  reply_to: {
    email: "ian@sponsorcomplians.com",
    name: "Sponsor ComplIANS",
  },
  content: [
    {
      type: "text/html",
      value: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0D1B2A, #1B3A5C); padding: 32px; text-align: center; }
    .header h1 { color: #00C3FF; margin: 0; font-size: 24px; }
    .header p { color: #94a3b8; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .body h2 { color: #0D1B2A; margin-top: 0; }
    .body p { color: #475569; line-height: 1.6; }
    .success-badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; }
    .checklist { list-style: none; padding: 0; }
    .checklist li { padding: 8px 0; color: #475569; }
    .checklist li::before { content: "✅ "; }
    .footer { background: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sponsor ComplIANS</h1>
      <p>Email Campaign System</p>
    </div>
    <div class="body">
      <h2>🎉 Test Email Successful!</h2>
      <p>This is a test email sent from your <strong>Sponsor ComplIANS Email Campaign System</strong>. If you're reading this, your SendGrid integration is working perfectly.</p>
      
      <p><span class="success-badge">System Online</span></p>
      
      <h3 style="color: #0D1B2A;">What's ready:</h3>
      <ul class="checklist">
        <li>SendGrid API connected and verified</li>
        <li>Sender identity verified (ian@sponsorcomplians.com)</li>
        <li>Campaign creation and email builder</li>
        <li>Contact list management</li>
        <li>Campaign scheduling and sending</li>
        <li>Open, click, bounce, and unsubscribe tracking</li>
        <li>Analytics dashboard</li>
      </ul>
      
      <p>You can now create your first real campaign from the admin panel at <strong>Email Campaigns → Campaigns → New Campaign</strong>.</p>
    </div>
    <div class="footer">
      <p>Sent from Sponsor ComplIANS Email Campaign System</p>
      <p>© ${new Date().getFullYear()} Sponsor ComplIANS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
    },
  ],
  tracking_settings: {
    click_tracking: { enable: true },
    open_tracking: { enable: true },
  },
};

console.log("Sending test email to ian@sponsorcomplians.com...");

const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${SENDGRID_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(emailData),
});

if (response.status === 202) {
  console.log("✅ Test email sent successfully! Check your inbox at ian@sponsorcomplians.com");
} else {
  const errorBody = await response.text();
  console.error(`❌ Failed to send email. Status: ${response.status}`);
  console.error("Response:", errorBody);
}
