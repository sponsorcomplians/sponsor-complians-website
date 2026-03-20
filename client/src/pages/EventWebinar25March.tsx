/*
 * EventWebinar25March.tsx — /events/25-march-webinar
 * ALL CONTENT IS GEO-OPTIMISED — USE VERBATIM
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowRight, Clock, ChevronDown, AlertTriangle,
  Shield, Quote,
} from "lucide-react";
import GDPRConsent from "@/components/GDPRConsent";

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
  const [target] = useState(() => new Date("2026-03-25T13:00:00Z"));
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
  if (diff === 0) return <p className="text-[#00C3FF] text-lg font-bold">The webinar has started!</p>;
  return (
    <div className="flex gap-4">
      {units.map((u, i) => (
        <div key={i} className="text-center">
          <div className="w-20 h-20 rounded-xl bg-[#1B3A5C] border border-white/10 flex items-center justify-center">
            <span className="text-3xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>{String(u.val).padStart(2, "0")}</span>
          </div>
          <span className="text-[#8B9EB7] text-xs mt-2 block">{u.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Animated Counter ── */
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
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {count.toLocaleString()}{suffix}
      </div>
    </div>
  );
}

const agenda = [
  { time: "1:00 PM", title: "Welcome & The State of Sponsor Compliance", desc: "Ian opens with the latest enforcement data, the 1,948 revocations, and what April 2026 HMRC data-sharing means for your business." },
  { time: "1:15 PM", title: "Live Platform Demo — Core Compliance Features", desc: "Full walkthrough: worker management, 65 SW document tracking, RTW monitoring, and AI compliance scoring." },
  { time: "1:40 PM", title: "The Salary Compliance Engine", desc: "How the platform cross-checks payroll against CoS obligations and flags underpayment risks before they become UKVI breaches." },
  { time: "1:55 PM", title: "Rota Analysis & The Hours Problem", desc: "Live demo of rota analysis — the feature built to solve the most common breach found across 100+ real audits." },
  { time: "2:10 PM", title: "Module Announcements — What's Coming on 1 April", desc: "Exclusive preview of 15 additional modules launching with the platform, including AI Voice Agent, CQC Compliance, and the Integrations Marketplace." },
  { time: "2:25 PM", title: "Founding Member Q&A with Ian", desc: "Open Q&A. Ask anything about the platform, your compliance situation, or the Founding Member programme." },
  { time: "2:45 PM", title: "Close & Founding Member Offer", desc: "Final recap of the £29/worker/month Founding Member rate and how to secure your spot before launch." },
];

const testimonials = [
  { quote: "The concerns email shook us. Their response was strategic, thorough and professionally written. It gave us a fighting chance and restored our confidence.", name: "Timothy Frank", role: "Director, Frank Care Solutions" },
  { quote: "The Home Office visit could have gone very differently without their preparation. Our files were aligned, our team was confident and our responses were structured.", name: "Rafiq Chati", role: "Authorising Officer, Esteemed Life Care" },
  { quote: "The action plan completely changed how we approach sponsor compliance. It gave us clarity, accountability and a roadmap. We feel prepared instead of exposed.", name: "Parveen Goyal", role: "Director, Cross Lane Care" },
];

const faqs = [
  { q: "Who is this webinar for?", a: "Any UK care provider or employer who holds a sponsor licence or is considering applying. Whether you're a registered manager, director, HR lead, or authorising officer — this event shows you exactly how to protect your licence before the April 2026 deadline." },
  { q: "Is it free?", a: "Yes. Completely free. Register above and you'll receive your joining link by email." },
  { q: "What is the Founding Member programme?", a: "Founding Members lock in the Sponsor ComplIANS Hub at £29/worker/month for life — a 50% discount on the standard rate. This price is guaranteed and never increases. Founding Member pricing closes when the platform goes live on 1 April 2026." },
  { q: "What if I can't attend live?", a: "All registered attendees receive a full recording within 24 hours. We recommend attending live for the Q&A." },
  { q: "Will there be a replay?", a: "Yes. The full recording will be available to all registered attendees." },
];

