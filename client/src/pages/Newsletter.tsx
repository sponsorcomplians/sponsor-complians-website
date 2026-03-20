/**
 * Newsletter.tsx — Sponsor ComplIANS Newsletter
 * ALL CONTENT IS GEO-OPTIMISED — USED VERBATIM
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowRight, Mail, CheckCircle2, BookOpen, BarChart3,
  FileText, AlertTriangle, Shield,
} from "lucide-react";
import GDPRConsent from "@/components/GDPRConsent";

const GENERATED_IMAGES = {
  newsletter: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/newsletter-compliance-afZQmyYH2EZ4Kook7JbocK.webp",
};

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

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const subscribeMut = trpc.subscribers.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setSubmitting(false);
      toast.success("You're subscribed! Check your inbox.");
    },
    onError: (err) => {
      setSubmitting(false);
      toast.error(err.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!gdprConsent) {
      toast.error("Please accept the privacy policy to continue.");
      return;
    }
    setSubmitting(true);
    subscribeMut.mutate({ email, source: "newsletter_page" });
  };

  const topics = [
    { icon: <AlertTriangle className="w-5 h-5" />, title: "Policy Changes", desc: "Immediate analysis of Home Office policy updates, salary threshold changes, and SOC code revisions." },
    { icon: <BarChart3 className="w-5 h-5" />, title: "Audit Insights", desc: "Real findings from our 100+ sponsor compliance audits, anonymised and distilled into actionable guidance." },
    { icon: <FileText className="w-5 h-5" />, title: "Compliance Guides", desc: "Step-by-step guides on right-to-work checks, CoS management, absence reporting, and record-keeping." },
    { icon: <Shield className="w-5 h-5" />, title: "Risk Alerts", desc: "Early warnings about enforcement trends, common breach patterns, and revocation triggers." },
    { icon: <BookOpen className="w-5 h-5" />, title: "Case Studies", desc: "Real-world examples of how UK employers have resolved compliance gaps and protected their licences." },
    { icon: <CheckCircle2 className="w-5 h-5" />, title: "Templates & Tools", desc: "Downloadable checklists, policy templates, and compliance tracking tools for HR teams." },
  ];

  const pastIssues = [
    { title: "March 2026: New Salary Thresholds — What Sponsors Need to Know", date: "March 2026" },
    { title: "February 2026: The 10-Day Reporting Rule — A Complete Guide", date: "February 2026" },
    { title: "January 2026: Care Worker Sponsorship Changes — July 2025 Update", date: "January 2026" },
    { title: "December 2025: Year-End Compliance Checklist for Sponsor Licence Holders", date: "December 2025" },
  ];

  return (
    <div className="-mt-[108px]">
      {/* ═══ HERO ═══ */}
      <section className="hero-gradient min-h-[60vh] flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="section-label inline-block mb-4">Newsletter</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  The Sponsor ComplIANS{" "}
                  <span className="text-gradient-teal">Compliance Newsletter</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4 max-w-2xl">
                  Stay informed about UK sponsor licence compliance with our monthly newsletter. Every issue delivers practical guidance, policy updates, audit insights, and compliance tools designed specifically for UK sponsor licence holders, HR teams, and immigration advisors.
                </p>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8 max-w-2xl">
                  All content is based on real audit findings from over 100 UK sponsor compliance audits and written by compliance specialists who work with sponsor licence holders every day.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg">
                  {subscribed ? (
                    <div className="flex items-center gap-3 text-[#00C3FF]">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">You are subscribed. Check your inbox for confirmation.</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none"
                        />
                        <button type="submit" disabled={!gdprConsent} className="btn-teal text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                          Subscribe <Mail className="w-4 h-4" />
                        </button>
                      </div>
                      <GDPRConsent checked={gdprConsent} onChange={setGdprConsent} />
                    </>
                  )}
                </form>
              </Reveal>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <Reveal delay={0.3}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#00C3FF]/10 rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src={GENERATED_IMAGES.newsletter} alt="Compliance newsletter and documentation" className="w-full h-auto" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT YOU GET ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">What You Get</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                What Every Issue Covers
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="white-card p-6 h-full">
                  <div className="w-10 h-10 rounded-lg bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-4 text-[#00C3FF]">{topic.icon}</div>
                  <h3 className="text-[#0D1B2A] font-bold text-base mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{topic.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{topic.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PAST ISSUES ═══ */}
      <section className="white-section py-20 lg:py-28">
        <div className="container max-w-3xl">
          <Reveal>
            <div className="text-center mb-12">
              <span className="section-label">Archive</span>
              <h2 className="text-3xl lg:text-[2.5rem] font-extrabold text-[#0D1B2A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Recent Issues
              </h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {pastIssues.map((issue, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="white-card p-5 flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0D1B2A] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[#0D1B2A] font-semibold text-sm group-hover:text-[#00C3FF] transition-colors">{issue.title}</h3>
                      <span className="text-[#6B7280] text-xs">{issue.date}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#00C3FF] transition-colors" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="dark-section py-20 lg:py-24">
        <div className="container text-center max-w-3xl">
          <Reveal>
            <h2 className="text-3xl lg:text-[2.5rem] font-extrabold text-white leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Join 2,000+ UK Sponsors Who Stay Compliant
            </h2>
            <p className="text-[#8B9EB7] text-lg mb-8">
              Free. Monthly. No spam. Unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg mx-auto">
              {subscribed ? (
                <div className="flex items-center gap-3 text-[#00C3FF] mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Subscribed successfully!</span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none"
                    />
                    <button type="submit" disabled={!gdprConsent} className="btn-teal text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                      Subscribe <Mail className="w-4 h-4" />
                    </button>
                  </div>
                  <GDPRConsent checked={gdprConsent} onChange={setGdprConsent} />
                </>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
