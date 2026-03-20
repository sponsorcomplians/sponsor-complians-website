/*
 * Jobs.tsx — ComplIANS Jobs — The UK's Only Job Board Built for Sponsor Licence Holders
 * ALL CONTENT IS GEO-OPTIMISED — USE VERBATIM, DO NOT REWRITE
 * Design: Hub palette #0D1B2A / #1B3A5C / #00C3FF / #00C9A7 / #F5F7FA
 * Database-backed with fallback to sample data
 * 10 sections: Hero, How It Works, Job Listings, Why Post With Us,
 *   How Candidates Come to Us, How We Vet Candidates, 65-Document Standard,
 *   What You Get, The Bottom Line, FAQ
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Search, Briefcase, UserPlus, FileCheck, ArrowRight,
  ChevronDown, ShieldCheck, CheckCircle, MapPin, Clock,
  Building2, BadgeCheck, FileText, Users, Star, X, Send, Loader2,
  Headphones, Mail, Eye, ClipboardCheck, Package, UsersRound,
  FileSearch, Award, BarChart3,
} from "lucide-react";
import GDPRConsent from "@/components/GDPRConsent";
import JobApplicationForm from "@/components/JobApplicationForm";
import { IMAGES } from "@/lib/images";

/* ─── Scroll-reveal ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(30px)", transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let cur = 0;
    const step = target / (2000 / 16);
    const t = setInterval(() => { cur += step; if (cur >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [started, target]);
  return (
    <div ref={ref} className="text-7xl md:text-9xl font-extrabold text-[#00C3FF]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {count}{suffix}
    </div>
  );
}

/* ─── FAQ Accordion ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1B3A5C]/40">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="text-white font-semibold text-lg pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#00C3FF] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[600px] pb-5" : "max-h-0"}`}>
        <p className="text-white/70 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ─── Sample Job Data (fallback when DB is empty) ─── */
const sampleJobs = [
  { id: 0, title: "Senior Care Worker", company: "Southvale Care Ltd", location: "Worcestershire", salaryMin: 24960, salaryMax: 24960, salaryType: "annual" as const, socCode: "6145", sponsorshipOffered: true, sponsorshipStatus: "available" as const, jobType: "full_time" as const, sector: "Healthcare", hours: "37.5hrs/week", createdAt: new Date(Date.now() - 2 * 86400000) },
  { id: 0, title: "Registered Manager", company: "Keeva Care Ltd", location: "Belfast", salaryMin: 48000, salaryMax: 60000, salaryType: "annual" as const, socCode: "1242", sponsorshipOffered: false, sponsorshipStatus: "rtw" as const, jobType: "full_time" as const, sector: "Healthcare", hours: "Full-time", createdAt: new Date(Date.now() - 1 * 86400000) },
  { id: 0, title: "Compliance & QA Officer", company: "React HCP Ltd", location: "Shropshire", salaryMin: 38000, salaryMax: 48000, salaryType: "annual" as const, socCode: "2419", sponsorshipOffered: false, sponsorshipStatus: "rtw" as const, jobType: "full_time" as const, sector: "Business and Finance", hours: "40hrs/week", createdAt: new Date(Date.now() - 3 * 86400000) },
  { id: 0, title: "Care Assistant", company: "Living Waters Healthcare", location: "Somerset", salaryMin: 24960, salaryMax: 24960, salaryType: "annual" as const, socCode: "6145", sponsorshipOffered: true, sponsorshipStatus: "available" as const, jobType: "full_time" as const, sector: "Healthcare", hours: "37.5hrs/week", createdAt: new Date(Date.now() - 5 * 86400000) },
  { id: 0, title: "Software Developer", company: "TechForward Solutions", location: "London", salaryMin: 45000, salaryMax: 45000, salaryType: "annual" as const, socCode: "2134", sponsorshipOffered: true, sponsorshipStatus: "available" as const, jobType: "full_time" as const, sector: "IT and Digital", hours: "Full-time", createdAt: new Date(Date.now() - 1 * 86400000) },
  { id: 0, title: "Care Assistant", company: "Gentle Hands Care Agency", location: "Devon", salaryMin: 24960, salaryMax: 24960, salaryType: "annual" as const, socCode: "6145", sponsorshipOffered: true, sponsorshipStatus: "both" as const, jobType: "full_time" as const, sector: "Healthcare", hours: "37.5hrs/week", createdAt: new Date(Date.now() - 4 * 86400000) },
];

