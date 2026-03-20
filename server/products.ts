/**
 * Stripe Products — Job Listing Tiers
 * Prices in pence (GBP)
 */

export const JOB_PRODUCTS = {
  sponsored: {
    name: "Sponsored Job Listing",
    description: "Priority placement, enhanced branding, 60-day duration, candidate shortlist dashboard",
    priceInPence: 14900, // £149
    tier: "sponsored" as const,
    durationDays: 60,
  },
  premium: {
    name: "Premium Job Listing",
    description: "AI candidate matching, compliance document pack, social media promotion, 90-day duration",
    priceInPence: 44900, // £449
    tier: "premium" as const,
    durationDays: 90,
  },
  managed: {
    name: "Managed Recruitment",
    description: "Full end-to-end compliant recruitment with dedicated consultant, screened CVs, and audit-ready file",
    priceInPence: 249500, // £2,495
    tier: "managed" as const,
    durationDays: 180, // Until filled, but cap at 180 days
  },
  sponsored_monthly: {
    name: "Sponsored Monthly (Unlimited Listings)",
    description: "Unlimited sponsored listings for one month",
    priceInPence: 34900, // £349/month
    tier: "sponsored" as const,
    durationDays: 30,
  },
  premium_monthly: {
    name: "Premium Monthly (Unlimited Listings)",
    description: "Unlimited premium listings for one month",
    priceInPence: 99900, // £999/month
    tier: "premium" as const,
    durationDays: 30,
  },
} as const;

export type ProductKey = keyof typeof JOB_PRODUCTS;
