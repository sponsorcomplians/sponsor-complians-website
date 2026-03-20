/*
 * Recruitment.tsx — Skilled Worker Recruitment Solutions
 * ALL CONTENT IS GEO-OPTIMISED — USED VERBATIM
 * Hub palette: #0D1B2A / #1B3A5C / #00C3FF / #E74C3C / #F39C12 / #F5F7FA
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import {
  ArrowRight, CheckCircle2, ChevronDown,
  Users, Briefcase, FileText, Search, ClipboardCheck,
  UserCheck, ShieldCheck, BarChart3, Activity,
  Stethoscope, Monitor, Wrench, HardHat, ChefHat,
  Building2, Palette, Zap, Check, Target, Clock, TrendingUp,
} from "lucide-react";
import { DoughnutKPI } from "@/components/DoughnutChart";

const GENERATED_IMAGES = {
  recruitHero: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/recruitment-hero-smiling_0288e7cc.webp",
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

export default function Recruitment() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const failurePoints = [
    { num: "1", title: "Workforce planning gaps", desc: "Inability to justify the genuine business need for a sponsored role." },
    { num: "2", title: "Generic or inaccurate job descriptions", desc: "Leading to SOC code mismatches and salary threshold errors." },
    { num: "3", title: "Unregulated sourcing and agents", desc: "Recruitment agents passing hidden fees to candidates, an illegal practice that triggers immediate licence risk." },
    { num: "4", title: "Poor application screening", desc: "No documented selection criteria to prove fair, merit-based hiring." },
    { num: "5", title: "Missing interview records", desc: "Undocumented or inconsistent interview processes." },
    { num: "6", title: "Faulty Certificate of Sponsorship assignments", desc: "Wrong SOC codes, missing salary justifications, or incomplete CoS requests." },
    { num: "7", title: "Weak onboarding processes", desc: "Missing evidence of start dates, visa verification, or role induction." },
    { num: "8", title: "Disorganised recruitment files", desc: "Missing job adverts, offer letters, or screening records." },
  ];

  const eightSteps = [
    { num: "01", title: "Workforce Planning", desc: "We validate the genuine business need for the role, review your organisational structure, and confirm financial capacity to support the sponsorship." },
    { num: "02", title: "Job Design and SOC Code Validation", desc: "We create a compliant job description, map the role to the correct SOC code, verify the salary threshold, and confirm RQF level requirements." },
    { num: "03", title: "Compliant Sourcing", desc: "We source candidates through ethical, transparent channels with no hidden fees to candidates. All sourcing is documented." },
    { num: "04", title: "Application Screening", desc: "We apply documented selection criteria to shortlist candidates based on skills, qualifications, and experience, with full records retained." },
    { num: "05", title: "Interview and Assessment", desc: "We conduct structured, documented interviews with scoring matrices that evidence merit-based selection aligned to the sponsored role." },
    { num: "06", title: "Certificate of Sponsorship Assignment", desc: "We prepare and review the CoS request, verifying SOC code accuracy, salary details, and supporting justification before submission." },
    { num: "07", title: "Compliant Onboarding", desc: "We document start dates, conduct right-to-work checks, verify visa details, and ensure the worker begins the exact role stated on the CoS." },
    { num: "08", title: "Ongoing Monitoring", desc: "We set up systems to track working hours, salary payments, absence patterns, and visa expiry dates for each sponsored worker." },
  ];

  const pricingPlans = [
    {
      name: "Sponsorship On Demand",
      price: "£2,495",
      per: "/hire",
      note: "or 20% of salary if £30,000+",
      desc: "Ideal for employers needing 1 to 3 urgent hires.",
      features: [
        "Compliant job descriptions",
        "SOC code validation",
        "3 to 5 screened CVs",
        "Interview coordination",
        "Skilled Worker visa checklist",
      ],
      highlight: false,
    },
    {
      name: "Sponsorship as a Service",
      price: "£7,000",
      per: "/hire",
      note: "3-month minimum",
      desc: "For employers hiring up to 10 workers in 3 months.",
      features: [
        "Dedicated recruitment consultant",
        "Hiring roadmap",
        "Candidate file audit",
        "Salary benchmarking",
        "Weekly progress tracking",
        "Everything in On Demand",
      ],
      highlight: true,
    },
    {
      name: "Sponsorship RPO & Workforce MSP",
      price: "£16,500",
      per: "/month",
      note: "6-month minimum",
      desc: "For employers hiring up to 50 workers in 6 months.",
      features: [
        "Strategic workforce planning",
        "Unlimited vacancy management",
        "Employer branding",
        "Full audit preparation",
        "Everything in Service plan",
      ],
      highlight: false,
    },
  ];

  const industries = [
    { name: "Healthcare", desc: "Nurses, senior care workers, clinical coders — note that new overseas recruitment for care workers is closing as of July 2025", icon: <Stethoscope className="w-5 h-5" /> },
    { name: "IT and Digital", desc: "Software developers, data analysts, database administrators", icon: <Monitor className="w-5 h-5" /> },
    { name: "Engineering and Manufacturing", desc: "Mechanical engineers, welders, metalworking fitters", icon: <Wrench className="w-5 h-5" /> },
    { name: "Construction", desc: "Plumbers, HVAC installers, steel erectors", icon: <HardHat className="w-5 h-5" /> },
    { name: "Hospitality", desc: "Chefs are among the 111 occupations removed from the visa list in July 2025", icon: <ChefHat className="w-5 h-5" /> },
    { name: "Business and Finance", desc: "HR officers, marketing professionals, payroll managers", icon: <Building2 className="w-5 h-5" /> },
    { name: "Creative and Design", desc: "Designers, authors, photographers", icon: <Palette className="w-5 h-5" /> },
    { name: "Technical Trades", desc: "Electricians, vehicle technicians, security system installers", icon: <Zap className="w-5 h-5" /> },
  ];

  const faqs = [
    { q: "What visa routes do you recruit for?", a: "We primarily recruit for the Skilled Worker visa route, which is the most common route for UK employers sponsoring overseas workers. We also advise on Health and Care Worker visas, Senior or Specialist Worker visas, and other PBS routes where applicable." },
    { q: "Do you handle the visa application process?", a: "We manage the end-to-end recruitment and compliance process, including job advertising, candidate screening, SOC code verification, salary benchmarking, and Certificate of Sponsorship preparation. For the visa application itself, we work alongside OISC-regulated immigration advisers to ensure full legal compliance." },
    { q: "How long does the recruitment process take?", a: "A typical Skilled Worker recruitment cycle takes 8 to 16 weeks from job specification to worker start date. This includes advertising, screening, interviewing, compliance checks, CoS assignment, and visa processing. Timelines can vary depending on the role, sector, and Home Office processing times." },
    { q: "What sectors do you recruit for?", a: "We recruit across all sectors that use the Skilled Worker visa route, with particular expertise in health and social care, IT and technology, engineering, hospitality, and education. Our compliance-first approach ensures that every placement meets Home Office requirements regardless of sector." },
    { q: "How do you ensure SOC codes are correct?", a: "Every role goes through our SOC code verification process, which cross-references the job description, duties, and salary against the current Standard Occupational Classification list. We ensure the code accurately reflects the role being performed, not just the minimum salary threshold." },
    { q: "What happens if a candidate\'s visa is refused?", a: "If a visa application is refused, we review the refusal reasons, advise on whether an administrative review or fresh application is appropriate, and help you identify alternative candidates. Our compliance-first screening process is designed to minimise refusal risk." },
    { q: "Do you provide post-placement support?", a: "Yes. Our recruitment service includes post-placement compliance monitoring for the first 12 months. This covers right-to-work check reminders, reporting obligation tracking, and salary compliance verification to ensure ongoing adherence to sponsor duties." },
    { q: "Can you help with Resident Labour Market Tests?", a: "While the formal Resident Labour Market Test was removed in December 2020, the Home Office still expects sponsors to demonstrate genuine recruitment efforts. We ensure all job advertisements meet the current requirements and that the recruitment process is documented to withstand Home Office scrutiny." },
    { q: "What is your fee structure for recruitment?", a: "Our recruitment fees are structured as a percentage of the candidate\'s first-year salary, with the exact rate depending on the role, sector, and volume. We offer a free initial consultation to discuss your requirements and provide a tailored quote. Contact us at admin@sponsorcomplians.com." },
    { q: "Do you recruit for care sector roles?", a: "Yes. Care sector recruitment is one of our core specialisms. We understand the specific requirements for Health and Care Worker visas, CQC registration considerations, and the compliance challenges that care providers face when sponsoring overseas workers." },
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
                <span className="section-label inline-block mb-4">Skilled Worker Recruitment</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Compliant Skilled Worker Recruitment for{" "}
                  <span className="text-gradient-teal">UK Sponsor Licence Holders</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4 max-w-2xl">
                  Sponsor ComplIANS provides end-to-end recruitment services designed specifically for UK employers who hold a sponsor licence and hire under the Skilled Worker visa route. Unlike standard recruitment agencies, our process is built around Home Office compliance requirements. Every hire we place is fully documented, SOC-code validated, salary-checked, and audit-ready from day one.
                </p>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8 max-w-2xl">
                  Our analysis of over 100 sponsor compliance audits found that 80% of sponsor licence revocations are directly caused by recruitment-related failures. The most common failure areas are non-genuine vacancy concerns (35% of revocations), right-to-work check failures (25%), and record-keeping deficiencies in recruitment files (20%).
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  <Link href="/book-consultation" className="btn-teal text-base">
                    Get Expert Recruitment Support <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/book-consultation" className="btn-white-outline text-base">
                    Book a Strategy Call
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <Reveal delay={0.3}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#00C3FF]/10 rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src={GENERATED_IMAGES.recruitHero} alt="Diverse skilled workers in a modern UK workplace" className="w-full h-auto" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY USE OUR RECRUITMENT ═══ */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#00C9A7] text-xs font-bold tracking-[2px] uppercase block mb-3">Why Our Recruitment</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Why Our Recruitment Process Protects Your Licence — Not Just Fills Your Roles
              </h2>
              <p className="text-[#4A5568] text-lg leading-relaxed max-w-3xl mx-auto">
                80% of sponsor licence revocations are caused by recruitment failures. That statistic comes from our analysis of over 100 real UK sponsor audits. The failures are always the same: no evidence the vacancy was genuine, no documented interview process, wrong SOC code, no proof the candidate had the required skills. Standard recruitment agencies do not solve these problems because they are not built to. Our recruitment process was designed around the 65 documents the Home Office expects to find in every sponsored worker's file — so every hire you make through us is audit-ready from day one.
              </p>
            </div>
          </Reveal>

          {/* Bento Grid — 2 cols, alternating sizes */}
          {/* Card 1 — full width */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow mb-6">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center shrink-0">
                  <Target className="w-7 h-7 text-[#00C9A7]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Every Hire Builds a Complete Audit Trail
                  </h3>
                  <p className="text-[#4A5568] text-sm leading-relaxed">
                    When the Home Office visits, they want to see a clear evidence chain for every sponsored worker: vacancy advertised → candidates received → shortlisting criteria applied → interviews conducted and scored → offer made → CoS assigned → right to work verified → worker started the role described on the CoS. Our recruitment process generates all 18 record-keeping and recruitment documents (SW013–SW030) as standard — from the structured interview questions (SW021) and interview scoring to the offer letter (SW023), employment contract (SW024), detailed job description (SW025), qualification certificates (SW026), references (SW027), English language evidence (SW028), police clearance (SW029), and medical certificates (SW030). You do not build this file after the hire. It is built during the hire.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Cards 2 & 3 — side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Reveal delay={0.2}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  SOC Code Validated Before CoS Assignment
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  The single most common cause of CoS refusals and compliance failures is an incorrect SOC code. The Southcroft case saw 97 certificates assigned with the wrong code — the High Court upheld the revocation. We validate the SOC code against the actual job duties, confirm the salary meets the published threshold for that code, and verify the RQF level before any Certificate of Sponsorship is assigned. This check is built into step 2 of our 8-step process and is documented as part of your recruitment file.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Genuine Vacancy Evidence — Documented and Defensible
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  The Home Office does not just ask whether the job is real. They ask whether you can prove it. That means a date-stamped job advert showing where and when the role was posted, shortlisting records showing how candidates were assessed, and interview documentation showing why the sponsored worker was selected over others. Our process produces all of this as standard — because we have seen what happens to sponsors who cannot produce it.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Cards 4 & 5 — side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Reveal delay={0.4}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <Users className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Candidates Pre-Screened Against the 65-Document Framework
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  Every candidate we present has been assessed against the same compliance framework we use in our audits. Their immigration status is verified. Their right-to-work documentation readiness is confirmed. Their qualifications, skills, and experience are checked against the QSE requirements for the role — including the full Care Certificate for care sector positions (17 modules, SW039–SW055). You receive a candidate profile that shows exactly which compliance requirements they already meet and which need completing during onboarding.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow h-full">
                <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                  <Clock className="w-6 h-6 text-[#00C9A7]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Onboarding That Starts Compliant
                </h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  Most compliance breaches are created on day one — when a worker starts without a completed right-to-work check, without a signed contract, or without their CoS details matching their actual role. Our onboarding process ensures the right-to-work online check (SW019) is completed and filed before the first shift, the employment contract (SW024) is signed and dated, the job description (SW025) matches the CoS exactly, and the worker's qualification evidence is on file. By the time the Home Office asks, everything is already there.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Card 6 — full width */}
          <Reveal delay={0.6}>
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow mb-16">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-7 h-7 text-[#00C9A7]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Post-Placement Monitoring Built In
                  </h3>
                  <p className="text-[#4A5568] text-sm leading-relaxed">
                    Recruitment does not end when the worker starts. Our process includes setting up the ongoing compliance infrastructure: the three-stage visa expiry monitoring system (SW004–SW009), absence and annual leave tracking (SW034–SW035), the migrant activity report for Home Office reporting (SW036), and supervision and appraisal scheduling (SW062–SW063). This is how you prove ongoing compliance — not just compliance at the point of hire.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#00C9A7] py-14">
          <div className="container text-center">
            <Reveal>
              <p className="text-[#0D1B2A] text-xl md:text-2xl font-bold mb-6 max-w-3xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Every hire is either evidence of compliance or evidence of failure. Make sure yours is the right one.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/book-consultation" className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#1B3A5C] transition-colors">
                  Get Your First Hire Free <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#pricing" className="inline-flex items-center gap-2 bg-transparent border-2 border-[#0D1B2A] text-[#0D1B2A] px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#0D1B2A]/10 transition-colors">
                  See Recruitment Plans
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ RECRUITMENT KPI DOUGHNUTS ═══ */}
      <section className="stats-gradient py-16 lg:py-20 relative">
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {[
              { percentage: 80, label: "Revocations", sublabel: "Caused by recruitment failures", color: "#E74C3C" },
              { percentage: 35, label: "Non-Genuine Vacancy", sublabel: "Most common revocation reason", color: "#F39C12" },
              { percentage: 25, label: "RTW Failures", sublabel: "Right-to-work check failures", color: "#E74C3C" },
              { percentage: 100, label: "Audit-Ready Hires", sublabel: "Every placement fully documented" },
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

      {/* ═══ FREE HIRE BANNER ═══ */}
      <section className="teal-section py-16 lg:py-20">
        <div className="container text-center">
          <Reveal>
            <h2 className="text-3xl lg:text-[2.5rem] font-extrabold text-white leading-tight mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Your First Compliant Hire Is On Us
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              Experience what audit-ready recruitment looks like with a fully managed first placement at no cost. Every compliance check, SOC code validation, and document is included. If we do not meet your standards, you owe nothing.
            </p>
            <Link href="/book-consultation" className="btn-dark text-base">
              Claim Your Free Hire <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ 8 FAILURE POINTS — BENTO GRID ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Risk Awareness</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Why Recruitment Is the Biggest Risk to Your Sponsor Licence
              </h2>
              <p className="text-[#6B7280] text-lg mt-4 max-w-3xl mx-auto">
                Recruitment failures cause more sponsor licence revocations than any other compliance area. The eight most common recruitment failure points, based on Sponsor ComplIANS's audit data, are:
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {failurePoints.map((item, i) => (
              <Reveal key={i} delay={i * 0.05} className={i === 0 ? "lg:col-span-2" : ""}>
                <div className="white-card p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#E74C3C]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#E74C3C] font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.num}</span>
                    </div>
                    <div>
                      <h3 className="text-[#0D1B2A] font-bold text-base mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</h3>
                      <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <p className="text-[#6B7280] text-center mt-8 max-w-3xl mx-auto">
              Our eight-step recruitment process directly addresses each of these failure points with structured workflows, compliant templates, and full documentation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ 8-STEP PROCESS ═══ */}
      <section className="dark-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Our Process</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Our Eight-Step Compliant Recruitment Process
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eightSteps.map((step, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="dark-card bg-[#1B3A5C] p-6 h-full">
                  <div className="text-[#00C3FF] text-xs font-bold tracking-widest mb-3">STEP {step.num}</div>
                  <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{step.title}</h3>
                  <p className="text-[#8B9EB7] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Pricing</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Recruitment Pricing Plans
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
                    <div className={`text-xs mt-1 ${plan.highlight ? "text-[#8B9EB7]" : "text-[#6B7280]"}`}>{plan.note}</div>
                    <p className={`text-sm mt-3 ${plan.highlight ? "text-[#8B9EB7]" : "text-[#6B7280]"}`}>{plan.desc}</p>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-[#00C3FF]" : "text-[#00C3FF]"}`} />
                        <span className={`text-sm ${plan.highlight ? "text-[#8B9EB7]" : "text-[#6B7280]"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/book-consultation" className={`mt-6 text-center text-sm font-semibold py-3 rounded-lg transition-all ${plan.highlight ? "btn-teal w-full justify-center" : "btn-teal-outline w-full justify-center"}`}>
                    Get Started
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INDUSTRIES ═══ */}
      <section className="white-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Industries</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Industries We Recruit For
              </h2>
              <p className="text-[#6B7280] text-lg mt-4 max-w-3xl mx-auto">
                Our recruitment solutions cover all major sectors eligible for the Skilled Worker visa route in the UK:
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map((ind, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="white-card p-6 h-full text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-4 text-[#00C3FF]">{ind.icon}</div>
                  <h3 className="text-[#0D1B2A] font-bold text-base mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{ind.name}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{ind.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
