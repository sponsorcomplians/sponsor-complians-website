/*
 * SW001.tsx — Full Staff List Feature Page
 * Design: Matches hub-demo layout exactly
 * Palette: #0D1B2A / #1B3A5C / #00C3FF / #E74C3C / #F39C12 / #F5F7FA
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import {
  ArrowRight, BarChart3, CheckCircle2, Shield, Users,
  FileCheck, Bell, Filter, Eye, AlertTriangle, Car,
  PieChart, Download, UserPlus, Table2, Layers,
  Clock, Sparkles, Upload, FileSpreadsheet,
} from "lucide-react";

/* ── Scroll-reveal ── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ── Feature section data ── */
const featureSections = [
  {
    id: "kpi-dashboard",
    tabLabel: "KPI Dashboard",
    icon: BarChart3,
    tagline: "REAL-TIME COMPLIANCE INTELLIGENCE",
    heading: "KPI Dashboard",
    description: "Five live KPI cards give you an instant health check of your entire sponsored workforce. The compliance donut breaks down compliant, at-risk, and non-compliant workers at a glance. RTW Urgent flags expired and critical visa situations that need immediate action. Alerts & Status shows how many workers are on probation or need attention. The Workforce card tracks total workers, contracted hours, and shortfall gaps. Document Compliance shows your average completion percentage and how many workers have fully compliant files. Every single card recalculates in real time as you apply filters to the table below — filter to Skilled Workers and the KPIs instantly show Skilled Worker stats only.",
    image: IMAGES.sw001KpiDashboard,
    stats: [
      { value: "5", label: "Live KPI Cards" },
      { value: "Real-time", label: "Filter-Reactive" },
      { value: "197", label: "Workers Tracked" },
    ],
    badges: ["Real-time monitoring", "Audit-ready reports", "Automated alerts"],
  },
  {
    id: "excel-filters",
    tabLabel: "Excel-Style Filters",
    icon: Filter,
    tagline: "FILTER LIKE A SPREADSHEET, ANALYSE LIKE A DASHBOARD",
    heading: "Excel-Style Column Filters",
    description: "Click any column header to open a checkbox filter dropdown — exactly like Excel's auto-filter. See the count for each value before you select it, so you know what you'll get. Stack multiple filters to drill down progressively: start with all 197 workers, filter to Non-Compliant, then narrow to Full UK Licence holders — and instantly see 20 results. Blue filter pills at the top show your active filters with one-click removal. The summary row appears automatically and shows stats only for filtered columns. Every KPI card, chart, and sidebar panel updates to reflect your filtered dataset.",
    image: IMAGES.sw001ExcelFilters,
    stats: [
      { value: "10", label: "Filterable Columns" },
      { value: "Yes", label: "Cumulative Stacking" },
      { value: "Instant", label: "Count Preview" },
    ],
    badges: ["Checkbox selection", "Filter pills", "One-click clear"],
  },
  {
    id: "rtw-alerts",
    tabLabel: "RTW & Visa Alerts",
    icon: AlertTriangle,
    tagline: "NEVER MISS A VISA RENEWAL AGAIN",
    heading: "RTW & Visa Expiry Alerts",
    description: "The Right to Work column shows colour-coded status dots for every worker at a glance. Green means compliant with plenty of time. Amber means expiring soon — within 30 days. Red means expired or critical — immediate action required. Each dot shows the exact number of days remaining. Filter to \"Expiring Soon\" and instantly see every worker who needs a renewal conversation this month. The RTW Urgent KPI card at the top tells you how many are in the danger zone before you even scroll. This is how you keep your sponsor licence safe.",
    image: IMAGES.sw001RtwAlerts,
    stats: [
      { value: "41", label: "RTW Urgent Alerts" },
      { value: "25", label: "Expiring Within 30 Days" },
      { value: "Colour-coded", label: "Status Indicators" },
    ],
    badges: ["Visa expiry tracking", "Automated alerts", "Days remaining"],
  },
  {
    id: "doc-compliance",
    tabLabel: "Document Compliance",
    icon: FileCheck,
    tagline: "KNOW EXACTLY WHERE THE GAPS ARE",
    heading: "Document Compliance Tracking",
    description: "Every worker's document status is shown as Complete, Partial, or Not Started — with a progress bar and percentage alongside. Filter to \"Not Started\" and instantly see the 60 workers who haven't submitted any documents yet. Filter to \"Partial\" to find workers who are halfway there and need a nudge. The Document Compliance KPI card shows your organisation's average completion and how many workers are fully compliant. When CQC inspectors or the Home Office ask for documentation status, you have the answer in seconds — not hours of spreadsheet work.",
    image: IMAGES.sw001DocCompliance,
    stats: [
      { value: "36", label: "Fully Compliant" },
      { value: "48%", label: "Average Completion" },
      { value: "3", label: "Status Categories" },
    ],
    badges: ["Progress tracking", "Gap identification", "Audit-ready exports"],
  },
  {
    id: "compliance-scoring",
    tabLabel: "Compliance Scoring",
    icon: Shield,
    tagline: "AUTOMATED RISK ASSESSMENT FOR EVERY WORKER",
    heading: "Compliance Scoring (0\u2013100)",
    description: "Every sponsored worker receives an automated compliance score from 0 to 100, calculated from their document completion, RTW status, visa validity, and employment stage. Scores are colour-coded: green (80-100) means compliant and audit-ready, amber (50-79) means at risk and needs attention, red (0-49) means non-compliant and requires urgent action. Stack filters to find exactly who needs help — like workers with no documents started AND a score between 51-75. The Workers Requiring Attention sidebar shows the lowest-scoring workers first, so you always know where to focus.",
    image: IMAGES.sw001ComplianceScoring,
    stats: [
      { value: "78", label: "Compliant Workers" },
      { value: "71", label: "At Risk Workers" },
      { value: "48", label: "Non-Compliant" },
    ],
    badges: ["Auto-calculated", "Three risk tiers", "Priority ranking"],
  },
  {
    id: "driving-status",
    tabLabel: "Driving Status",
    icon: Car,
    tagline: "DEPLOYMENT-READY WORKFORCE VISIBILITY",
    heading: "Driving Status Tracking",
    description: "Know exactly who can drive before you assign them to a run. Five driving status categories track the real-world licensing situation of your sponsored workforce: Full UK Licence, Provisional Licence, International Licence under 12 months (cannot drive unsupervised), International Licence over 12 months (must exchange to UK licence), and Non-Driver. Each status has a colour-coded badge. Filter by driving status to instantly see who's available for driving runs — or identify workers who need to start their UK licence conversion before their international licence window closes.",
    image: IMAGES.sw001DrivingStatus,
    stats: [
      { value: "5", label: "Licence Categories" },
      { value: "72", label: "Full UK Licence" },
      { value: "45", label: "International (<12m)" },
    ],
    badges: ["Licence tracking", "Run allocation", "Compliance alerts"],
  },
  {
    id: "interactive-charts",
    tabLabel: "Interactive Charts",
    icon: PieChart,
    tagline: "SEE THE PATTERNS YOUR SPREADSHEET HIDES",
    heading: "Interactive Charts & Visualisations",
    description: "The Compliance Overview panel expands to reveal six interactive visualisations. The Compliance Distribution donut shows your workforce health at a glance — click any segment to filter the table. The Immigration Breakdown donut shows your visa type composition. Contracted vs Scheduled Hours reveals shortfall patterns per worker. Compliance by Area shows which zones have the most non-compliant workers. The Document Gaps Heatmap is a grid of workers versus key documents, colour-coded red where gaps exist. The Upcoming RTW Expiries timeline shows who's running out of time. Every chart reacts to your active filters — they're not static reports, they're live analytical tools.",
    image: IMAGES.sw001InteractiveCharts,
    secondaryImage: IMAGES.sw001RtwExpiries,
    stats: [
      { value: "6", label: "Chart Types" },
      { value: "Clickable", label: "Filter Integration" },
      { value: "Live", label: "Filter-Reactive" },
    ],
    badges: ["Compliance donut", "Area heatmap", "RTW timeline"],
  },
  {
    id: "bulk-actions",
    tabLabel: "Bulk Actions & Export",
    icon: Download,
    tagline: "ACT ON MULTIPLE WORKERS AT ONCE",
    heading: "Bulk Actions & Export",
    description: "Select individual workers with checkboxes or use Select All to grab the entire filtered set. The bulk action bar appears instantly with Export CSV, Archive, and Change Stage options. Export sends your filtered data to a spreadsheet — exactly what's on screen, with all columns and applied filters. Print generates a formatted A4 view ready for CQC inspections or audit meetings with Ctrl+P shortcut support. Save your most-used filter combinations as named Presets — \"Skilled Workers with expiring RTW\" becomes a one-click view you can return to daily. The Columns button lets you toggle columns on and off, saved between sessions.",
    image: IMAGES.sw001BulkActions,
    stats: [
      { value: "3", label: "Bulk Actions" },
      { value: "1-click", label: "CSV Export" },
      { value: "Saved", label: "Filter Presets" },
    ],
    badges: ["Bulk operations", "Print-ready", "Saved presets"],
  },
  {
    id: "add-worker",
    tabLabel: "Add Sponsored Worker",
    icon: UserPlus,
    tagline: "ONBOARD NEW WORKERS IN MINUTES",
    heading: "Add Sponsored Worker",
    description: "Add new sponsored workers through a guided 3-step wizard. Step 1: Upload personal documents — the AI Document Upload feature automatically classifies passports, CoS letters, BRP cards, bank statements, and contracts. Just drop the files and the system identifies what they are. Step 2: Upload employment documents. Step 3: Review and confirm. Enter personal details including name, date of birth, nationality, immigration status, gender, passport information, and place of birth. Choose between adding a single worker or bulk importing via Excel/CSV for large onboarding batches. New workers immediately appear in the SW001 table with their compliance score calculated from the documents uploaded during onboarding.",
    image: IMAGES.sw001AddWorker,
    stats: [
      { value: "3-step", label: "Guided Wizard" },
      { value: "AI", label: "Document Classification" },
      { value: "Bulk", label: "Excel/CSV Import" },
    ],
    badges: ["AI-powered upload", "Single or bulk", "Instant scoring"],
  },
  {
    id: "smart-table",
    tabLabel: "Smart Table",
    icon: Table2,
    tagline: "THE TABLE THAT THINKS WITH YOU",
    heading: "Smart Table",
    description: "The SW001 table isn't just a list — it's an analytical engine. Fifteen columns cover every compliance dimension: worker name, employee ID, compliance status, employment stage, immigration type, start date, contracted hours, area, driving status, Right to Work, document completion, and compliance score. Sort any column with a click. Stack up to 10 filters simultaneously and watch the summary row, KPI cards, charts, and sidebar all react together. The table shows \"28 of 197\" so you always know your filtered scope. Tab filters at the top let you quickly switch between All, Employed, On Probation, and New Hire views. Search by name, ID, or area. Pagination handles any workforce size. This is the spreadsheet replacement your compliance team has been waiting for.",
    image: IMAGES.sw001KpiDashboard,
    stats: [
      { value: "15", label: "Data Columns" },
      { value: "10", label: "Simultaneous Filters" },
      { value: "Everything", label: "Updates Together" },
    ],
    badges: ["Sort & search", "Tab views", "Responsive sidebar"],
  },
];

