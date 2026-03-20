/*
 * Advertise.tsx — ComplIANS Jobs Advertising Plans & Pricing
 * ALL CONTENT IS GEO-OPTIMISED — USE VERBATIM, DO NOT REWRITE
 * Design: Hub palette #0D1B2A / #1B3A5C / #00C3FF / #00C9A7 / #F5F7FA
 * 6 sections: Hero, Pricing Cards, Comparison Table, Why ComplIANS Jobs, CTA Banner, FAQ
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  ArrowRight, ChevronDown, Check, X,
  ShieldCheck, FileText, BadgeCheck, Users,
  Zap, Crown, Briefcase, Star,
} from "lucide-react";

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

/* ─── FAQ Accordion ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1B3A5C]/40">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="text-white font-semibold text-lg pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#00C3FF] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[600px] pb-5" : "max-h-0"}`}>
        <p className="text-white/70 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ─── Pricing Plans Data ─── */
const plans = [
  {
    name: "Free",
    price: "£0",
    period: "/listing",
    subtitle: "Up to 3 per month · 30 days live",
    desc: "Ideal for sponsors posting occasional vacancies.",
    icon: Briefcase,
    highlighted: false,
    badge: null,
    cta: "Post for Free",
    ctaLink: "/jobs",
    stripeProductKey: null,
    features: [
      { text: "Job listing with title, salary, location, hours", included: true },
      { text: "SOC code and RQF level displayed", included: true },
      { text: "Sponsorship status badge", included: true },
      { text: "Employer profile page", included: true },
      { text: "Direct applications", included: true },
      { text: "Basic analytics (views & clicks)", included: true },
    ],
  },
  {
    name: "Sponsored",
    price: "£149",
    period: "/listing",
    subtitle: "Or £349/month unlimited · 60 days live",
    desc: "For sponsors hiring regularly who need faster results.",
    icon: Zap,
    highlighted: false,
    badge: null,
    cta: "Sponsor Your Listing",
    ctaLink: null,
    stripeProductKey: "sponsored",
    features: [
      { text: "Everything in Free, plus:", included: true, isHeader: true },
      { text: "Priority search placement", included: true },
      { text: "Weekly candidate email alerts", included: true },
      { text: "\"Urgently Hiring\" badge", included: true },
      { text: "Company logo & brand colours", included: true },
      { text: "Screening questions (up to 5)", included: true },
      { text: "Candidate shortlist dashboard", included: true },
      { text: "Advanced analytics", included: true },
    ],
  },
  {
    name: "Premium",
    price: "£449",
    period: "/listing",
    subtitle: "Or £999/month unlimited · 90 days live",
    desc: "For sponsors with urgent or hard-to-fill roles.",
    icon: Crown,
    highlighted: true,
    badge: "MOST POPULAR",
    cta: "Go Premium",
    ctaLink: null,
    stripeProductKey: "premium",
    features: [
      { text: "Everything in Sponsored, plus:", included: true, isHeader: true },
      { text: "\"Premium Employer\" verified badge", included: true },
      { text: "AI candidate matching", included: true },
      { text: "Compliance Document Pack:", included: true, isHeader: true },
      { text: "SOC-validated job description", included: true },
      { text: "Genuine vacancy checklist", included: true },
      { text: "Interview scoring matrix", included: true },
      { text: "Recruitment audit trail template", included: true },
      { text: "SOC code validation check", included: true },
      { text: "Salary threshold compliance check", included: true },
      { text: "Social media promotion", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Priority support (24hr)", included: true },
    ],
  },
  {
    name: "Managed Recruitment",
    price: "From £2,495",
    period: "/hire",
    subtitle: "Full end-to-end compliant recruitment.",
    desc: "For sponsors who want the entire process handled.",
    icon: Star,
    highlighted: false,
    badge: null,
    cta: "Get Managed Recruitment",
    ctaLink: null,
    stripeProductKey: "managed",
    features: [
      { text: "Everything in Premium, plus:", included: true, isHeader: true },
      { text: "Dedicated recruitment consultant", included: true },
      { text: "Compliant JD written for you", included: true },
      { text: "Candidate sourcing (multi-channel)", included: true },
      { text: "3–5 screened, compliance-checked CVs", included: true },
      { text: "Interview coordination & scoring", included: true },
      { text: "CoS assignment review", included: true },
      { text: "Complete audit-ready recruitment file", included: true },
      { text: "Salary benchmarking report", included: true },
      { text: "30-day post-placement support", included: true },
    ],
  },
];

/* ─── Comparison Table Data ─── */
const comparisonFeatures = [
  { feature: "Listings per month", free: "3", sponsored: "Unlimited (£349/mo)", premium: "Unlimited (£999/mo)", managed: "Per hire" },
  { feature: "Listing duration", free: "30 days", sponsored: "60 days", premium: "90 days", managed: "Until filled" },
  { feature: "SOC code displayed", free: true, sponsored: true, premium: true, managed: true },
  { feature: "Sponsorship badge", free: true, sponsored: true, premium: true, managed: true },
  { feature: "Basic analytics", free: true, sponsored: true, premium: true, managed: true },
  { feature: "Priority search placement", free: false, sponsored: true, premium: true, managed: true },
  { feature: "Email alerts to candidates", free: false, sponsored: true, premium: true, managed: true },
  { feature: "Urgently Hiring badge", free: false, sponsored: true, premium: true, managed: true },
  { feature: "Screening questions", free: false, sponsored: true, premium: true, managed: true },
  { feature: "Candidate shortlist dashboard", free: false, sponsored: true, premium: true, managed: true },
  { feature: "Advanced analytics", free: false, sponsored: true, premium: true, managed: true },
  { feature: "Company logo & branding", free: false, sponsored: true, premium: true, managed: true },
  { feature: "AI candidate matching", free: false, sponsored: false, premium: true, managed: true },
  { feature: "Compliance Document Pack", free: false, sponsored: false, premium: true, managed: true },
  { feature: "SOC code validation check", free: false, sponsored: false, premium: true, managed: true },
  { feature: "Salary threshold check", free: false, sponsored: false, premium: true, managed: true },
  { feature: "Social media promotion", free: false, sponsored: false, premium: true, managed: true },
  { feature: "Dedicated account manager", free: false, sponsored: false, premium: true, managed: true },
  { feature: "Full candidate sourcing", free: false, sponsored: false, premium: false, managed: true },
  { feature: "Screened CVs delivered", free: false, sponsored: false, premium: false, managed: true },
  { feature: "Interview coordination", free: false, sponsored: false, premium: false, managed: true },
  { feature: "CoS assignment review", free: false, sponsored: false, premium: false, managed: true },
  { feature: "Complete audit-ready file", free: false, sponsored: false, premium: false, managed: true },
];

const CellValue = ({ val }: { val: boolean | string }) => {
  if (typeof val === "string") return <span className="text-sm font-medium text-[#0D1B2A]">{val}</span>;
  return val ? <Check className="w-5 h-5 text-[#00C9A7] mx-auto" /> : <X className="w-5 h-5 text-[#0D1B2A]/20 mx-auto" />;
};

export default function Advertise() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="-mt-[108px] pt-[108px]">

      {/* ═══ SECTION 1 — HERO (shorter) ═══ */}
      <section className="relative bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#132B47] py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #00C9A7 0%, transparent 50%), radial-gradient(circle at 70% 30%, #00C3FF 0%, transparent 40%)" }} />
        <div className="container max-w-4xl relative z-10 text-center">
          <Reveal>
            <p className="text-[#00C3FF] text-sm font-bold tracking-widest uppercase mb-4">Pricing</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              ComplIANS Jobs Advertising Plans
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              From free listings to full managed recruitment. Every plan builds the compliance evidence trail the Home Office expects.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 2 — PRICING CARDS ═══ */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="container max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`rounded-2xl p-6 flex flex-col h-full relative ${
                  plan.highlighted
                    ? "bg-[#0D1B2A] text-white border-2 border-[#00C3FF] shadow-2xl shadow-[#00C3FF]/10 scale-[1.02]"
                    : "bg-white text-[#0D1B2A] border border-[#0D1B2A]/8 shadow-sm hover:shadow-lg"
                } transition-all`}>
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00C9A7] text-[#0D1B2A] text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-4 mt-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.highlighted ? "bg-[#00C3FF]/15" : "bg-[#0D1B2A]/5"}`}>
                      <plan.icon className={`w-5 h-5 ${plan.highlighted ? "text-[#00C3FF]" : "text-[#0D1B2A]"}`} />
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-[#0D1B2A]"}`}>{plan.name}</h3>
                  <div className="mb-1">
                    <span className={`text-3xl font-extrabold ${plan.highlighted ? "text-white" : "text-[#0D1B2A]"}`}>{plan.price}</span>
                    <span className={`text-sm ${plan.highlighted ? "text-white/60" : "text-[#0D1B2A]/50"}`}> {plan.period}</span>
                  </div>
                  <p className="text-xs mb-3 text-[#00C3FF] font-medium">{plan.subtitle}</p>
                  <p className={`text-sm mb-6 ${plan.highlighted ? "text-white/60" : "text-[#0D1B2A]/60"}`}>{plan.desc}</p>

                  <div className="space-y-3 flex-1 mb-6">
                    {plan.features.map((f, fi) => (
                      <div key={fi} className="flex items-start gap-2.5">
                        {f.included ? (
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? "text-[#00C9A7]" : "text-[#00C9A7]"}`} />
                        ) : (
                          <X className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? "text-white/20" : "text-[#0D1B2A]/20"}`} />
                        )}
                        <span className={`text-sm ${
                          !f.included
                            ? (plan.highlighted ? "text-white/30 line-through" : "text-[#0D1B2A]/30 line-through")
                            : ('isHeader' in f && f.isHeader)
                              ? (plan.highlighted ? "text-[#00C3FF] font-semibold" : "text-[#00C3FF] font-semibold")
                              : (plan.highlighted ? "text-white/80" : "text-[#0D1B2A]/70")
                        }`}>{f.text}</span>
                      </div>
                    ))}
                  </div>

                  {plan.stripeProductKey ? (
                    <button
                      onClick={async () => {
                        toast.info("Redirecting to checkout...");
                        try {
                          const res = await fetch("/api/stripe/checkout", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ productKey: plan.stripeProductKey }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            window.open(data.url, "_blank");
                          } else {
                            toast.error(data.error || "Failed to create checkout session");
                          }
                        } catch {
                          toast.error("Failed to connect to payment service");
                        }
                      }}
                      className={`block w-full text-center font-bold py-3 px-6 rounded-lg transition-all cursor-pointer ${
                        plan.highlighted
                          ? "bg-[#00C9A7] text-[#0D1B2A] hover:bg-[#00C9A7]/90"
                          : "border-2 border-[#00C9A7] text-[#00C9A7] hover:bg-[#00C9A7]/10"
                      }`}
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <Link
                      href={plan.ctaLink || "/jobs"}
                      className="block text-center font-bold py-3 px-6 rounded-lg transition-all border-2 border-[#00C9A7] text-[#00C9A7] hover:bg-[#00C9A7]/10"
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3 — COMPARISON TABLE ═══ */}
      <section className="bg-white py-20">
        <div className="container max-w-7xl">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1B2A] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Compare All Plans</h2>
              <p className="text-[#0D1B2A]/60 text-lg max-w-2xl mx-auto">Full feature comparison across all tiers</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#0D1B2A]/10">
                    <th className="text-left py-4 px-4 text-[#0D1B2A] font-bold text-sm w-1/4">Feature</th>
                    <th className="text-center py-4 px-3 text-[#0D1B2A] font-bold text-sm">Free</th>
                    <th className="text-center py-4 px-3 text-[#0D1B2A] font-bold text-sm">Sponsored</th>
                    <th className="text-center py-4 px-3 text-[#0D1B2A] font-bold text-sm bg-[#00C3FF]/5 rounded-t-lg">Premium</th>
                    <th className="text-center py-4 px-3 text-[#0D1B2A] font-bold text-sm">Managed</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, i) => (
                    <tr key={i} className="border-b border-[#0D1B2A]/5 hover:bg-[#F5F7FA]/50 transition-colors">
                      <td className="py-3.5 px-4 text-sm text-[#0D1B2A]/80 font-medium">{row.feature}</td>
                      <td className="py-3.5 px-3 text-center"><CellValue val={row.free} /></td>
                      <td className="py-3.5 px-3 text-center"><CellValue val={row.sponsored} /></td>
                      <td className="py-3.5 px-3 text-center bg-[#00C3FF]/5"><CellValue val={row.premium} /></td>
                      <td className="py-3.5 px-3 text-center"><CellValue val={row.managed} /></td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#0D1B2A]/10 font-bold">
                    <td className="py-4 px-4 text-sm text-[#0D1B2A]">Price</td>
                    <td className="py-4 px-3 text-center text-sm text-[#0D1B2A]">£0</td>
                    <td className="py-4 px-3 text-center text-sm text-[#0D1B2A]">£149/listing</td>
                    <td className="py-4 px-3 text-center text-sm text-[#0D1B2A] bg-[#00C3FF]/5 rounded-b-lg">£449/listing</td>
                    <td className="py-4 px-3 text-center text-sm text-[#0D1B2A]">From £2,495/hire</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 4 — WHY SPONSORS CHOOSE COMPLIANS JOBS ═══ */}
      <section className="bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#132B47] py-20">
        <div className="container max-w-7xl">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Why Sponsors Choose ComplIANS Jobs
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: ShieldCheck, title: "Compliance Built In, Not Bolted On", desc: "Every listing generates recruitment evidence that satisfies the Home Office's genuine vacancy requirements." },
              { icon: FileText, title: "SOC Code and Salary Validation", desc: "Premium listings are checked before publication — catching errors that cause CoS refusals." },
              { icon: BadgeCheck, title: "Only Verified Sponsors", desc: "Every employer holds a current Home Office sponsor licence. Candidates know every listing is legitimate." },
              { icon: Users, title: "Niche Audience, Better Results", desc: "Your vacancy reaches candidates specifically seeking sponsored work — not competing with millions of generic listings." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#1B3A5C]/30 border border-[#1B3A5C]/50 rounded-xl p-8 hover:border-[#00C3FF]/40 transition-colors h-full">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-[#00C3FF]/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-7 h-7 text-[#00C3FF]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-white/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5 — CTA BANNER ═══ */}
      <section className="bg-[#00C9A7] py-16">
        <div className="container max-w-4xl text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1B2A] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Ready to Hire Compliantly?
            </h2>
            <p className="text-[#0D1B2A]/70 text-lg mb-8 max-w-2xl mx-auto">
              Post your first vacancy for free. Upgrade anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/jobs" className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#0D1B2A]/90 transition-all text-lg">
                Post a Free Vacancy <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/skilled-worker-recruitment-solutions" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-all text-lg">
                Talk to Our Recruitment Team
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 6 — FAQ ═══ */}
      <section className="bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#132B47] py-20">
        <div className="container max-w-3xl">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Frequently Asked Questions</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              {/* Jobs page FAQs */}
              <FAQItem q="Is it really free to post a job?" a="Yes. Every UK sponsor licence holder can post up to 3 vacancies per month at no cost. Free listings are live for 30 days and appear in search results for all candidates." />
              <FAQItem q="Do I need a sponsor licence to post?" a="Yes. ComplIANS Jobs is exclusively for employers who hold a current Home Office sponsor licence. Your licence number is verified during registration." />
              <FAQItem q="How do you vet candidates?" a="Every candidate is assessed against our 65-document compliance framework covering immigration status, right-to-work documentation, qualifications and skills evidence (including Care Certificate modules for care roles), English language proficiency, references, and police clearance." />
              <FAQItem q="Where do your candidates come from?" a="Three channels: our network of 500+ sponsor licence holder clients (including workers from revoked sponsors who need new compliant employers), our Sponsorship Files podcast audience (30,000+ downloads), and our compliance webinar and newsletter community (2,500+ subscribers)." />
              <FAQItem q="How is this different from Indeed?" a="Indeed is a general job board. ComplIANS Jobs is purpose-built for sponsor licence holders. Every listing shows SOC code, salary threshold compliance, and sponsorship status. Only verified sponsors can post. Premium listings include SOC code validation, salary checks, and a Compliance Document Pack." />
              <FAQItem q="Can I use ComplIANS Jobs and Indeed together?" a="Yes. Use Indeed for volume and reach. Use ComplIANS Jobs for compliance-ready candidates, validated listings, and recruitment evidence. The two complement each other." />
              <FAQItem q="What if I need full managed recruitment?" a="Our Managed Recruitment tier (from £2,495/hire) provides end-to-end compliant recruitment — sourcing, screening, interviews, placement, and a complete audit-ready file." />
              {/* Advertise-specific FAQs */}
              <FAQItem q="How does pricing compare to Indeed?" a="Indeed charges variable rates on a pay-per-click or pay-per-application basis with no fixed price. Costs escalate quickly for competitive roles. ComplIANS Jobs offers transparent, fixed pricing per listing or per month with no bidding, no hidden costs, and genuinely free listings that stay free." />
              <FAQItem q="Can I upgrade a listing after posting?" a="Yes. You can upgrade any active listing from your employer dashboard at any time. It immediately receives the benefits of the upgraded tier for the remaining duration." />
              <FAQItem q="What is the Compliance Document Pack?" a="A set of templates included with every Premium listing: a SOC-code-validated job description, a genuine vacancy evidence checklist, an interview scoring matrix, and a recruitment audit trail template. These are the same documents we use when preparing sponsors for Home Office compliance visits." />
              <FAQItem q="Do candidates pay anything?" a="No. ComplIANS Jobs is completely free for all candidates." />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
