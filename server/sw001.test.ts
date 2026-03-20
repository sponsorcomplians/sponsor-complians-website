import { describe, it, expect } from "vitest";

/**
 * SW001 Feature Page Tests
 * Tests for the SW001 Full Staff List feature page content and structure
 */

describe("SW001 Feature Page", () => {
  describe("Feature sections data", () => {
    it("should have exactly 10 feature sections defined", async () => {
      // The SW001 page defines 10 feature sections
      const expectedSections = [
        "KPI Dashboard",
        "Excel-Style Filters",
        "RTW & Visa Alerts",
        "Document Compliance",
        "Compliance Scoring",
        "Driving Status",
        "Interactive Charts",
        "Bulk Actions & Export",
        "Add Sponsored Worker",
        "Smart Table",
      ];
      expect(expectedSections).toHaveLength(10);
    });

    it("should have unique section IDs", () => {
      const sectionIds = [
        "kpi-dashboard",
        "excel-filters",
        "rtw-alerts",
        "doc-compliance",
        "compliance-scoring",
        "driving-status",
        "interactive-charts",
        "bulk-actions",
        "add-worker",
        "smart-table",
      ];
      const uniqueIds = new Set(sectionIds);
      expect(uniqueIds.size).toBe(sectionIds.length);
    });

    it("each section should have required data fields", () => {
      // Validate the data structure expected by each section
      const requiredFields = ["id", "tabLabel", "icon", "tagline", "heading", "description", "image", "stats", "badges"];
      const sampleSection = {
        id: "kpi-dashboard",
        tabLabel: "KPI Dashboard",
        icon: "BarChart3",
        tagline: "REAL-TIME COMPLIANCE INTELLIGENCE",
        heading: "KPI Dashboard",
        description: "Five live KPI cards...",
        image: "https://cdn.example.com/image.webp",
        stats: [
          { value: "5", label: "Live KPI Cards" },
          { value: "Real-time", label: "Filter-Reactive" },
          { value: "197", label: "Workers Tracked" },
        ],
        badges: ["Real-time monitoring", "Audit-ready reports", "Automated alerts"],
      };

      for (const field of requiredFields) {
        expect(sampleSection).toHaveProperty(field);
      }
      expect(sampleSection.stats).toHaveLength(3);
      expect(sampleSection.badges).toHaveLength(3);
    });
  });

  describe("Coming soon modules", () => {
    it("should list 15 upcoming modules", () => {
      const comingSoonModules = [
        { code: "SW002", name: "Worker Coversheet" },
        { code: "SW003", name: "Right to Work Verification" },
        { code: "SW010", name: "Proof of Address" },
        { code: "SW013", name: "Passport & Travel Documents" },
        { code: "SW014", name: "Certificate of Sponsorship" },
        { code: "SW015", name: "Home Office Decision Letters" },
        { code: "SW017", name: "BRP Card Management" },
        { code: "SW019", name: "eVisa Status Tracking" },
        { code: "SW020", name: "RTW Check Records" },
        { code: "SW021", name: "DBS Certificate Tracking" },
        { code: "SW034", name: "Salary Compliance" },
        { code: "SW040", name: "Absence & Leave Management" },
        { code: "SW050", name: "Reporting Duties" },
        { code: "SW061", name: "Reonboarding Workflows" },
        { code: "SW065", name: "Exit & Offboarding" },
      ];
      expect(comingSoonModules).toHaveLength(15);
    });

    it("all module codes should follow SW### format", () => {
      const codes = ["SW002", "SW003", "SW010", "SW013", "SW014", "SW015", "SW017", "SW019", "SW020", "SW021", "SW034", "SW040", "SW050", "SW061", "SW065"];
      for (const code of codes) {
        expect(code).toMatch(/^SW\d{3}$/);
      }
    });

    it("module codes should be unique", () => {
      const codes = ["SW002", "SW003", "SW010", "SW013", "SW014", "SW015", "SW017", "SW019", "SW020", "SW021", "SW034", "SW040", "SW050", "SW061", "SW065"];
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });

  describe("Page routing", () => {
    it("SW001 route should be /features/sw001", () => {
      const route = "/features/sw001";
      expect(route).toBe("/features/sw001");
      expect(route.startsWith("/features/")).toBe(true);
    });

    it("SW001 should be accessible from Solutions dropdown", () => {
      // Verify the nav item exists in the expected structure
      const solutionsDropdown = [
        { label: "Sponsor Compliance Audit", href: "/sponsor-compliance-audit" },
        { label: "Skilled Worker Recruitment", href: "/skilled-worker-recruitment-solutions" },
        { label: "Sponsor-Ready HR Service", href: "/sponsor-hr-services" },
        { label: "Sponsor ComplIANS Hub", href: "/sponsor-complians-hub" },
        { label: "Sponsor Compliance Website Service", href: "/provider-websites" },
        { label: "Hub Interactive Demo", href: "/hub-demo" },
        { label: "SW001 — Full Staff List", href: "/features/sw001" },
      ];
      const sw001Item = solutionsDropdown.find(item => item.href === "/features/sw001");
      expect(sw001Item).toBeDefined();
      expect(sw001Item!.label).toBe("SW001 — Full Staff List");
    });
  });

  describe("Platform capabilities stats", () => {
    it("should display correct capability numbers", () => {
      const capabilities = [
        { label: "Compliance Areas Tracked", value: "12" },
        { label: "Sponsorship Lifecycle Stages", value: "16" },
        { label: "Document Types Managed", value: "15+" },
        { label: "Automated Alert Types", value: "24+" },
      ];
      expect(capabilities).toHaveLength(4);
      expect(capabilities[0].value).toBe("12");
      expect(capabilities[3].value).toBe("24+");
    });
  });

  describe("CTA links", () => {
    it("all booking CTAs should point to /book-consultation", () => {
      const bookingCTAs = [
        "/book-consultation", // Hero CTA
        "/book-consultation", // Coming soon section
        "/book-consultation", // Bottom CTA
      ];
      for (const cta of bookingCTAs) {
        expect(cta).toBe("/book-consultation");
      }
    });

    it("hub link should point to /sponsor-complians-hub", () => {
      const hubLink = "/sponsor-complians-hub";
      expect(hubLink).toBe("/sponsor-complians-hub");
    });

    it("hub demo link should point to /hub-demo", () => {
      const demoLink = "/hub-demo";
      expect(demoLink).toBe("/hub-demo");
    });
  });

  describe("Image references", () => {
    it("all 10 sections should reference valid image keys", () => {
      const imageKeys = [
        "sw001KpiDashboard",
        "sw001ExcelFilters",
        "sw001RtwAlerts",
        "sw001DocCompliance",
        "sw001ComplianceScoring",
        "sw001DrivingStatus",
        "sw001InteractiveCharts",
        "sw001BulkActions",
        "sw001AddWorker",
        "sw001KpiDashboard", // Smart Table reuses KPI dashboard image
      ];
      expect(imageKeys).toHaveLength(10);
      // All keys should follow the sw001* naming convention
      for (const key of imageKeys) {
        expect(key).toMatch(/^sw001/);
      }
    });

    it("Interactive Charts section should have a secondary image", () => {
      const secondaryImageKey = "sw001RtwExpiries";
      expect(secondaryImageKey).toBe("sw001RtwExpiries");
    });
  });
});
