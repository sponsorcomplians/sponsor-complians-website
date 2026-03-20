import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import DoughnutChart from "@/components/DoughnutChart";
import {
  ArrowRight, CheckCircle2, ExternalLink, Shield, Monitor,
  Users, Globe, Quote, ClipboardCheck, Zap, FileCheck, BarChart3
} from "lucide-react";

/* ── solution steps ── */
const solutions = [
  {
    num: "1",
    icon: ClipboardCheck,
    title: "Sponsor Compliance Audit",
    body: "A full audit across all 12 compliance areas for every sponsored worker, identifying gaps in documentation, salary compliance, right-to-work records, recruitment evidence, and reporting duties.",
  },
  {
    num: "2",
    icon: Monitor,
    title: "Sponsor ComplIANS Hub Implementation",
    body: "The Sponsor ComplIANS Hub was deployed as Divine's central compliance management platform, tracking all 65 sponsored workers through the complete 12-stage sponsorship lifecycle. The Hub monitors salary compliance in real time, tracks right-to-work check deadlines, calculates document compliance scores, and generates audit-ready reports.",
  },
  {
    num: "3",
    icon: Zap,
    title: "Purpose-Built Care Technology Platform",
    body: "Working alongside Divine's leadership team, Sponsor ComplIANS helped design and implement a purpose-built digital care platform covering intelligent rota management (48 care runs, 2,419 weekly hours), client management with RAG status and risk monitoring, digital care plans with version control, real-time operational dashboards, and automated compliance alerts.",
  },
  {
    num: "4",
    icon: Globe,
    title: "Compliance-Ready Website & Digital Presence",
    body: "Sponsor ComplIANS designed and built a full website at sponsorcompliansdivinecare.com that showcases Divine's technology, compliance systems, care services, and outcomes — providing a digital evidence base that supports regulatory inspections and Home Office assessments.",
  },
];

/* ── key metrics ── */
const metrics = [
  { val: "65", label: "Sponsored workers tracked through the Hub" },
  { val: "100%", label: "Salary compliance — zero shortfalls" },
  { val: "0", label: "Urgent right-to-work alerts" },
  { val: "104+", label: "Active care clients" },
  { val: "2,419", label: "Weekly care hours delivered" },
  { val: "48", label: "Care runs managed" },
  { val: "9.6/10", label: "Rating on homecare.co.uk" },
  { val: "14 days", label: "Time to submit all documentation" },
  { val: "27 days", label: "From initial contact to full clearance" },
];

/* ── what this demonstrates ── */
const demonstrates = [
  { icon: ClipboardCheck, text: "The compliance audit identified every gap before the Home Office could find them." },
  { icon: Monitor, text: "The Sponsor ComplIANS Hub provided real-time monitoring and audit-ready documentation at the moment it was needed." },
  { icon: Zap, text: "The technology platform embedded compliance into daily operations — from rota allocation to salary payments." },
  { icon: Globe, text: "The compliance-ready website provided supporting evidence of systems and processes that regulators could review independently." },
];

