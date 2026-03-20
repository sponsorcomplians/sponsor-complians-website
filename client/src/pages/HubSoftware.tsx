import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import DoughnutChart from "@/components/DoughnutChart";
import {
  Monitor, Users, PoundSterling, FileCheck, Shield, Bell,
  ChevronDown, ArrowRight, CheckCircle2, Layers, Clock, BarChart3,
  Database, Zap, Globe, MonitorCheck, ShieldAlert, BellRing, Printer,
  Play, X, Mail, CheckCircle,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import ctaConfig from "@/lib/ctaConfig";

/* ── Founding Member Countdown ── */
const LAUNCH_DATE = new Date("2026-04-01T00:00:00Z");

function FoundingMemberCountdown() {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calc = () => {
      const diff = LAUNCH_DATE.getTime() - Date.now();
      if (diff <= 0) return null;
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="mt-10 text-center">
      <p className="text-[#8B9EB7] text-sm mb-4 uppercase tracking-wider font-semibold">Founding Member pricing closes in</p>
      <div className="flex justify-center gap-4">
        {([
          { val: timeLeft.days, label: "Days" },
          { val: timeLeft.hours, label: "Hours" },
          { val: timeLeft.minutes, label: "Min" },
          { val: timeLeft.seconds, label: "Sec" },
        ] as const).map(({ val, label }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-w-[70px]">
            <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {String(val).padStart(2, "0")}
            </div>
            <div className="text-[#8B9EB7] text-xs uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── colour tokens ── */
const NAVY = "#0D1B2A";
const MID   = "#1B3A5C";
const BLUE  = "#00C3FF";
const LIGHT = "#F8FAFC";

/* ── features data ── */
const features = [
  {
    icon: Users,
    title: "Sponsored Worker Management",
    body: "A complete staff list with real-time compliance status for every sponsored worker. Each worker's profile shows their immigration classification, right-to-work status, CoS details, contract information, salary compliance score, document completeness percentage, and position in the 12-stage sponsorship lifecycle. Workers flagged as non-compliant are highlighted immediately with specific action items.",
  },
  {
    icon: PoundSterling,
    title: "Salary Compliance Monitoring",
    body: "The Hub continuously compares each sponsored worker's actual pay against the salary declared on their Certificate of Sponsorship. Any shortfall — even by a few pounds — is flagged automatically before payslips are finalised. The system generates a complete audit trail that matches exactly what the Home Office checks during Phase 1 enforcement: payslips, RTI-ready data, and payment evidence.",
  },
  {
    icon: Shield,
    title: "Right-to-Work Tracking",
    body: "Automated monitoring of visa expiry dates, BRP validity, and right-to-work check deadlines. The system sends alerts when checks are due, flags expired or critical documents, and maintains a timestamped record of every check conducted — meeting the Home Office's requirements under the Employer Checking Service and the online right-to-work system.",
  },
  {
    icon: FileCheck,
    title: "Document Management & Audit Readiness",
    body: "Every document the Home Office expects to see is tracked per worker: signed contracts, payslips, P60s, right-to-work certificates, qualification evidence, recruitment records, absence logs, and CoS documentation. The Hub calculates a document compliance score for each worker and for the organisation as a whole.",
  },
  {
    icon: Layers,
    title: "Sponsorship Lifecycle Tracking",
    body: "The Hub tracks each sponsored worker through a 12-stage lifecycle: vacancy approved, application received, interview completed, offer accepted, pre-sponsorship checks, CoS assigned, visa submitted, visa granted, right-to-work verified, employment started, QSE validated, and probation complete. Every stage is timestamped and documented.",
  },
  {
    icon: Bell,
    title: "Compliance Alerts & Reporting",
    body: "Real-time notifications for overdue documents, upcoming visa expiry dates, missed reporting deadlines, salary discrepancies, and compliance score changes. Monthly compliance reports can be generated showing the organisation's overall compliance position across all 12 audit areas.",
  },
];

/* ── FAQ data ── */
const faqs = [
  { q: "What is the Sponsor ComplIANS Hub?", a: "The Sponsor ComplIANS Hub is a compliance management platform designed specifically for UK sponsor licence holders. It centralises sponsored worker management, automates reporting reminders, monitors salary compliance in real time, and provides a complete audit trail for every compliance action." },
  { q: "Who is the Hub designed for?", a: "The Hub is designed for any UK employer that holds or is applying for a sponsor licence. It is particularly valuable for organisations with multiple sponsored workers, multi-site operations, or those in sectors with high compliance scrutiny such as health and social care." },
  { q: "Can the Hub help me prepare for a Home Office visit?", a: "Yes. The Hub maintains a real-time compliance dashboard that shows your current compliance status across all 12 audit areas. It generates visit-ready reports, flags outstanding issues, and ensures all documentation is organised and accessible within minutes." },
  { q: "When does the Hub launch?", a: "The Hub is currently in development with early access planned for Q2 2026. You can join the early access waiting list to be among the first to use the platform when it launches." },
  { q: "How does the Hub track salary compliance?", a: "The Hub monitors salary payments against Certificate of Sponsorship declarations in real time. It flags any discrepancies between declared and actual salaries, alerts you to minimum salary threshold changes, and generates salary compliance reports for audit purposes." },
  { q: "Does the Hub integrate with existing HR systems?", a: "Yes. The Hub is designed to integrate with popular payroll systems (Sage, Xero, QuickBooks), HR platforms (BrightHR, PeopleHR), and rota management tools (Birdie, CarePlanner). Integration allows automatic data synchronisation and reduces manual data entry." },
  { q: "How does the Hub handle right-to-work checks?", a: "The Hub includes a right-to-work check module that tracks document expiry dates, sends automated reminders before documents expire, records check completion with timestamps, and maintains a complete audit trail for every worker." },
  { q: "Is the Hub secure?", a: "Yes. The Hub uses bank-grade encryption for all data at rest and in transit. It is hosted on UK-based servers, complies with GDPR, and includes role-based access controls to ensure only authorised personnel can access sensitive information." },
  { q: "How much will the Hub cost?", a: "Hub pricing will be based on the number of sponsored workers and the features required. Early access members will receive preferential pricing. Contact us at admin@sponsorcomplians.com for more information." },
  { q: "Can I try the Hub before committing?", a: "Yes. We will offer a free trial period for all new users when the Hub launches. Early access members will receive an extended trial period and priority onboarding support." },
];

/* ── Video URL — set to real URL when footage is recorded ── */
const VIDEO_URL: string | null = null;

function WatchDemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
                <img src={IMAGES.hubDashboardHero} alt="Hub Product Tour Preview" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px]" />
                <div className="relative z-10 flex flex-col items-center gap-5 px-4">
                  <div className="w-20 h-20 rounded-full bg-[#00C3FF]/90 flex items-center justify-center shadow-xl shadow-[#00C3FF]/40 animate-pulse">
                    <Play className="w-9 h-9 text-white ml-1" fill="white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Product Tour Coming Soon</h3>
                    <p className="text-[#8B9EB7] text-sm max-w-md">We're recording a full walkthrough. Get notified the moment it's ready.</p>
                  </div>
                  {emailSubmitted ? (
                    <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-5 py-3 rounded-lg text-sm font-medium">
                      <CheckCircle className="w-5 h-5" /> You're on the list!
                    </div>
                  ) : (
                    <form className="flex flex-col sm:flex-row gap-2 w-full max-w-md" onSubmit={(e) => { e.preventDefault(); if (!email) return; subscribeMut.mutate({ email, source: "hub_video_early_access" }); }}>
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9EB7]" />
                        <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-[#8B9EB7] text-sm focus:outline-none focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] transition-colors" />
                      </div>
                      <button type="submit" disabled={subscribeMut.isPending} className="inline-flex items-center justify-center gap-2 bg-[#00C3FF] text-white font-semibold px-5 py-3 rounded-lg hover:bg-[#00B0E6] transition-colors text-sm disabled:opacity-60 whitespace-nowrap">
                        {subscribeMut.isPending ? "..." : "Notify Me"} <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                  <p className="text-[#8B9EB7]/60 text-xs">No spam. Unsubscribe anytime. GDPR compliant.</p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-[#0D1B2A] px-4 py-3">
            <div className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer mb-3 group" onClick={VIDEO_URL ? handleSeek : undefined}>
              <div className="h-full bg-gradient-to-r from-[#00C3FF] to-[#00E5FF] rounded-full relative transition-all" style={{ width: VIDEO_URL ? `${progress}%` : "0%" }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {VIDEO_URL ? (
                  <button onClick={togglePlay} className="text-white/80 hover:text-white transition-colors">
                    {playing ? <div className="flex gap-1"><div className="w-1 h-4 bg-white rounded-sm" /><div className="w-1 h-4 bg-white rounded-sm" /></div> : <Play className="w-5 h-5" fill="currentColor" />}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-[#8B9EB7] text-xs"><div className="w-2 h-2 rounded-full bg-[#F39C12] animate-pulse" />Recording in progress</div>
                )}
                <span className="text-[#8B9EB7] text-xs font-mono">{VIDEO_URL ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "0:00 / --:--"}</span>
              </div>
              <span className="text-[#8B9EB7] text-xs">Sponsor ComplIANS Hub — Product Tour</span>
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

export default function HubSoftware() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="bg-[#0D1B2A] text-white">
      <WatchDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#122840] to-[#0D1B2A]" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#00C3FF]/5 rounded-full blur-[120px]" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C3FF]/10 border border-[#00C3FF]/20 text-[#00C3FF] text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Launching 1 April 2026
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Sponsor ComplIANS Hub — Compliance Software Built for{" "}
                <span className="text-[#00C3FF]">UK Sponsor Licence Holders</span>
              </h1>
              <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4">
                The Sponsor ComplIANS Hub is a purpose-built compliance management platform designed specifically for UK employers who hold a Home Office sponsor licence. It replaces spreadsheets, disconnected HR systems, and manual tracking with a single, centralised platform that monitors every sponsored worker, every compliance obligation, and every document — in real time.
              </p>
              <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8">
                The Hub was built from the ground up using insights from over 100 sponsor compliance audits conducted by Sponsor ComplIANS. Every feature exists because a real compliance gap was identified in a real audit.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/book-consultation" className="btn-teal inline-flex items-center gap-2">
                  Request Early Access <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={ctaConfig.getPrimaryCTAPath()} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-[#00C3FF]/30 text-white hover:bg-[#00C3FF]/10 hover:border-[#00C3FF]/50 transition-all font-medium group">
                  <Play className="w-4 h-4 text-[#00C3FF] group-hover:scale-110 transition-transform" fill="currentColor" />
                  {ctaConfig.getHeroCTALabel()}
                </Link>
                <Link href="/book-consultation" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors font-medium">
                  Book a Demo
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-8 text-sm">
                <span className="flex items-center gap-2 text-[#8B9EB7]"><CheckCircle2 className="w-4 h-4 text-[#00C3FF]" /> Built from 100+ real audits</span>
                <span className="flex items-center gap-2 text-[#8B9EB7]"><CheckCircle2 className="w-4 h-4 text-[#00C3FF]" /> 12 compliance areas</span>
                <span className="flex items-center gap-2 text-[#8B9EB7]"><CheckCircle2 className="w-4 h-4 text-[#00C3FF]" /> Real-time monitoring</span>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={IMAGES.sw002CoverSheet}
                  alt="Sponsor ComplIANS Hub — Worker Compliance Dashboard with personal info and rota schedule"
                  className="w-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl overflow-hidden border border-white/10 shadow-xl w-[55%]">
                <img
                  src={IMAGES.sw004VisaCalendar}
                  alt="Hub visa key dates calendar and immigration monitoring"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ WHY USE THE SPONSOR COMPLIANS HUB ═══════ */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C9A7] text-xs font-bold tracking-[2px] uppercase block mb-3">Why Our Software</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Why the Hub Exists — Because Spreadsheets Cannot Protect Your Licence
            </h2>
            <p className="text-[#4A5568] text-lg leading-relaxed max-w-3xl mx-auto">
              The Home Office's two-phase enforcement model demands two things: accurate salary data and complete, accessible records. Spreadsheets fail both. They are not real-time, they do not send alerts, they cannot calculate compliance scores, and they cannot produce an audit-ready report at the moment the Home Office asks for one. The Sponsor ComplIANS Hub was built to replace every spreadsheet, every disconnected tracker, and every manual process with a single platform that monitors all 65 compliance documents across every sponsored worker — in real time.
            </p>
          </div>

          {/* Bento Grid — 2 large cards top */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                <MonitorCheck className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Every Worker. Every Document. One Dashboard.
              </h3>
              <p className="text-[#4A5568] text-sm leading-relaxed">
                The Hub tracks every sponsored worker through the complete 12-stage sponsorship lifecycle — from vacancy approved through to probation complete. For each worker, it monitors compliance status across all 65 document types (SW001–SW065), calculates a document compliance score, flags missing or expiring items, tracks immigration classification and visa expiry dates, and monitors salary compliance against CoS declarations. When the Home Office asks for information, you do not dig through files — you generate a report.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                <ShieldAlert className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Phase 1 Ready: Salary Compliance in Real Time
              </h3>
              <p className="text-[#4A5568] text-sm leading-relaxed">
                The Home Office now requests payslips, RTI data, P60s, and bank statements to verify salary compliance. The Hub continuously compares each worker's actual pay against their CoS salary. Any shortfall is flagged immediately — before payslips are finalised, before RTI is submitted, before the Home Office sends that email. Divine Health Services runs 65 sponsored workers through the Hub at 100% salary compliance with zero shortfalls. When the Home Office checked, they confirmed satisfaction in 27 days.
              </p>
            </div>
          </div>

          {/* 3 standard cards bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                <BellRing className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Automated Alerts That Replace Manual Checking
              </h3>
              <p className="text-[#4A5568] text-sm leading-relaxed">
                Right-to-work check due in 30 days. Visa expiring in 60 days. Contract unsigned. Payslip missing. Training module overdue. Absence unreported. The Hub sends alerts for every compliance event that would otherwise be missed by a human checking a spreadsheet. Each alert maps to a specific document in the SW001–SW065 framework, so you know exactly what is needed, for whom, and by when.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Compliance Scores — Organisation-Wide and Per Worker
              </h3>
              <p className="text-[#4A5568] text-sm leading-relaxed">
                The Hub calculates a compliance score for every individual worker and for your organisation as a whole. The score reflects document completeness, salary compliance status, right-to-work check currency, training completion, and reporting timeliness. You can see at a glance which workers are fully compliant, which have gaps, and what needs to be done — prioritised by risk level. When we audited a client with 120 workers, we found 44 breaches across 11 areas. The Hub is designed to ensure that number is zero.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                <Printer className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Audit-Ready Reports — Generated in Seconds
              </h3>
              <p className="text-[#4A5568] text-sm leading-relaxed">
                When the Home Office sends a document request, most sponsors spend days gathering files. Hub users generate a complete compliance report in seconds: worker list with compliance status, salary evidence for any period, right-to-work check records, document completeness per worker, and sponsorship lifecycle positions. Divine Health Services submitted all requested documentation within 14 days of the Home Office request. With the Hub, it could have been 14 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#00C9A7] py-14">
          <div className="container text-center">
            <p className="text-[#0D1B2A] text-xl md:text-2xl font-bold mb-6 max-w-3xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The Home Office is already checking. The Hub makes sure you are already ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#1B3A5C] transition-colors">
                Request Early Access — Launching 1 April 2026 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/book-consultation" className="inline-flex items-center gap-2 border-2 border-[#0D1B2A] text-[#0D1B2A] px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#0D1B2A]/10 transition-colors">
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ THE PROBLEM ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">The Problem</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Why Spreadsheets and Generic HR Systems Fail
            </h2>
            <p className="text-[#8B9EB7] text-lg leading-relaxed">
              The Home Office now enforces sponsor compliance through a two-phase model. In Phase 1 (The Money Stage), it requests payslips, RTI submissions, P60s, and bank statements to verify salary compliance. In Phase 2 (The Records Stage), compliance officers review all documentation during on-site visits. Sponsors who rely on spreadsheets, paper files, or generic HR systems consistently fail both phases because their data is fragmented, outdated, or incomplete.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0D1B2A] border border-white/10 rounded-2xl p-8 text-center">
              <DoughnutChart percentage={64.7} size={120} color="#00C3FF" label="" />
              <h3 className="text-xl font-bold mt-4 mb-2">HR System Failures</h3>
              <p className="text-[#8B9EB7] text-sm">64.7% of all compliance failures are caused by HR system and process deficiencies.</p>
            </div>
            <div className="bg-[#0D1B2A] border border-white/10 rounded-2xl p-8 text-center">
              <DoughnutChart percentage={80} size={120} color="#FF6B6B" label="" />
              <h3 className="text-xl font-bold mt-4 mb-2">Recruitment-Related</h3>
              <p className="text-[#8B9EB7] text-sm">80% of licence revocations are directly caused by recruitment-related failures.</p>
            </div>
            <div className="bg-[#0D1B2A] border border-white/10 rounded-2xl p-8 text-center">
              <DoughnutChart percentage={100} size={120} color="#00C3FF" label="" />
              <h3 className="text-xl font-bold mt-4 mb-2">Our Pass Rate</h3>
              <p className="text-[#8B9EB7] text-sm">100% compliance visit pass rate for every client prepared using the Hub.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ WHAT THE HUB DOES — FEATURES ═══════ */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">Platform Features</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              What the Hub Does
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group bg-[#0A1628] border border-white/10 rounded-2xl p-8 hover:border-[#00C3FF]/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#00C3FF]/20 transition-colors">
                    <Icon className="w-7 h-7 text-[#00C3FF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-[#8B9EB7] text-sm leading-relaxed">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ DASHBOARD SCREENSHOTS ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">Inside the Hub</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Built for Real Compliance Workflows
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { img: IMAGES.sw004VisaCalendar, label: "Visa Key Dates & Calendar" },
              { img: IMAGES.sw002CoverSheet, label: "Worker Compliance Dashboard" },
              { img: IMAGES.complianceOverviewCalendar, label: "Compliance Overview & Monthly Calendar" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/10 group hover:border-[#00C3FF]/30 transition-all">
                <img src={s.img} alt={s.label} className="w-full group-hover:scale-[1.02] transition-transform duration-500" />
                <div className="p-4 bg-[#0D1B2A]">
                  <p className="text-sm font-medium text-center">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CASE STUDY PROOF ═══════ */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#1B3A5C] to-[#0D1B2A] border border-white/10 rounded-3xl p-10 md:p-14">
              <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">Real-World Proof</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                How the Hub Helped Divine Health Services Pass a Home Office Check
              </h2>
              <p className="text-[#8B9EB7] text-lg leading-relaxed mb-6">
                Divine Health Services, a CQC-regulated homecare provider in Worcestershire with 65 sponsored workers, uses the Sponsor ComplIANS Hub as its compliance backbone. When the Home Office initiated a compliance check on 10 December 2025 and requested documentation, Divine submitted all requested materials within 14 days. On 6 January 2026, the Home Office confirmed: <em className="text-white">"We are satisfied with your representations, and no further action is required."</em>
              </p>
              {/* Technology Built for Sponsored Workers image */}
              <div className="rounded-2xl overflow-hidden border border-white/10 mb-8">
                <img
                  src={IMAGES.technologyBuiltSponsoredWorkers}
                  alt="Technology Built for Sponsored Workers — Home Office compliance visit passed, A-Rated Sponsor Licence timeline"
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {[
                  { val: "65", label: "Sponsored Workers" },
                  { val: "100%", label: "Salary Compliance" },
                  { val: "0", label: "Urgent RTW Alerts" },
                  { val: "14 days", label: "To Submit All Docs" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-extrabold text-[#00C3FF]">{s.val}</div>
                    <div className="text-[#8B9EB7] text-sm mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/case-studies/divine-health-services" className="inline-flex items-center gap-2 text-[#00C3FF] hover:underline font-medium">
                  Read the Full Case Study <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">FAQ</span>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-[15px] pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#00C3FF] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-[#8B9EB7] text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FOUNDING MEMBER PRICING ═══════ */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#122840] to-[#0D1B2A]" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#F39C12]/10 text-[#F39C12] text-xs font-bold uppercase tracking-wider mb-4">Limited Time Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Founding Member Pricing
            </h2>
            <p className="text-[#8B9EB7] text-lg max-w-2xl mx-auto">
              Lock in 50% off for life. Founding Member pricing closes when the Hub goes live on 1 April 2026.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-[#1B3A5C] to-[#0D1B2A] rounded-2xl border border-[#00C3FF]/30 p-8 lg:p-10 shadow-2xl shadow-[#00C3FF]/10 relative">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F39C12] text-[#0D1B2A] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                50% Off — Founding Members Only
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-[#8B9EB7] text-lg line-through">£58</span>
                  <span className="text-5xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>£29</span>
                  <span className="text-[#8B9EB7] text-sm">/worker/month</span>
                </div>
                <p className="text-[#8B9EB7] text-sm">Locked in for life. Price never increases.</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Full platform access — all 12 compliance modules",
                  "Unlimited users and admin accounts",
                  "Salary compliance monitoring with payslip matching",
                  "Document management with expiry alerts",
                  "Real-time compliance dashboard and scoring",
                  "Priority support and onboarding",
                  "All future features included at no extra cost",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#C8D6E5]">
                    <CheckCircle2 className="w-4 h-4 text-[#00C3FF] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href={ctaConfig.getPrimaryCTAPath()} className="btn-teal w-full justify-center text-base mb-4">
                Lock In Founding Member Price <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[#8B9EB7] text-xs text-center">
                No payment required today. Register for the webinar to claim your Founding Member spot.
              </p>
            </div>
          </div>

          {/* Countdown */}
          <FoundingMemberCountdown />
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Ready to See the Hub in Action?
          </h2>
          <p className="text-[#8B9EB7] text-lg mb-8 max-w-2xl mx-auto">
            The Sponsor ComplIANS Hub launches 1 April 2026. Request early access or book a demo to see how it can transform your compliance operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={ctaConfig.getPrimaryCTAPath()} className="btn-teal inline-flex items-center gap-2">
              {ctaConfig.getHeroCTALabel()} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/book-consultation" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors font-medium">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Sponsor ComplIANS Hub",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description: "Purpose-built compliance management platform for UK sponsor licence holders. Track sponsored workers, monitor salary compliance, manage documents, and stay audit-ready.",
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/PreOrder",
              availabilityStarts: "2026-04-01",
            },
            creator: {
              "@type": "Organization",
              name: "Sponsor ComplIANS",
              url: "https://sponsorcomplians.com",
            },
          }),
        }}
      />
    </div>
  );
}
