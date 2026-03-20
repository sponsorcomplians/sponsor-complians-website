/*
 * Audit.tsx — Sponsor Compliance Audit page
 * ALL CONTENT IS GEO-OPTIMISED — USED VERBATIM
 * Hub palette: #0D1B2A / #1B3A5C / #00C3FF / #E74C3C / #F39C12 / #F5F7FA
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import {
  ShieldCheck, ArrowRight, CheckCircle2, ChevronDown,
  FileSearch, ClipboardCheck, Rocket, AlertTriangle,
  Layers, GraduationCap,
} from "lucide-react";
import { DoughnutKPI } from "@/components/DoughnutChart";

const GENERATED_IMAGES = {
  auditHero: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/audit-hero-training-event_5fdbaa4a.webp",
};

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
function AnimatedCounter({ target, prefix = "", suffix = "", duration = 2000 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
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
    const step = target / (duration / 16);
    const t = setInterval(() => { cur += step; if (cur >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [started, target, duration]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
    </div>
  );
}

export default function Audit() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const auditAreas = [
    { title: "Record-Keeping Duties", desc: "Whether the employer maintains all documents required by the Home Office for each sponsored worker, including contracts, right-to-work evidence, absence records, salary records, and CoS documentation." },
    { title: "HR and Operational Systems", desc: "Whether the employer has functioning systems for tracking visa expiry dates, monitoring working hours, managing absence, and triggering compliance alerts." },
    { title: "Ongoing Compliance Readiness", desc: "Whether the employer can demonstrate to an inspector that all sponsor duties are being met at the point of a visit, including access to up-to-date files and trained personnel." },
    { title: "Certificate of Sponsorship Management", desc: "Whether each CoS has been issued correctly, with the right SOC code, accurate salary details, and proper justification." },
    { title: "Genuine Vacancy and Recruitment Process", desc: "Whether the employer can evidence that each sponsored role is a genuine vacancy, filled through a fair, documented recruitment process." },
    { title: "Pay and National Minimum Wage Compliance", desc: "Whether each sponsored worker is being paid at or above the published salary threshold for their SOC code and is not being underpaid relative to settled workers in equivalent roles." },
    { title: "Right-to-Work Checks", desc: "Whether initial and follow-up right-to-work checks have been conducted correctly, documented, and stored accessibly." },
    { title: "Monitoring and Reporting Duties", desc: "Whether the employer has reported all required changes to the Home Office within 10 working days, including absences, resignations, salary changes, and role modifications." },
    { title: "Job Role and Salary Matching", desc: "Whether each worker's actual job duties, location, and salary match what was stated on the Certificate of Sponsorship." },
    { title: "Key Personnel Responsibilities", desc: "Whether the Authorising Officer, Key Contact, and Level 1 Users understand and are fulfilling their specific compliance responsibilities." },
    { title: "Absence Tracking and Leave Management", desc: "Whether the employer monitors and records absences accurately and reports unauthorised absences of 10 or more working days." },
    { title: "Change Control Procedures", desc: "Whether the employer has a process for reporting and managing changes to the business, its structure, or its sponsored workers." },
  ];

  const revocationReasons = [
    { num: "01", title: "Missing or invalid right-to-work checks", desc: "The most fundamental duty, frequently overlooked or improperly documented." },
    { num: "02", title: "Underpaying sponsored workers", desc: "Salaries below the minimum threshold for the relevant SOC code." },
    { num: "03", title: "Non-compliant working hours", desc: "Contracted hours not reflecting actual working patterns." },
    { num: "04", title: "Improper CoS assignment", desc: "Certificates of Sponsorship issued to relatives or without genuine business need." },
    { num: "05", title: "Workers lacking required skills or qualifications", desc: "Sponsored employees who do not meet the role's stated requirements." },
    { num: "06", title: "Non-genuine recruitment practices", desc: "Roles that appear fabricated or processes that cannot demonstrate merit-based selection." },
    { num: "07", title: "Hiring out sponsored workers to third parties", desc: "Placing workers at other sites without proper contractual arrangements." },
    { num: "08", title: "Failure to report changes within 10 working days", desc: "Missed notifications for absences, resignations, or salary changes." },
    { num: "09", title: "Poor record-keeping", desc: "Missing contracts, absence logs, pay records, or CoS documentation." },
    { num: "10", title: "Inadequate HR systems and training", desc: "No structured processes for key personnel to fulfil compliance responsibilities." },
  ];

  const faqs = [
    { q: "How long does a sponsor compliance audit take?", a: "A standard audit takes between 5 and 10 working days depending on the number of sponsored workers, the volume of documentation, and the complexity of the organisation\'s structure. Urgent audits for businesses facing an imminent Home Office visit can be completed in as little as 48 hours." },
    { q: "Can we do the audit remotely?", a: "Yes. Sponsor ComplIANS conducts audits both remotely and on-site. Remote audits are completed via secure document sharing and video calls. On-site audits are available across England, Wales, Scotland, and Northern Ireland." },
    { q: "What do we receive after the audit?", a: "You receive a comprehensive compliance report covering all 12 compliance areas, a risk score, a breach-by-breach analysis with severity ratings, a prioritised action plan, and where applicable, templates, checklists, and system recommendations to close identified gaps." },
    { q: "Do you offer ongoing support after the audit?", a: "Yes. Sponsor ComplIANS offers ongoing compliance monitoring, regular health checks, and proactive support through our Sponsor-Ready HR Service. Many clients begin with an audit and then transition to a monthly HR compliance plan." },
    { q: "What does the audit cover?", a: "Our audit covers 12 compliance areas: right-to-work checks, record-keeping, reporting obligations, salary compliance, SOC code accuracy, Certificate of Sponsorship management, recruitment practices, key personnel duties, absence monitoring, workplace conditions, training records, and overall SMS portal management." },
    { q: "How much does a compliance audit cost?", a: "Audit pricing depends on the number of sponsored workers, the number of sites, and the complexity of your organisation. We offer a free initial audit call to assess your situation and provide a tailored quote. Contact us at admin@sponsorcomplians.com or call 020 3618 6968." },
    { q: "Will the audit prepare us for a Home Office visit?", a: "Yes. Our audit is specifically designed to mirror the areas the Home Office examines during a compliance visit. Every client we have prepared following an audit has passed their subsequent Home Office compliance visit — a 100% pass rate." },
    { q: "What if we have already received a Home Office warning?", a: "If you have received a \'We Have Concerns\' email or a pre-action letter from the Home Office, we offer an urgent response service. We can conduct an accelerated audit, help you prepare your response, and guide you through the remediation process." },
    { q: "Do you audit care providers specifically?", a: "Yes. A large proportion of our audit clients are care providers. We understand the specific challenges of the care sector, including multi-site operations, shift-based workers, and the intersection of CQC and Home Office requirements. Our methodology addresses these sector-specific risks." },
    { q: "Can you help us fix the issues you find?", a: "Absolutely. Our audit report includes a prioritised action plan, and we offer implementation support to help you close every gap. This can include template creation, system setup, staff training, and ongoing compliance monitoring through our HR service." },
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
              <span className="section-label inline-block mb-4">Sponsor Compliance Audit</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Sponsor Compliance Audit — Identify Every Risk and Protect Your{" "}
                <span className="text-gradient-teal">UK Sponsor Licence</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4 max-w-2xl">
                A sponsor compliance audit is a comprehensive review of a UK employer's adherence to Home Office sponsor duties. Sponsor ComplIANS conducts audit-grade assessments that cover every obligation a sponsor licence holder must meet, from record-keeping and right-to-work checks to recruitment practices, salary compliance, and change reporting. The goal is to identify every compliance gap, score the risk level, and deliver a clear, prioritised action plan before the Home Office conducts its own compliance visit.
              </p>
              <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8 max-w-2xl">
                Our audit methodology has been developed from findings across more than 100 real UK sponsor licence audits. It covers 12 compliance areas, identifies 16 distinct issue types, and has produced a 100% compliance visit pass rate for every client we have prepared.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <Link href="/book-consultation" className="btn-teal text-base">
                Book Your Free Compliance Audit <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-6 mt-8">
                {[
                  { icon: <CheckCircle2 className="w-4 h-4 text-[#00C3FF]" />, text: "100+ Audits Completed" },
                  { icon: <ShieldCheck className="w-4 h-4 text-[#00C3FF]" />, text: "100% Pass Rate" },
                  { icon: <FileSearch className="w-4 h-4 text-[#00C3FF]" />, text: "12 Compliance Areas Reviewed" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/70 text-sm">{t.icon}<span>{t.text}</span></div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5 hidden lg:block">
            <Reveal delay={0.3}>
              <div className="relative">
                <div className="absolute -inset-4 bg-[#00C3FF]/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src={GENERATED_IMAGES.auditHero} alt="Compliance audit team reviewing sponsor licence data" className="w-full h-auto" />
                </div>
              </div>
            </Reveal>
          </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY USE OUR AUDIT ═══ */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#00C9A7] text-xs font-bold tracking-[2px] uppercase block mb-3">Why Our Audit</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Why Our Audit Finds What Others Miss
              </h2>
              <p className="text-[#4A5568] text-lg leading-relaxed max-w-3xl mx-auto">
                Most compliance consultants review your HR folder and give you a checklist. We review every document, for every sponsored worker, across every compliance area the Home Office assesses — because that is exactly what the Home Office does. Our audit methodology was built from real enforcement cases, real revocation letters, and real compliance visits. It is not based on generic guidance — it is based on what actually gets licences revoked.
              </p>
            </div>
          </Reveal>

          {/* Bento Grid — 3 top, 2 bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Card 1 */}
            <Reveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <FileSearch className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  65 Documents Per Worker. Not 10. Not 20. Sixty-Five.
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  Generic audits check a handful of documents — typically contracts, right-to-work copies, and maybe a payslip. Our audit checks 65 document types per sponsored worker, coded SW001 through SW065. These cover immigration monitoring, contact records, recruitment evidence, migrant tracking, reporting duties, the full qualification and skills framework (including all 17 Care Certificate modules), and compliance declarations. For a client with 120 sponsored workers, that meant our team manually reviewed 7,200 individual documents.
                </p>
              </div>
            </Reveal>

            {/* Card 2 */}
            <Reveal delay={0.2}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <Layers className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  12 Compliance Areas. Not Just Pay and Hours.
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  The Home Office does not just check whether you paid the right salary. They audit across 12 distinct areas: pay and hours, record keeping, right to work, genuine vacancy, recruitment practices, HR systems, reporting duties, immigration status monitoring, key personnel responsibilities, third-party labour, qualifications and skills, and change control. A single weakness in one area cascades into breaches in others. Our audit covers all 12 — because a single missed area is how licences get revoked.
                </p>
              </div>
            </Reveal>

            {/* Card 3 */}
            <Reveal delay={0.3}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <AlertTriangle className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  We Audit the Way the Home Office Audits.
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  The Home Office now uses a two-phase enforcement model. Phase 1 (The Money Stage) analyses payslips, RTI submissions, P60s, and bank statements to verify salary compliance. Phase 2 (The Records Stage) examines your files, contracts, right-to-work checks, job descriptions, training logs, and HR systems during an on-site visit. Our audit simulates both phases — so you know exactly what they will find before they find it.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Bottom row — 2 wider cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Card 4 */}
            <Reveal delay={0.4}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <ClipboardCheck className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Your Three-Stage Visa Monitoring — Tested.
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  One of the first things the Home Office checks is whether you are proactively monitoring visa expiry dates. Our framework includes a three-stage alert system: calendar reminders and formal letters sent at 60 days, 30 days, and 15 days before each sponsored worker's visa expires (documents SW004–SW009). During our audit, we check whether this system exists, whether it has been followed for every worker, and whether the evidence is on file. Most sponsors have nothing. Our clients have a documented, timestamped monitoring trail.
                </p>
              </div>
            </Reveal>

            {/* Card 5 */}
            <Reveal delay={0.5}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <GraduationCap className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  27 QSE Documents — The Area That Destroys Licences.
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  The Southcroft Healthcare case proved that getting qualifications wrong leads to mandatory revocation — 97 Certificates of Sponsorship with the wrong SOC code destroyed a care empire. Our audit checks 27 qualification, skills, and experience documents per worker (SW037–SW063): the QSE checklist, induction records, all 17 Care Certificate modules, medication competency, shadowing feedback, sign-off letters, completion certificates, spot checks, supervision records, and appraisals. If a worker cannot demonstrate they hold the skills stated on their CoS, your licence is at risk. We find that gap before the Home Office does.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Stat Banner */}
        <div className="bg-[#0D1B2A] py-16">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Reveal delay={0.1}>
                <div className="text-center">
                  <AnimatedCounter target={65} />
                  <p className="text-[#8B9EB7] text-sm mt-2">Documents checked per worker</p>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="text-center">
                  <AnimatedCounter target={12} />
                  <p className="text-[#8B9EB7] text-sm mt-2">Compliance areas audited</p>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="text-center">
                  <AnimatedCounter target={100} suffix="%" />
                  <p className="text-[#8B9EB7] text-sm mt-2">Audit pass rate</p>
                </div>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="text-center">
                  <AnimatedCounter target={7200} duration={2500} />
                  <p className="text-[#8B9EB7] text-sm mt-2">Documents reviewed for one client</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#00C9A7] py-14">
          <div className="container text-center">
            <Reveal>
              <p className="text-[#0D1B2A] text-xl md:text-2xl font-bold mb-6 max-w-3xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Your compliance gaps exist right now. The only question is whether you find them first — or the Home Office does.
              </p>
              <Link href="/book-consultation" className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#1B3A5C] transition-colors">
                Book Your Free Compliance Audit <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ AUDIT KPI DOUGHNUTS ═══ */}
      <section className="stats-gradient py-16 lg:py-20 relative">
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {[
              { percentage: 100, label: "Pass Rate", sublabel: "All prepared clients passed" },
              { percentage: 65, label: "HR Breaches", sublabel: "Of all breaches are HR-related", color: "#F39C12" },
              { percentage: 80, label: "Recruitment Failures", sublabel: "Cause of licence revocations", color: "#E74C3C" },
              { percentage: 100, label: "Audits Completed", sublabel: "100+ UK sponsor audits" },
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

      {/* ═══ WHAT WE AUDIT — 12 areas ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">What We Audit</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                What a Sponsor Compliance Audit Covers
              </h2>
              <p className="text-[#6B7280] text-lg mt-4 max-w-2xl mx-auto">
                A thorough sponsor compliance audit reviews the following areas:
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {auditAreas.map((area, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="white-card p-6 h-full">
                  <div className="w-10 h-10 rounded-lg bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#00C3FF] font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-[#0D1B2A] font-bold text-base mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{area.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{area.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 10 REASONS — BENTO GRID ═══ */}
      <section className="white-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Risk Awareness</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                10 Most Common Reasons Sponsor Licences Are Revoked
              </h2>
              <p className="text-[#6B7280] text-lg mt-4 max-w-3xl mx-auto">
                Based on Sponsor ComplIANS's analysis of over 100 UK sponsor compliance audits, the most common reasons for licence revocation are:
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {revocationReasons.map((item, i) => (
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
                Find Out Where You Stand — Book Your Audit <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 3-STEP AUDIT PROCESS ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Our Process</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Our Three-Step Audit Process
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "1", title: "Discover", icon: <FileSearch className="w-6 h-6" />, color: "#00C3FF",
                desc: "We conduct a full review of your sponsor operations, including HR files, recruitment records, CoS assignments, salary evidence, right-to-work documentation, and reporting compliance. Every area is assessed against the latest Home Office Worker and Temporary Worker guidance."
              },
              {
                num: "2", title: "Diagnose", icon: <ClipboardCheck className="w-6 h-6" />, color: "#F39C12",
                desc: "We produce a detailed compliance report that maps each identified breach to the specific sponsor duty it violates, categorises it by severity (critical, high, medium, low), and explains the consequences of non-remediation. The report includes a compliance risk score and a visual heatmap of your exposure."
              },
              {
                num: "3", title: "Demonstrate", icon: <Rocket className="w-6 h-6" />, color: "#00C3FF",
                desc: "We deliver a tailored action plan with step-by-step remediation, implement the required systems and templates, and train your Authorising Officer and key personnel to maintain compliance independently. The goal is to build a compliance infrastructure that lasts, not a one-off fix."
              },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="white-card p-8 text-center h-full">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: `${step.color}15`, color: step.color }}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold tracking-widest mb-2" style={{ color: step.color }}>STEP {step.num}</div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{step.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="text-center mt-12">
              <Link href="/book-consultation" className="btn-teal text-base">
                Start Your Compliance Transformation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ DASHBOARD PREVIEW ═══ */}
      <section className="white-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <span className="section-label">Compliance Dashboard</span>
              <h2 className="text-3xl lg:text-[2.5rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                See Your Compliance Position in Real Time
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-lg max-w-5xl mx-auto">
              <img src={IMAGES.hubDashboard2} alt="Sponsor ComplIANS Audit Report — Hours Shortfall Analysis" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/60 to-transparent flex items-end p-8">
                <div>
                  <div className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sponsor ComplIANS Audit Report</div>
                  <div className="text-white/70 text-sm">Detailed hours shortfall analysis across all sponsored workers</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FAQ ACCORDION (Dark bg) ═══ */}
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

      {/* ═══ CTA BANNER ═══ */}
      <section className="dark-section py-20 lg:py-24 border-t border-white/5">
        <div className="container text-center max-w-3xl">
          <Reveal>
            <h2 className="text-3xl lg:text-[2.5rem] font-extrabold text-white leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Don't Wait for the Home Office to Find Your Gaps
            </h2>
            <p className="text-[#8B9EB7] text-lg mb-8">
              Book a free compliance audit call and discover exactly where your sponsor licence is at risk.
            </p>
            <Link href="/book-consultation" className="btn-teal text-base">
              Book Your Free Audit Call <ArrowRight className="w-4 h-4" />
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
