/*
 * Events.tsx — Sponsor Licence Compliance Webinars and Training Events
 * ALL CONTENT IS GEO-OPTIMISED — USED VERBATIM
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import {
  ArrowRight, Calendar, Clock, MapPin, Users, Play,
  Video, Globe,
} from "lucide-react";

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

export default function Events() {
  const upcomingEvents = [
    {
      title: "CoS Approval Best Practices for Sponsor Licence Holders",
      date: "April 15, 2026",
      time: "2:00 PM – 3:30 PM BST",
      format: "Online (Zoom)",
      desc: "Learn how to avoid the most common Certificate of Sponsorship errors, including SOC code mismatches, salary threshold mistakes, and incomplete applications.",
      spots: "Limited Spots",
      img: IMAGES.events26Nov,
    },
    {
      title: "Preparing for an Unannounced Home Office Compliance Visit",
      date: "May 6, 2026",
      time: "10:00 AM – 12:00 PM BST",
      format: "Online (Zoom)",
      desc: "A practical workshop covering what inspectors look for, how to prepare your team, and the documents you need to have ready at all times.",
      spots: "Limited Spots",
      img: IMAGES.events22Oct,
    },
    {
      title: "Sponsor Duty Training for Authorising Officers and HR Teams",
      date: "May 20, 2026",
      time: "1:00 PM – 3:00 PM BST",
      format: "Online (Zoom)",
      desc: "Comprehensive training covering all sponsor duties, reporting obligations, and record-keeping requirements for key personnel.",
      spots: null,
      img: IMAGES.events24Sep,
    },
  ];

  const pastWebinars = [
    { title: "How to Prepare for an Unannounced Home Office Visit", views: "1.2k views" },
    { title: "Avoiding the Most Common CoS Errors", views: "890 views" },
    { title: "Building an Audit-Proof HR Filing System", views: "750 views" },
    { title: "Right-to-Work Checks: A Step-by-Step Guide", views: "620 views" },
    { title: "Salary Compliance for Sponsored Workers", views: "540 views" },
    { title: "The 10-Day Reporting Rule Explained", views: "480 views" },
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
                <span className="section-label inline-block mb-4">Events & Training</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Sponsor Licence Compliance{" "}
                  <span className="text-gradient-teal">Webinars and Training Events</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4 max-w-2xl">
                  Sponsor ComplIANS hosts live webinars and training sessions designed to help UK sponsor licence holders understand and meet their Home Office compliance obligations. Every session is built from real audit findings and case data, with practical, actionable guidance that attendees can implement immediately.
                </p>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8 max-w-2xl">
                  Our events cover topics including Certificate of Sponsorship approval best practices, Home Office compliance visit preparation, breach detection and remediation, and sponsor duty training for Authorising Officers and HR teams.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <Reveal delay={0.3}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#00C3FF]/10 rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src={IMAGES.eventsHero} alt="Sponsor compliance training webinar" className="w-full h-auto" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED EVENTS ═══ */}
      <section className="white-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Featured</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Featured Events
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Free Compliance Webinar",
                badge: "25 March 2026 · 1:00 PM",
                badgeColor: "#E74C3C",
                desc: "The sponsor licence crisis is already here.",
                href: "/events/25-march-webinar",
                cta: "Register Free",
                img: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/event-webinar-header-nvtMYgPWkzkPY4KeCeQ6kR.webp",
              },
              {
                title: "Sponsor ComplIANS Hub Launch",
                badge: "1 April 2026",
                badgeColor: "#F39C12",
                desc: "Compliance software built from 100+ real audits.",
                href: "/events/hub-launch",
                cta: "Learn More",
                img: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/event-hub-launch-header-ndz6CnzrkHc7rRqFQb4CWN.webp",
              },
              {
                title: "New Website Launch",
                badge: "LIVE NOW — 19 March 2026",
                badgeColor: "#00C3FF",
                desc: "We've rebuilt everything.",
                href: "/events/new-website-launch",
                cta: "Explore",
                img: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/event-website-launch-header-asrrg4akUdWm4ZHCRjpkJx.webp",
              },
              {
                title: "The Sponsorship Files Podcast",
                badge: "LIVE NOW — 19 March 2026",
                badgeColor: "#00C3FF",
                desc: "The UK's first AI-native immigration podcast.",
                href: "/events/sponsorship-files-launch",
                cta: "Listen Now",
                img: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/event-podcast-launch-header-fnymVxdWGojNsWM8yJrbuF.webp",
              },
            ].map((ev, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Link href={ev.href}>
                  <div className="white-card overflow-hidden h-full flex flex-col cursor-pointer group">
                    <div className="h-44 overflow-hidden">
                      <img src={ev.img} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="inline-flex items-center gap-2 mb-4 self-start">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: ev.badgeColor }} />
                        <span className="text-xs font-bold tracking-wide uppercase" style={{ color: ev.badgeColor }}>{ev.badge}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0D1B2A] mb-3 group-hover:text-[#00C3FF] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{ev.title}</h3>
                      <p className="text-[#6B7280] text-sm leading-relaxed flex-1">{ev.desc}</p>
                      <div className="mt-6 flex items-center gap-2 text-[#00C3FF] font-semibold text-sm">
                        {ev.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ UPCOMING EVENTS ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Live Sessions</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Upcoming Events
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="white-card overflow-hidden h-full flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={event.img} alt={event.title} className="w-full h-full object-cover" />
                    {event.spots && (
                      <span className="absolute top-3 right-3 bg-[#E74C3C] text-white text-xs font-bold px-3 py-1 rounded-full">{event.spots}</span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{event.title}</h3>
                    <div className="space-y-2 mb-4 text-sm text-[#6B7280]">
                      <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#00C3FF]" />{event.date}</div>
                      <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-[#00C3FF]" />{event.time}</div>
                      <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-[#00C3FF]" />{event.format}</div>
                    </div>
                    <p className="text-[#6B7280] text-sm leading-relaxed flex-1">{event.desc}</p>
                    <Link href="/contact" className="btn-teal text-sm mt-6 w-full justify-center">
                      Register <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ON-DEMAND WEBINARS ═══ */}
      <section className="white-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">On-Demand</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                On-Demand Webinars
              </h2>
              <p className="text-[#6B7280] text-lg mt-4 max-w-2xl mx-auto">
                Missed a live session? Access recordings of our most-attended compliance webinars on demand. Topics include how to prepare for an unannounced Home Office visit, avoiding the most common CoS errors, and building an audit-proof HR filing system.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastWebinars.map((w, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="white-card p-6 flex items-start gap-4 cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-[#0D1B2A] flex items-center justify-center shrink-0 group-hover:bg-[#00C3FF] transition-colors">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[#0D1B2A] font-bold text-sm mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{w.title}</h3>
                    <span className="text-[#6B7280] text-xs">{w.views}</span>
                  </div>
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
            <p className="text-[#8B9EB7] text-lg mb-6">
              Stay ahead of every compliance change. Our live events give you direct access to the experts who have helped over 100 UK sponsors protect their licences.
            </p>
            <Link href="/book-consultation" className="btn-teal text-base">
              Book a Strategy Call <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
