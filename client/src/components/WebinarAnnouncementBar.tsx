import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, ArrowRight, Play } from "lucide-react";
import ctaConfig from "@/lib/ctaConfig";

const WEBINAR_DATE = new Date("2026-03-25T13:00:00Z"); // 1:00 PM GMT

function getTimeLeft() {
  const now = new Date();
  const diff = WEBINAR_DATE.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function WebinarAnnouncementBar({ onDismiss }: { onDismiss?: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    if (sessionStorage.getItem("webinar-bar-dismissed") === "true") {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (ctaConfig.MODE !== "webinar") return;
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("webinar-bar-dismissed", "true");
    onDismiss?.();
  };

  // Don't show if dismissed or config says hide
  if (dismissed || !ctaConfig.shouldShowAnnouncementBar()) return null;
  // In webinar mode, also hide if webinar has passed
  if (ctaConfig.MODE === "webinar" && !timeLeft) return null;

  const isVideo = ctaConfig.MODE === "video";

  return (
    <div className={`${isVideo ? "bg-[#7C3AED]" : "bg-[#00C9A7]"} text-white relative z-[60]`}>
      <div className="container flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-medium">
        {isVideo ? (
          <>
            <Play className="w-4 h-4 hidden sm:inline" />
            <span className="text-center">
              <span className="font-bold">NEW:</span> Watch Our Product Tour — See the Sponsor ComplIANS Hub in Action
            </span>
            <Link
              href="/hub-demo"
              className="inline-flex items-center gap-1 bg-white text-[#7C3AED] font-bold text-xs px-3 py-1.5 rounded-md hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Watch Now <ArrowRight className="w-3 h-3" />
            </Link>
          </>
        ) : (
          <>
            <span className="hidden sm:inline font-bold uppercase tracking-wide">FREE WEBINAR:</span>
            <span className="text-center">
              <span className="font-semibold">25 March 2026</span>
              <span className="mx-1.5">—</span>
              <span>{ctaConfig.WEBINAR_TITLE}.</span>
            </span>

            {/* Countdown */}
            {timeLeft && (
              <span className="hidden md:inline-flex items-center gap-1 bg-white/20 rounded-md px-2.5 py-1 text-xs font-bold tracking-wider">
                {timeLeft.days}d {String(timeLeft.hours).padStart(2, "0")}h{" "}
                {String(timeLeft.minutes).padStart(2, "0")}m{" "}
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            )}

            <Link
              href={ctaConfig.getWebinarPath()}
              className="inline-flex items-center gap-1 bg-white text-[#00C9A7] font-bold text-xs px-3 py-1.5 rounded-md hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Register Now <ArrowRight className="w-3 h-3" />
            </Link>
          </>
        )}

        <button
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
