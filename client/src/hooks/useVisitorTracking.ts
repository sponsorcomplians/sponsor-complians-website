import { useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";

/**
 * Visitor Behaviour Tracking Hook
 * 
 * Automatically tracks page views and provides methods to track
 * CTA clicks, form interactions, chatbot usage, downloads, etc.
 * 
 * Events are sent to the backend which scores them and classifies
 * visitors as Cold (0-19), Warm (20-49), or Hot (50+).
 */

function getOrCreateSessionId(): string {
  const key = "sc_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

function getStoredEmail(): string | undefined {
  return localStorage.getItem("sc_visitor_email") || undefined;
}

export function setVisitorEmail(email: string) {
  localStorage.setItem("sc_visitor_email", email);
}

export function useVisitorTracking() {
  const trackMut = trpc.visitorScoring.trackEvent.useMutation();
  const lastTrackedPath = useRef<string>("");

  const sessionId = typeof window !== "undefined" ? getOrCreateSessionId() : "";

  const trackEvent = useCallback((eventType: string, eventValue?: string, email?: string) => {
    const storedEmail = email || getStoredEmail();
    trackMut.mutate({
      sessionId,
      email: storedEmail,
      eventType,
      eventValue,
      pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    });
  }, [sessionId, trackMut]);

  // Auto-track page views on route change
  useEffect(() => {
    const path = window.location.pathname;
    if (path !== lastTrackedPath.current) {
      lastTrackedPath.current = path;
      trackEvent("page_view", path);
    }
  }, [trackEvent]);

  const trackCTAClick = useCallback((label: string) => {
    trackEvent("cta_click", label);
  }, [trackEvent]);

  const trackFormStart = useCallback((formName: string) => {
    trackEvent("form_start", formName);
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, email?: string) => {
    if (email) setVisitorEmail(email);
    trackEvent("form_submit", formName, email);
  }, [trackEvent]);

  const trackChatbotOpen = useCallback(() => {
    trackEvent("chatbot_open");
  }, [trackEvent]);

  const trackChatbotMessage = useCallback(() => {
    trackEvent("chatbot_message");
  }, [trackEvent]);

  const trackDownload = useCallback((fileName: string) => {
    trackEvent("download", fileName);
  }, [trackEvent]);

  const trackVideoPlay = useCallback(() => {
    trackEvent("video_play");
  }, [trackEvent]);

  const trackPricingView = useCallback(() => {
    trackEvent("pricing_view");
  }, [trackEvent]);

  const trackEmergencySelect = useCallback(() => {
    trackEvent("emergency_select");
  }, [trackEvent]);

  const trackWebinarRegister = useCallback((email: string) => {
    setVisitorEmail(email);
    trackEvent("webinar_register", "25-march-webinar", email);
  }, [trackEvent]);

  const trackNewsletterSubscribe = useCallback((email: string) => {
    setVisitorEmail(email);
    trackEvent("newsletter_subscribe", undefined, email);
  }, [trackEvent]);

  const trackConsultationBook = useCallback((email?: string) => {
    if (email) setVisitorEmail(email);
    trackEvent("consultation_book", undefined, email);
  }, [trackEvent]);

  return {
    trackEvent,
    trackCTAClick,
    trackFormStart,
    trackFormSubmit,
    trackChatbotOpen,
    trackChatbotMessage,
    trackDownload,
    trackVideoPlay,
    trackPricingView,
    trackEmergencySelect,
    trackWebinarRegister,
    trackNewsletterSubscribe,
    trackConsultationBook,
  };
}
