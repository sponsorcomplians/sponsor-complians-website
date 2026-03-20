import { useEffect, useState } from "react";
import { X, Calendar, Clock, Video, Phone } from "lucide-react";

/**
 * CalendlyModal — Inline booking modal for free compliance consultations.
 * 
 * When a Calendly URL is configured, it embeds the Calendly widget.
 * When no URL is set, it shows a self-service booking form that submits
 * via the existing contact form tRPC mutation with a "consultation_booking" tag.
 */

const CALENDLY_URL = ""; // Set to your Calendly URL when ready, e.g. "https://calendly.com/sponsorcomplians/30min"

interface CalendlyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CalendlyModal({ open, onClose }: CalendlyModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", preferredTime: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Load Calendly widget script when URL is configured
  useEffect(() => {
    if (!CALENDLY_URL || !open) return;
    const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, [open]);

  if (!open) return null;

  const timeSlots = [
    { label: "Morning (9:00 – 11:00)", value: "morning", icon: <Clock className="w-4 h-4" /> },
    { label: "Midday (11:00 – 13:00)", value: "midday", icon: <Clock className="w-4 h-4" /> },
    { label: "Afternoon (14:00 – 16:00)", value: "afternoon", icon: <Clock className="w-4 h-4" /> },
    { label: "Late Afternoon (16:00 – 17:30)", value: "late_afternoon", icon: <Clock className="w-4 h-4" /> },
  ];

  const consultationTypes = [
    { label: "Video Call (Microsoft Teams)", icon: <Video className="w-5 h-5 text-[#00C3FF]" /> },
    { label: "Phone Call", icon: <Phone className="w-5 h-5 text-[#00C3FF]" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real integration, this would call a tRPC mutation
    // For now, it opens the user's email client with pre-filled details
    const subject = encodeURIComponent("Consultation Booking Request");
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nPreferred Time: ${formData.preferredTime || selectedSlot || "Any"}\n\nPlease book a free 30-minute compliance consultation.`
    );
    window.open(`mailto:admin@sponsorcomplians.com?subject=${subject}&body=${body}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1B3A5C] rounded-t-2xl p-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-[#00C3FF]" />
            <h2 className="text-xl font-bold">Book Free Consultation</h2>
          </div>
          <p className="text-sm text-white/70">30-minute compliance review with a senior advisor</p>
        </div>

        {CALENDLY_URL ? (
          /* Calendly Embed */
          <div className="p-0">
            <div
              className="calendly-inline-widget"
              data-url={CALENDLY_URL}
              style={{ minWidth: "320px", height: "630px" }}
            />
          </div>
        ) : submitted ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-[#0D1B2A] mb-2">Request Sent</h3>
            <p className="text-sm text-gray-600 mb-4">
              We'll confirm your consultation slot within 2 working hours. Check your email for a calendar invite.
            </p>
            <p className="text-xs text-gray-400">
              Need it sooner? Call us directly: <a href="tel:02036186968" className="text-[#00C3FF] font-medium">020 3618 6968</a>
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-[#0D1B2A] text-white rounded-lg text-sm font-medium hover:bg-[#1B3A5C] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* What to expect */}
            <div className="bg-[#F5F7FA] rounded-xl p-4">
              <h4 className="text-sm font-semibold text-[#0D1B2A] mb-3">What to expect:</h4>
              <ul className="space-y-2">
                {[
                  "Review your current sponsor licence compliance status",
                  "Identify immediate risks and priority actions",
                  "Recommend the right service package for your needs",
                  "No obligation — completely free"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-[#00C3FF] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Consultation type */}
            <div>
              <label className="block text-sm font-medium text-[#0D1B2A] mb-2">Consultation Type</label>
              <div className="grid grid-cols-2 gap-3">
                {consultationTypes.map((type, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-700">
                    {type.icon}
                    {type.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none"
                  placeholder="you@company.co.uk"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00C3FF] focus:border-transparent outline-none"
                placeholder="+44 ..."
              />
            </div>

            {/* Preferred Time Slot */}
            <div>
              <label className="block text-sm font-medium text-[#0D1B2A] mb-2">Preferred Time Slot</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => setSelectedSlot(slot.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-xs transition-all ${
                      selectedSlot === slot.value
                        ? "border-[#00C3FF] bg-[#00C3FF]/10 text-[#0D1B2A] font-medium"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {slot.icon}
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#00C3FF] to-[#00C9A7] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00C3FF]/25 transition-all text-sm"
            >
              Request Consultation Slot
            </button>

            <p className="text-[10px] text-gray-400 text-center">
              We'll confirm your slot within 2 working hours. Mon–Fri, 9:00 AM – 5:30 PM GMT.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
