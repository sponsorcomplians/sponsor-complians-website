import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, ShieldCheck, Users, Rocket } from "lucide-react";
import { toast } from "sonner";

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

export default function Signup() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", company: "", phone: "", interest: "",
  });
  const signupMut = trpc.signups.register.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("You're signed up! We'll be in touch.");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    signupMut.mutate({ ...form, source: "signup_page" });
  };

  return (
    <div className="-mt-[108px]">
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Benefits */}
            <div>
              <Reveal>
                <span className="section-label inline-block mb-4">Get Early Access</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Sign Up for the <span className="text-gradient-teal">Sponsor ComplIANS Hub</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[#8B9EB7] text-lg leading-relaxed mb-8">
                  Be among the first UK employers to access our compliance management platform. Built on data from 100+ real audits.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="space-y-4">
                  {[
                    { icon: <ShieldCheck className="w-5 h-5 text-[#00C3FF]" />, text: "Real-time compliance monitoring and alerts" },
                    { icon: <Users className="w-5 h-5 text-[#00C3FF]" />, text: "Centralised sponsored worker management" },
                    { icon: <Rocket className="w-5 h-5 text-[#00C3FF]" />, text: "Automated reporting and audit trail" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/80">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right — Form */}
            <Reveal delay={0.3}>
              <div className="bg-[#0D1B2A] border border-[#1B3A5C]/50 rounded-2xl p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-[#00C3FF] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">You're In!</h3>
                    <p className="text-[#8B9EB7]">We'll notify you when the Hub launches. Check your email for confirmation.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Create Your Account</h3>
                    <p className="text-[#8B9EB7] text-sm mb-4">Launching 1 April 2026. Register now for priority access.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/70 text-sm">First Name *</Label>
                        <Input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className="bg-[#1B3A5C]/30 border-[#1B3A5C]/50 text-white mt-1" required />
                      </div>
                      <div>
                        <Label className="text-white/70 text-sm">Last Name *</Label>
                        <Input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className="bg-[#1B3A5C]/30 border-[#1B3A5C]/50 text-white mt-1" required />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/70 text-sm">Email Address *</Label>
                      <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="bg-[#1B3A5C]/30 border-[#1B3A5C]/50 text-white mt-1" required />
                    </div>
                    <div>
                      <Label className="text-white/70 text-sm">Company</Label>
                      <Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="bg-[#1B3A5C]/30 border-[#1B3A5C]/50 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-white/70 text-sm">Phone</Label>
                      <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-[#1B3A5C]/30 border-[#1B3A5C]/50 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-white/70 text-sm">What interests you most?</Label>
                      <select
                        value={form.interest}
                        onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
                        className="w-full mt-1 bg-[#1B3A5C]/30 border border-[#1B3A5C]/50 text-white rounded-md px-3 py-2 text-sm"
                      >
                        <option value="">Select...</option>
                        <option value="compliance_monitoring">Compliance Monitoring</option>
                        <option value="worker_management">Worker Management</option>
                        <option value="salary_tracking">Salary Tracking</option>
                        <option value="document_management">Document Management</option>
                        <option value="reporting">Reporting & Audit Trail</option>
                        <option value="all">All Features</option>
                      </select>
                    </div>
                    <Button type="submit" disabled={signupMut.isPending} className="w-full bg-[#00C3FF] hover:bg-[#00C3FF]/80 text-[#0D1B2A] font-bold">
                      {signupMut.isPending ? "Signing up..." : "Sign Up for Early Access"} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-[#8B9EB7] text-xs text-center">By signing up you agree to our privacy policy. We will never share your data.</p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
