import { describe, expect, it } from "vitest";

/**
 * Tests for Hub Demo page and hero image enhancements.
 * These are structural/integration tests verifying that the page modules
 * and image references are correctly configured.
 */

describe("Hub Demo page configuration", () => {
  it("IMAGES constant includes hubDashboardHero", async () => {
    // Verify the images module exports the hero image
    const imagesModule = await import("../client/src/lib/images");
    expect(imagesModule.IMAGES).toBeDefined();
    expect(imagesModule.IMAGES.hubDashboardHero).toBeDefined();
    expect(typeof imagesModule.IMAGES.hubDashboardHero).toBe("string");
    expect(imagesModule.IMAGES.hubDashboardHero).toContain("hub-dashboard-hero");
  });

  it("IMAGES constant includes all Hub screenshots used in demo", async () => {
    const { IMAGES } = await import("../client/src/lib/images");
    // All images referenced in the HubDemo showcase modules
    expect(IMAGES.hubDashboard1).toBeDefined();
    expect(IMAGES.hubDashboard3).toBeDefined();
    expect(IMAGES.rtwCalendar).toBeDefined();
    expect(IMAGES.technologyBuiltSponsoredWorkers).toBeDefined();
    expect(IMAGES.complianceOverviewCalendar).toBeDefined();
  });

  it("Hub demo route is registered in App.tsx", async () => {
    const fs = await import("fs");
    const appContent = fs.readFileSync("client/src/App.tsx", "utf-8");
    expect(appContent).toContain('path="/hub-demo"');
    expect(appContent).toContain("HubDemo");
  });

  it("Hero section uses ctaConfig for dynamic CTA path", async () => {
    const fs = await import("fs");
    const homeContent = fs.readFileSync("client/src/pages/Home.tsx", "utf-8");
    expect(homeContent).toContain("ctaConfig.getPrimaryCTAPath()");
  });

  it("Hero section uses ctaConfig for dynamic CTA label", async () => {
    const fs = await import("fs");
    const homeContent = fs.readFileSync("client/src/pages/Home.tsx", "utf-8");
    expect(homeContent).toContain("ctaConfig.getHeroCTALabel()");
    expect(homeContent).toContain('import ctaConfig from "@/lib/ctaConfig"');
  });

  it("Hero image has hover animation classes", async () => {
    const fs = await import("fs");
    const homeContent = fs.readFileSync("client/src/pages/Home.tsx", "utf-8");
    expect(homeContent).toContain("group-hover:scale-[1.03]");
    expect(homeContent).toContain("group-hover:scale-[1.02]");
    expect(homeContent).toContain("transition-all duration-500");
  });

  it("Hero image has glow effect on hover", async () => {
    const fs = await import("fs");
    const homeContent = fs.readFileSync("client/src/pages/Home.tsx", "utf-8");
    expect(homeContent).toContain("group-hover:shadow-[0_0_60px_rgba(0,195,255,0.15)]");
    expect(homeContent).toContain("group-hover:border-[#00C3FF]/30");
  });

  it("Hub Demo page has 10 showcase modules (6 original hub sections removed)", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    // All 6 original hub sections removed
    expect(demoContent).not.toContain('"run-dashboard"');
    expect(demoContent).not.toContain('"unified-inbox"');
    expect(demoContent).not.toContain('"compliance-status"');
    expect(demoContent).not.toContain('"rtw-calendar"');
    expect(demoContent).not.toContain('"sponsored-workers"');
    expect(demoContent).not.toContain('"zone-management"');
    // SW001 sections should be present
    expect(demoContent).toContain('"kpi-dashboard"');
    expect(demoContent).toContain('"smart-table"');
  });

  it("Hub Demo page includes video modal and ctaConfig integration", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    expect(demoContent).toContain("VideoModal");
    expect(demoContent).toContain("ctaConfig");
  });

  it("Hub Demo page has CTA section with demo booking link", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    expect(demoContent).toContain("Book a Live Demo");
    expect(demoContent).toContain('href="/book-consultation"');
    expect(demoContent).toContain("Ready to See the Hub in Action");
  });

  it("Hero image has scroll-triggered parallax transform", async () => {
    const fs = await import("fs");
    const homeContent = fs.readFileSync("client/src/pages/Home.tsx", "utf-8");
    expect(homeContent).toContain("scrollY");
    expect(homeContent).toContain("translateY");
    expect(homeContent).toContain("rotate3d");
    expect(homeContent).toContain("requestAnimationFrame");
  });

  it("Solutions dropdown includes Hub Interactive Demo with New badge", async () => {
    const fs = await import("fs");
    const navContent = fs.readFileSync("client/src/components/TopNav.tsx", "utf-8");
    expect(navContent).toContain("Hub Interactive Demo");
    expect(navContent).toContain('/hub-demo');
    expect(navContent).toContain("New");
  });

  it("Video modal has HeyGen-style player with progress bar and controls", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    expect(demoContent).toContain("VIDEO_URL");
    expect(demoContent).toContain("aspect-video");
    expect(demoContent).toContain("handleSeek");
    expect(demoContent).toContain("handleTimeUpdate");
    expect(demoContent).toContain("formatTime");
    expect(demoContent).toContain("progress");
    expect(demoContent).toContain("Sponsor ComplIANS Hub \u2014 Product Tour");
  });

  it("Video modal supports real video playback when VIDEO_URL is set", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    expect(demoContent).toContain("<video");
    expect(demoContent).toContain("togglePlay");
    expect(demoContent).toContain("onTimeUpdate");
    expect(demoContent).toContain("onLoadedMetadata");
    expect(demoContent).toContain("onEnded");
  });

  it("Video modal shows placeholder state with Hub screenshot when no video", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    expect(demoContent).toContain("hubDashboardHero");
    expect(demoContent).toContain("Hub Product Tour Preview");
    expect(demoContent).toContain("Recording in progress");
  });

  it("Video placeholder has email capture form for early access notifications", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    expect(demoContent).toContain('type="email"');
    expect(demoContent).toContain('placeholder="Enter your email"');
    expect(demoContent).toContain("Notify Me");
    expect(demoContent).toContain("hub_video_early_access");
    expect(demoContent).toContain("subscribers.subscribe");
    expect(demoContent).toContain("emailSubmitted");
    expect(demoContent).toContain("You're on the list");
    expect(demoContent).toContain("No spam. Unsubscribe anytime. GDPR compliant.");
  });

  it("Hub Software page uses ctaConfig for dynamic CTAs", async () => {
    const fs = await import("fs");
    const hubContent = fs.readFileSync("client/src/pages/HubSoftware.tsx", "utf-8");
    expect(hubContent).toContain("ctaConfig.getHeroCTALabel()");
    expect(hubContent).toContain("ctaConfig.getPrimaryCTAPath()");
    expect(hubContent).toContain('import ctaConfig from "@/lib/ctaConfig"');
  });

  it("Hub Software Watch Demo modal has same video player and email capture", async () => {
    const fs = await import("fs");
    const hubContent = fs.readFileSync("client/src/pages/HubSoftware.tsx", "utf-8");
    expect(hubContent).toContain("VIDEO_URL");
    expect(hubContent).toContain("aspect-video");
    expect(hubContent).toContain('type="email"');
    expect(hubContent).toContain("Notify Me");
    expect(hubContent).toContain("hub_video_early_access");
    expect(hubContent).toContain("Recording in progress");
  });

  it("Book a Live Demo button appears after video ends in both modals", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    const hubContent = fs.readFileSync("client/src/pages/HubSoftware.tsx", "utf-8");
    // Both files should have videoEnded state and Book a Live Demo CTA
    for (const content of [demoContent, hubContent]) {
      expect(content).toContain("videoEnded");
      expect(content).toContain("setVideoEnded(true)");
      expect(content).toContain("Book a Live Demo");
      expect(content).toContain("Ready to see it live?");
      expect(content).toContain('href="/book-consultation"');
    }
  });

  it("Video ended state resets when modal is closed", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    const hubContent = fs.readFileSync("client/src/pages/HubSoftware.tsx", "utf-8");
    for (const content of [demoContent, hubContent]) {
      expect(content).toContain("setVideoEnded(false)");
    }
  });
});

