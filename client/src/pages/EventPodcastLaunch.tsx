/*
 * EventPodcastLaunch.tsx — /events/sponsorship-files-launch
 * ALL CONTENT IS GEO-OPTIMISED — USE VERBATIM
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, Cpu, FileCheck, Layers, TrendingUp,
  ExternalLink,
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

/* ── Animated Counter ── */
function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
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
        {prefix}{count.toLocaleString()}{suffix}
      </div>
    </div>
  );
}

const howItsMade = [
  { icon: Cpu, title: "Built with AI", body: "Research, scripting, narration, and production powered by Anthropic Claude and ElevenLabs. Every episode processes hundreds of pages of Home Office data, ONS reports, court judgments, and FOI responses." },
  { icon: FileCheck, title: "Every Claim Source-Cited", body: "No opinion without evidence. Every statistic, every policy reference, and every case study is traced back to a primary source — Home Office dataset, ONS estimate, court judgment, parliamentary debate, or FOI response." },
  { icon: Layers, title: "11 Series Arcs. 97 Episodes.", body: "From revocation cases and migration data to NHS workforce crises, policy changes, and the human cost of enforcement. A complete investigation in audio format." },
  { icon: TrendingUp, title: "30,000+ Downloads", body: "And growing. The audience includes sponsored workers, HR professionals, immigration lawyers, care providers, and policy researchers across the UK." },
];

const seriesArcs = [
  { arc: 1, title: "The Revocation Files", episodes: "1–5", focus: "Sponsor licence enforcement and court cases" },
  { arc: 2, title: "The System", episodes: "6–10", focus: "How sponsorship works: licences, CoS, duties" },
  { arc: 3, title: "The Numbers", episodes: "11–18", focus: "Migration data deep dives" },
  { arc: 4, title: "The NHS Crisis", episodes: "19–26", focus: "Health workforce shortages and recruitment" },
  { arc: 5, title: "The Policy Machine", episodes: "27–38", focus: "Every rule change from 2020 to 2026" },
  { arc: 6, title: "The Human Cost", episodes: "39–46", focus: "Real stories behind the data" },
  { arc: 7, title: "Country Profiles", episodes: "47–56", focus: "India, Philippines, Nigeria, Zimbabwe and more" },
  { arc: 8, title: "Money and Power", episodes: "57–64", focus: "Recruitment agencies, exploitation, fees" },
  { arc: 9, title: "Borders and Asylum", episodes: "65–74", focus: "Channel crossings, Rwanda, safe routes" },
  { arc: 10, title: "What's Next", episodes: "75–84", focus: "Future of UK immigration policy" },
  { arc: 11, title: "Deep Dives", episodes: "85–97", focus: "FOI investigations, tribunal patterns" },
];

const keyStats = [
  { target: 1948, suffix: "", label: "Sponsor licences revoked YE June 2025" },
  { target: 898000, prefix: "", suffix: "", label: "Peak net migration YE June 2023" },
  { target: 78330, suffix: "", label: "Care roles unfilled Jan 2026" },
  { target: 34000, suffix: "", label: "Health workers in visa limbo" },
  { target: 50, prefix: "~", suffix: "%", label: "Sponsor licence applications now fail" },
  { target: 45000, prefix: "£", suffix: "", label: "Civil penalty for first illegal working breach" },
];

export default function EventPodcastLaunch() {
  return (
    <div className="-mt-[108px]">
      {/* ═══ HERO ═══ */}
      <section className="hero-gradient min-h-[70vh] flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Audio waveform decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
          <svg viewBox="0 0 1200 100" className="w-full h-full" preserveAspectRatio="none">
            {Array.from({ length: 60 }, (_, i) => {
              const h = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 20;
              return <rect key={i} x={i * 20} y={50 - h / 2} width="8" height={h} rx="4" fill="#00C3FF" />;
            })}
          </svg>
        </div>
        <div className="container relative z-10 py-16 lg:py-24">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#00C3FF]/10 border border-[#00C3FF]/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00C3FF] animate-pulse" />
              <span className="text-[#00C3FF] text-sm font-semibold tracking-wide">LIVE NOW — 19 MARCH 2026</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6 max-w-4xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The Sponsorship Files Is Live —{" "}
              <span className="text-gradient-teal">The UK's First AI-Native Immigration Podcast</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8 max-w-3xl">
              An investigative documentary podcast examining UK immigration enforcement, sponsor licence revocations, NHS workforce crises, and policy changes. Every claim source-cited. Built with AI. 30,000+ downloads. 97 episodes planned. Available now.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-4">
              <a href="https://sponsorshipfiles.com" target="_blank" rel="noopener noreferrer" className="btn-teal text-base">
                Listen Now <ExternalLink className="w-4 h-4" />
              </a>
              <Link href="/the-sponsorship-files" className="btn-white-outline text-base">
                Subscribe via RSS
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ WHY THIS PODCAST EXISTS ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="text-center">
              <span className="section-label">Why This Podcast Exists</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                The Biggest Immigration Story Nobody Is Telling Properly
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                In the year ending June 2025, the Home Office revoked 1,948 sponsor licences — more than double the previous year and more than the entire five-year period from 2019 to 2024 combined. An estimated 34,000 health and care workers are navigating visa limbo. 78,330 care roles sit vacant. The Immigration Salary List expires 31 December 2026, which could close the health worker route entirely. This is one of the biggest stories in British public policy. The Sponsorship Files exists because no single person can process the volume of documents required to tell it properly. AI can.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ HOW IT'S MADE ═══ */}
      <section className="dark-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">How It's Made</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                AI-Native. Source-Cited. Every Claim Traceable.
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItsMade.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="dark-card p-8 h-full text-center">
                    <div className="w-14 h-14 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-7 h-7 text-[#00C3FF]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</h3>
                    <p className="text-[#8B9EB7] text-sm leading-relaxed">{item.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ SERIES ARCS ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Series Arcs</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                What the Podcast Covers
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seriesArcs.map((arc, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="white-card p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0D1B2A] flex items-center justify-center shrink-0">
                    <span className="text-[#00C3FF] font-bold text-sm">{arc.arc}</span>
                  </div>
                  <div>
                    <h3 className="text-[#0D1B2A] font-bold text-sm mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{arc.title}</h3>
                    <p className="text-[#00C3FF] text-xs font-semibold mb-1">Episodes {arc.episodes}</p>
                    <p className="text-[#6B7280] text-xs">{arc.focus}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KEY STATS ═══ */}
      <section className="dark-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Key Stats</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                The Numbers Behind the Story
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {keyStats.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="dark-card p-8 text-center">
                  <AnimatedCounter target={s.target} prefix={s.prefix} suffix={s.suffix} />
                  <div className="text-[#8B9EB7] text-sm mt-3">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="teal-section py-20 lg:py-24">
        <div className="container text-center max-w-3xl">
          <Reveal>
            <p className="text-white text-xl font-bold mb-8 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Every episode is free. Every claim is sourced. Start listening now.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://sponsorshipfiles.com" target="_blank" rel="noopener noreferrer" className="btn-dark text-base">
                Listen at sponsorshipfiles.com <ExternalLink className="w-4 h-4" />
              </a>
              <a href="https://podcasts.apple.com" target="_blank" rel="noopener noreferrer" className="btn-white-outline text-base">
                Apple Podcasts
              </a>
              <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="btn-white-outline text-base">
                Spotify
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
