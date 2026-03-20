/*
 * Home.tsx — Sponsor ComplIANS Homepage
 * ALL CONTENT IS GEO-OPTIMISED — USE VERBATIM, DO NOT REWRITE
 * Design: Hub palette #0D1B2A / #1B3A5C / #00C3FF / #E74C3C / #F39C12 / #F5F7FA
 * Layout: Power Theme-inspired — bold typography, bento grids, asymmetric hero
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import {
  ShieldCheck, Users, Briefcase, ArrowRight, Star,
  Search, ClipboardCheck, Rocket, Shield, ChevronDown,
  FileSearch, AlertTriangle, XCircle, FileWarning, UserX,
  Play,
} from "lucide-react";
import { DoughnutKPI } from "@/components/DoughnutChart";
import ContentSlider from "@/components/ContentSlider";
import TestimonialsGrid from "@/components/TestimonialsGrid";
import ctaConfig from "@/lib/ctaConfig";
import WebinarAnnouncementBar from "@/components/WebinarAnnouncementBar";

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
      <div className="text-5xl md:text-7xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
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

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  /* Scroll-triggered parallax for hero image */
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Testimonials are now rendered by the TestimonialsGrid component below */

  const faqs = [
    { q: "What is a sponsor licence?", a: "A sponsor licence is an authorisation granted by the UK Home Office that allows an employer to hire workers from outside the UK under specific immigration routes, most commonly the Skilled Worker visa. Employers must apply for a sponsor licence, demonstrate that they can meet their sponsor duties, and maintain compliance on an ongoing basis to retain the licence." },
    { q: "What happens if a sponsor licence is revoked?", a: "If the Home Office revokes a sponsor licence, the employer can no longer sponsor any workers. All existing sponsored workers will have their permission to work curtailed, typically within 60 days. The employer will also be unable to reapply for a sponsor licence for a specified cooling-off period, usually 12 months. Revocation can also trigger reputational damage and operational disruption." },
    { q: "How often does the Home Office conduct compliance visits?", a: "The Home Office can conduct a compliance visit at any time, including unannounced visits. There is no fixed schedule. Visits are more likely after a licence is first granted, after a Certificate of Sponsorship allocation request, after a change in key personnel, or if the Home Office has received information suggesting non-compliance. Employers should be audit-ready at all times." },
    { q: "What are the most common reasons sponsor licences are revoked?", a: "Based on Sponsor ComplIANS\'s analysis of over 100 UK sponsor compliance audits, the most common causes of licence revocation are: poor or non-genuine recruitment practices (35% of cases), failure to conduct proper right-to-work checks (25%), inadequate record-keeping (20%), monitoring and reporting failures (8%), Certificate of Sponsorship management errors (7%), and other compliance issues (5%)." },
    { q: "What does a sponsor compliance audit cost?", a: "The cost of a sponsor compliance audit depends on the size of the organisation, the number of sponsored workers, and the complexity of the compliance landscape. Sponsor ComplIANS offers a free initial audit call to assess your situation and recommend the right level of support. Contact us at admin@sponsorcomplians.com or call 020 3618 6968 to book your free audit." },
    { q: "Who is Sponsor ComplIANS?", a: "Sponsor ComplIANS is a UK-based sponsor licence compliance consultancy headquartered at 915 High Road, North Finchley, London N12 8QJ. The company specialises in sponsor compliance audits, Skilled Worker recruitment solutions, and sponsor-ready HR services for UK employers. All solutions are built on proprietary audit data from over 100 UK sponsor licence holders." },
    { q: "What is the Sponsor ComplIANS Hub?", a: "The Sponsor ComplIANS Hub is a compliance management platform designed specifically for UK sponsor licence holders. It centralises sponsored worker management, automates reporting reminders, monitors salary compliance in real time, and provides a complete audit trail. The Hub is built on data from over 100 real compliance audits." },
    { q: "Do you work with care providers?", a: "Yes. A significant proportion of our clients are care providers, including domiciliary care agencies, residential care homes, and nursing homes. The care sector has been disproportionately affected by sponsor licence revocations, and our audit methodology addresses the specific compliance challenges care providers face, including multi-site management and shift-based worker tracking." },
    { q: "Can you help with a B-rating or suspension?", a: "Yes. If your sponsor licence has been downgraded to a B-rating or suspended, Sponsor ComplIANS can help you develop and implement an action plan to address the Home Office\'s concerns. Our track record includes successfully helping sponsors move from B-rating back to A-rating and having suspensions lifted." },
    { q: "What areas of the UK do you cover?", a: "Sponsor ComplIANS provides services across England, Wales, Scotland, and Northern Ireland. Our audits can be conducted remotely via secure document sharing and video calls, or on-site at your premises. Our headquarters are in London, but we serve clients nationwide." },
  ];

  return (
    <div className="-mt-[108px]">
      {/* ═══ SECTION 1 — HERO ═══ */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 py-16 lg:py-0">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="section-label inline-block mb-4">UK Sponsor Licence Compliance</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Sponsor Licence Compliance, Recruitment, and HR Solutions{" "}
                  <span className="text-gradient-teal">for UK Employers</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[#8B9EB7] text-lg lg:text-xl leading-relaxed max-w-2xl mb-8">
                  Sponsor ComplIANS provides end-to-end sponsor licence compliance services for UK employers who hold or are applying for a Home Office sponsor licence. Our solutions cover three core areas: sponsor compliance audits, Skilled Worker recruitment, and sponsor-ready HR services. Every system we deliver is built on real audit data collected from over 100 UK sponsor licence holders.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link href="/book-consultation" className="btn-teal text-base">
                    Book Your Free Compliance Audit <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/sponsor-compliance-audit" className="btn-white-outline text-base">
                    See How It Works
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="flex flex-wrap gap-6 lg:gap-8">
                  {[
                    { icon: <Users className="w-4 h-4 text-[#00C3FF]" />, text: "Trusted by 500+ UK Sponsors" },
                    { icon: <ShieldCheck className="w-4 h-4 text-[#00C3FF]" />, text: "100% Compliance Track Record" },
                    { icon: <Star className="w-4 h-4 text-[#F39C12]" />, text: "100+ Audits Completed" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/70 text-sm">{item.icon}<span>{item.text}</span></div>
                  ))}
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={0.3}>
                <div
                  ref={heroRef}
                  className="relative group"
                  style={{
                    transform: `translateY(${scrollY * 0.08}px) rotate3d(1, 0, 0, ${Math.min(scrollY * 0.015, 4)}deg)`,
                    transition: "transform 0.1s linear",
                  }}
                >
                  <div className="absolute -inset-4 bg-[#00C3FF]/10 rounded-3xl blur-2xl transition-all duration-500 group-hover:bg-[#00C3FF]/20 group-hover:blur-3xl" />
                  <Link href={ctaConfig.getPrimaryCTAPath()}>
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:shadow-[0_0_60px_rgba(0,195,255,0.15)] group-hover:border-[#00C3FF]/30 cursor-pointer">
                      <img src={IMAGES.hubDashboardHero} alt="Sponsor ComplIANS Hub — Run Dashboard, Unified Inbox, and compliance monitoring" className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
                      {/* Webinar CTA overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-[#00C3FF] flex items-center justify-center shadow-lg shadow-[#00C3FF]/30 transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-7 h-7 text-white ml-1" fill="white" />
                          </div>
                          <span className="text-white font-semibold text-sm tracking-wide uppercase">{ctaConfig.getHeroCTALabel()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {/* Floating stat badge */}
                  <div className="absolute bottom-4 left-4 bg-[#1B3A5C] border border-white/10 rounded-xl px-4 py-3 shadow-xl z-40 transition-transform duration-500 group-hover:translate-y-[-4px]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#00C3FF]/20 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-[#00C3FF]" /></div>
                      <div><div className="text-white text-sm font-bold">100%</div><div className="text-[#8B9EB7] text-[11px]">Audit Pass Rate</div></div>
                    </div>
                  </div>
                  {/* Click-through hint */}
                  <div className="absolute top-4 right-4 bg-[#00C3FF]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40">
                    Explore the Hub &rarr;
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WEBINAR ANNOUNCEMENT BAR — Between Hero & Section 2 ═══ */}
      <WebinarAnnouncementBar />

      {/* ═══ SECTION 2 — WHAT IS SPONSOR COMPLIANCE ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="max-w-4xl mx-auto">
              <span className="section-label">What Is Sponsor Compliance</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                What Is Sponsor Licence Compliance?
              </h2>
              <p className="text-[#6B7280] text-lg leading-[1.75] mb-6">
                Sponsor licence compliance is the ongoing obligation of UK employers who hold a Home Office sponsor licence to meet a defined set of sponsor duties. These duties include maintaining accurate records for all sponsored workers, conducting and documenting right-to-work checks, reporting changes to the Home Office within 10 working days, ensuring sponsored workers are paid at or above the relevant salary threshold for their SOC code, and cooperating with any Home Office compliance visit or audit.
              </p>
              <p className="text-[#6B7280] text-lg leading-[1.75]">
                Failure to meet these duties can result in the sponsor licence being suspended, downgraded, or revoked. A revoked licence means the employer can no longer sponsor Skilled Workers, and existing sponsored employees may lose their right to work in the UK.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 3 — WHY SPECIALIST SUPPORT ═══ */}
      <section className="white-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="max-w-4xl mx-auto">
              <span className="section-label-steel">Why Specialist Support</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Why Sponsor Licence Holders Need Specialist Compliance Support
              </h2>
              <p className="text-[#6B7280] text-lg leading-[1.75] mb-6">
                Our analysis of over 100 UK sponsor compliance audits found that no organisation achieved full compliance across all areas. The most common failure categories were HR systems and processes (64.7% of all breaches), recruitment practices (responsible for 80% of licence revocations), and record-keeping duties (the single highest-risk compliance area, with 16 distinct issue types identified).
              </p>
              <p className="text-[#6B7280] text-lg leading-[1.75] mb-6">
                These failures are not caused by bad intentions. They are caused by operational gaps: HR teams who have not been trained on sponsor duties, recruiters who assign incorrect SOC codes, personnel files that are missing key evidence, and a lack of systems to detect and report problems before they escalate.
              </p>
              <p className="text-[#6B7280] text-lg leading-[1.75]">
                Sponsor ComplIANS exists to close these gaps. We bring tested, data-driven solutions that have been refined through direct work with hundreds of UK employers.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 4 — OUR THREE CORE SERVICES (Bento Grid) ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Our Products</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Six Products. One Compliance Ecosystem.
              </h2>
              <p className="text-[#6B7280] mt-4 max-w-2xl mx-auto">
                Every product is built on real audit data from over 100 UK sponsor licence holders.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Compliance Audit — featured */}
            <Reveal delay={0}>
              <div className="bento-card bg-[#0D1B2A] p-8 lg:p-10 flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-5"><ShieldCheck className="w-7 h-7 text-[#00C3FF]" /></div>
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sponsor Compliance Audit</h3>
                  <p className="text-[#8B9EB7] text-sm leading-relaxed">
                    Systematic review across 12 compliance areas and 16 issue types. Covers record-keeping, right-to-work, salary compliance, CoS management, recruitment, and reporting duties. 100% pass rate for prepared clients.
                  </p>
                </div>
                <Link href="/sponsor-compliance-audit" className="flex items-center gap-2 text-[#00C3FF] font-semibold text-sm hover:gap-3 transition-all mt-5">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            {/* 2. Recruitment */}
            <Reveal delay={0.1}>
              <div className="bento-card bg-white border border-[#E2E8F0] p-8 shadow-sm flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-5"><Users className="w-6 h-6 text-[#00C3FF]" /></div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Skilled Worker Recruitment</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    Compliance-led recruitment for Skilled Worker visa hires. Covers SOC code validation, genuine vacancy testing, candidate screening, interview documentation, and compliant onboarding. 80% of revocations are recruitment-related.
                  </p>
                </div>
                <Link href="/skilled-worker-recruitment-solutions" className="flex items-center gap-2 text-[#00C3FF] font-semibold text-sm hover:gap-3 transition-all mt-5">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            {/* 3. HR Services */}
            <Reveal delay={0.2}>
              <div className="bento-card bg-white border border-[#E2E8F0] p-8 shadow-sm flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#E74C3C]/10 flex items-center justify-center mb-5"><Briefcase className="w-6 h-6 text-[#E74C3C]" /></div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sponsor-Ready HR Services</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    HR compliance aligned with Home Office sponsor duties. Right-to-work management, salary monitoring, absence tracking, change reporting, and key personnel training. 64.7% of failures are HR-related.
                  </p>
                </div>
                <Link href="/sponsor-hr-services" className="flex items-center gap-2 text-[#00C3FF] font-semibold text-sm hover:gap-3 transition-all mt-5">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            {/* 4. Hub Software — featured */}
            <Reveal delay={0.3}>
              <div className="bento-card bg-[#0D1B2A] p-8 lg:p-10 flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-5"><Search className="w-7 h-7 text-[#00C3FF]" /></div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sponsor ComplIANS Hub</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#00C3FF]/20 text-[#00C3FF] text-[10px] font-bold">NEW</span>
                  </div>
                  <p className="text-[#8B9EB7] text-sm leading-relaxed">
                    Cloud-based compliance management platform. Tracks every sponsored worker, salary payment, right-to-work check, and document — in real time. Built from insights from 100+ audits. Launching 1 April 2026.
                  </p>
                </div>
                <Link href="/sponsor-complians-hub" className="flex items-center gap-2 text-[#00C3FF] font-semibold text-sm hover:gap-3 transition-all mt-5">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            {/* 5. The Sponsorship Files */}
            <Reveal delay={0.4}>
              <div className="bento-card bg-white border border-[#E2E8F0] p-8 shadow-sm flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F39C12]/10 flex items-center justify-center mb-5"><Star className="w-6 h-6 text-[#F39C12]" /></div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>The Sponsorship Files</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    AI-native investigative podcast examining UK immigration enforcement, sponsor licence revocations, NHS workforce crises, and policy changes. 30,000+ downloads. 97 planned episodes across 11 series arcs.
                  </p>
                </div>
                <Link href="/the-sponsorship-files" className="flex items-center gap-2 text-[#00C3FF] font-semibold text-sm hover:gap-3 transition-all mt-5">
                  Listen Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            {/* 6. Provider Websites */}
            <Reveal delay={0.5}>
              <div className="bento-card bg-white border border-[#E2E8F0] p-8 shadow-sm flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-5"><Rocket className="w-6 h-6 text-[#00C3FF]" /></div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Provider Websites</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    Compliance-ready websites for care providers and sponsor licence holders. CQC-aligned service pages, technology showcases, careers sections, and GEO-optimised content that regulators and families trust.
                  </p>
                </div>
                <Link href="/provider-websites" className="flex items-center gap-2 text-[#00C3FF] font-semibold text-sm hover:gap-3 transition-all mt-5">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5 — RESULTS & STATS BANNER ═══ */}
      <section className="stats-gradient py-20 lg:py-28 relative">
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-4">
              <span className="section-label">Results</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Results and Track Record
              </h2>
              <p className="text-[#8B9EB7] text-lg max-w-2xl mx-auto mb-12">
                Sponsor ComplIANS has supported over 500 UK sponsor licence holders. Key outcomes include:
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
            {[
              { percentage: 100, label: "Audit Pass Rate", sublabel: "Across all clients prepared for Home Office compliance visits" },
              { percentage: 95, label: "Client Retention", sublabel: "Of clients continue with ongoing compliance support" },
              { percentage: 80, label: "Revocations from Recruitment", sublabel: "Of licence revocations are caused by recruitment failures", color: "#E74C3C" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="flex flex-col items-center">
                  <DoughnutKPI
                    percentage={stat.percentage}
                    label={stat.label}
                    sublabel={stat.sublabel}
                    size={160}
                    strokeWidth={14}
                    color={stat.color || "#00C3FF"}
                    bgColor="rgba(255,255,255,0.08)"
                    textColor="#FFFFFF"
                    labelColor="#8B9EB7"
                  />
                </div>
              </Reveal>
            ))}
          </div>
          {/* Additional stat counters below doughnuts */}
          <div className="grid md:grid-cols-3 gap-10 lg:gap-16 mt-16">
            {[
              { target: 500, suffix: "+", label: "UK Sponsors Supported", sublabel: "Across healthcare, IT, hospitality, and construction" },
              { target: 22, prefix: "£", suffix: "M+", label: "Business Risk Avoided", sublabel: "Calculated from licence values, worker investments, and operational continuity savings" },
              { target: 500, suffix: "+", label: "Workers Hired Compliantly", sublabel: "Through our end-to-end recruitment processes" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.15 + 0.3}>
                <div className="text-center">
                  <AnimatedCounter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                  <div className="w-12 h-1 bg-[#00C3FF] mx-auto mt-4 mb-3 rounded-full" />
                  <div className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>{stat.label}</div>
                  <div className="text-[#8B9EB7] text-sm mt-1">{stat.sublabel}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6 — OUR METHODOLOGY (4-step) ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Our Methodology</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                How Our Process Works
              </h2>
              <p className="text-[#6B7280] text-lg mt-4 max-w-3xl mx-auto">
                Sponsor ComplIANS follows a four-stage methodology for every engagement:
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-6 lg:gap-8 relative">
            <div className="hidden md:block absolute top-[60px] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-[#00C3FF]/20 via-[#00C3FF] to-[#00C3FF]/20" />
            {[
              { step: "01", title: "Assess", desc: "We review your current HR systems, recruitment processes, and sponsor licence records to establish your compliance position and identify every area of risk.", icon: <Search className="w-6 h-6" /> },
              { step: "02", title: "Align", desc: "We customise your policies, systems, and documentation against the latest Home Office sponsor requirements.", icon: <ClipboardCheck className="w-6 h-6" /> },
              { step: "03", title: "Apply", desc: "We train your team on their specific compliance responsibilities and implement automation tools to reduce manual effort and eliminate human error.", icon: <Rocket className="w-6 h-6" /> },
              { step: "04", title: "Assure", desc: "We provide ongoing monitoring, regular compliance health checks, and proactive adjustments as rules and your business evolve.", icon: <Shield className="w-6 h-6" /> },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="white-card p-8 text-center relative">
                  <div className="w-[72px] h-[72px] rounded-2xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-5 text-[#00C3FF] relative z-10">{item.icon}</div>
                  <div className="text-[#00C3FF] text-xs font-bold tracking-widest mb-2">{item.step}</div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="text-center mt-12">
              <Link href="/book-consultation" className="btn-teal text-base">
                Start with a Free Discovery Call <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 7 — TESTIMONIALS (Pastel Grid) ═══ */}
      <TestimonialsGrid />

      {/* ═══ SECTION 8 — FAQ (Dark bg) ═══ */}
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

      {/* ═══ SECTION 9 — FINAL CTA ═══ */}
      <section className="dark-section py-20 lg:py-24 border-t border-white/5">
        <div className="container text-center max-w-3xl">
          <Reveal>
            <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Your Sponsor Licence Is Too Valuable to Leave Unprotected
            </h2>
            <p className="text-[#8B9EB7] text-lg mb-10">
              Whether you need a compliance audit, a recruitment overhaul, or a fully integrated HR system, we have a proven solution ready for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/book-consultation" className="btn-teal text-base">
                Book Your Free Audit Call <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/newsletter" className="btn-white-outline text-base">
                Join Our Training Hub Waitlist
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* JSON-LD: Organisation Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Sponsor ComplIANS",
            url: "https://www.sponsorcomplians.com",
            logo: IMAGES.logoLight,
            description: "UK sponsor licence compliance consultancy providing audits, recruitment, and HR solutions.",
            address: { "@type": "PostalAddress", streetAddress: "915 High Road, North Finchley", addressLocality: "London", postalCode: "N12 8QJ", addressCountry: "GB" },
            telephone: "+442036186968",
            email: "admin@sponsorcomplians.com",
            sameAs: [
              "https://linkedin.com/company/sponsorcomplians",
              "https://facebook.com/profile.php?id=61572202899701",
              "https://instagram.com/sponsorcomplians",
              "https://youtube.com/channel/UCWCUNlwdJzgHtkC-pzKWJbg",
            ],
          }),
        }}
      />
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
