/*
 * Contact.tsx — Contact Sponsor ComplIANS
 * ALL CONTENT IS GEO-OPTIMISED — USED VERBATIM
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "@/lib/images";
import { trpc } from "@/lib/trpc";

import { toast } from "sonner";
import {
  ArrowRight, Mail, Phone, MapPin, Clock,
  MessageCircle, Send, AlertTriangle,
} from "lucide-react";
import GDPRConsent from "@/components/GDPRConsent";

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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "", email: "", company: "", phone: "", service: "", urgency: "", message: "",
  });
  const [gdprConsent, setGdprConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const submitMut = trpc.submissions.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setSubmitting(false);
      toast.success("Message sent! We'll be in touch soon.");
    },
    onError: (err) => {
      setSubmitting(false);
      toast.error(err.message || "Failed to send message. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!gdprConsent) {
      toast.error("Please accept the privacy policy to continue.");
      return;
    }
    setSubmitting(true);
    const nameParts = formData.name.split(" ");
    submitMut.mutate({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: formData.email,
      company: formData.company || undefined,
      phone: formData.phone || undefined,
      subject: formData.urgency
        ? `[${formData.urgency === "home_office_email" ? "URGENT" : "Enquiry"}] ${formData.urgency} | Service: ${formData.service || "Not specified"}`
        : formData.service ? `Service Interest: ${formData.service}` : undefined,
      message: formData.message,
    });
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: "Email", value: "admin@sponsorcomplians.com", href: "mailto:admin@sponsorcomplians.com" },
    { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "020 3618 6968", href: "tel:02036186968" },
    { icon: <MapPin className="w-5 h-5" />, label: "Office", value: "London, United Kingdom", href: null },
    { icon: <Clock className="w-5 h-5" />, label: "Hours", value: "Mon – Fri, 9:00 AM – 5:30 PM GMT", href: null },
  ];

  return (
    <div className="-mt-[108px]">
      {/* ═══ HERO ═══ */}
      <section className="hero-gradient min-h-[50vh] flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="section-label inline-block mb-4">Get in Touch</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Contact <span className="text-gradient-teal">Sponsor ComplIANS</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[#8B9EB7] text-lg leading-relaxed max-w-2xl">
                  Whether you need a compliance audit, recruitment support, HR compliance services, or simply want to understand where your sponsor licence stands, our team is ready to help. Book a free consultation or send us a message.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <Reveal delay={0.3}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#00C3FF]/10 rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80" alt="Professional consultation meeting" className="w-full h-auto" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT FORM + INFO ═══ */}
      <section className="light-section py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-3">
              <Reveal>
                <div className="white-card p-8 lg:p-10">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-[#00C3FF]/10 flex items-center justify-center mx-auto mb-6">
                        <Send className="w-7 h-7 text-[#00C3FF]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Message Received</h3>
                      <p className="text-[#6B7280]">Thank you for contacting Sponsor ComplIANS. A member of our team will respond within one working day.</p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Send Us a Message</h2>
                      <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
                        {/* Urgency Triage */}
                        <div>
                          <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">How can we help? *</label>
                          <select
                            required
                            value={formData.urgency}
                            onChange={e => setFormData({...formData, urgency: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#0D1B2A] text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none transition-all"
                          >
                            <option value="">Select your situation...</option>
                            <option value="home_office_email">I've received a Home Office concerns email</option>
                            <option value="audit_request">I need a compliance audit</option>
                            <option value="recruitment">I need to recruit sponsored workers</option>
                            <option value="hub_demo">I'd like a demo of the Hub software</option>
                            <option value="general">General enquiry</option>
                          </select>
                        </div>

                        {/* Emergency Banner */}
                        {formData.urgency === "home_office_email" && (
                          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-bold text-red-800 mb-1">Urgent: Time-Sensitive Compliance Matter</h4>
                                <p className="text-xs text-red-700 leading-relaxed mb-2">
                                  Home Office concerns emails typically require a response within 20 working days. Delays can lead to licence downgrade, suspension, or revocation.
                                </p>
                                <a href="tel:02036186968" className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 hover:text-red-900 transition-colors">
                                  <Phone className="w-4 h-4" /> Call us now: 020 3618 6968
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Full Name *</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#0D1B2A] text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none transition-all" placeholder="Your name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Email Address *</label>
                            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#0D1B2A] text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none transition-all" placeholder="you@company.co.uk" />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Company Name</label>
                            <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#0D1B2A] text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none transition-all" placeholder="Your company" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Phone Number</label>
                            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#0D1B2A] text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none transition-all" placeholder="+44 ..." />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Service of Interest</label>
                          <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#0D1B2A] text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none transition-all">
                            <option value="">Select a service...</option>
                            <option value="audit">Sponsor Compliance Audit</option>
                            <option value="recruitment">Skilled Worker Recruitment</option>
                            <option value="hr">Sponsor-Ready HR Service</option>
                            <option value="hub">Sponsor Compliance Hub</option>
                            <option value="other">Other / General Enquiry</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Message *</label>
                          <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#0D1B2A] text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none transition-all resize-none" placeholder="Tell us about your compliance needs..." />
                        </div>
                        <GDPRConsent checked={gdprConsent} onChange={setGdprConsent} />
                        <button type="submit" disabled={submitting || !gdprConsent} className="btn-teal text-base w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                          {submitting ? "Sending..." : "Send Message"} <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <Reveal delay={0.1}>
                <div className="space-y-6">
                  {contactInfo.map((info, i) => (
                    <div key={i} className="white-card p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#00C3FF]/10 flex items-center justify-center shrink-0 text-[#00C3FF]">{info.icon}</div>
                      <div>
                        <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">{info.label}</div>
                        {info.href ? (
                          <a href={info.href} className="text-[#0D1B2A] font-semibold text-sm hover:text-[#00C3FF] transition-colors">{info.value}</a>
                        ) : (
                          <span className="text-[#0D1B2A] font-semibold text-sm">{info.value}</span>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="white-card p-6 mt-8">
                    <h3 className="text-lg font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Free Compliance Consultation</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                      Not sure where to start? Book a free 30-minute consultation with one of our compliance advisors. We will review your current position and recommend the right next step.
                    </p>
                    <Link
                      href="/book-consultation"
                      className="btn-teal-outline text-sm w-full justify-center cursor-pointer inline-flex"
                    >
                      Book Free Consultation
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
