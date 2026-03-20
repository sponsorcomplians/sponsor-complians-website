/*
 * EventHubLaunch.tsx — /events/hub-launch
 * ALL CONTENT IS GEO-OPTIMISED — USE VERBATIM
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, Users, Calculator, Clock, FileStack,
  ShieldCheck, BarChart3, ChevronDown, Check,
} from "lucide-react";

/* ── Reveal ── */
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

/* ── Countdown Timer ── */
function Countdown() {
  const [target] = useState(() => new Date("2026-04-01T00:00:00Z"));
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const units = [
    { val: days, label: "Days" },
    { val: hours, label: "Hours" },
    { val: minutes, label: "Minutes" },
    { val: seconds, label: "Seconds" },
  ];
  if (diff === 0) return <p className="text-[#00C3FF] text-lg font-bold">The Hub is live!</p>;
  return (
    <div className="flex gap-4 justify-center">
      {units.map((u, i) => (
        <div key={i} className="text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-[#1B3A5C] border border-white/10 flex items-center justify-center">
            <span className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>{String(u.val).padStart(2, "0")}</span>
          </div>
          <span className="text-[#8B9EB7] text-xs mt-2 block">{u.label}</span>
        </div>
      ))}
    </div>
  );
}

const coreFeatures = [
  { icon: Users, title: "Sponsored Worker Management", body: "Complete staff list with real-time compliance status, immigration classification, CoS details, salary compliance score, document completeness, and 12-stage sponsorship lifecycle position for every worker." },
  { icon: Calculator, title: "Salary Compliance Engine", body: "Continuously compares actual pay against CoS salary. Flags any shortfall before payslips are finalised. Generates the exact audit trail the Home Office checks in Phase 1: payslips, RTI-ready data, payment evidence." },
  { icon: Clock, title: "RTW Expiry Monitoring", body: "Automated 60/30/15-day escalation alerts for visa expiries. Auto-generated reminder letters. Timestamped record of every check conducted." },
  { icon: FileStack, title: "65-Document Tracking", body: "Every document from SW001 to SW065 mapped, tracked, and scored per worker. Document compliance percentage calculated for each individual and for the organisation." },
  { icon: ShieldCheck, title: "Immutable Audit Trail", body: "Every action logged with timestamps, user attribution, and before/after snapshots. Always audit-ready for unannounced Home Office visits." },
  { icon: BarChart3, title: "Compliance Reporting", body: "Generate a complete compliance report in seconds: worker list, salary evidence, RTW records, document completeness, lifecycle positions. What used to take days now takes minutes." },
];

const modules = [
  "Sponsored Worker Management",
  "65-Document Tracking (SW001–SW065)",
  "Salary Compliance Engine",
  "RTW Expiry Monitoring",
  "Compliance Dashboard & Scoring",
  "Rota Analysis & Hours Compliance",
  "Reporting Duties Tracker (SMS submissions)",
  "Sponsorship Lifecycle Manager (12 stages)",
  "AI Compliance Scoring Engine",
  "AI Voice Agent (phone-based compliance assistant)",
  "CQC Compliance Module",
  "Integrations Marketplace",
  "Key Personnel Management",
  "Audit Trail & Evidence Vault",
  "Monthly Compliance Reports",
];

const pricingFeatures = [
  "All 15 modules included",
  "Unlimited users",
  "Priority support",
  "Early access before public launch",
  "Price never increases",
];

const faqs = [
  { q: "When does the Hub launch?", a: "1 April 2026. Founding Members receive early access before the public launch." },
  { q: "What does the Founding Member price include?", a: "All 15 modules, unlimited users, priority support, and a price locked at £29/worker/month for life. The standard rate after launch is £58/worker/month." },
  { q: "How many workers can I track?", a: "There is no limit. You pay per sponsored worker per month." },
  { q: "Can I see a demo before committing?", a: "Yes. Book a demo at /contact or attend our free webinar on 25 March 2026 where Ian walks through every feature live." },
  { q: "What if I already use the Sponsor-Ready HR Service?", a: "The Hub is included as part of the Comply Pro and Comply Enterprise HR Service tiers. If you're already on one of these plans, you'll get Hub access at no additional cost." },
  { q: "Is my data secure?", a: "Yes. The Hub is GDPR compliant with encrypted storage, role-based access controls, and full audit logging. Enterprise-grade reliability with 99.9% uptime." },
];