describe("Admin dashboard video early access stat card", () => {
  it("getDashboardStats returns videoEarlyAccess count", async () => {
    const fs = await import("fs");
    const dbContent = fs.readFileSync("server/db.ts", "utf-8");
    expect(dbContent).toContain("videoEarlyAccess");
    expect(dbContent).toContain('hub_video_early_access');
  });

  it("Admin dashboard has prominent Video Early Access featured card with gradient", async () => {
    const fs = await import("fs");
    const adminContent = fs.readFileSync("client/src/pages/AdminDashboard.tsx", "utf-8");
    expect(adminContent).toContain("Video Early Access Signups");
    expect(adminContent).toContain("videoEarlyAccess");
    expect(adminContent).toContain("from-[#7C3AED] to-[#6D28D9]");
    expect(adminContent).toContain("Subscribers waiting for the product tour video");
    expect(adminContent).toContain("total subscribers");
  });

  it("VideoEarlyAccessBreakdown component groups subscribers by date", async () => {
    const fs = await import("fs");
    const adminContent = fs.readFileSync("client/src/pages/AdminDashboard.tsx", "utf-8");
    expect(adminContent).toContain("VideoEarlyAccessBreakdown");
    expect(adminContent).toContain("Subscriber Breakdown by Date");
    expect(adminContent).toContain("videoRelease.subscriberCount");
    expect(adminContent).toContain("toLocaleDateString");
  });

  it("VideoEarlyAccessBreakdown shows recent subscriber emails", async () => {
    const fs = await import("fs");
    const adminContent = fs.readFileSync("client/src/pages/AdminDashboard.tsx", "utf-8");
    expect(adminContent).toContain("Recent Subscribers");
    expect(adminContent).toContain("s.email");
    expect(adminContent).toContain("s.subscribedAt");
    expect(adminContent).toContain("slice(0, 10)");
  });

  it("VideoEarlyAccessBreakdown shows empty state when no subscribers", async () => {
    const fs = await import("fs");
    const adminContent = fs.readFileSync("client/src/pages/AdminDashboard.tsx", "utf-8");
    expect(adminContent).toContain("No subscribers yet");
    expect(adminContent).toContain("Signups will appear here");
  });
});