/* ── Coming Soon modules ── */
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

export default function SW001() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="-mt-[108px]">
      {/* ═══ HERO ═══ */}
      <section className="hero-gradient min-h-[60vh] flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase bg-[#00C3FF]/10 text-[#00C3FF] border border-[#00C3FF]/20 mb-6">
                Sponsor ComplIANS Hub — Module SW001
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                SW001 —{" "}
                <span className="bg-gradient-to-r from-[#00C3FF] to-[#00E5FF] bg-clip-text text-transparent">
                  Full Staff List
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-[#8B9EB7] text-xl lg:text-2xl font-medium mb-4">
                Your entire sponsored workforce. One intelligent view.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#8B9EB7] text-base lg:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                The SW001 module is the command centre for managing your sponsored workers' compliance. Every worker's status, immigration details, visa expiry, documents, Right to Work checks, driving licence, contracted hours, and compliance score — visible in a single, filterable table with live KPIs, interactive charts, and Excel-style column filters. This is what replacing spreadsheets looks like.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/book-consultation" className="inline-flex items-center gap-2 bg-[#00C3FF] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#00B0E6] transition-colors">
                  Book a Live Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/hub-demo" className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/5 transition-colors">
                  See the Full Hub <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ TAB NAVIGATION ═══ */}
      <section className="bg-[#0D1B2A] border-b border-white/5 sticky top-[68px] z-30">
        <div className="container">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {featureSections.map((sec, i) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveTab(i);
                    document.getElementById(`section-${sec.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === i
                      ? "bg-[#00C3FF]/10 text-[#00C3FF] border border-[#00C3FF]/30"
                      : "text-[#8B9EB7] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {sec.tabLabel}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FEATURE SECTIONS ═══ */}
      {featureSections.map((sec, i) => {
        const Icon = sec.icon;
        const isEven = i % 2 === 0;
        return (
          <section
            key={sec.id}
            id={`section-${sec.id}`}
            className={`py-20 lg:py-28 ${i % 2 === 0 ? "bg-[#0A1628]" : "bg-[#0D1B2A]"}`}
          >
            <div className="container">
              <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${!isEven ? "lg:[direction:rtl]" : ""}`}>
                {/* Screenshot */}
                <Reveal className={!isEven ? "lg:[direction:ltr]" : ""}>
                  <div className="relative group">
                    <div className="absolute -inset-3 bg-[#00C3FF]/5 rounded-2xl blur-xl group-hover:bg-[#00C3FF]/10 transition-all duration-500" />
                    <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(0,195,255,0.1)] group-hover:border-[#00C3FF]/20">
                      <img
                        src={sec.image}
                        alt={`${sec.heading} — ${sec.tagline}`}
                        className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </div>
                    {/* Section number badge */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-[#00C3FF] flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                      {i + 1}
                    </div>
                  </div>
                  {/* Secondary image for Interactive Charts section */}
                  {"secondaryImage" in sec && sec.secondaryImage && (
                    <div className="relative group mt-6">
                      <div className="absolute -inset-3 bg-[#00C3FF]/5 rounded-2xl blur-xl group-hover:bg-[#00C3FF]/10 transition-all duration-500" />
                      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(0,195,255,0.1)] group-hover:border-[#00C3FF]/20">
                        <img
                          src={sec.secondaryImage}
                          alt="Upcoming RTW Expiries Timeline"
                          className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                  )}
                </Reveal>

                {/* Description */}
                <Reveal delay={0.2} className={!isEven ? "lg:[direction:ltr]" : ""}>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#00C3FF]/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#00C3FF]" />
                      </div>
                      <span className="text-[#00C3FF] text-xs font-bold tracking-[0.15em] uppercase">{sec.tagline}</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {sec.heading}
                    </h2>
                    <p className="text-[#8B9EB7] text-base lg:text-lg leading-relaxed mb-8">
                      {sec.description}
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {sec.stats.map((stat, si) => (
                        <div key={si} className="bg-[#1B3A5C]/50 border border-white/5 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-[#8B9EB7] text-xs mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Badge pills */}
                    <div className="flex flex-wrap gap-2">
                      {sec.badges.map((badge, bi) => (
                        <span key={bi} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00C3FF]/5 text-[#00C3FF] text-xs font-medium border border-[#00C3FF]/10">
                          <CheckCircle2 className="w-3 h-3" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* ═══ PLATFORM CAPABILITIES BAR ═══ */}
      <section className="bg-[#0D1B2A] py-20 lg:py-28 border-t border-white/5">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase bg-[#00C3FF]/10 text-[#00C3FF] border border-[#00C3FF]/20 mb-4">
                Platform Capabilities
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Built for UK Sponsor Licence Compliance
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: "Compliance Areas Tracked", value: "12", color: "#00C3FF" },
              { icon: Users, label: "Sponsorship Lifecycle Stages", value: "16", color: "#00E5FF" },
              { icon: FileCheck, label: "Document Types Managed", value: "15+", color: "#00C3FF" },
              { icon: Bell, label: "Automated Alert Types", value: "24+", color: "#00E5FF" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#1B3A5C]/30 border border-white/5 rounded-xl p-6 text-center hover:border-[#00C3FF]/20 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00C3FF]/20 transition-colors">
                    <stat.icon className="w-6 h-6 text-[#00C3FF]" />
                  </div>
                  <div className="text-3xl font-extrabold text-white mb-2">{stat.value}</div>
                  <div className="text-[#8B9EB7] text-sm">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMING SOON FOOTER ═══ */}
      <section className="bg-gradient-to-b from-[#0A1628] to-[#0D1B2A] py-20 lg:py-28 border-t border-white/5">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase bg-[#F39C12]/10 text-[#F39C12] border border-[#F39C12]/20 mb-4">
                This Is Just the Beginning
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                SW002 to SW065 — Coming in the Next Release
              </h2>
              <p className="text-[#8B9EB7] text-lg max-w-3xl mx-auto">
                The SW001 Full Staff List is one module in a comprehensive compliance platform. Over the coming days, we'll be releasing detailed feature pages for every module — from the SW002 Worker Coversheet through to SW065 Exit Management. Each module is purpose-built around the UK Sponsor Guidance framework, designed to meet and exceed your duties as a licensed sponsor.
              </p>
            </div>
          </Reveal>

          {/* Module preview grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {comingSoonModules.map((mod, i) => (
              <Reveal key={mod.code} delay={i * 0.03}>
                <div className="bg-[#1B3A5C]/20 border border-white/5 rounded-xl p-4 text-center hover:border-[#F39C12]/20 hover:shadow-lg hover:shadow-[#F39C12]/5 transition-all duration-300 group relative overflow-hidden">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F39C12]/0 to-[#F39C12]/0 group-hover:from-[#F39C12]/5 group-hover:to-transparent transition-all duration-500" />
                  <div className="relative z-10">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#F39C12]/10 text-[#F39C12] border border-[#F39C12]/20 mb-2">
                      {mod.code}
                    </span>
                    <h4 className="text-white text-sm font-semibold mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {mod.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#F39C12]/70">
                      <Clock className="w-3 h-3" />
                      Coming Soon
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Footer text and CTAs */}
          <Reveal delay={0.3}>
            <div className="text-center">
              <p className="text-[#8B9EB7] text-base mb-8">
                Watch this space. Subscribe to get notified when each module page goes live.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/newsletter" className="inline-flex items-center gap-2 bg-[#F39C12] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#E08E0B] transition-colors shadow-lg shadow-[#F39C12]/20">
                  Subscribe for Updates <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/book-consultation" className="inline-flex items-center gap-2 bg-[#00C3FF] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#00B0E6] transition-colors shadow-lg shadow-[#00C3FF]/20">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="bg-gradient-to-br from-[#0D1B2A] via-[#1B3A5C] to-[#0D1B2A] py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Ready to Replace Your Spreadsheets?
              </h2>
              <p className="text-[#8B9EB7] text-lg mb-8 max-w-xl mx-auto">
                Book a live demo and see how the SW001 Full Staff List can transform your sponsored workforce compliance management.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/book-consultation" className="inline-flex items-center gap-2 bg-[#00C3FF] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#00B0E6] transition-colors text-lg">
                  Book a Live Demo <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/sponsor-complians-hub" className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/5 transition-colors text-lg">
                  Learn More About the Hub
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
