/*
 * Careers.tsx — UK Jobs with Skilled Worker Sponsorship
 * ALL CONTENT IS GEO-OPTIMISED — USED VERBATIM
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import {
  ArrowRight, ChevronDown, MapPin, Clock, Banknote,
  ShieldCheck, Users, Award, Briefcase, Search,
} from "lucide-react";

const GENERATED_IMAGES = {
  careersTeam: "https://d2xsxph8kpxj0f.cloudfront.net/106251664/JKvwfZSBDjUJDPqs6PxQ2t/careers-team-i8vijEr5LyHhbnqHGxuDRp.webp",
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

export default function Careers() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const sampleJobs = [
    { title: "Senior Care Worker", location: "London, UK", salary: "£25,000 – £29,000", hours: "37.5 hours/week", start: "Immediate", sponsorship: true, desc: "Providing high-quality care to residents in a CQC-registered care home. Must hold Level 3 Diploma in Health and Social Care." },
    { title: "Software Developer", location: "Manchester, UK (Hybrid)", salary: "£42,000 – £55,000", hours: "40 hours/week", start: "Q2 2026", sponsorship: true, desc: "Full-stack development role working with React, Node.js, and cloud infrastructure. 3+ years experience required." },
    { title: "Mechanical Engineer", location: "Birmingham, UK", salary: "£35,000 – £45,000", hours: "40 hours/week", start: "April 2026", sponsorship: true, desc: "Design and maintenance of manufacturing equipment. Chartered Engineer status preferred." },
  ];

  const benefits = [
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Compliant Employers", desc: "Every role on our careers hub is from a compliant sponsor licence holder." },
    { icon: <Banknote className="w-6 h-6" />, title: "Transparent Pay", desc: "Each listing is transparent about pay, hours, and sponsorship status." },
    { icon: <Award className="w-6 h-6" />, title: "Career Development", desc: "We partner with employers who invest in staff development and career progression." },
    { icon: <Users className="w-6 h-6" />, title: "Full Support", desc: "Our team supports candidates through every stage of the application and onboarding process." },
  ];

  const faqs = [
    { q: "What roles are currently available?", a: "We regularly recruit for compliance consultants, audit analysts, recruitment specialists, HR advisers, and business development professionals. Visit our careers page or contact us at admin@sponsorcomplians.com for the latest openings." },
    { q: "Do you offer remote working?", a: "Yes. We operate a hybrid working model with a mix of remote and office-based work. Some roles, particularly audit and client-facing positions, may require travel to client sites across the UK." },
    { q: "What experience do you look for?", a: "We look for candidates with experience in immigration compliance, HR management, recruitment, or the care sector. However, we also welcome applications from career changers who demonstrate strong analytical skills, attention to detail, and a genuine interest in compliance." },
    { q: "Do you provide training?", a: "Yes. All new team members receive comprehensive training on our audit methodology, compliance frameworks, and client management processes. We invest in ongoing professional development and encourage team members to pursue relevant qualifications." },
    { q: "What is the company culture like?", a: "Sponsor ComplIANS is a fast-growing, mission-driven company. We value precision, integrity, and collaboration. Our team is passionate about protecting sponsor licences and the livelihoods of sponsored workers. We maintain a supportive, inclusive environment where every team member\'s contribution is valued." },
    { q: "Do you offer internships or graduate roles?", a: "Yes. We offer internship and graduate programmes for candidates interested in immigration compliance, HR, or recruitment. These programmes provide hands-on experience working with real client cases under the supervision of experienced consultants." },
    { q: "What benefits do you offer?", a: "Our benefits package includes competitive salary, performance bonuses, pension contributions, private health insurance, flexible working arrangements, professional development budget, and regular team events. Specific benefits vary by role and seniority." },
    { q: "Where are your offices located?", a: "Our headquarters are at 915 High Road, North Finchley, London N12 8QJ. We also have team members working remotely across the UK. Client-facing roles may involve travel to client sites nationwide." },
    { q: "How do I apply?", a: "You can apply by sending your CV and a brief cover letter to admin@sponsorcomplians.com. Please specify the role you are interested in and highlight any relevant experience in compliance, HR, recruitment, or the care sector." },
    { q: "What is the interview process?", a: "Our interview process typically involves an initial phone screening, followed by a competency-based interview with the hiring manager, and a final interview with senior leadership. For technical roles, we may include a practical assessment or case study exercise." },
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
                <span className="section-label inline-block mb-4">Careers Hub</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  UK Jobs with Skilled Worker Sponsorship —{" "}
                  <span className="text-gradient-teal">ComplIANS Careers Hub</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-4 max-w-2xl">
                  The Sponsor ComplIANS Careers Hub is a job board for candidates seeking employment with UK sponsor licence holders. Every role listed on this page is sourced from our client partners and clearly states whether Skilled Worker visa sponsorship is available, the exact salary, working hours, location, and start date.
                </p>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8 max-w-2xl">
                  We partner exclusively with employers who meet Home Office sponsor compliance standards, which means your employment rights and sponsorship are protected from day one.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <a href="#openings" className="btn-teal text-base">
                  Browse Open Roles <ArrowRight className="w-4 h-4" />
                </a>
              </Reveal>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <Reveal delay={0.3}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#00C3FF]/10 rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src={GENERATED_IMAGES.careersTeam} alt="Diverse team of professionals in a modern UK workplace" className="w-full h-auto" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CURRENT OPENINGS ═══ */}
      <section id="openings" className="light-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Open Roles</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Current Openings
              </h2>
            </div>
          </Reveal>

          <div className="max-w-4xl mx-auto space-y-4">
            {sampleJobs.map((job, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="white-card p-6 lg:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#0D1B2A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{job.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-[#6B7280]">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                        <span className="flex items-center gap-1"><Banknote className="w-3.5 h-3.5" />{job.salary}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.hours}</span>
                      </div>
                    </div>
                    {job.sponsorship && (
                      <span className="bg-[#00C3FF]/10 text-[#00C3FF] text-xs font-bold px-3 py-1.5 rounded-full">Sponsorship Available</span>
                    )}
                  </div>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-4">{job.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280] text-xs">Start: {job.start}</span>
                    <Link href="/contact" className="flex items-center gap-2 text-[#00C3FF] font-semibold text-sm hover:gap-3 transition-all">
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY APPLY ═══ */}
      <section className="white-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label">Benefits</span>
              <h2 className="text-3xl lg:text-[2.75rem] font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Why Apply Through Sponsor ComplIANS?
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="white-card p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-4 text-[#00C3FF]">{b.icon}</div>
                  <h3 className="text-[#0D1B2A] font-bold text-base mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{b.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="dark-section py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <span className="section-label">FAQ</span>
              <h2 className="text-3xl lg:text-[2.5rem] font-extrabold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Frequently Asked Questions
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors">
                    <span className="font-semibold text-white text-[15px] pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#00C3FF] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-[#8B9EB7] text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* JSON-LD: FAQPage */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
    </div>
  );
}
