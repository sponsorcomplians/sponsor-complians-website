/*
 * HubDemo.tsx — Sponsor ComplIANS Hub Interactive Demo Page
 * Unified showcase: 10 SW001 feature sections
 * Design: Hub palette #0D1B2A / #1B3A5C / #00C3FF / #F5F7FA
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight, Play, Monitor, Users,
  FileCheck, Shield, Bell, Layers, Clock, BarChart3,
  MessageSquare, Calendar, MapPin, ChevronDown,
  CheckCircle2, Zap, X, Mail, CheckCircle,
  Filter, AlertTriangle, Car, PieChart, Download,
  UserPlus, Table2,
} from "lucide-react";
import ctaConfig from "@/lib/ctaConfig";

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

/* ── All 10 showcase modules ── */
const showcaseModules: {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ElementType;
  stats: { label: string; value: string }[];
  badges: string[];
}[] = [
  /* ─── SW001 Full Staff List Sections ─── */
  {
    id: "kpi-dashboard",
    title: "KPI Dashboard",
    subtitle: "Real-Time Compliance Intelligence",
    description: "Five live KPI cards give you an instant health check of your entire sponsored workforce. The compliance donut breaks down compliant, at-risk, and non-compliant workers at a glance. RTW Urgent flags expired and critical visa situations that need immediate action. Alerts & Status shows how many workers are on probation or need attention. The Workforce card tracks total workers, contracted hours, and shortfall gaps. Document Compliance shows your average completion percentage and how many workers have fully compliant files. Every single card recalculates in real time as you apply filters to the table below — filter to Skilled Workers and the KPIs instantly show Skilled Worker stats only.",
    image: IMAGES.sw001KpiDashboard,
    icon: BarChart3,
    stats: [
      { label: "Live KPI Cards", value: "5" },
      { label: "Filter-Reactive", value: "Real-time" },
      { label: "Workers Tracked", value: "197" },
    ],
    badges: ["Real-time monitoring", "Audit-ready reports", "Automated alerts"],
  },
  {
    id: "excel-filters",
    title: "Excel-Style Column Filters",
    subtitle: "Filter Like a Spreadsheet, Analyse Like a Dashboard",
    description: "Click any column header to open a checkbox filter dropdown — exactly like Excel's auto-filter. See the count for each value before you select it, so you know what you'll get. Stack multiple filters to drill down progressively: start with all 197 workers, filter to Non-Compliant, then narrow to Full UK Licence holders — and instantly see 20 results. Blue filter pills at the top show your active filters with one-click removal. The summary row appears automatically and shows stats only for filtered columns. Every KPI card, chart, and sidebar panel updates to reflect your filtered dataset.",
    image: IMAGES.sw001ExcelFilters,
    icon: Filter,
    stats: [
      { label: "Filterable Columns", value: "10" },
      { label: "Cumulative Stacking", value: "Yes" },
      { label: "Count Preview", value: "Instant" },
    ],
    badges: ["Checkbox selection", "Filter pills", "One-click clear"],
  },
  {
    id: "rtw-alerts",
    title: "RTW & Visa Expiry Alerts",
    subtitle: "Never Miss a Visa Renewal Again",
    description: "The Right to Work column shows colour-coded status dots for every worker at a glance. Green means compliant with plenty of time. Amber means expiring soon — within 30 days. Red means expired or critical — immediate action required. Each dot shows the exact number of days remaining. Filter to \"Expiring Soon\" and instantly see every worker who needs a renewal conversation this month. The RTW Urgent KPI card at the top tells you how many are in the danger zone before you even scroll. This is how you keep your sponsor licence safe.",
    image: IMAGES.sw001RtwAlerts,
    icon: AlertTriangle,
    stats: [
      { label: "RTW Urgent Alerts", value: "41" },
      { label: "Expiring Within 30 Days", value: "25" },
      { label: "Status Indicators", value: "Colour-coded" },
    ],
    badges: ["Visa expiry tracking", "Automated alerts", "Days remaining"],
  },
  {
    id: "doc-compliance",
    title: "Document Compliance Tracking",
    subtitle: "Know Exactly Where the Gaps Are",
    description: "Every worker's document status is shown as Complete, Partial, or Not Started — with a progress bar and percentage alongside. Filter to \"Not Started\" and instantly see the 60 workers who haven't submitted any documents yet. Filter to \"Partial\" to find workers who are halfway there and need a nudge. The Document Compliance KPI card shows your organisation's average completion and how many workers are fully compliant. When CQC inspectors or the Home Office ask for documentation status, you have the answer in seconds — not hours of spreadsheet work.",
    image: IMAGES.sw001DocCompliance,
    icon: FileCheck,
    stats: [
      { label: "Fully Compliant", value: "36" },
      { label: "Average Completion", value: "48%" },
      { label: "Status Categories", value: "3" },
    ],
    badges: ["Progress tracking", "Gap identification", "Audit-ready exports"],
  },
  {
    id: "compliance-scoring",
    title: "Compliance Scoring (0\u2013100)",
    subtitle: "Automated Risk Assessment for Every Worker",
    description: "Every sponsored worker receives an automated compliance score from 0 to 100, calculated from their document completion, RTW status, visa validity, and employment stage. Scores are colour-coded: green (80-100) means compliant and audit-ready, amber (50-79) means at risk and needs attention, red (0-49) means non-compliant and requires urgent action. Stack filters to find exactly who needs help — like workers with no documents started AND a score between 51-75. The Workers Requiring Attention sidebar shows the lowest-scoring workers first, so you always know where to focus.",
    image: IMAGES.sw001ComplianceScoring,
    icon: Shield,
    stats: [
      { label: "Compliant Workers", value: "78" },
      { label: "At Risk Workers", value: "71" },
      { label: "Non-Compliant", value: "48" },
    ],
    badges: ["Auto-calculated", "Three risk tiers", "Priority ranking"],
  },
  {
    id: "driving-status",
    title: "Driving Status Tracking",
    subtitle: "Deployment-Ready Workforce Visibility",
    description: "Know exactly who can drive before you assign them to a run. Five driving status categories track the real-world licensing situation of your sponsored workforce: Full UK Licence, Provisional Licence, International Licence under 12 months (cannot drive unsupervised), International Licence over 12 months (must exchange to UK licence), and Non-Driver. Each status has a colour-coded badge. Filter by driving status to instantly see who's available for driving runs — or identify workers who need to start their UK licence conversion before their international licence window closes.",
    image: IMAGES.sw001DrivingStatus,
    icon: Car,
    stats: [
      { label: "Licence Categories", value: "5" },
      { label: "Full UK Licence", value: "72" },
      { label: "International (<12m)", value: "45" },
    ],
    badges: ["Licence tracking", "Run allocation", "Compliance alerts"],
  },
  {
    id: "interactive-charts",
    title: "Interactive Charts & Visualisations",
    subtitle: "See the Patterns Your Spreadsheet Hides",
    description: "The Compliance Overview panel expands to reveal six interactive visualisations. The Compliance Distribution donut shows your workforce health at a glance — click any segment to filter the table. The Immigration Breakdown donut shows your visa type composition. Contracted vs Scheduled Hours reveals shortfall patterns per worker. Compliance by Area shows which zones have the most non-compliant workers. The Document Gaps Heatmap is a grid of workers versus key documents, colour-coded red where gaps exist. The Upcoming RTW Expiries timeline shows who's running out of time. Every chart reacts to your active filters — they're not static reports, they're live analytical tools.",
    image: IMAGES.sw001InteractiveCharts,

    icon: PieChart,
    stats: [
      { label: "Chart Types", value: "6" },
      { label: "Filter Integration", value: "Clickable" },
      { label: "Filter-Reactive", value: "Live" },
    ],
    badges: ["Compliance donut", "Area heatmap", "RTW timeline"],
  },
  {
    id: "bulk-actions",
    title: "Bulk Actions & Export",
    subtitle: "Act on Multiple Workers at Once",
    description: "Select individual workers with checkboxes or use Select All to grab the entire filtered set. The bulk action bar appears instantly with Export CSV, Archive, and Change Stage options. Export sends your filtered data to a spreadsheet — exactly what's on screen, with all columns and applied filters. Print generates a formatted A4 view ready for CQC inspections or audit meetings with Ctrl+P shortcut support. Save your most-used filter combinations as named Presets — \"Skilled Workers with expiring RTW\" becomes a one-click view you can return to daily. The Columns button lets you toggle columns on and off, saved between sessions.",
    image: IMAGES.sw001BulkActions,
    icon: Download,
    stats: [
      { label: "Bulk Actions", value: "3" },
      { label: "CSV Export", value: "1-click" },
      { label: "Filter Presets", value: "Saved" },
    ],
    badges: ["Bulk operations", "Print-ready", "Saved presets"],
  },
  {
    id: "add-worker",
    title: "Add Sponsored Worker",
    subtitle: "Onboard New Workers in Minutes",
    description: "Add new sponsored workers through a guided 3-step wizard. Step 1: Upload personal documents — the AI Document Upload feature automatically classifies passports, CoS letters, BRP cards, bank statements, and contracts. Just drop the files and the system identifies what they are. Step 2: Upload employment documents. Step 3: Review and confirm. Enter personal details including name, date of birth, nationality, immigration status, gender, passport information, and place of birth. Choose between adding a single worker or bulk importing via Excel/CSV for large onboarding batches. New workers immediately appear in the SW001 table with their compliance score calculated from the documents uploaded during onboarding.",
    image: IMAGES.sw001AddWorker,
    icon: UserPlus,
    stats: [
      { label: "Guided Wizard", value: "3-step" },
      { label: "Document Classification", value: "AI" },
      { label: "Excel/CSV Import", value: "Bulk" },
    ],
    badges: ["AI-powered upload", "Single or bulk", "Instant scoring"],
  },
  {
    id: "smart-table",
    title: "Smart Table",
    subtitle: "The Table That Thinks With You",
    description: "The SW001 table isn't just a list — it's an analytical engine. Fifteen columns cover every compliance dimension: worker name, employee ID, compliance status, employment stage, immigration type, start date, contracted hours, area, driving status, Right to Work, document completion, and compliance score. Sort any column with a click. Stack up to 10 filters simultaneously and watch the summary row, KPI cards, charts, and sidebar all react together. The table shows \"28 of 197\" so you always know your filtered scope. Tab filters at the top let you quickly switch between All, Employed, On Probation, and New Hire views. Search by name, ID, or area. Pagination handles any workforce size. This is the spreadsheet replacement your compliance team has been waiting for.",
    image: IMAGES.sw001KpiDashboard,
    icon: Table2,
    stats: [
      { label: "Data Columns", value: "15" },
      { label: "Simultaneous Filters", value: "10" },
      { label: "Updates Together", value: "Everything" },
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

/*
 * Video Player Modal
 * Set VIDEO_URL to a real video URL when footage is recorded.
 */
const VIDEO_URL: string | null = null;

function VideoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const subscribeMut = trpc.subscribers.subscribe.useMutation({
    onSuccess: () => setEmailSubmitted(true),
  });

  useEffect(() => {
    if (!isOpen) {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setVideoEnded(false);
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md" onClick={onClose}>
      <div className="relative w-full max-w-5xl mx-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors">
          <X className="w-4 h-4" /> Close
        </button>

        <div className="bg-[#0A1222] rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
          <div className="relative aspect-video bg-[#060D18]">
            {VIDEO_URL ? (
              <>
                <video
                  ref={videoRef}
                  src={VIDEO_URL}
                  className="w-full h-full object-cover"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
                  onEnded={() => { setPlaying(false); setVideoEnded(true); }}
                />
                {!playing && (
                  <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30" onClick={togglePlay}>
                    <div className="w-20 h-20 rounded-full bg-[#00C3FF] flex items-center justify-center shadow-xl shadow-[#00C3FF]/40 hover:scale-110 transition-transform">
                      <Play className="w-9 h-9 text-white ml-1" fill="white" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <img
                  src={IMAGES.hubDashboardHero}
                  alt="Hub Product Tour Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px]"
                />
                <div className="relative z-10 flex flex-col items-center gap-5 px-4">
                  <div className="w-20 h-20 rounded-full bg-[#00C3FF]/90 flex items-center justify-center shadow-xl shadow-[#00C3FF]/40 animate-pulse">
                    <Play className="w-9 h-9 text-white ml-1" fill="white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {ctaConfig.MODE === "video" ? "Watch the Product Tour" : "See It Live at the Free Webinar"}
                    </h3>
                    <p className="text-[#8B9EB7] text-sm max-w-md">
                      Join us on 25 March for a full live walkthrough of the Sponsor ComplIANS Hub. Register below or sign up to be notified when the recording is available.
                    </p>
                  </div>
                  {emailSubmitted ? (
                    <div className="flex items-center gap-2 text-[#00C3FF] font-semibold text-sm bg-[#00C3FF]/10 px-4 py-2 rounded-lg border border-[#00C3FF]/20">
                      <CheckCircle className="w-5 h-5" />
                      You're on the list! We'll notify you when the tour is live.
                    </div>
                  ) : (
                    <form
                      className="flex flex-col gap-2 w-full max-w-md"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!email) return;
                        subscribeMut.mutate({ email, source: "hub_video_early_access" });
                      }}
                    >
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9EB7]" />
                          <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-[#8B9EB7] text-sm focus:outline-none focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={subscribeMut.isPending}
                          className="inline-flex items-center justify-center gap-2 bg-[#00C3FF] text-white font-semibold px-5 py-3 rounded-lg hover:bg-[#00B0E6] transition-colors text-sm disabled:opacity-60 whitespace-nowrap"
                        >
                          {subscribeMut.isPending ? "Subscribing..." : "Notify Me"}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-[#00C3FF] focus:ring-[#00C3FF] cursor-pointer shrink-0" />
                        <span className="text-xs text-[#8B9EB7] leading-relaxed">I consent to Sponsor ComplIANS processing my data per the <a href="/privacy-policy" className="text-[#00C3FF] hover:underline">Privacy Policy</a>.</span>
                      </label>
                    </form>
                  )}
                  <p className="text-[#8B9EB7]/60 text-xs">No spam. Unsubscribe anytime. GDPR compliant.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#0D1B2A] px-4 py-3">
            <div className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer mb-3 group" onClick={VIDEO_URL ? handleSeek : undefined}>
              <div
                className="h-full bg-gradient-to-r from-[#00C3FF] to-[#00E5FF] rounded-full relative transition-all"
                style={{ width: VIDEO_URL ? `${progress}%` : "0%" }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {VIDEO_URL ? (
                  <button onClick={togglePlay} className="text-white/80 hover:text-white transition-colors">
                    {playing ? (
                      <div className="flex gap-1"><div className="w-1 h-4 bg-white rounded-sm" /><div className="w-1 h-4 bg-white rounded-sm" /></div>
                    ) : (
                      <Play className="w-5 h-5" fill="currentColor" />
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-[#8B9EB7] text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#F39C12] animate-pulse" />
                    Recording in progress
                  </div>
                )}
                <span className="text-[#8B9EB7] text-xs font-mono">
                  {VIDEO_URL ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "0:00 / --:--"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8B9EB7] text-xs">Sponsor ComplIANS Hub — Product Tour</span>
              </div>
            </div>
          </div>
        </div>

        {VIDEO_URL && videoEnded && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#0A1222] rounded-xl border border-[#00C3FF]/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>Ready to see it live?</h4>
                <p className="text-[#8B9EB7] text-sm">Book a personalised demo with our compliance team.</p>
              </div>
              <Link href="/book-consultation" className="inline-flex items-center gap-2 bg-[#00C3FF] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#00B0E6] transition-colors text-sm whitespace-nowrap shadow-lg shadow-[#00C3FF]/20">
                Book a Live Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HubDemo() {
  const [activeModule, setActiveModule] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const scrollToFirstSection = () => {
    document.getElementById(`module-${showcaseModules[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="-mt-[108px]">
      {/* ═══ HERO ═══ */}
      <section className="hero-gradient min-h-[70vh] flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase bg-[#00C3FF]/10 text-[#00C3FF] border border-[#00C3FF]/20 mb-6">
                Interactive Platform Demo
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Explore the{" "}
                <span className="bg-gradient-to-r from-[#00C3FF] to-[#00E5FF] bg-clip-text text-transparent">
                  Sponsor ComplIANS Hub
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#8B9EB7] text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
                See how the Hub manages sponsored workers, tracks compliance in real time, and keeps your sponsor licence audit-ready. Click through each module below.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href={ctaConfig.getPrimaryCTAPath()} className="inline-flex items-center gap-3 bg-[#00C3FF] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#00B0E6] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                  </div>
                  {ctaConfig.getHeroCTALabel()}
                </Link>
                <button
                  onClick={scrollToFirstSection}
                  className="inline-flex items-center gap-2 bg-[#00C3FF]/20 text-[#00C3FF] font-semibold px-6 py-3 rounded-lg hover:bg-[#00C3FF]/30 transition-colors border border-[#00C3FF]/30"
                >
                  See the Full Hub <ChevronDown className="w-4 h-4" />
                </button>
                <Link href="/book-consultation" className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/5 transition-colors">
                  Book a Live Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ MODULE NAVIGATION — 16 tabs ═══ */}
      <section className="bg-[#0D1B2A] border-b border-white/5 sticky top-[68px] z-30">
        <div className="container">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-none">
            {showcaseModules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModule(i);
                    document.getElementById(`module-${mod.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeModule === i
                      ? "bg-[#00C3FF]/10 text-[#00C3FF] border border-[#00C3FF]/30"
                      : "text-[#8B9EB7] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {mod.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ ALL 16 MODULE SHOWCASES ═══ */}
      {showcaseModules.map((mod, i) => {
        const Icon = mod.icon;
        const isEven = i % 2 === 0;
        return (
          <section
            key={mod.id}
            id={`module-${mod.id}`}
            className={`py-20 lg:py-28 ${i % 2 === 0 ? "bg-[#0A1628]" : "bg-[#0D1B2A]"}`}
          >
            <div className="container">
               <div className={`grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start ${!isEven ? "lg:[direction:rtl]" : ""}`}>
                {/* Screenshot — large, prominent */}
                <Reveal className={!isEven ? "lg:[direction:ltr]" : ""}>
                  <div className="relative group">
                    <div className="absolute -inset-3 bg-[#00C3FF]/5 rounded-2xl blur-xl group-hover:bg-[#00C3FF]/10 transition-all duration-500" />
                    <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(0,195,255,0.1)] group-hover:border-[#00C3FF]/20">
                      <img
                        src={mod.image}
                        alt={`${mod.title} — ${mod.subtitle}`}
                        className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </Reveal>

                {/* Description */}
                <Reveal delay={0.2} className={!isEven ? "lg:[direction:ltr]" : ""}>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#00C3FF]/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#00C3FF]" />
                      </div>
                      <span className="text-[#00C3FF] text-xs font-bold tracking-[0.15em] uppercase">{mod.subtitle}</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {mod.title}
                    </h2>
                    <p className="text-[#8B9EB7] text-base lg:text-lg leading-relaxed mb-8">
                      {mod.description}
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {mod.stats.map((stat, si) => (
                        <div key={si} className="bg-[#1B3A5C]/50 border border-white/5 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-[#8B9EB7] text-xs mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Feature badges */}
                    <div className="flex flex-wrap gap-2">
                      {mod.badges.map((badge, bi) => (
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

      {/* ═══ PLATFORM OVERVIEW STATS ═══ */}
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
              { icon: Shield, label: "Compliance Areas Tracked", value: "12" },
              { icon: Users, label: "Sponsorship Lifecycle Stages", value: "16" },
              { icon: FileCheck, label: "Document Types Managed", value: "15+" },
              { icon: Bell, label: "Automated Alert Types", value: "24+" },
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

      {/* ═══ KEY FEATURES SHOWCASE ═══ */}
      <section className="bg-[#0A1628] py-20 lg:py-28 border-t border-white/5">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase bg-[#00C3FF]/10 text-[#00C3FF] border border-[#00C3FF]/20 mb-4">
                Why Sponsors Choose the Hub
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Key Features at a Glance
              </h2>
              <p className="text-[#8B9EB7] text-lg max-w-2xl mx-auto">
                Every feature is purpose-built for UK sponsor licence holders — designed from real audit data collected across 100+ compliance reviews.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "12-Point Compliance Engine", description: "Monitors salary compliance, RTW checks, document completeness, CoS tracking, absence management, and 7 more compliance areas in real time.", badge: "Core" },
              { icon: Bell, title: "Automated Alert System", description: "24+ alert types with 90/60/30-day advance warnings for visa expiries, BRP renewals, contract end dates, and reporting deadlines.", badge: "Automation" },
              { icon: FileCheck, title: "Document Vault & Audit Trail", description: "Secure storage for 15+ document types per worker. Every upload, view, and change is timestamped for Home Office audit readiness.", badge: "Compliance" },
              { icon: Users, title: "12-Stage Sponsorship Lifecycle", description: "Track every sponsored worker from pre-employment checks through onboarding, probation, RTW monitoring, to visa renewal and beyond.", badge: "Lifecycle" },
              { icon: MessageSquare, title: "Unified Messaging & Inbox", description: "Centralised communications with priority filtering, auto-categorisation, and full message history linked to each worker's compliance profile.", badge: "Communication" },
              { icon: BarChart3, title: "Compliance Analytics & Reporting", description: "Real-time dashboards showing compliance scores, gap analysis, workforce coverage, and exportable reports for Home Office submissions.", badge: "Analytics" },
              { icon: Calendar, title: "RTW Calendar & Reminders", description: "Colour-coded calendar tracking every visa expiry, BRP validity, and right-to-work check deadline across your entire sponsored workforce.", badge: "Scheduling" },
              { icon: MapPin, title: "Zone & Coverage Intelligence", description: "Geographic service delivery management with carer allocation, client coverage scoring, and automatic gap detection per zone.", badge: "Operations" },
              { icon: Zap, title: "One-Click Audit Preparation", description: "Generate audit-ready compliance packs in seconds. Pre-formatted for Home Office compliance visits with all required evidence bundled.", badge: "Audit" },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="bg-[#0D1B2A] border border-white/5 rounded-xl p-6 h-full hover:border-[#00C3FF]/20 hover:shadow-lg hover:shadow-[#00C3FF]/5 transition-all duration-300 group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[#00C3FF]/10 flex items-center justify-center shrink-0 group-hover:bg-[#00C3FF]/20 transition-colors">
                      <feature.icon className="w-5 h-5 text-[#00C3FF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>{feature.title}</h3>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#00C3FF]/10 text-[#00C3FF] border border-[#00C3FF]/20">
                        {feature.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#8B9EB7] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-12 bg-gradient-to-r from-[#1B3A5C]/50 via-[#00C3FF]/10 to-[#1B3A5C]/50 border border-white/5 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center">
                  <Layers className="w-7 h-7 text-[#00C3FF]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>All Features. One Platform. Zero Compliance Gaps.</h3>
                  <p className="text-[#8B9EB7] text-sm">Built from 100+ real UK sponsor licence audits — every feature addresses a real compliance risk.</p>
                </div>
              </div>
              <Link href="/book-consultation" className="inline-flex items-center gap-2 bg-[#00C3FF] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#00B0E6] transition-colors text-sm whitespace-nowrap shadow-lg shadow-[#00C3FF]/20">
                Book a Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ COMING SOON — SW002 to SW065 ═══ */}
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
                The SW001 Full Staff List is one module in a comprehensive compliance platform. Over the coming days, we'll be releasing detailed feature pages for every module — from the SW002 Worker Coversheet through to SW065 Exit Management. Each module is purpose-built around the UK Sponsor Guidance framework.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {comingSoonModules.map((mod, i) => (
              <Reveal key={mod.code} delay={i * 0.03}>
                <div className="bg-[#1B3A5C]/20 border border-white/5 rounded-xl p-4 text-center hover:border-[#F39C12]/20 hover:shadow-lg hover:shadow-[#F39C12]/5 transition-all duration-300 group relative overflow-hidden">
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

      {/* ═══ CTA SECTION ═══ */}
      <section className="bg-gradient-to-br from-[#0D1B2A] via-[#1B3A5C] to-[#0D1B2A] py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Ready to See the Hub in Action?
              </h2>
              <p className="text-[#8B9EB7] text-lg mb-8 max-w-xl mx-auto">
                Book a live demo with our team and see how the Sponsor ComplIANS Hub can protect your sponsor licence and streamline your compliance operations.
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

      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </div>
  );
}