describe("Video release email notification system", () => {
  it("videoRelease router exists with sendNotifications and subscriberCount", async () => {
    const fs = await import("fs");
    const routerContent = fs.readFileSync("server/routers.ts", "utf-8");
    expect(routerContent).toContain("videoRelease: router");
    expect(routerContent).toContain("sendNotifications:");
    expect(routerContent).toContain("subscriberCount:");
    expect(routerContent).toContain("adminProcedure");
    expect(routerContent).toContain("getSubscribersBySource");
  });

  it("sendVideoReleaseEmail function exists in email.ts", async () => {
    const fs = await import("fs");
    const emailContent = fs.readFileSync("server/email.ts", "utf-8");
    expect(emailContent).toContain("sendVideoReleaseEmail");
    expect(emailContent).toContain("Hub Product Tour is Ready");
    expect(emailContent).toContain("Watch the Product Tour");
    expect(emailContent).toContain("Book a personalised demo");
    expect(emailContent).toContain("Unsubscribe");
  });

  it("getSubscribersBySource helper exists in db.ts", async () => {
    const fs = await import("fs");
    const dbContent = fs.readFileSync("server/db.ts", "utf-8");
    expect(dbContent).toContain("getSubscribersBySource");
    expect(dbContent).toContain("source: string");
  });

  it("sendNotifications requires videoUrl input", async () => {
    const fs = await import("fs");
    const routerContent = fs.readFileSync("server/routers.ts", "utf-8");
    expect(routerContent).toContain('videoUrl: z.string().url()');
  });
});

describe("Hub Demo key features showcase section", () => {
  it("Hub Demo page has Key Features at a Glance section", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    expect(demoContent).toContain("Key Features at a Glance");
    expect(demoContent).toContain("Why Sponsors Choose the Hub");
  });

  it("Key features section has 9 feature cards", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    expect(demoContent).toContain("12-Point Compliance Engine");
    expect(demoContent).toContain("Automated Alert System");
    expect(demoContent).toContain("Document Vault & Audit Trail");
    expect(demoContent).toContain("12-Stage Sponsorship Lifecycle");
    expect(demoContent).toContain("Unified Messaging & Inbox");
    expect(demoContent).toContain("Compliance Analytics & Reporting");
    expect(demoContent).toContain("RTW Calendar & Reminders");
    expect(demoContent).toContain("Zone & Coverage Intelligence");
    expect(demoContent).toContain("One-Click Audit Preparation");
  });

  it("Key features section has category badges", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    const badges = ["Core", "Automation", "Compliance", "Lifecycle", "Communication", "Analytics", "Scheduling", "Operations", "Audit"];
    for (const badge of badges) {
      expect(demoContent).toContain(`"${badge}"`);
    }
  });

  it("Key features section has bottom highlight bar with CTA", async () => {
    const fs = await import("fs");
    const demoContent = fs.readFileSync("client/src/pages/HubDemo.tsx", "utf-8");
    expect(demoContent).toContain("All Features. One Platform. Zero Compliance Gaps.");
    expect(demoContent).toContain("Built from 100+ real UK sponsor licence audits");
    expect(demoContent).toContain("Book a Demo");
  });
});
