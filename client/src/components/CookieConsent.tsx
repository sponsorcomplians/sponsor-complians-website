/**
 * CookieConsent.tsx — ICO-compliant GDPR Cookie Consent Banner
 * Provides granular consent controls for UK visitors
 */

import { useState, useEffect } from "react";
import { Cookie, Settings, Check, X, Shield } from "lucide-react";

type ConsentPreferences = {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

const CONSENT_KEY = "complians_cookie_consent";
const CONSENT_VERSION = "1.0";

function getStoredConsent(): ConsentPreferences | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed.preferences;
  } catch {
    return null;
  }
}

function storeConsent(prefs: ConsentPreferences) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ version: CONSENT_VERSION, preferences: prefs, timestamp: Date.now() })
  );
}

export function hasAnalyticsConsent(): boolean {
  const consent = getStoredConsent();
  return consent?.analytics ?? false;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    storeConsent(allAccepted);
    setVisible(false);
  };

  const rejectAll = () => {
    const onlyNecessary: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    storeConsent(onlyNecessary);
    setVisible(false);
  };

  const savePreferences = () => {
    storeConsent(preferences);
    setVisible(false);
  };

  if (!visible) return null;

  const categories = [
    {
      key: "necessary" as const,
      label: "Strictly Necessary",
      desc: "Required for the website to function. Cannot be disabled.",
      locked: true,
    },
    {
      key: "analytics" as const,
      label: "Analytics & Performance",
      desc: "Help us understand how visitors interact with the site by collecting anonymous usage data.",
      locked: false,
    },
    {
      key: "functional" as const,
      label: "Functional",
      desc: "Enable enhanced functionality such as saved preferences, audio playback settings, and personalised content.",
      locked: false,
    },
    {
      key: "marketing" as const,
      label: "Marketing & Advertising",
      desc: "Used to deliver relevant advertisements and track campaign effectiveness across platforms.",
      locked: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 pointer-events-auto transition-opacity duration-300"
        onClick={() => {}}
      />

      {/* Banner */}
      <div className="relative pointer-events-auto w-full max-w-3xl mx-4 mb-6 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1B3A5C] px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Cookie className="w-5 h-5 text-[#00C3FF]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Cookie Preferences</h3>
            <p className="text-white/60 text-xs">Manage your privacy settings</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00C9A7]" />
            <span className="text-[#00C9A7] text-xs font-medium">ICO Compliant</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-[#0D1B2A]/70 text-sm leading-relaxed mb-4">
            We use cookies to improve your experience, analyse site traffic, and personalise content.
            Under the UK GDPR and the Privacy and Electronic Communications Regulations (PECR),
            we need your consent for non-essential cookies.{" "}
            <a href="/privacy-policy" className="text-[#00C3FF] hover:underline font-medium">
              Read our Privacy Policy
            </a>
          </p>

          {/* Granular controls */}
          {showDetails && (
            <div className="space-y-3 mb-5 border-t border-gray-100 pt-4">
              {categories.map((cat) => (
                <div
                  key={cat.key}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#F5F7FA] hover:bg-[#F0F3F7] transition-colors"
                >
                  <button
                    disabled={cat.locked}
                    onClick={() => {
                      if (!cat.locked) {
                        setPreferences((p) => ({ ...p, [cat.key]: !p[cat.key] }));
                      }
                    }}
                    className={`mt-0.5 w-10 h-6 rounded-full transition-colors flex items-center shrink-0 ${
                      preferences[cat.key]
                        ? "bg-[#00C9A7]"
                        : "bg-gray-300"
                    } ${cat.locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mx-1 ${
                        preferences[cat.key] ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#0D1B2A]">{cat.label}</span>
                      {cat.locked && (
                        <span className="text-[10px] bg-[#0D1B2A]/10 text-[#0D1B2A]/60 px-2 py-0.5 rounded-full font-medium">
                          Always On
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#0D1B2A]/50 mt-0.5 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={acceptAll}
              className="flex items-center gap-2 bg-[#00C9A7] text-[#0D1B2A] font-bold py-2.5 px-6 rounded-lg hover:bg-[#00C9A7]/90 transition-colors text-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Accept All
            </button>
            <button
              onClick={rejectAll}
              className="flex items-center gap-2 bg-[#0D1B2A] text-white font-bold py-2.5 px-6 rounded-lg hover:bg-[#0D1B2A]/90 transition-colors text-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
              Reject Non-Essential
            </button>
            {showDetails ? (
              <button
                onClick={savePreferences}
                className="flex items-center gap-2 border-2 border-[#0D1B2A]/20 text-[#0D1B2A] font-bold py-2.5 px-6 rounded-lg hover:border-[#0D1B2A]/40 transition-colors text-sm cursor-pointer"
              >
                Save My Preferences
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center gap-2 border-2 border-[#0D1B2A]/20 text-[#0D1B2A] font-bold py-2.5 px-6 rounded-lg hover:border-[#0D1B2A]/40 transition-colors text-sm cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                Customise
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
