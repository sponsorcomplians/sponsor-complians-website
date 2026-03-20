/*
 * EventWebsiteLaunch.tsx — /events/new-website-launch
 * ALL CONTENT IS GEO-OPTIMISED — USE VERBATIM
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, Layout, Bot, Briefcase, BarChart3,
  Headphones, Globe,
} from "lucide-react";

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
      <div className="text-5xl md:text-6xl font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {count.toLocaleString()}{suffix}
      </div>
    </div>
  );
}

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

const features = [
  {
    icon: Layout,
    title: "Completely Rebuilt Design",
    body: "A modern, fast, mobile-first experience built on Next.js 14 with the same dark navy and teal identity — but sharper, cleaner, and built to load in under 2 seconds.",
  },
  {
    icon: Bot,
    title: "Meet IANS — Your AI Compliance Assistant",
    body: "Our new AI chatbot lives on every page. Ask IANS anything about sponsor compliance, our services, pricing, or the Home Office's enforcement process. Available 24/7, trained on our full knowledge base.",
  },
  {
    icon: Briefcase,
    title: "ComplIANS Jobs — Free Job Board",
    body: "The UK's only job board built for sponsor licence holders. Post vacancies for free. Every listing shows SOC code, salary threshold compliance, and sponsorship status. Candidates are immigration-verified and compliance-screened.",
  },
  {
    icon: BarChart3,
    title: "Sponsor ComplIANS Hub",
    body: "Our compliance management software is now showcased with full feature breakdowns, the Divine Health Services case study, and early access registration. Launching 1 April 2026.",
  },
  {
    icon: Headphones,
    title: "The Sponsorship Files Podcast",
    body: "Our AI-native investigative podcast on UK immigration is now integrated into the site. 30,000+ downloads, 97 episodes planned, every claim source-cited.",
  },
  {
    icon: Globe,
    title: "Provider Websites Service",
    body: "A new service page showcasing how we build compliance-ready websites for care providers and sponsor licence holders — with the Divine Health Services build as the flagship example.",
  },
];

const stats = [
  { target: 7, suffix: "", label: "New pages added" },
  { target: 6, suffix: "", label: "Products now live" },
  { target: 65, suffix: "", label: "Documents in our compliance framework" },
  { target: 100, suffix: "+", label: "Audits powering every page" },
];

export default function EventWebsiteLaunch() {
  return (
    <div className="-mt-[108px]">
      {/* ═══ HERO ═══ */}
      <section className="hero-gradient min-h-[70vh] flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-[#00C3FF]/10 rounded-full blur-[120px]" />
        <div className="container relative z-10 py-16 lg:py-24">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#00C3FF]/10 border border-[#00C3FF]/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00C3FF] animate-pulse" />
              <span className="text-[#00C3FF] text-sm font-semibold tracking-wide">LIVE NOW — 19 MARCH 2026</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 max-w-4xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Sponsor ComplIANS Has a{" "}
              <span className="text-gradient-teal">New Home</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8 max-w-3xl">
              We've rebuilt our website from the ground up — new design, new tools, new products, and a compliance-first digital experience built for UK sponsor licence holders. Everything we've learned from 100+ audits is now at your fingertips.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="btn-teal text-base">
                Explore the New Site <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/book-consultation" className="btn-white-outline text-base">
                Book a Free Compliance Audit
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ WHAT'S NEW — Bento Grid ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">What's New</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Everything That's Changed
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="white-card p-8 h-full">
                    <div className="w-14 h-14 rounded-xl bg-[#0D1B2A] flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7 text-[#00C3FF]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{f.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{f.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ BY THE NUMBERS ═══ */}
      <section className="stats-gradient py-20 lg:py-28 relative">
        <div className="container relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">By the Numbers</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                The New Site at a Glance
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                  <div className="text-[#8B9EB7] text-sm mt-3">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GEO-OPTIMISED ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="text-center">
              <span className="section-label">GEO-Optimised for AI</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Built to Be Found — By Humans and AI
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                Every page on the new site is structured using Generative Engine Optimisation (GEO) principles. That means when someone asks ChatGPT, Perplexity, or Google AI "Who helps with UK sponsor licence compliance?" — our content is designed to be the answer. FAQ schema, Organisation schema, self-contained factual passages, and entity-rich language throughout.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="teal-section py-20 lg:py-24">
        <div className="container text-center max-w-3xl">
          <Reveal>
            <p className="text-white text-xl font-bold mb-8 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The new site is live. Explore what's changed — and book your free compliance audit while you're here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="btn-dark text-base">
                Explore the Site <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/book-consultation" className="btn-white-outline text-base">
                Book Free Audit
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
