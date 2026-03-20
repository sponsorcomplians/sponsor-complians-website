import { useState } from "react";
import { Link } from "wouter";
import {
  Headphones, Mic, BarChart3, ArrowRight, ExternalLink,
  ChevronDown, Play, Radio, TrendingUp, Users, Globe, Scale
} from "lucide-react";

/* ── colour tokens ── */
const NAVY = "#0D1B2A";
const BLUE  = "#00C3FF";

/* ── series arcs ── */
const arcs = [
  { num: "1", title: "The Revocation Files", eps: "1–5", desc: "Sponsor licence enforcement and court cases, including the Southcroft Healthcare judgment where a single wrong SOC code on 97 Certificates of Sponsorship triggered mandatory revocation." },
  { num: "2", title: "The System", eps: "6–10", desc: "How sponsorship actually works: the licence, the CoS, salary thresholds, sponsor duties, and compliance visits." },
  { num: "3", title: "The Numbers", eps: "11–18", desc: "Migration data deep dives covering net migration (898,000 peak), visa volumes, nationality trends, and refusal rates." },
  { num: "4", title: "The NHS Crisis", eps: "19–26", desc: "Health workforce shortages, 78,330 unfilled care roles, international recruitment pipelines, and the brain drain." },
  { num: "5", title: "The Policy Machine", eps: "27–38", desc: "Every rule change from 2020 to 2026, the \"Restoring Control\" White Paper, salary threshold increases from £26,200 to £41,700, and party positions." },
  { num: "6–11", title: "The Human Cost & Beyond", eps: "39–97", desc: "The Human Cost, Country Profiles, Money and Power, Borders and Asylum, What's Next, and Deep Dives (FOI investigations, tribunal patterns)." },
];

/* ── key data points ── */
const dataPoints = [
  { val: "1,948", label: "Sponsor licences revoked in YE June 2025 — highest on record" },
  { val: "898,000", label: "Net migration to the UK in YE June 2023 — highest on record" },
  { val: "78,330", label: "Care roles unfilled as of January 2026" },
  { val: "34,000", label: "Health and care workers estimated in visa limbo" },
  { val: "~50%", label: "Sponsor licence applications now fail (refusal rate 2025–26)" },
  { val: "59%", label: "Salary threshold increase: £26,200 → £41,700 (2023–2025)" },
];

