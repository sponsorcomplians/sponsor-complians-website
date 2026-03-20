import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@sponsorcomplians.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

const baseJobInput = {
  title: "Test Compliance Job",
  company: "Test Company Ltd",
  location: "London",
  salaryMin: 30000,
  salaryMax: 40000,
  salaryType: "annual" as const,
  jobType: "full_time" as const,
  sector: "Healthcare",
  sponsorshipOffered: true,
  socCode: "2231",
  description: "This is a test job description with enough characters to pass validation.",
  requirements: "Test requirements",
  benefits: "Test benefits",
  contactEmail: "hr@testcompany.co.uk",
  contactPhone: "020 1234 5678",
};

describe("Compliance Pre-Qualification Fields", () => {
  it("accepts job posting with all three compliance fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.jobs.postFree({
      ...baseJobInput,
      sponsorLicenceStatus: "Yes — active licence",
      cosAvailability: "Yes — I have available CoS",
      homeOfficeInspection: "No — never been inspected",
    });
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe("number");
  });

  it("accepts job posting with flagged compliance values", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.jobs.postFree({
      ...baseJobInput,
      title: "Flagged Compliance Job",
      sponsorLicenceStatus: "Yes — but currently suspended",
      cosAvailability: "No — I need to request more",
      homeOfficeInspection: "Yes — licence downgraded",
      inspectionOutcomeDetail: "Licence was downgraded due to late reporting. Action plan completed in Q1 2026.",
    });
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.complianceReviewNote).toContain("compliance status will be reviewed");
  });

  it("rejects job posting when sponsorLicenceStatus is missing", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.jobs.postFree({
        ...baseJobInput,
        sponsorLicenceStatus: "",
        cosAvailability: "Yes — I have available CoS",
        homeOfficeInspection: "No — never been inspected",
      })
    ).rejects.toThrow();
  });

  it("rejects job posting when cosAvailability is missing", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.jobs.postFree({
        ...baseJobInput,
        sponsorLicenceStatus: "Yes — active licence",
        cosAvailability: "",
        homeOfficeInspection: "No — never been inspected",
      })
    ).rejects.toThrow();
  });

  it("rejects job posting when homeOfficeInspection is missing", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.jobs.postFree({
        ...baseJobInput,
        sponsorLicenceStatus: "Yes — active licence",
        cosAvailability: "Yes — I have available CoS",
        homeOfficeInspection: "",
      })
    ).rejects.toThrow();
  });

  it("allows optional inspectionOutcomeDetail field", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.jobs.postFree({
      ...baseJobInput,
      title: "Job With Inspection Detail",
      sponsorLicenceStatus: "Yes — active licence",
      cosAvailability: "Yes — I have available CoS",
      homeOfficeInspection: "Yes — passed with action plan",
      inspectionOutcomeDetail: "Minor HR record-keeping improvements recommended. All actions completed.",
    });
    expect(result.success).toBe(true);
  });

  it("admin can update compliance fields on a job", async () => {
    // First create a job
    const publicCaller = appRouter.createCaller(createPublicContext());
    const { id } = await publicCaller.jobs.postFree({
      ...baseJobInput,
      title: "Job For Admin Update",
      sponsorLicenceStatus: "No — I don't have one yet",
      cosAvailability: "I'm not sure",
      homeOfficeInspection: "Prefer not to say",
    });

    // Admin updates compliance fields
    const adminCaller = appRouter.createCaller(createAdminContext());
    const updateResult = await adminCaller.jobs.update({
      id,
      sponsorLicenceStatus: "Yes — active licence",
      cosAvailability: "Yes — I have available CoS",
      homeOfficeInspection: "No — never been inspected",
    });
    expect(updateResult.success).toBe(true);
  });

  it("returns complianceReviewNote in the response", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.jobs.postFree({
      ...baseJobInput,
      title: "Review Note Test Job",
      sponsorLicenceStatus: "Applied — awaiting decision",
      cosAvailability: "Not applicable",
      homeOfficeInspection: "No — never been inspected",
    });
    expect(result.complianceReviewNote).toBeDefined();
    expect(result.complianceReviewNote).toContain("sponsor licence status");
    expect(result.complianceReviewNote).toContain("CoS availability");
    expect(result.complianceReviewNote).toContain("Home Office inspection");
  });
});
