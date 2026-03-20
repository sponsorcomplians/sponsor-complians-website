/**
 * CTA Configuration — Config-Driven Video/Webinar Toggle
 * 
 * When the product tour video is recorded:
 * 1. Set MODE to "video"
 * 2. Set VIDEO_URL to the actual video URL
 * 3. All CTAs across the site will automatically switch from
 *    webinar registration links to video player triggers.
 * 
 * When running a webinar campaign:
 * 1. Set MODE to "webinar"
 * 2. Update WEBINAR_SLUG and WEBINAR_DATE as needed
 * 3. All CTAs will point to the webinar registration page.
 */

export type CTAMode = "webinar" | "video";

interface CTAConfig {
  /** Current mode: "webinar" shows webinar CTAs, "video" shows product tour video CTAs */
  MODE: CTAMode;

  /** Webinar settings */
  WEBINAR_SLUG: string;
  WEBINAR_DATE: string;
  WEBINAR_TITLE: string;

  /** Video settings (used when MODE = "video") */
  VIDEO_URL: string;
  VIDEO_THUMBNAIL: string;

  /** Derived paths */
  getWebinarPath: () => string;
  getPrimaryCTALabel: () => string;
  getPrimaryCTAPath: () => string;
  getHeroCTALabel: () => string;
  getAnnouncementText: () => string;
  shouldShowAnnouncementBar: () => boolean;
}

const config: CTAConfig = {
  // ═══════════════════════════════════════════════
  // CHANGE THESE VALUES TO SWITCH CTA MODE
  // ═══════════════════════════════════════════════
  MODE: "webinar" as CTAMode,

  // Webinar settings
  WEBINAR_SLUG: "25-march-webinar",
  WEBINAR_DATE: "2026-03-25T10:00:00Z",
  WEBINAR_TITLE: "The Sponsor Compliance Crisis Is Already Here",

  // Video settings (populate when video is recorded)
  VIDEO_URL: "",
  VIDEO_THUMBNAIL: "",

  // ═══════════════════════════════════════════════
  // DERIVED METHODS — DO NOT EDIT BELOW
  // ═══════════════════════════════════════════════
  getWebinarPath() {
    return `/events/${this.WEBINAR_SLUG}`;
  },

  getPrimaryCTALabel() {
    if (this.MODE === "video") return "Watch Product Tour";
    return "See It Live — Free Webinar";
  },

  getPrimaryCTAPath() {
    if (this.MODE === "video") return "/hub-demo";
    return this.getWebinarPath();
  },

  getHeroCTALabel() {
    if (this.MODE === "video") return "▶ Watch Product Tour";
    const date = new Date(this.WEBINAR_DATE);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    return `See It Live — Free Webinar ${day} ${month}`;
  },

  getAnnouncementText() {
    if (this.MODE === "video") return "NEW: Watch Our Product Tour — See the Sponsor ComplIANS Hub in Action";
    const date = new Date(this.WEBINAR_DATE);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    return `FREE WEBINAR: ${day} ${month} ${year} — ${this.WEBINAR_TITLE}. Register Now →`;
  },

  shouldShowAnnouncementBar() {
    if (this.MODE === "video") return true;
    // Hide webinar bar after the event date
    return new Date() < new Date(this.WEBINAR_DATE);
  },
};

export default config;