export default function Podcast() {
  const [expandedArc, setExpandedArc] = useState<number | null>(0);

  return (
    <div className="bg-[#0D1B2A] text-white">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#0F2236] to-[#0D1B2A]" />
        {/* Decorative audio wave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
          <svg viewBox="0 0 1200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q150,10 300,50 T600,50 T900,50 T1200,50 V100 H0 Z" fill="#00C3FF" />
          </svg>
        </div>
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C3FF]/10 border border-[#00C3FF]/20 text-[#00C3FF] text-sm font-medium mb-6">
              <Headphones className="w-4 h-4" />
              AI-Native Documentary Podcast
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The Sponsorship Files —{" "}
              <span className="text-[#00C3FF]">UK Immigration Investigated</span>
            </h1>
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4">
              The Sponsorship Files is an AI-native documentary podcast produced by Sponsor ComplIANS that investigates the UK immigration system. From sponsor licence revocations and visa policy changes to NHS workforce crises, net migration data, and the human consequences of enforcement — every episode is built on primary source evidence. Every claim is traced to a Home Office dataset, ONS estimate, court judgment, parliamentary debate, or FOI response.
            </p>
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8">
              With over 30,000 downloads and 11 planned series arcs covering 97 episodes, The Sponsorship Files is the most comprehensive source-cited investigation into UK sponsor licence enforcement, immigration data, and workforce policy available in podcast format.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://sponsorshipfiles.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-teal inline-flex items-center gap-2"
              >
                Listen Now <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://sponsorshipfiles.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors font-medium"
              >
                Subscribe via RSS
              </a>
            </div>
            <div className="flex flex-wrap gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-[#00C3FF]">30,000+</div>
                <div className="text-[#8B9EB7] text-sm mt-1">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-[#00C3FF]">97</div>
                <div className="text-[#8B9EB7] text-sm mt-1">Planned Episodes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-[#00C3FF]">11</div>
                <div className="text-[#8B9EB7] text-sm mt-1">Series Arcs</div>
              </div>
            </div>
          </div>
          {/* Hero image — Sponsorship Files platform screenshot */}
          <div className="hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/sponsorship-files-screenshot_b87704fe.webp"
                alt="The Sponsorship Files — AI-native documentary podcast platform"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/60 via-transparent to-transparent" />
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ═══════ WHY THIS PODCAST EXISTS ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">Why This Podcast Exists</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The Biggest Story in British Public Policy
            </h2>
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4">
              In the year ending June 2025, the Home Office revoked 1,948 sponsor licences — more than double the previous year and more than the entire five-year period from 2019 to 2024 combined. An estimated 34,000 health and care workers are navigating visa limbo. 78,330 care roles sit vacant. The Immigration Salary List is set to expire on 31 December 2026, which could close the health worker route entirely.
            </p>
            <p className="text-[#8B9EB7] text-lg leading-relaxed">
              This is one of the biggest stories in British public policy. The Sponsorship Files exists because no single person can process the volume of documents required to tell it properly. AI can.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ SERIES ARCS ═══════ */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">Series Arcs</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              11 Arcs. 97 Episodes. Every Claim Source-Cited.
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {arcs.map((arc, i) => (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedArc(expandedArc === i ? null : i)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="shrink-0 w-10 h-10 rounded-lg bg-[#00C3FF]/10 flex items-center justify-center text-[#00C3FF] font-bold text-sm">
                    {arc.num}
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold text-[15px]">{arc.title}</span>
                    <span className="text-[#8B9EB7] text-sm ml-2">(Episodes {arc.eps})</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#00C3FF] shrink-0 transition-transform ${expandedArc === i ? "rotate-180" : ""}`} />
                </button>
                {expandedArc === i && (
                  <div className="px-6 pb-5 pl-20 text-[#8B9EB7] text-sm leading-relaxed">
                    {arc.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ KEY DATA POINTS ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">Key Data Points</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Statistics from the Podcast's Research
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataPoints.map((dp, i) => (
              <div key={i} className="bg-[#0D1B2A] border border-white/10 rounded-2xl p-8 text-center hover:border-[#00C3FF]/30 transition-all">
                <div className="text-3xl md:text-4xl font-extrabold text-[#00C3FF] mb-3">{dp.val}</div>
                <p className="text-[#8B9EB7] text-sm leading-relaxed">{dp.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20">
        <div className="container text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00C3FF]/10 mb-6">
            <Headphones className="w-10 h-10 text-[#00C3FF]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Listen to The Sponsorship Files
          </h2>
          <p className="text-[#8B9EB7] text-lg mb-8 max-w-2xl mx-auto">
            Available on Apple Podcasts, Spotify, or any podcast app. Every episode source-cited. Every claim verifiable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://sponsorshipfiles.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-teal inline-flex items-center gap-2"
            >
              Listen Now <ExternalLink className="w-4 h-4" />
            </a>
            <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors font-medium">
              Read Our Blog <ArrowRight className="w-4 h-4" />
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
            "@type": "PodcastSeries",
            name: "The Sponsorship Files",
            description: "AI-native investigative podcast examining UK immigration enforcement, sponsor licence revocations, NHS workforce crises, and policy changes. Every claim source-cited.",
            url: "https://sponsorshipfiles.com",
            author: {
              "@type": "Organization",
              name: "Sponsor ComplIANS",
            },
            numberOfEpisodes: 97,
          }),
        }}
      />
    </div>
  );
}
