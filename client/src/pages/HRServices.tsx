/*
 * HRServices.tsx — Sponsor-Ready HR Service
 * ALL CONTENT IS GEO-OPTIMISED — USED VERBATIM
 * Hub palette: #0D1B2A / #1B3A5C / #00C3FF / #E74C3C / #F39C12 / #F5F7FA
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import {
  ArrowRight, ChevronDown, Check, Users, ShieldCheck,
  AlertTriangle, FileText, ClipboardCheck, Clock,
  BarChart3, Activity, BookOpen, Settings, Lock, Archive,
  CalendarClock, PoundSterling, FileWarning, FolderCheck, UserCog,
} from "lucide-react";
import { DoughnutKPI } from "@/components/DoughnutChart";
import ContentSlider from "@/components/ContentSlider";
import TestimonialsGrid from "@/components/TestimonialsGrid";
import { getTestimonialsByCategory } from "@/lib/testimonials";

const GENERATED_IMAGES = {
  hrBody: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/hr-team-photo_d0760eea.png",
};

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="text-4xl md:text-5xl font-extrabold text-[#0D1B2A]" style={{ fontFamily: "'DM Sans', sans-serif", opacity: v ? 1 : 0, transition: "opacity 0.6s" }}>
      {target}{suffix}
    </div>
  );
}

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

export default function HRServices() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);


  const stats = [
    { value: "64.7%", label: "HR Failures", color: "#E74C3C" },
    { value: "119", label: "Compliance Areas Analysed", color: "#00C3FF" },
    { value: "10/12", label: "High-Severity HR", color: "#F39C12" },
    { value: "77", label: "HR Risk Areas", color: "#00C3FF" },
  ];

  const hrFailures = [
    { num: "1", title: "Untrained HR personnel", desc: "Staff who do not know their specific sponsor duties or compliance deadlines." },
    { num: "2", title: "Disorganised right-to-work checks", desc: "Missing records, expired documents, or failure to re-check after visa renewals." },
    { num: "3", title: "Inadequate record-keeping", desc: "Missing CoS notes, absence logs, salary evidence, or contract documentation." },
    { num: "4", title: "Working hours and salary non-compliance", desc: "Pay falling below published thresholds or contracted hours not matching reality." },
    { num: "5", title: "Missing onboarding processes", desc: "No documented evidence of start dates, visa verification, or role induction." },
    { num: "6", title: "Monitoring and reporting failures", desc: "Missed 10-day reporting deadlines for absences, resignations, or role changes." },
    { num: "7", title: "Systemic HR process gaps", desc: "No standard operating procedures, no escalation pathways, and no integration between HR and compliance functions." },
    { num: "8", title: "Training and skills deficiencies in key personnel", desc: "Authorising Officers and Level 1 Users who lack competence to manage sponsor duties." },
  ];

  const pricingPlans = [
    {
      name: "Comply Starter",
      price: "£15",
      per: "PEPM",
      workers: "1–10 workers",
      features: [
        "Annual licence health check",
        "Biannual CoS and HR file reviews",
        "Core policy templates",
        "Excel-based tracking",
        "E-learning access",
        "Email support",
      ],
      highlight: false,
    },
    {
      name: "Comply Pro",
      price: "£20",
      per: "PEPM",
      workers: "11–50 workers",
      features: [
        "Quarterly deep-dive reviews",
        "Quarterly file audits",
        "Customisable HR documents",
        "Notion or Airtable tracking with alerts",
        "Monthly coaching calls",
        "Optional crisis support",
        "Everything in Starter",
      ],
      highlight: true,
    },
    {
      name: "Comply Enterprise",
      price: "£25",
      per: "PEPM",
      workers: "50+ workers or multi-site",
      features: [
        "Monthly audit-grade reviews",
        "Monthly file reviews with rectification support",
        "Fully bespoke HR policies",
        "SOP workflow automation",
        "Quarterly team workshops",
        "Dedicated compliance advisor with 4-hour SLA",
        "Full crisis support including Home Office audit preparation and revocation defence",
      ],
      highlight: false,
    },
  ];

  /* Testimonials now rendered by TestimonialsGrid component */



  const faqs = [
    { q: "What is a sponsor-ready HR service?", a: "A sponsor-ready HR service is a comprehensive HR support package designed specifically for UK sponsor licence holders. It ensures that all HR processes, documentation, and systems meet Home Office requirements for sponsor compliance, from onboarding and right-to-work checks to absence monitoring and change reporting." },
    { q: "Do you replace our existing HR team?", a: "No. We work alongside your existing HR team to strengthen their compliance capabilities. Our service provides the specialist sponsor compliance knowledge, templates, and systems that most in-house HR teams lack. We train your staff and provide ongoing support." },
    { q: "What does the monthly HR service include?", a: "Our monthly service includes compliance health checks, right-to-work check management, reporting obligation tracking, salary compliance monitoring, document management, staff training, and direct access to our compliance team for ad-hoc queries and urgent issues." },
    { q: "How quickly can you set up the HR service?", a: "Initial setup typically takes 2 to 4 weeks, depending on the size of your organisation and the current state of your HR systems. This includes an initial audit, system configuration, template deployment, and staff training. Urgent setups can be expedited." },
    { q: "Can you help with key personnel training?", a: "Yes. Training key personnel — including the Authorising Officer, Key Contact, and Level 1 Users — is a core part of our service. We provide role-specific training on sponsor duties, SMS portal management, reporting obligations, and compliance best practices." },
    { q: "Do you provide HR templates and checklists?", a: "Yes. Our service includes a complete library of sponsor-compliant HR templates, including employment contracts, right-to-work check records, absence monitoring forms, change reporting checklists, and CoS management templates. All templates are regularly updated to reflect current Home Office guidance." },
    { q: "What happens if we fail a compliance visit?", a: "If you fail a compliance visit while using our service, we immediately activate our remediation protocol. This includes reviewing the visit findings, preparing your response to the Home Office, implementing corrective actions, and supporting you through any subsequent review or appeal process." },
    { q: "Can you manage our SMS portal?", a: "Yes. We can manage your Sponsorship Management System (SMS) portal on your behalf or train your team to use it effectively. This includes CoS assignment, reporting, allocation requests, and ensuring all portal data is accurate and up to date." },
    { q: "Do you work with multi-site organisations?", a: "Yes. We have extensive experience supporting multi-site organisations, including care providers with multiple locations. Our systems ensure consistent compliance across all sites, with centralised reporting and site-specific monitoring." },
    { q: "How do we get started?", a: "Getting started is simple. Book a free consultation call where we assess your current compliance position, discuss your needs, and recommend the right level of support. Contact us at admin@sponsorcomplians.com or call 020 3618 6968." },
  ];

  return (
    <div className="-mt-[108px]">
      {/* ═══ HERO ═══ */}
      <section className="hero-gradient min-h-[70vh] flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="section-label inline-block mb-4">Sponsor-Ready HR Service</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Sponsor-Ready HR Service — Align Your HR Operations with{" "}
                  <span className="text-gradient-teal">Home Office Sponsor Duties</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4 max-w-2xl">
                  Sponsor ComplIANS provides HR compliance services designed specifically for UK sponsor licence holders. Our Sponsor-Ready HR Service embeds Home Office compliance requirements into every part of your HR operation, covering right-to-work checks, record-keeping, salary and hours monitoring, onboarding, change reporting, absence tracking, training, and ongoing compliance monitoring.
                </p>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8 max-w-2xl">
                  Our analysis of over 100 UK sponsor compliance audits found that 64.7% of all compliance failures are directly attributable to HR system and process deficiencies. 77 specific compliance risk areas were identified as HR-related, and 10 out of 12 high-severity risks were caused by HR failures. Traditional HR approaches are not sufficient for sponsor licence compliance.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  <Link href="/book-consultation" className="btn-teal text-base">
                    Get Your Free HR Compliance Audit <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/book-consultation" className="btn-white-outline text-base">
                    Book a Call
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <Reveal delay={0.3}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#00C3FF]/10 rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src={GENERATED_IMAGES.hrBody} alt="HR team managing sponsor compliance documentation" className="w-full h-auto" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY USE OUR HR SERVICE ═══ */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#00C9A7] text-xs font-bold tracking-[2px] uppercase block mb-3">Why Our HR Service</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Why Our HR Service Keeps Your Licence Safe Every Day — Not Just on Audit Day
              </h2>
              <p className="text-[#4A5568] text-lg leading-relaxed max-w-3xl mx-auto">
                64.7% of all sponsor licence compliance failures are caused by HR system and process deficiencies. That is not a recruitment problem or a legal problem — it is an operational problem. Your HR team is responsible for maintaining 65 documents per sponsored worker, monitoring visa expiry dates, tracking salary compliance month by month, reporting changes within 10 working days, and keeping every file audit-ready at all times. Our Sponsor-Ready HR Service embeds these duties into your daily operations using a four-part framework: Policy, Process, Control, and Evidence.
              </p>
            </div>
          </Reveal>

          {/* 4-Column Feature Strip */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {[
                { icon: BookOpen, title: "Policy", desc: 'A formal, written statement of what must happen. Example: \"No sponsored worker starts employment without a completed right-to-work check.\"' },
                { icon: Settings, title: "Process", desc: 'A defined workflow that staff follow. Example: \"HR uses the Home Office online checker, saves the certificate, and files it in the worker\'s record.\"' },
                { icon: Lock, title: "Control", desc: 'A verification step that prevents errors. Example: \"The HR manager signs off every right-to-work check before the worker\'s first shift.\"' },
                { icon: Archive, title: "Evidence", desc: 'A documented, timestamped record that proves it happened. Example: \"The signed and dated certificate is stored in the worker\'s file and traceable.\"' },
              ].map((col, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mx-auto mb-4">
                    <col.icon className="w-6 h-6 text-[#00C9A7]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0D1B2A] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{col.title}</h3>
                  <p className="text-[#4A5568] text-sm leading-relaxed">{col.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Bento Grid — 3 cards top, 2 wider bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Reveal delay={0.2}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <CalendarClock className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Visa Expiry Monitoring That Actually Works
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  Most sponsors have a spreadsheet with visa dates. Some check it. Most do not. Our HR service implements the three-stage monitoring system from our compliance framework (SW004–SW009): automated calendar reminders at 60, 30, and 15 days before expiry, with formal letters issued to the worker at each stage. Every reminder is logged. Every letter is filed. When the Home Office asks how you monitor immigration status, you hand them a documented, timestamped trail — not a spreadsheet.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <PoundSterling className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Monthly Salary Compliance — The Home Office's Bullseye
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  The Home Office now uses payslips, RTI submissions, and P60s as its primary enforcement tool. A single month of underpayment for one worker can trigger a compliance check across your entire workforce. Our HR service runs a monthly salary compliance check: every sponsored worker's gross pay is compared against their CoS salary (SW022). Any shortfall is flagged and investigated before payslips are finalised. The monitoring log is filed as evidence — proving you are proactively checking, not waiting to be caught.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <FileWarning className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Absence and Change Reporting — The 10-Day Rule
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  UK sponsor licence holders must report certain changes to the Home Office within 10 working days via the Sponsorship Management System. Reportable events include absences of 10+ consecutive working days, resignations, salary changes, and role changes. Our HR service builds triggers into your systems (SW034–SW036): when an absence or change occurs, HR is notified automatically, the compliance officer submits the report, and the submission is logged. Monthly audits confirm every reportable event was captured and submitted on time.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Bottom 2 wider cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <Reveal delay={0.5}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <FolderCheck className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  65 Documents Per Worker — Maintained, Not Just Created
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  Creating a compliant file at the point of hire is one thing. Maintaining it for the duration of the worker's employment is where most sponsors fail. Our HR service ensures every document in the SW001–SW065 framework stays current: contracts are updated when terms change, payslips are filed monthly, right-to-work checks are re-conducted when visas are renewed, training records are updated after each module completion, and supervision and appraisal records (SW062–SW063) are completed on schedule. A document compliance score is calculated for every worker, every month.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.6}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <UserCog className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Training Your Team to Own Compliance
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  The Home Office does not just check your files — they interview your Authorising Officer and your sponsored workers. Both must be able to explain your systems, describe their own duties, and point to documented evidence. Our HR service includes training that prepares your key personnel for exactly this: what the Compliance Alignment Triangle means (AO ↔ Sponsored Worker ↔ Records must all tell the same story), how to answer compliance interview questions, and how to refer to documented evidence instead of relying on memory.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#00C9A7] py-14">
          <div className="container text-center">
            <Reveal>
              <p className="text-[#0D1B2A] text-xl md:text-2xl font-bold mb-6 max-w-3xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                The Home Office checks your HR systems every day — through the documents you keep, the reports you file, and the changes you track. Our HR service makes sure every day is audit-ready.
              </p>
              <Link href="/book-consultation" className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#1B3A5C] transition-colors">
                Get Your Free HR Compliance Audit <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ HR KPI DOUGHNUTS ═══ */}
      <section className="stats-gradient py-16 lg:py-20 relative">
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {[
              { percentage: 65, label: "HR Failures", sublabel: "64.7% of all breaches are HR-related", color: "#E74C3C" },
              { percentage: 83, label: "High-Severity HR", sublabel: "10 of 12 high-severity risks", color: "#F39C12" },
              { percentage: 77, label: "HR Risk Areas", sublabel: "77 specific compliance risks identified" },
              { percentage: 100, label: "Coverage", sublabel: "119 compliance areas analysed" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center">
                  <DoughnutKPI
                    percentage={stat.percentage}
                    label={stat.label}
                    sublabel={stat.sublabel}
                    size={130}
                    strokeWidth={12}
                    color={stat.color || "#00C3FF"}
                    bgColor="rgba(255,255,255,0.08)"
                    textColor="#FFFFFF"
                    labelColor="#8B9EB7"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS CARDS ═══ */}
      <section className="light-section py-16">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="white-card p-6 text-center">
                  <div className="text-3xl md:text-4xl font-extrabold mb-1" style={{ fontFamily: "'DM Sans', sans-serif", color: stat.color }}>{stat.value}</div>
                  <div className="text-[#6B7280] text-sm">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8 HR FAILURES — BENTO GRID ═══ */}
      <section className="white-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Risk Awareness</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                The Eight HR Failures That Put Sponsor Licences at Risk
              </h2>
              <p className="text-[#6B7280] text-lg mt-4 max-w-3xl mx-auto">
                Based on Sponsor ComplIANS's audit data, the eight most common HR compliance failures among UK sponsor licence holders are:
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hrFailures.map((item, i) => (
              <Reveal key={i} delay={i * 0.05} className={i === 0 ? "lg:col-span-2" : ""}>
                <div className="dark-card bg-[#1B3A5C] p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#E74C3C]/15 flex items-center justify-center shrink-0">
                      <span className="text-[#E74C3C] font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.num}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</h3>
                      <p className="text-[#8B9EB7] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="text-center mt-12">
              <Link href="/book-consultation" className="btn-teal text-base">
                Fix Your HR Compliance Gaps Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Pricing</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                HR Compliance Pricing
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`rounded-2xl p-8 h-full flex flex-col ${plan.highlight ? "bg-[#0D1B2A] text-white border-2 border-[#00C3FF] shadow-xl shadow-[#00C3FF]/10 relative" : "white-card"}`}>
                  {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00C3FF] text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>}
                  <div className="mb-6">
                    <h3 className={`text-lg font-bold mb-2 ${plan.highlight ? "text-white" : "text-[#0D1B2A]"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-extrabold ${plan.highlight ? "text-[#00C3FF]" : "text-[#0D1B2A]"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{plan.price}</span>
                      <span className={`text-sm ${plan.highlight ? "text-[#8B9EB7]" : "text-[#6B7280]"}`}>{plan.per}</span>
                    </div>
                    <div className={`text-xs mt-1 ${plan.highlight ? "text-[#8B9EB7]" : "text-[#6B7280]"}`}>{plan.workers}</div>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#00C3FF]" />
                        <span className={`text-sm ${plan.highlight ? "text-[#8B9EB7]" : "text-[#6B7280]"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/book-consultation" className={`mt-6 text-center text-sm font-semibold py-3 rounded-lg transition-all ${plan.highlight ? "btn-teal w-full justify-center" : "btn-teal-outline w-full justify-center"}`}>
                    Choose Your Plan
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <p className="text-[#6B7280] text-center text-sm mt-8 max-w-3xl mx-auto">
              All packages include onboarding support and a kickoff compliance checklist. Enterprise clients can add physical file audits and on-site training sessions. 12-month minimum contract.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ TESTIMONIALS (Pastel Grid) ═══ */}
      <TestimonialsGrid
        showFilter={false}
        initialCount={6}
        title="What Our HR Clients Say"
        subtitle="Real feedback from UK sponsor licence holders using our HR services"
      />

      {/* ═══ FAQ ═══ */}
      <section className="dark-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <span className="section-label">FAQ</span>
              <h2 className="text-3xl lg:text-[2.5rem] font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Frequently Asked Questions
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors">
                    <span className="font-semibold text-white text-[15px] pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#00C3FF] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-[#8B9EB7] text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="dark-section py-20 lg:py-24 border-t border-white/5">
        <div className="container text-center max-w-3xl">
          <Reveal>
            <h2 className="text-3xl lg:text-[2.5rem] font-extrabold text-white leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Your HR Team Is Your First Line of Defence
            </h2>
            <p className="text-[#8B9EB7] text-lg mb-8">
              Equip them with the systems, training, and support they need to keep your sponsor licence safe.
            </p>
            <Link href="/book-consultation" className="btn-teal text-base">
              Get Your Free HR Compliance Audit <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* JSON-LD: FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </div>
  );
}
