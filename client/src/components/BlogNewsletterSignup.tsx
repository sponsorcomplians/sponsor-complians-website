import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import GDPRConsent from "@/components/GDPRConsent";

export default function BlogNewsletterSignup({ variant = "inline" }: { variant?: "inline" | "card" }) {
  const [email, setEmail] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subscribe = trpc.subscribers.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("You're subscribed! Check your inbox.");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (!gdprConsent) {
      toast.error("Please accept the privacy policy to continue.");
      return;
    }
    subscribe.mutate({ email: email.trim(), source: "blog" });
  };

  if (submitted) {
    return (
      <div className={`${variant === "card" ? "bg-[#0D1B2A] border border-[#1B3A5C]/40 rounded-xl p-6" : "bg-[#0A1628]/50 border border-[#1B3A5C]/30 rounded-lg p-4"}`}>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#00C9A7] shrink-0" />
          <p className="text-white text-sm font-medium">You're subscribed to the Sponsor ComplIANS newsletter.</p>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-[#0D1B2A] border border-[#1B3A5C]/40 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-[#00C3FF]" />
          <h3 className="text-white font-bold text-sm">Compliance Newsletter</h3>
        </div>
        <p className="text-[#8B9EB7] text-xs leading-relaxed mb-4">
          Weekly compliance updates, Home Office enforcement news, and practical guidance for UK sponsor licence holders.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full px-3 py-2 bg-[#1B3A5C]/40 border border-[#1B3A5C]/60 rounded-lg text-white text-sm placeholder:text-[#5A7A9A] focus:outline-none focus:ring-2 focus:ring-[#00C3FF]/40"
          />
          <GDPRConsent checked={gdprConsent} onChange={setGdprConsent} />
          <button
            type="submit"
            disabled={subscribe.isPending || !email.trim() || !gdprConsent}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#00C3FF] hover:bg-[#00B0E6] disabled:bg-[#1B3A5C] disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {subscribe.isPending ? "Subscribing..." : "Subscribe"}
            {!subscribe.isPending && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>
    );
  }

  // Inline variant (for blog listing page)
  return (
    <div className="bg-gradient-to-r from-[#0A1628] to-[#132B47] border border-[#1B3A5C]/30 rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-[#00C3FF]" />
            <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Stay Compliant — Subscribe to Our Newsletter
            </h3>
          </div>
          <p className="text-[#8B9EB7] text-sm leading-relaxed">
            Weekly compliance updates, Home Office enforcement news, and practical guidance for UK sponsor licence holders. Join 2,500+ subscribers.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:w-[320px] shrink-0">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-2.5 bg-[#1B3A5C]/40 border border-[#1B3A5C]/60 rounded-lg text-white text-sm placeholder:text-[#5A7A9A] focus:outline-none focus:ring-2 focus:ring-[#00C3FF]/40"
            />
            <button
              type="submit"
              disabled={subscribe.isPending || !email.trim() || !gdprConsent}
              className="px-4 py-2.5 bg-[#00C3FF] hover:bg-[#00B0E6] disabled:bg-[#1B3A5C] disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
            >
              {subscribe.isPending ? "..." : "Subscribe"}
            </button>
          </div>
          <GDPRConsent checked={gdprConsent} onChange={setGdprConsent} />
        </form>
      </div>
    </div>
  );
}
