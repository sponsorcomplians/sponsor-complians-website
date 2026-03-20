import { useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import {
  Globe, Shield, Monitor, Users, Star, FileText,
  ArrowRight, CheckCircle2, ExternalLink, Megaphone, ChevronDown,
  Layout, Award, Briefcase, Search,
} from "lucide-react";

/* ── FAQ data ── */
const faqs = [
  { q: "What is a GEO-optimised website?", a: "A GEO-optimised website is designed to rank in both traditional search engines and AI-powered search tools like ChatGPT, Perplexity, and Google AI Overviews. It uses structured data, semantic HTML, FAQ schema markup, and authoritative content to ensure your organisation is cited when users ask questions about care services in your area." },
  { q: "How long does it take to build a website?", a: "A standard provider website takes 4 to 6 weeks from initial briefing to launch. This includes design, content creation, development, testing, and SEO optimisation. Urgent builds can be expedited for an additional fee." },
  { q: "Do you write the content for us?", a: "Yes. All packages include professional copywriting tailored to your services, location, and target audience. Our content is GEO-optimised to rank in both search engines and AI systems, and includes blog articles, service descriptions, and FAQ content." },
  { q: "Can you redesign our existing website?", a: "Yes. We can redesign your existing website to meet current SEO and GEO standards. We audit your current site, identify improvement opportunities, and rebuild it with modern design, structured data, and AI-discoverable content." },
  { q: "Do you provide ongoing maintenance?", a: "Yes. All packages include a period of post-launch support. We also offer ongoing maintenance plans that cover content updates, security patches, performance monitoring, and monthly SEO reporting." },
  { q: "Will the website work on mobile devices?", a: "Yes. All our websites are fully responsive and optimised for mobile, tablet, and desktop devices. Mobile performance is a key ranking factor for both Google and AI search systems." },
  { q: "Do you include SEO as standard?", a: "Yes. Every website we build includes on-page SEO optimisation, including meta tags, structured data (Organisation schema, FAQ schema, LocalBusiness schema), image optimisation, and internal linking. Our GEO approach goes beyond traditional SEO to ensure AI discoverability." },
  { q: "Can you help with Google Business Profile?", a: "Yes. We can set up or optimise your Google Business Profile as part of the website project. This includes accurate business information, service descriptions, photos, and review management guidance." },
  { q: "What CMS do you use?", a: "We build websites using modern frameworks that prioritise speed, security, and SEO performance. The specific technology depends on your requirements, but all sites include a content management system that allows you to update text, images, and blog posts without technical knowledge." },
  { q: "How do I get started?", a: "Book a free consultation call where we discuss your requirements, review your current online presence, and recommend the right package for your organisation. Contact us at admin@sponsorcomplians.com or call 020 3618 6968." },
];

/* ── Featured website showcase items ── */
const showcaseWebsites = [
  {
    title: "Sponsor ComplIANS",
    subtitle: "Main Company Website",
    description: "Our flagship website — sponsor licence compliance, Skilled Worker recruitment, and HR solutions for UK employers. GEO-optimised for AI discovery with FAQ schema, Organisation schema, and structured content.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/sponsorcomplians_2026-03-20_07-09-32_2915_d4a1faf3.webp",
    url: "https://sponsorcomplians.com",
    tags: ["GEO-Optimised", "AI-Discoverable", "Full SEO"],
  },
  {
    title: "Sponsor ComplIANS Hub",
    subtitle: "SaaS Compliance Platform",
    description: "The complete compliance management platform for UK care providers. Tracks 61 SW documents, monitors RTW expiries, salary compliance, rota analysis, and maintains an immutable audit trail — all in one place.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/sponsorcomplianshub_2026-03-20_07-09-56_7433_515d099c.webp",
    url: "/sponsor-complians-hub",
    isInternal: true,
    launchDate: "Platform Launch — 1 April 2026",
    tags: ["SaaS Platform", "Dashboard UI", "Founding Members"],
  },
  {
    title: "Divine Health Services",
    subtitle: "Client Website — CQC-Regulated Care Provider",
    description: "A compliance-ready website built for a CQC-regulated homecare provider in Worcestershire with 65 sponsored workers. Features real production screenshots, 9.6/10 homecare.co.uk rating integration, and CQC-aligned service pages.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/sponsorcompliansdivi_2026-03-20_07-10-16_9692_d665a3c1.webp",
    url: "https://sponsorcompliansdivinecare.com",
    tags: ["Healthcare", "CQC-Aligned", "Testimonials"],
  },
  {
    title: "The Sponsorship Files",
    subtitle: "AI-Native Documentary Podcast",
    description: "An investigative podcast platform documenting the UK immigration system — from sponsor licence revocations to net migration data. Features 75+ episodes, enforcement data explorer, policy timeline, and 100% source-cited content.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/sponsorshipfiles_2026-03-20_07-10-27_9083_3f0b0f43.webp",
    url: "https://sponsorshipfiles.com",
    tags: ["Podcast", "Data-Driven", "AI-Native"],
  },
];

/* ── what we build (for icon cards) ── */
const services = [
  {
    icon: Shield,
    title: "Compliance Showcase Pages",
    body: "Dedicated pages that demonstrate your sponsor compliance systems, HR processes, salary monitoring tools, right-to-work tracking, and recruitment frameworks. These pages show regulators and the Home Office that your business has the infrastructure they expect — before they even visit.",
  },
  {
    icon: Monitor,
    title: "Technology Platform Showcases",
    body: "If you use the Sponsor ComplIANS Hub or any compliance management system, we build dedicated technology pages that showcase your platform's capabilities — from rota management and salary compliance monitoring to document tracking and sponsorship lifecycle management. Real screenshots (GDPR-compliant), real data points, real proof.",
  },
  {
    icon: FileText,
    title: "CQC-Aligned Service Pages",
    body: "Service pages structured around CQC inspection frameworks: Safe, Effective, Caring, Responsive, and Well-Led. Each service page is written to demonstrate how your care delivery meets regulatory standards, with specific evidence and outcomes.",
  },
  {
    icon: Users,
    title: "Careers & Recruitment Pages",
    body: "Compliant recruitment pages that clearly state sponsorship availability, salary, hours, location, and role requirements for every vacancy — meeting Home Office genuine vacancy requirements and attracting the right candidates.",
  },
  {
    icon: Star,
    title: "Client Testimonial Integration",
    body: "Verified reviews pulled from platforms like homecare.co.uk, with proper attribution, star ratings, and dates. Real testimonials from real families, presented professionally.",
  },
  {
    icon: Megaphone,
    title: "Blog & Content Marketing",
    body: "GEO-optimised blog content that positions your organisation as an authority in your sector, drives organic traffic, and ensures AI systems cite your content when users ask questions about care services in your area.",
  },
];

/* ── pricing tiers ── */
const pricing = [
  {
    tier: "Starter",
    pages: "8–12 pages",
    desc: "Core service pages, contact form, and basic compliance showcase.",
    features: ["Responsive design", "SEO optimisation", "Contact form", "Basic compliance page", "FAQ schema markup"],
  },
  {
    tier: "Professional",
    pages: "15–25 pages",
    highlight: true,
    desc: "Full technology showcase, CQC-aligned service pages, blog, careers section, testimonial integration, and compliance evidence pages.",
    features: ["Everything in Starter", "Technology showcase", "CQC-aligned pages", "Blog & careers", "Testimonial integration", "Organisation schema"],
  },
  {
    tier: "Enterprise",
    pages: "25+ pages",
    desc: "Custom design, full Sponsor ComplIANS Hub integration, ongoing content marketing, GEO-optimised blog posts, and quarterly content updates.",
    features: ["Everything in Professional", "Custom design", "Hub integration", "Ongoing content marketing", "GEO-optimised blog", "Quarterly updates"],
  },
];

export default function ProviderWebsites() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);


  return (
    <div className="bg-[#0D1B2A] text-white">
      {/* ═══════ HERO — text RIGHT, screenshot LEFT ═══════ */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#122840] to-[#0D1B2A]" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-[#00C3FF]/5 rounded-full blur-[120px]" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT — Dashboard Screenshot */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#00C3FF]/10 border border-white/10">
                <img
                  src={IMAGES.rtwCalendar}
                  alt="Sponsor ComplIANS Hub — RTW & Calendar compliance monitoring dashboard"
                  className="w-full h-auto"
                  loading="eager"
                />
                {/* Floating stat badge */}
                <div className="absolute bottom-4 left-4 bg-[#0D1B2A]/90 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00C3FF]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#00C3FF]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Featured Client</div>
                    <div className="text-xs text-[#8B9EB7]">Divine Health Services</div>
                  </div>
                </div>
              </div>
              {/* Decorative glow behind image */}
              <div className="absolute -inset-4 bg-[#00C3FF]/5 rounded-3xl blur-2xl -z-10" />
            </div>

            {/* RIGHT — Text content */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C3FF]/10 border border-[#00C3FF]/20 text-[#00C3FF] text-sm font-medium mb-6">
                <Globe className="w-4 h-4" />
                Compliance-Ready Digital Presence
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Compliance-Ready Websites for{" "}
                <span className="text-[#00C3FF]">UK Care Providers and Sponsor Licence Holders</span>
              </h1>
              <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4">
                Sponsor ComplIANS builds purpose-designed websites for care providers, healthcare organisations, and other UK sponsor licence holders. These are not generic business websites — they are compliance-ready digital platforms built to showcase the systems, processes, and evidence that regulators, the Home Office, families, and commissioners expect to see.
              </p>
              <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8">
                Every website we build is informed by our experience conducting over 100 sponsor compliance audits and preparing care providers for Home Office visits. We know exactly what compliance officers look for, what CQC inspectors want to see, and what families need to trust a provider. We build websites that demonstrate all three.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-teal inline-flex items-center gap-2">
                  Request a Quote <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://sponsorcompliansdivinecare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors font-medium"
                >
                  See Divine Health Services Example <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ WHY USE OUR PROVIDER WEBSITE SERVICE ═══════ */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C9A7] text-xs font-bold tracking-[2px] uppercase block mb-3">Why Our Websites</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Why Your Website Is a Compliance Asset — Not Just a Marketing Page
            </h2>
            <p className="text-[#4A5568] text-lg leading-relaxed max-w-3xl mx-auto">
              When the Home Office conducts a compliance check, they do not just review your files. They review your business. They look at your website to understand your operations, your services, your workforce structure, and your systems. A website that shows generic stock photos and a contact form tells them nothing. A website that showcases your compliance technology, your recruitment process, your training framework, and your HR systems tells them you are serious about sponsor duties. We build websites that work as compliance evidence — because we know exactly what regulators look for.
            </p>
          </div>

          {/* Bento Grid — 2 cards top */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow md:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                <Layout className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Showcase Your Compliance Systems
              </h3>
              <p className="text-[#4A5568] text-sm leading-relaxed">
                We build dedicated technology and compliance pages that display your monitoring infrastructure: how you track sponsored workers, how you verify salary compliance, how you manage right-to-work checks, how you monitor visa expiry dates, and how you maintain the 65-document personnel file for every worker. Divine Health Services' technology page shows their Sponsor Compliance Hub with real production screenshots — 65 sponsored workers tracked, 100% salary compliant, 12-stage sponsorship lifecycle documented. When the Home Office reviewed their systems, they confirmed satisfaction with no further action required.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                <Award className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Demonstrate QSE Compliance Publicly
              </h3>
              <p className="text-[#4A5568] text-sm leading-relaxed">
                The Home Office expects every sponsored worker to hold the qualifications, skills, and experience required for their role. Our provider websites include pages that evidence your training framework — showing the 17 Care Certificate modules your workers complete (SW039–SW055), your induction process (SW038), your supervision and appraisal structure (SW062–SW063), and your ongoing professional development programme. This is public proof that your workforce meets the standard.
              </p>
            </div>
          </div>

          {/* 3 standard cards bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                <Briefcase className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Compliant Careers and Recruitment Pages
              </h3>
              <p className="text-[#4A5568] text-sm leading-relaxed">
                Your careers page is part of your genuine vacancy evidence. When the Home Office asks whether a role was genuinely advertised, your website is the first place they check. We build careers pages that show every vacancy with SOC code, salary, hours, location, and sponsorship status — matching the exact format the Home Office expects. Each listing is date-stamped and stored, creating a permanent record of when and where the role was advertised.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                <Star className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Real Testimonials from Verified Platforms
              </h3>
              <p className="text-[#4A5568] text-sm leading-relaxed">
                Trust is built through evidence, not claims. We integrate verified reviews from platforms like homecare.co.uk — with full attribution, star ratings, dates, and reviewer details. Divine Health Services displays 16 verified reviews with a 9.6/10 rating. This demonstrates to families, commissioners, and regulators that your care delivery matches your compliance claims.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#00C9A7]/10 flex items-center justify-center mb-5">
                <Search className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                GEO-Optimised for AI Discovery
              </h3>
              <p className="text-[#4A5568] text-sm leading-relaxed">
                Every website we build is structured using Generative Engine Optimisation (GEO) principles — so AI systems like ChatGPT, Perplexity, and Google AI Overviews can discover, extract, and cite your content. This means when someone asks an AI "Who are the best homecare providers in Worcestershire?" or "Which care providers sponsor Skilled Workers?", your website is designed to be the answer. We add FAQ schema, Organisation schema, and structured content that AI systems prioritise.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#00C9A7] py-14">
          <div className="container text-center">
            <p className="text-[#0D1B2A] text-xl md:text-2xl font-bold mb-6 max-w-4xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Your website is the first thing families see, the first thing the CQC reviews, and the first thing the Home Office checks. Make sure it tells the right story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://sponsorcompliansdivinecare.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#1B3A5C] transition-colors">
                See the Divine Health Services Example <ExternalLink className="w-4 h-4" />
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-[#0D1B2A] text-[#0D1B2A] px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#0D1B2A]/10 transition-colors">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ THE PROBLEM ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">The Problem We Solve</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Generic Websites Don't Demonstrate Compliance
            </h2>
            <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4">
              Most care providers have websites that look generic, say nothing about compliance, and fail to demonstrate the systems that regulators assess. When a Home Office compliance officer or CQC inspector reviews your digital presence, they should see evidence of robust processes — not a template site with stock photos.
            </p>
            <p className="text-[#8B9EB7] text-lg leading-relaxed">
              Similarly, when families search for a care provider, they want to see real testimonials, transparent pricing, technology that proves quality, and credentials that build trust. A compliance-ready website delivers all of this.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ WHAT WE BUILD — centred icons ═══════ */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">What We Build</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Purpose-Built for Regulators, Families, and the Home Office
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="group bg-[#0A1628] border border-white/10 rounded-2xl p-8 hover:border-[#00C3FF]/30 transition-all duration-300 text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#00C3FF]/20 transition-colors">
                    <Icon className="w-7 h-7 text-[#00C3FF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-[#8B9EB7] text-sm leading-relaxed">{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ CASE STUDY: DIVINE — with screenshot ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT — Screenshot */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-[#00C3FF]/10 border border-white/10">
                <img
                  src={IMAGES.rtwCalendar}
                  alt="Sponsor ComplIANS Hub — RTW & Calendar compliance monitoring dashboard"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#0D1B2A] border border-[#00C3FF]/30 rounded-xl px-5 py-3 shadow-lg">
                <div className="text-[#00C3FF] text-2xl font-extrabold">9.6/10</div>
                <div className="text-[#8B9EB7] text-xs">Homecare.co.uk Rating</div>
              </div>
            </div>

            {/* RIGHT — Case study text */}
            <div>
              <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">Case Study</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Divine Health Services — A Complete Digital Presence
              </h2>
              <p className="text-[#8B9EB7] leading-relaxed mb-4">
                Sponsor ComplIANS designed and built the complete digital presence for Divine Health Services, a CQC-regulated homecare provider in Worcestershire with 65 sponsored workers and over 104 active clients.
              </p>
              <p className="text-[#8B9EB7] leading-relaxed mb-6">
                We built a full website at sponsorcompliansdivinecare.com including a homepage with service overview, trust badges, and 9.6/10 homecare.co.uk rating integration; a detailed "Our Technology" page showcasing their purpose-built care platform with real production screenshots (GDPR-compliant); a "Case Study" page documenting their Home Office compliance check outcome; service pages covering home care, live-in care, complex care, companionship, night care, and respite care; a costs and funding section with transparent pricing; a careers page with sponsored worker roles; 16 verified homecare.co.uk testimonials with full attribution; and a blog with care guidance articles.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { val: "104+", label: "Active Clients" },
                  { val: "2,419", label: "Weekly Care Hours" },
                  { val: "65", label: "Sponsored Workers" },
                  { val: "9.6/10", label: "Homecare.co.uk Rating" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-extrabold text-[#00C3FF]">{s.val}</div>
                    <div className="text-[#8B9EB7] text-sm mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/case-studies/divine-health-services" className="inline-flex items-center gap-2 text-[#00C3FF] hover:underline font-medium">
                  Read the Full Case Study <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://sponsorcompliansdivinecare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#8B9EB7] hover:text-white font-medium"
                >
                  Visit the Website <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ WEBSITE SHOWCASE ═══════ */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">Our Work</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Websites We've Built
            </h2>
            <p className="text-[#8B9EB7] mt-4 max-w-2xl mx-auto">
              Every website below was designed, built, and launched by Sponsor ComplIANS. Click to visit each live site.
            </p>
          </div>

          {/* 2x2 Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {showcaseWebsites.map((site, i) => {
              const isInternal = "isInternal" in site && site.isInternal;
              const linkProps = isInternal
                ? {}
                : { target: "_blank" as const, rel: "noopener noreferrer" };
              const Wrapper = isInternal ? Link : "a";
              return (
                <Wrapper
                  key={i}
                  href={site.url}
                  {...linkProps}
                  className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-[#00C3FF]/30 transition-all duration-500 bg-[#0A1628]"
                >
                  {/* Screenshot */}
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img
                      src={site.image}
                      alt={site.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Visit overlay */}
                    <div className="absolute inset-0 bg-[#0D1B2A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 bg-[#00C3FF] text-[#0D1B2A] px-6 py-3 rounded-lg font-semibold text-sm">
                        {isInternal ? "View Details" : "Visit Live Site"} <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                    {/* Launch date badge */}
                    {"launchDate" in site && site.launchDate && (
                      <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C3FF]/90 text-[#0D1B2A] text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#0D1B2A] animate-pulse" />
                        {site.launchDate}
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#00C3FF] transition-colors">{site.title}</h3>
                        <p className="text-[#00C3FF] text-sm font-medium mt-1">{site.subtitle}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-[#8B9EB7] group-hover:text-[#00C3FF] transition-colors shrink-0 mt-1" />
                    </div>
                    <p className="text-[#8B9EB7] text-sm leading-relaxed mt-3 mb-4">{site.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {site.tags.map((tag, j) => (
                        <span key={j} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#8B9EB7] text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Packages for Every Provider
            </h2>
            <p className="text-[#8B9EB7] mt-4 max-w-2xl mx-auto">
              All packages include responsive design, SEO optimisation, FAQ schema markup, and Organisation schema for AI discoverability.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((p, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 border transition-all ${
                  p.highlight
                    ? "bg-[#00C3FF]/5 border-[#00C3FF]/30 scale-[1.02]"
                    : "bg-[#0D1B2A] border-white/10"
                }`}
              >
                {p.highlight && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#00C3FF]/20 text-[#00C3FF] text-xs font-semibold mb-4">Most Popular</span>
                )}
                <h3 className="text-2xl font-bold mb-1">{p.tier}</h3>
                <p className="text-[#00C3FF] font-semibold mb-3">{p.pages}</p>
                <p className="text-[#8B9EB7] text-sm leading-relaxed mb-6">{p.desc}</p>
                <ul className="space-y-2 mb-8">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[#8B9EB7]">
                      <CheckCircle2 className="w-4 h-4 text-[#00C3FF] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                  p.highlight
                    ? "btn-teal"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}>
                  Request a Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-4 block">FAQ</span>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-[15px] pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#00C3FF] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-[#8B9EB7] text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 bg-[#0A1628]">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Ready to Build Your Compliance-Ready Website?
          </h2>
          <p className="text-[#8B9EB7] text-lg mb-8 max-w-2xl mx-auto">
            See what we built for Divine Health Services, then let us build the same for your organisation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-teal inline-flex items-center gap-2">
              Request a Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://sponsorcompliansdivinecare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors font-medium"
            >
              See the Example <ExternalLink className="w-4 h-4" />
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
            "@type": "Service",
            name: "Compliance-Ready Provider Websites",
            description: "Purpose-built websites for UK care providers and sponsor licence holders that showcase compliance systems, CQC alignment, and technology capabilities.",
            provider: {
              "@type": "Organization",
              name: "Sponsor ComplIANS",
              url: "https://sponsorcomplians.com",
            },
          }),
        }}
      />
    </div>
  );
}