export default function EventHubLaunch() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="-mt-[108px]">
      {/* ═══ HERO ═══ */}
      <section className="min-h-[80vh] flex items-center relative overflow-hidden pt-[108px]" style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #1B3A5C 40%, #0D1B2A 100%)" }}>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,195,255,0.08) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 py-16 lg:py-24">
          <Reveal>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-[#F39C12]/10 border border-[#F39C12]/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#F39C12] animate-pulse" />
                <span className="text-[#F39C12] text-sm font-semibold tracking-wide">LAUNCHING 1 APRIL 2026</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6 max-w-4xl mx-auto text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The Sponsor ComplIANS Hub —{" "}
              <span className="text-gradient-teal">Compliance Software Built From 100+ Real Audits</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-10 max-w-3xl mx-auto text-center">
              A purpose-built compliance management platform for UK sponsor licence holders. Track every worker, every document, and every deadline in real time. Replace spreadsheets with a system the Home Office respects. Launching 1 April 2026.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <Countdown />
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href="/sponsor-complians-hub" className="btn-teal text-base">
                Join as a Founding Member — £29/worker/month <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/book-consultation" className="btn-white-outline text-base">
                Book a Demo
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ WHY THE HUB EXISTS ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="text-center">
              <span className="section-label">Why the Hub Exists</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Because Spreadsheets Cannot Protect Your Licence
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                The Home Office's two-phase enforcement model demands accurate salary data and complete, accessible records. Spreadsheets fail both. They are not real-time, they do not send alerts, they cannot calculate compliance scores, and they cannot produce an audit-ready report at the moment the Home Office asks for one. The Hub was built to replace every spreadsheet, every disconnected tracker, and every manual process with a single platform that monitors all 65 compliance documents across every sponsored worker — in real time.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CORE FEATURES ═══ */}
      <section className="dark-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Core Features</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                What the Hub Does
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="dark-card p-8 h-full">
                    <div className="w-14 h-14 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7 text-[#00C3FF]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{f.title}</h3>
                    <p className="text-[#8B9EB7] text-sm leading-relaxed">{f.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ PROOF — DIVINE HEALTH ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="text-center">
              <span className="section-label">Proof</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Already Proven — Divine Health Services
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                Divine Health Services, a CQC-regulated homecare provider with 65 sponsored workers, uses the Hub as its compliance backbone. When the Home Office initiated a compliance check on 10 December 2025, Divine submitted all documentation within 14 days. On 6 January 2026, the Home Office confirmed: "We are satisfied with your representations, and no further action is required." 65 workers. 100% salary compliance. Zero shortfalls. Zero RTW alerts. Cleared in 27 days.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 15 MODULES ═══ */}
      <section className="dark-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">What's Coming</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                15 Modules Launching on 1 April 2026
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {modules.map((m, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="dark-card p-5 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#00C3FF]/10 flex items-center justify-center mb-3">
                    <span className="text-[#00C3FF] font-bold text-xs">{i + 1}</span>
                  </div>
                  <span className="text-white text-xs font-semibold leading-snug">{m}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOUNDING MEMBER PRICING ═══ */}
      <section className="teal-section py-20 lg:py-28">
        <div className="container max-w-3xl">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Founding Member Programme — Lock In £29/worker/month for Life
              </h2>
              <p className="text-white/90 text-lg leading-relaxed mt-6">
                Founding Members get access to the full Hub platform at £29 per worker per month — a 50% discount on the standard rate of £58/worker/month. This price is guaranteed for life and will never increase as long as you remain a member. Founding Member pricing closes when the Hub goes live on 1 April 2026.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-[#0D1B2A] rounded-2xl p-10 text-center shadow-2xl">
              <div className="text-[#00C3FF] text-sm font-bold tracking-widest uppercase mb-4">Founding Member</div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>£29</span>
                <span className="text-[#8B9EB7] text-lg">/worker /month</span>
              </div>
              <div className="text-[#8B9EB7] text-sm mb-1">Locked for life</div>
              <div className="text-[#E74C3C] line-through text-sm mb-8">£58/worker/month standard rate</div>
              <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                {pricingFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00C3FF] shrink-0" />
                    <span className="text-white text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/sponsor-complians-hub" className="btn-teal text-base w-full justify-center">
                Become a Founding Member <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/80 text-sm text-center mt-6">
              Limited to the first 100 sponsors. Once the platform goes live on 1 April, this rate is gone.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="dark-section py-20 lg:py-28">
        <div className="container max-w-3xl">
          <Reveal>
            <div className="text-center mb-12">
              <span className="section-label">FAQ</span>
              <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Frequently Asked Questions
              </h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-semibold text-sm pr-4">{f.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#00C3FF] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-[#8B9EB7] text-sm leading-relaxed">{f.a}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