export default function CaseStudyDivine() {
  return (
    <div className="bg-[#0D1B2A] text-white">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#122840] to-[#0D1B2A]" />
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[#00C3FF]/5 rounded-full blur-[100px]" />
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C3FF]/10 border border-[#00C3FF]/20 text-[#00C3FF] text-sm font-medium mb-6">
              <FileCheck className="w-4 h-4" />
              Case Study
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.8rem] font-extrabold leading-[1.15] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              How Divine Health Services Achieved{" "}
              <span className="text-[#00C3FF]">100% Sponsor Compliance</span>{" "}
              and Passed a Home Office Check
            </h1>
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4">
              Divine Health Services is a CQC-regulated homecare provider based in Worcestershire, delivering home care, live-in care, complex care, and companionship services across the region. The organisation employs 65 sponsored workers under the Skilled Worker visa route and manages over 104 active clients across 48 care runs, delivering 2,419 hours of care per week.
            </p>
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8">
              Sponsor ComplIANS was engaged to deliver a complete compliance transformation — from a full sponsor compliance audit and breach correction programme to the implementation of the Sponsor ComplIANS Hub software platform and the design of a compliance-ready website and digital presence.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-[#8B9EB7]">
                <CheckCircle2 className="w-4 h-4 text-[#00C3FF]" /> CQC-Regulated
              </div>
              <div className="flex items-center gap-2 text-sm text-[#8B9EB7]">
                <CheckCircle2 className="w-4 h-4 text-[#00C3FF]" /> 65 Sponsored Workers
              </div>
              <div className="flex items-center gap-2 text-sm text-[#8B9EB7]">
                <CheckCircle2 className="w-4 h-4 text-[#00C3FF]" /> Worcestershire
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ THE CHALLENGE ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">The Challenge</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The Same Challenges Facing Most UK Care Providers
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Salary Compliance Risk",
                body: "With 65 sponsored workers across multiple care runs, ensuring every worker was paid at or above their CoS-declared salary every single month required a level of monitoring that manual systems could not reliably deliver.",
              },
              {
                title: "Document Management at Scale",
                body: "Maintaining 60+ document types per sponsored worker across 65 workers means managing thousands of documents, any one of which could trigger a compliance breach if missing, expired, or unsigned.",
              },
              {
                title: "Home Office Readiness",
                body: "The Home Office could request documentation or conduct an on-site visit at any time. Without a centralised system, producing the required evidence within the tight deadlines the Home Office imposes would be extremely difficult.",
              },
              {
                title: "Digital Credibility",
                body: "The organisation needed a professional digital presence that demonstrated its compliance systems, care quality, and technology capabilities to regulators, families, commissioners, and the Home Office itself.",
              },
            ].map((c, i) => (
              <div key={i} className="bg-[#0D1B2A] border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-3 text-white">{c.title}</h3>
                <p className="text-[#8B9EB7] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ THE SOLUTION ═══════ */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">The Solution</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Four Integrated Solutions
            </h2>
          </div>
          <div className="space-y-8 max-w-4xl mx-auto">
            {solutions.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex gap-6 bg-[#0A1628] border border-white/10 rounded-2xl p-8 hover:border-[#00C3FF]/20 transition-all">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-[#00C3FF]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                    <p className="text-[#8B9EB7] leading-relaxed">{s.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ THE RESULT ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="text-center mb-8">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">The Result</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Home Office Compliance Check — Passed
            </h2>
          </div>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4">
              On 10 December 2025, the Home Office initiated a compliance check and requested documentation from Divine Health Services. Using the Sponsor ComplIANS Hub, Divine submitted all requested materials within 14 days.
            </p>
            <p className="text-lg leading-relaxed">
              On 6 January 2026, the Home Office Sponsor Licensing Unit confirmed:{" "}
              <span className="text-[#00C3FF] font-semibold italic">
                "We are satisfied with your representations, and no further action is required."
              </span>
            </p>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {metrics.map((m, i) => (
              <div key={i} className="bg-[#0D1B2A] border border-white/10 rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-[#00C3FF]">{m.val}</div>
                <div className="text-[#8B9EB7] text-xs md:text-sm mt-2">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIAL ═══════ */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00C3FF]/10 mb-6">
              <Quote className="w-8 h-8 text-[#00C3FF]" />
            </div>
            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-6 italic">
              "Now we understand why you're so particular about details, processes, systems, frameworks, and practice — about doing everything before you get a letter. You've changed our lives."
            </blockquote>
            <p className="text-[#8B9EB7]">
              — Divine Health Services leadership team, following Home Office clearance
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ WHAT THIS DEMONSTRATES ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">What This Demonstrates</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Four Products Working Together
            </h2>
            <p className="text-[#8B9EB7] mt-4 max-w-2xl mx-auto">
              The result: a sponsor licence holder that went from potential risk to confirmed compliance in under a month.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {demonstrates.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i} className="flex items-start gap-4 bg-[#0D1B2A] border border-white/10 rounded-xl p-6">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[#00C3FF]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#00C3FF]" />
                  </div>
                  <p className="text-[#8B9EB7] leading-relaxed">{d.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Get the Same Results for Your Organisation
          </h2>
          <p className="text-[#8B9EB7] text-lg mb-8 max-w-2xl mx-auto">
            Whether you need a compliance audit, the Hub platform, or a complete digital transformation — we can help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sponsor-compliance-audit" className="btn-teal inline-flex items-center gap-2">
              Book Your Free Compliance Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/sponsor-complians-hub" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors font-medium">
              Request a Hub Demo
            </Link>
            <a
              href="https://sponsorcompliansdivinecare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors font-medium"
            >
              See the Website <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Case Study: How Divine Health Services Achieved 100% Sponsor Compliance and Passed a Home Office Check",
            datePublished: "2026-01-15",
            author: {
              "@type": "Organization",
              name: "Sponsor ComplIANS",
            },
            about: {
              "@type": "Organization",
              name: "Divine Health Services",
              description: "CQC-regulated homecare provider in Worcestershire with 65 sponsored workers",
            },
          }),
        }}
      />
    </div>
  );
}