const sectors = ["All", "Healthcare", "IT and Digital", "Business and Finance", "Engineering", "Construction", "Hospitality"];

function formatSalary(min?: number | null, max?: number | null, type?: string | null) {
  if (!min && !max) return "Competitive";
  const fmt = (n: number) => type === "hourly" ? `£${(n / 1950).toFixed(2)}` : `£${n.toLocaleString()}`;
  const suffix = type === "hourly" ? "/hr" : type === "daily" ? "/day" : "/yr";
  if (min && max && min !== max) return `${fmt(min)} – ${fmt(max)}${suffix}`;
  if (min) return `${fmt(min)}${suffix}`;
  return `Up to ${fmt(max!)}${suffix}`;
}

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

/* ─── Sponsorship Badge ─── */
function SponsorshipBadge({ status, offered }: { status?: string; offered?: boolean }) {
  if (status === "both") return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30"><ShieldCheck className="w-3.5 h-3.5" /> Open to Both</span>;
  if (status === "available" || offered) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"><ShieldCheck className="w-3.5 h-3.5" /> Sponsorship Available</span>;
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-400 border border-gray-500/30"><FileCheck className="w-3.5 h-3.5" /> Right to Work Required</span>;
}

/* ─── Post Job Modal ─── */
function PostJobModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    title: "", company: "", location: "", salaryMin: "", salaryMax: "",
    salaryType: "annual", jobType: "full_time", sector: "Healthcare",
    sponsorshipOffered: true,
    sponsorLicenceStatus: "", cosAvailability: "", homeOfficeInspection: "", inspectionOutcomeDetail: "",
    socCode: "", description: "",
    requirements: "", benefits: "", contactEmail: "", contactPhone: "", applyUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const postJob = trpc.jobs.postFree.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await postJob.mutateAsync({
        title: form.title, company: form.company, location: form.location,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        salaryType: form.salaryType as "annual" | "hourly" | "daily",
        jobType: form.jobType as "full_time" | "part_time" | "contract" | "temporary",
        sector: form.sector, sponsorshipOffered: form.sponsorshipOffered,
        sponsorLicenceStatus: form.sponsorLicenceStatus,
        cosAvailability: form.cosAvailability,
        homeOfficeInspection: form.homeOfficeInspection,
        inspectionOutcomeDetail: form.inspectionOutcomeDetail || undefined,
        socCode: form.socCode || undefined, description: form.description,
        requirements: form.requirements || undefined, benefits: form.benefits || undefined,
        contactEmail: form.contactEmail, contactPhone: form.contactPhone || undefined,
        applyUrl: form.applyUrl || undefined,
      });
      toast.success("Vacancy submitted! Your compliance status will be reviewed before approval. You'll hear from us within 24 hours.");
      onClose();
    } catch {
      toast.error("Failed to submit vacancy. Please try again.");
    } finally { setSubmitting(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-[#0D1B2A]">Post a Free Vacancy</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Job Title *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none" placeholder="e.g. Registered Nurse — Band 5" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Company Name *</label>
              <input required value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none" placeholder="Your company name" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Location *</label>
              <input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none" placeholder="e.g. Birmingham" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">SOC Code</label>
              <input value={form.socCode} onChange={e => setForm(f => ({ ...f, socCode: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none" placeholder="e.g. 2231" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Min Salary (£)</label>
              <input type="number" value={form.salaryMin} onChange={e => setForm(f => ({ ...f, salaryMin: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none" placeholder="29970" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Max Salary (£)</label>
              <input type="number" value={form.salaryMax} onChange={e => setForm(f => ({ ...f, salaryMax: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none" placeholder="36483" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Salary Type</label>
              <select value={form.salaryType} onChange={e => setForm(f => ({ ...f, salaryType: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none">
                <option value="annual">Annual</option><option value="hourly">Hourly</option><option value="daily">Daily</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Job Type *</label>
              <select value={form.jobType} onChange={e => setForm(f => ({ ...f, jobType: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none">
                <option value="full_time">Full Time</option><option value="part_time">Part Time</option><option value="contract">Contract</option><option value="temporary">Temporary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Sector *</label>
              <select value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none">
                {sectors.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.sponsorshipOffered} onChange={e => setForm(f => ({ ...f, sponsorshipOffered: e.target.checked }))} className="w-5 h-5 rounded border-gray-300 text-[#00C9A7] focus:ring-[#00C9A7]" />
                <span className="text-sm font-semibold text-[#0D1B2A]">Sponsorship Offered</span>
              </label>
            </div>
          </div>

          {/* ─── Compliance Pre-Qualification ─── */}
          <div className="border border-[#00C3FF]/30 bg-[#F0FDFF] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#00C3FF]" />
              <h3 className="text-sm font-bold text-[#0D1B2A]">Compliance Pre-Qualification</h3>
            </div>
            <p className="text-xs text-[#6B7280] -mt-2">These questions help us assess your compliance readiness before approving your listing.</p>
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Do you have a sponsor licence? *</label>
              <select required value={form.sponsorLicenceStatus} onChange={e => setForm(f => ({ ...f, sponsorLicenceStatus: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none bg-white">
                <option value="" disabled>Select an option</option>
                <option value="Yes — active licence">Yes — active licence</option>
                <option value="Yes — but currently suspended">Yes — but currently suspended</option>
                <option value="No — I don't have one yet">No — I don't have one yet</option>
                <option value="Applied — awaiting decision">Applied — awaiting decision</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Do you have available Certificates of Sponsorship (CoS) to sponsor a Skilled Worker? *</label>
              <select required value={form.cosAvailability} onChange={e => setForm(f => ({ ...f, cosAvailability: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none bg-white">
                <option value="" disabled>Select an option</option>
                <option value="Yes — I have available CoS">Yes — I have available CoS</option>
                <option value="No — I need to request more">No — I need to request more</option>
                <option value="I'm not sure">I'm not sure</option>
                <option value="Not applicable">Not applicable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Have you been inspected by the Home Office? *</label>
              <select required value={form.homeOfficeInspection} onChange={e => setForm(f => ({ ...f, homeOfficeInspection: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none bg-white">
                <option value="" disabled>Select an option</option>
                <option value="No — never been inspected">No — never been inspected</option>
                <option value="Yes — passed with no actions">Yes — passed with no actions</option>
                <option value="Yes — passed with action plan">Yes — passed with action plan</option>
                <option value="Yes — licence downgraded">Yes — licence downgraded</option>
                <option value="Yes — licence revoked (now reinstated)">Yes — licence revoked (now reinstated)</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            {(form.homeOfficeInspection === "Yes — passed with action plan" || form.homeOfficeInspection === "Yes — licence downgraded") && (
              <div>
                <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Please briefly describe the outcome and any actions taken</label>
                <textarea value={form.inspectionOutcomeDetail} onChange={e => setForm(f => ({ ...f, inspectionOutcomeDetail: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none resize-none bg-white" placeholder="Describe the outcome of the inspection and any remedial actions taken..." />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Job Description *</label>
            <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none resize-none" placeholder="Describe the role, responsibilities, and requirements..." />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">Contact Email *</label>
              <input required type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none" placeholder="hr@company.co.uk" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-1.5">External Apply URL</label>
              <input value={form.applyUrl} onChange={e => setForm(f => ({ ...f, applyUrl: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00C3FF]/50 focus:border-[#00C3FF] outline-none" placeholder="https://your-ats.com/apply/123" />
            </div>
          </div>
          <GDPRConsent checked={gdprConsent} onChange={setGdprConsent} className="mt-2" />
          <button type="submit" disabled={submitting || !gdprConsent} className="w-full bg-[#00C9A7] text-[#0D1B2A] font-bold py-4 rounded-xl hover:bg-[#00C9A7]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><Send className="w-5 h-5" /> Submit Vacancy (Free)</>}
          </button>
          <p className="text-xs text-center text-gray-500">Your listing will be reviewed and published within 24 hours. <Link href="/advertise" className="text-[#00C3FF] hover:underline">Upgrade for instant publishing →</Link></p>
        </form>
      </div>
    </div>
  );
}

/* ─── Apply Modal replaced by JobApplicationForm component ─── */


/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedSponsorship, setSelectedSponsorship] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [applyJob, setApplyJob] = useState<{ id: number; title: string; company: string; sector: string } | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Fetch from database
  const { data: dbJobs } = trpc.jobs.list.useQuery({
    search: searchTerm || undefined,
    sector: selectedSector !== "All" ? selectedSector : undefined,
    sponsorshipOnly: selectedSponsorship === "available" ? true : undefined,
  });

  const dbItems = dbJobs?.items ?? [];
  const hasDbJobs = dbItems.length > 0;
  const displayJobs: any[] = hasDbJobs ? dbItems : sampleJobs.filter(job => {
    const matchesSearch = !searchTerm || job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase()) || job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "All" || job.sector === selectedSector;
    const matchesSponsorship = selectedSponsorship === "All" || (selectedSponsorship === "available" ? job.sponsorshipOffered : !job.sponsorshipOffered);
    return matchesSearch && matchesSector && matchesSponsorship;
  });

  return (
    <div className="-mt-[108px] pt-[108px]">

      {/* ═══ SECTION 1 — HERO ═══ */}
      <section className="relative bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B3A5C] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #00C3FF 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00C9A7 0%, transparent 40%)" }} />
        <div className="container max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <Reveal>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[#00C9A7]/10 border border-[#00C9A7]/30 rounded-full px-4 py-1.5 mb-6">
                  <span className="w-2 h-2 bg-[#00C9A7] rounded-full animate-pulse" />
                  <span className="text-[#00C9A7] text-sm font-medium tracking-wide">UK'S SPONSOR-READY JOB BOARD</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  ComplIANS Jobs — The UK's Only Job Board Built for{" "}
                  <span className="text-[#00C3FF]">Sponsor Licence Holders</span>
                </h1>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
                  Post and find Skilled Worker visa-eligible jobs on the UK's only compliance-built job board. Every listing shows sponsorship status, salary, SOC code, and compliance readiness. Free for all sponsor licence holders.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  <button onClick={() => setShowPostModal(true)} className="inline-flex items-center gap-2 bg-[#00C9A7] text-[#0D1B2A] font-bold px-8 py-4 rounded-lg hover:bg-[#00C9A7]/90 transition-all text-lg">
                    Post a Free Vacancy <ArrowRight className="w-5 h-5" />
                  </button>
                  <a href="#listings" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/5 transition-all text-lg">
                    Browse Open Vacancies
                  </a>
                </div>
                <div className="flex flex-wrap gap-6 text-sm text-white/50">
                  <span className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-[#00C9A7]" /> Only Verified Sponsors</span>
                  <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#00C3FF]" /> SOC Code Validated</span>
                  <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#F39C12]" /> Compliance Evidence Built In</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.3} className="hidden lg:block flex-shrink-0 w-[600px] min-w-[600px]">
              <div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#00C3FF]/20 to-[#00C9A7]/20 rounded-2xl blur-xl" />
                  <img
                    src={IMAGES.jobApplicationForm}
                    alt="SW Sponsorship / Job Application Form"
                    className="relative rounded-xl shadow-2xl border border-white/10 w-full"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — HOW IT WORKS ═══ */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="container max-w-7xl">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[#00C3FF] text-sm font-bold tracking-widest uppercase mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1B2A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Three Simple Steps</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: UserPlus, title: "Create Your Employer Account", desc: "Verify your sponsor licence number and set up your company profile." },
              { step: "2", icon: Briefcase, title: "Post Your Vacancy", desc: "Add job title, salary, SOC code, location, hours, and sponsorship status. Free listings go live within 24 hours." },
              { step: "3", icon: FileCheck, title: "Receive Compliance-Ready Applications", desc: "Get applications from immigration-verified, qualifications-screened, compliance-aware candidates." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#00C3FF] rounded-full flex items-center justify-center text-[#0D1B2A] font-bold text-sm">{item.step}</div>
                  <div className="w-16 h-16 bg-[#0D1B2A]/5 rounded-xl flex items-center justify-center mx-auto mb-5 mt-2">
                    <item.icon className="w-8 h-8 text-[#0D1B2A]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] mb-3">{item.title}</h3>
                  <p className="text-[#0D1B2A]/60 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3 — JOB LISTINGS BOARD ═══ */}
      <section id="listings" className="bg-white py-20">
        <div className="container max-w-7xl">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-[#00C3FF] text-sm font-bold tracking-widest uppercase mb-3">Open Vacancies</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1B2A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Browse Sponsor-Verified Listings</h2>
              {!hasDbJobs && <p className="text-xs text-[#00C3FF] mt-2">Showing sample listings — <button onClick={() => setShowPostModal(true)} className="underline hover:no-underline">post the first real vacancy</button></p>}
            </div>
          </Reveal>

          {/* Search & Filters */}
          <Reveal delay={0.1}>
            <div className="bg-[#F5F7FA] rounded-2xl p-6 mb-10">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0D1B2A]/40" />
                  <input type="text" placeholder="Search by job title, keyword, or SOC code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#0D1B2A]/10 bg-white text-[#0D1B2A] placeholder:text-[#0D1B2A]/40 focus:outline-none focus:ring-2 focus:ring-[#00C3FF]/50" />
                </div>
                <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)} className="py-3.5 px-4 rounded-xl border border-[#0D1B2A]/10 bg-white text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#00C3FF]/50">
                  {sectors.map(s => <option key={s} value={s}>{s === "All" ? "All Sectors" : s}</option>)}
                </select>
                <select value={selectedSponsorship} onChange={(e) => setSelectedSponsorship(e.target.value)} className="py-3.5 px-4 rounded-xl border border-[#0D1B2A]/10 bg-white text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#00C3FF]/50">
                  <option value="All">All Sponsorship Status</option>
                  <option value="available">Sponsorship Available</option>
                  <option value="rtw">Right to Work Required</option>
                </select>
              </div>
            </div>
          </Reveal>

          {/* Job Cards — card-based grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayJobs.map((job: any, i: number) => (
              <Reveal key={job.id || i} delay={i * 0.05}>
                <div className="bg-white border border-[#0D1B2A]/8 rounded-xl p-6 hover:shadow-lg hover:border-[#00C3FF]/30 transition-all group flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-[#0D1B2A] group-hover:text-[#00C3FF] transition-colors leading-tight">{job.title}</h3>
                    {job.socCode && <span className="bg-[#0D1B2A]/5 px-2.5 py-1 rounded-md text-xs font-semibold text-[#0D1B2A]/70 shrink-0 ml-2">SOC {job.socCode}</span>}
                  </div>
                  <div className="space-y-2 text-sm text-[#0D1B2A]/60 mb-4">
                    <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4 shrink-0" /> {job.company}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 shrink-0" /> {job.location}</div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 shrink-0 text-[#00C9A7]" />
                      <span className="font-semibold text-[#0D1B2A]">{formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}</span>
                    </div>
                    {job.hours && <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 shrink-0" /> {job.hours}</div>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <SponsorshipBadge status={job.sponsorshipStatus} offered={job.sponsorshipOffered} />
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#0D1B2A]/5">
                    <span className="text-xs text-[#0D1B2A]/40">{timeAgo(job.createdAt)}</span>
                    <button onClick={() => setApplyJob({ id: job.id, title: job.title, company: job.company, sector: job.sector })} className="bg-[#00C9A7] text-[#0D1B2A] font-bold px-5 py-2 rounded-lg hover:bg-[#00C9A7]/80 transition-colors text-sm">
                      Apply Now
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {displayJobs.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-[#0D1B2A]/20 mx-auto mb-4" />
              <p className="text-[#0D1B2A]/50 text-lg">No vacancies match your filters. Try adjusting your search criteria.</p>
            </div>
          )}

          <div className="text-center mt-10">
            <p className="text-[#0D1B2A]/50 text-sm">Showing {displayJobs.length} of 24 vacancies</p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4 — WHY POST YOUR VACANCIES WITH US ═══ */}
      <section className="bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#132B47] py-20">
        <div className="container max-w-4xl">
          <Reveal>
            <p className="text-[#00C9A7] text-sm font-bold tracking-widest uppercase mb-3">Why Post With Us</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Why Sponsor Licence Holders Post Their Vacancies With Us
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              When you post a vacancy on Indeed, Reed, or any general job board, you get applications. What you do not get is any assurance that the candidates have been assessed against sponsor compliance requirements, that the recruitment process will produce the evidence the Home Office expects, or that the person you hire will not put your licence at risk. ComplIANS Jobs exists because we understand what happens after you hire someone.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 5 — HOW CANDIDATES COME TO US ═══ */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="container max-w-7xl">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[#00C3FF] text-sm font-bold tracking-widest uppercase mb-3">Our Candidate Channels</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1B2A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>How Candidates Come to Us</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: UsersRound,
                title: "From Our 500+ Sponsor Client Network",
                desc: "When sponsored workers are affected by licence revocations, business closures, or role changes, they need new compliant sponsors quickly. These are workers who already hold valid Skilled Worker visas, have UK work experience, and understand sponsor compliance requirements. They come to us because they know we work exclusively with compliant employers.",
              },
              {
                icon: Headphones,
                title: "From The Sponsorship Files Podcast",
                desc: "Our investigative podcast on UK immigration enforcement has over 30,000 downloads. Its audience includes sponsored workers navigating the immigration system, HR professionals managing sponsor duties, and internationally trained professionals seeking legitimate UK sponsorship. This audience is informed, engaged, and actively looking for compliant employers.",
              },
              {
                icon: Mail,
                title: "From Our Compliance Community",
                desc: "Our weekly newsletter reaches over 2,500 sponsor licence holders, HR leaders, and care sector professionals. Our live webinars attract hundreds of attendees per session. Candidates who find us through these channels already understand what sponsor compliance means and what is expected of them as sponsored workers.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow h-full">
                  <div className="w-14 h-14 bg-[#00C3FF]/10 rounded-xl flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-[#00C3FF]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] mb-4">{item.title}</h3>
                  <p className="text-[#0D1B2A]/60 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6 — HOW WE VET CANDIDATES ═══ */}
      <section className="bg-white py-20">
        <div className="container max-w-7xl">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[#00C9A7] text-sm font-bold tracking-widest uppercase mb-3">Our Vetting Process</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1B2A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>How We Vet Candidates Before They Reach You</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 — large, spans 2 cols on md */}
            <Reveal delay={0}>
              <div className="bg-[#0D1B2A] rounded-2xl p-8 md:col-span-1 h-full">
                <div className="w-12 h-12 bg-[#00C3FF]/15 rounded-lg flex items-center justify-center mb-5">
                  <Eye className="w-6 h-6 text-[#00C3FF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Immigration Status Verification</h3>
                <p className="text-white/60 leading-relaxed">Before a candidate's application reaches you, their immigration status is checked. We confirm whether they hold a valid Skilled Worker visa, whether they have existing right to work in the UK, or whether they require a new Certificate of Sponsorship. You see this clearly on every application — no guessing, no surprises at the offer stage.</p>
              </div>
            </Reveal>
            {/* Card 2 */}
            <Reveal delay={0.1}>
              <div className="bg-[#F5F7FA] rounded-2xl p-8 h-full">
                <div className="w-12 h-12 bg-[#00C9A7]/15 rounded-lg flex items-center justify-center mb-5">
                  <FileSearch className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-xl font-bold text-[#0D1B2A] mb-4">Right-to-Work Documentation Readiness</h3>
                <p className="text-[#0D1B2A]/60 leading-relaxed">We assess whether candidates can provide the documentation your HR team needs on day one: passport, BRP (front and back with NI number), visa vignette with entry stamp, Home Office decision letter, and right-to-work online check status. Candidates who cannot evidence these are flagged before they reach your shortlist.</p>
              </div>
            </Reveal>
            {/* Card 3 */}
            <Reveal delay={0.15}>
              <div className="bg-[#F5F7FA] rounded-2xl p-8 h-full">
                <div className="w-12 h-12 bg-[#F39C12]/15 rounded-lg flex items-center justify-center mb-5">
                  <Award className="w-6 h-6 text-[#F39C12]" />
                </div>
                <h3 className="text-xl font-bold text-[#0D1B2A] mb-4">Qualifications, Skills & Experience Screening</h3>
                <p className="text-[#0D1B2A]/60 leading-relaxed">Candidate profiles are assessed against our QSE checklist. For care sector roles, this includes evidence of the Care Certificate (17 modules), induction completion, English language proficiency, qualifications, references, police clearance, and medical certificates. You see exactly which requirements the candidate already meets and which need completing during onboarding.</p>
              </div>
            </Reveal>
            {/* Card 4 — large */}
            <Reveal delay={0.2}>
              <div className="bg-[#0D1B2A] rounded-2xl p-8 h-full">
                <div className="w-12 h-12 bg-[#00C3FF]/15 rounded-lg flex items-center justify-center mb-5">
                  <ClipboardCheck className="w-6 h-6 text-[#00C3FF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Interview-Ready Candidate Profiles</h3>
                <p className="text-white/60 leading-relaxed">Every candidate profile is structured to support compliant interview documentation. Profiles capture the information you need to conduct a structured, scored interview that meets the Home Office's genuine vacancy and fair recruitment requirements — so the interview itself becomes part of your audit trail.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7 — THE 65-DOCUMENT STANDARD ═══ */}
      <section className="bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#132B47] py-20">
        <div className="container max-w-7xl">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[#00C9A7] text-sm font-bold tracking-widest uppercase mb-3">The ComplIANS Standard</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>The 65-Document Standard Behind Every Hire</h2>
              <div className="flex justify-center mb-6">
                <AnimatedCounter target={65} />
              </div>
              <p className="text-white/50 text-sm uppercase tracking-wider mb-8">Documents per sponsored worker</p>
              <p className="text-white/70 text-lg leading-relaxed max-w-3xl mx-auto">
                When Sponsor ComplIANS facilitates a hire, the standard we work to is a 65-document personnel file for every sponsored worker. This framework was built from auditing over 100 UK sponsor licence holders and covers every document the Home Office expects to see.
              </p>
            </div>
          </Reveal>

          {/* Stat cards bento grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {[
              { count: 6, category: "Immigration Monitoring", desc: "Three-stage visa expiry alert system with reminders at 60, 30, and 15 days" },
              { count: 3, category: "Contact & Address Records", desc: "Two proofs of address plus formal sponsorship application" },
              { count: 18, category: "Record Keeping & Recruitment", desc: "Passport, CoS, visa docs, BRP, RTW check, DBS, interview records, payslips, contract, JD, qualifications, references" },
              { count: 5, category: "Migrant Tracking", desc: "Next of kin, change of contact, address history, absence records, annual leave" },
              { count: 27, category: "Qualifications, Skills & Experience", desc: "Full QSE checklist, induction, 17 Care Certificate modules, medication competency, supervision, appraisals" },
              { count: 2, category: "Compliance Declarations", desc: "Illegal working prevention form and e-visa status" },
              { count: 1, category: "Reporting Duties", desc: "Dedicated migrant activity report tracking all Home Office submissions" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`bg-[#1B3A5C]/40 border border-[#1B3A5C]/60 rounded-xl p-6 hover:border-[#00C3FF]/40 transition-colors ${i === 2 || i === 4 ? "lg:col-span-2" : ""}`}>
                  <div className="text-3xl font-extrabold text-[#00C3FF] mb-2">{stat.count}</div>
                  <h4 className="text-white font-bold mb-2">{stat.category}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{stat.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.5}>
            <p className="text-center text-white/40 text-sm mt-8 italic">Total: 65 documents — coded SW001 to SW065</p>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 8 — WHAT YOU GET THAT NO OTHER JOB BOARD PROVIDES ═══ */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="container max-w-7xl">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1B2A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>What You Get That No Other Job Board Provides</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileCheck,
                title: "Recruitment Audit Trail — Built Automatically",
                desc: "Every step is timestamped and documented: vacancy advertised, candidates received, shortlisting criteria applied, interviews conducted, offer made, CoS assigned. On Indeed, you post and pray. On ComplIANS Jobs, you post and prove.",
              },
              {
                icon: ShieldCheck,
                title: "SOC Code & Salary Validation",
                desc: "Before your listing goes live, we verify the SOC code matches the role and the salary meets the published minimum threshold. This catches the single most common cause of CoS refusals before it happens. Indeed does not check your SOC code. We do.",
              },
              {
                icon: Package,
                title: "Compliance Document Pack",
                desc: "Premium listings include templates built from our audit work: SOC-validated job description, genuine vacancy evidence checklist, interview scoring matrix, and recruitment audit trail template — the same documents we use when preparing sponsors for Home Office visits.",
              },
              {
                icon: Users,
                title: "Candidates Who Understand Their Obligations",
                desc: "Our candidates come from within the sponsor compliance ecosystem. They understand they must work the hours on their CoS, report changes, maintain immigration documents, and cooperate with compliance processes. This reduces the risk of worker-side breaches.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-shadow h-full border border-[#0D1B2A]/5">
                  <div className="w-12 h-12 bg-[#00C3FF]/10 rounded-lg flex items-center justify-center mb-5">
                    <item.icon className="w-6 h-6 text-[#00C3FF]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0D1B2A] mb-3">{item.title}</h3>
                  <p className="text-[#0D1B2A]/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 9 — THE BOTTOM LINE ═══ */}
      <section className="bg-[#00C9A7] py-16">
        <div className="container max-w-4xl text-center">
          <Reveal>
            <p className="text-3xl md:text-4xl font-extrabold text-[#0D1B2A] mb-6 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              80% of sponsor licence revocations are caused by recruitment failures. The job board you choose is where that risk starts — or stops.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button onClick={() => setShowPostModal(true)} className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#0D1B2A]/90 transition-all text-lg">
                Post Your First Vacancy Free <ArrowRight className="w-5 h-5" />
              </button>
              <Link href="/advertise" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-all text-lg">
                See Advertising Plans
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 10 — FAQ ═══ */}
      <section className="bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#132B47] py-20">
        <div className="container max-w-3xl">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Frequently Asked Questions</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <FAQItem q="Is it really free to post a job?" a="Yes. Every UK sponsor licence holder can post up to 3 vacancies per month at no cost. Free listings are live for 30 days and appear in search results for all candidates." />
              <FAQItem q="Do I need a sponsor licence to post?" a="Yes. ComplIANS Jobs is exclusively for employers who hold a current Home Office sponsor licence. Your licence number is verified during registration." />
              <FAQItem q="How do you vet candidates?" a="Every candidate is assessed against our 65-document compliance framework covering immigration status, right-to-work documentation, qualifications and skills evidence (including Care Certificate modules for care roles), English language proficiency, references, and police clearance. Their profile shows exactly which requirements they meet before you interview them." />
              <FAQItem q="Where do your candidates come from?" a="Three channels: our network of 500+ sponsor licence holder clients (including workers from revoked sponsors who need new compliant employers), our Sponsorship Files podcast audience (30,000+ downloads), and our compliance webinar and newsletter community (2,500+ subscribers)." />
              <FAQItem q="What is the 65-document standard?" a="A personnel file framework developed from auditing over 100 UK sponsor licence holders. It lists every document the Home Office expects per sponsored worker, coded SW001 through SW065, covering immigration monitoring, recruitment evidence, migrant tracking, reporting duties, qualifications and training, and compliance declarations." />
              <FAQItem q="How is this different from Indeed?" a="Indeed is a general job board. ComplIANS Jobs is purpose-built for sponsor licence holders. Every listing shows SOC code, salary threshold compliance, and sponsorship status. Only verified sponsors can post. Premium listings include SOC code validation, salary checks, and a Compliance Document Pack. Your recruitment process automatically builds the audit trail the Home Office expects." />
              <FAQItem q="Can I use ComplIANS Jobs and Indeed together?" a="Yes. Use Indeed for volume and reach. Use ComplIANS Jobs for compliance-ready candidates, validated listings, and recruitment evidence. The two complement each other." />
              <FAQItem q="What if I need full managed recruitment?" a="Our Managed Recruitment tier (from £2,495/hire) provides end-to-end compliant recruitment — sourcing, screening, interviews, placement, and a complete audit-ready file. See our Skilled Worker Recruitment Solutions page for details." />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Modals */}
      <PostJobModal open={showPostModal} onClose={() => setShowPostModal(false)} />
      {applyJob && <JobApplicationForm job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  );
}