const deadlineStats = [
  { target: 1948, suffix: "", label: "Sponsor licences revoked last year" },
  { target: 400, suffix: "%", label: "Increase in revocations since new rules" },
  { target: 100, suffix: "+", label: "Real compliance audits the Hub is built from" },
  { target: 100, suffix: "+", label: "Care providers already protected" },
];

export default function EventWebinar25March() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ fullName: "", email: "", companyName: "", sponsoredWorkers: "", hasSponsorLicence: "" });
  const [gdprConsent, setGdprConsent] = useState(false);
  const registerMutation = trpc.webinar.register.useMutation({
    onSuccess: () => {
      toast.success("You're registered! Check your email for the joining link.");
      setForm({ fullName: "", email: "", companyName: "", sponsoredWorkers: "", hasSponsorLicence: "" });
    },
    onError: (err) => toast.error(err.message || "Registration failed. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      toast.error("Please enter your name and email.");
      return;
    }
    if (!gdprConsent) {
      toast.error("Please accept the privacy policy to continue.");
      return;
    }
    registerMutation.mutate({ ...form, eventSlug: "25-march-webinar" });
  };

  return (
    <div className="-mt-[108px]">
      {/* ═══ HERO ═══ */}
      <section className="hero-gradient min-h-[80vh] flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#E74C3C]/10 rounded-full blur-[150px]" />
        <div className="container relative z-10 py-16 lg:py-24">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#E74C3C]/10 border border-[#E74C3C]/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#E74C3C] animate-pulse" />
              <span className="text-[#E74C3C] text-sm font-semibold tracking-wide">FREE WEBINAR — WEDNESDAY 25 MARCH 2026 · 1:00 PM GMT</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] mb-6 max-w-4xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The Sponsor Compliance Crisis Is Already Here.{" "}
              <span className="text-gradient-teal">Are You Ready?</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8 max-w-3xl">
              Workers resigning without being reported. Salary mismatches sitting in payroll for months. SMS portals untouched since the licence was granted. The Home Office doesn't need to visit your premises to find these gaps — they already have your HMRC data. Join our free live webinar 6 days before the April 2026 automated enforcement deadline.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#register" className="btn-teal text-base">
                Register Free — Limited Spots <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#agenda" className="btn-white-outline text-base">
                Download the Agenda
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <Countdown />
          </Reveal>
        </div>
      </section>

      {/* ═══ REAL CASES ═══ */}
      <section className="dark-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#E74C3C] text-sm font-semibold tracking-widest uppercase mb-4 block">Real Consequences</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Real Cases. Real Consequences.
              </h2>
            </div>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-8">
            <Reveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 text-[#0D1B2A]">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-[#E74C3C]" />
                  <span className="text-[#E74C3C] text-sm font-bold">February 2026</span>
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>The Provider Who Did Everything Right</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                  A live-in care provider received a compliance request from UKVI. They responded within six days, submitting contracts, payslips, RTI reports, bank statements, and P60s. They even found their own payroll error and made back-payments before the deadline. It made no difference. Two workers were underpaid by £1,329 and £2,071. The Home Office response was absolute: compliance must exist before enforcement action begins. Retrospective fixes are not accepted.
                </p>
                <div className="bg-[#E74C3C]/10 border border-[#E74C3C]/20 rounded-xl p-4">
                  <p className="text-[#E74C3C] font-bold text-sm">Result: Licence revoked. No right of appeal. 12-month ban on reapplying.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-white rounded-2xl p-8 text-[#0D1B2A]">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-[#E74C3C]" />
                  <span className="text-[#E74C3C] text-sm font-bold">West Midlands 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Seven Providers. One Council. All Gone.</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                  Seven domiciliary care providers working with one council all lost their sponsor licences. Most had worked with the council for 10 to 15 years. One provider lost 20 workers in three weeks. They described 10 service users hospitalised and five who passed away during the disruption. This provider was delivering 5,000 hours of care per week — roughly £7 million per year in revenue.
                </p>
                <div className="bg-[#00C3FF]/10 border border-[#00C3FF]/20 rounded-xl p-4">
                  <p className="text-[#00C3FF] font-bold text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Result: A second provider in the same region who had completed a compliance audit received "no further action required."
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ APRIL 2026 DEADLINE ═══ */}
      <section className="py-20 lg:py-28 relative" style={{ background: "#E74C3C" }}>
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                In April 2026, It Becomes Automatic.
              </h2>
              <p className="text-white/90 text-lg leading-relaxed mt-6 max-w-3xl mx-auto">
                Right now, the Home Office already cross-references HMRC payroll data against CoS commitments. But in April 2026, full automated integration goes live. Salary mismatches, unreported changes, and hours discrepancies will be flagged instantly — not during visits, not during spot checks, but continuously and automatically. This webinar is 6 days before the new rules take effect.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {deadlineStats.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0D1B2A] rounded-2xl p-6 text-center">
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                  <div className="text-white/70 text-sm mt-3">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AGENDA ═══ */}
      <section id="agenda" className="light-section py-20 lg:py-28">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Agenda</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                What Happens on the Day
              </h2>
            </div>
          </Reveal>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#00C3FF]/20 hidden md:block" />
            <div className="space-y-6">
              {agenda.map((item, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="flex gap-6 items-start">
                    <div className="hidden md:flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-[#0D1B2A] flex items-center justify-center shrink-0 z-10">
                        <Clock className="w-5 h-5 text-[#00C3FF]" />
                      </div>
                    </div>
                    <div className="white-card p-6 flex-1">
                      <div className="text-[#00C3FF] text-sm font-bold mb-1">{item.time}</div>
                      <h3 className="text-[#0D1B2A] font-bold text-base mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</h3>
                      <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="dark-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Trusted</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Trusted by 100+ Care Providers
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="dark-card p-8 h-full flex flex-col">
                  <Quote className="w-8 h-8 text-[#00C3FF]/30 mb-4" />
                  <p className="text-white/90 text-sm leading-relaxed flex-1 italic">"{t.quote}"</p>
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-[#8B9EB7] text-xs">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REGISTRATION FORM ═══ */}
      <section id="register" className="py-20 lg:py-28" style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #1B3A5C 100%)" }}>
        <div className="container max-w-2xl">
          <Reveal>
            <div className="text-center mb-10">
              <span className="section-label">Register</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Register for the Free Webinar
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="space-y-5">
                <div>
                  <label className="block text-[#0D1B2A] text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-[#0D1B2A] text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-[#0D1B2A] text-sm font-semibold mb-2">Company Name</label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))}
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-[#0D1B2A] text-sm font-semibold mb-2">Number of Sponsored Workers</label>
                  <select
                    value={form.sponsoredWorkers}
                    onChange={e => setForm(p => ({ ...p, sponsoredWorkers: e.target.value }))}
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="1-10">1–10</option>
                    <option value="11-50">11–50</option>
                    <option value="51-100">51–100</option>
                    <option value="100+">100+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#0D1B2A] text-sm font-semibold mb-2">Do you currently hold a sponsor licence?</label>
                  <select
                    value={form.hasSponsorLicence}
                    onChange={e => setForm(p => ({ ...p, hasSponsorLicence: e.target.value }))}
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="applying">Applying</option>
                  </select>
                </div>
                <GDPRConsent checked={gdprConsent} onChange={setGdprConsent} />
                <button
                  type="submit"
                  disabled={registerMutation.isPending || !gdprConsent}
                  className="w-full bg-[#0D1B2A] text-white font-bold py-4 rounded-lg hover:bg-[#1B3A5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registerMutation.isPending ? "Registering..." : "Register Now"}
                </button>
              </div>
              <p className="text-[#6B7280] text-xs mt-5 leading-relaxed text-center">
                Free to attend. 25 March 2026 at 1:00 PM GMT. You'll receive your joining link by email. Can't attend live? Register anyway — all attendees receive the full recording within 24 hours.
              </p>
            </form>
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
