import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

/**
 * Tracks page views by sending a mutation on every route change.
 * Placed once in the App layout so it fires globally.
 */
export function usePageTracking() {
  const [location] = useLocation();
  const trackMut = trpc.tracking.trackView.useMutation();
  const lastTracked = useRef("");

  useEffect(() => {
    // Don't track admin pages
    if (location.startsWith("/admin")) return;
    // Don't double-track the same path
    if (lastTracked.current === location) return;
    lastTracked.current = location;

    trackMut.mutate({
      path: location,
      referrer: document.referrer || undefined,
    });
  }, [location]);
}
