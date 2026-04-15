/**
 * Captures Meta (Facebook) tracking parameters from URL, cookies,
 * and browser context for the Conversion API (CAPI).
 */

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function getUrlParam(name: string): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get(name) ?? "";
}

function generateEventId(): string {
  return crypto.randomUUID();
}

export interface MetaTrackingData {
  meta_fbclid: string;
  meta_fbc: string;
  meta_fbp: string;
  meta_eventId: string;
  meta_eventName: string;
  meta_sourceUrl: string;
  meta_userAgent: string;
}

export function captureMetaTracking(
  eventName: string = "Lead"
): MetaTrackingData {
  return {
    meta_fbclid: getUrlParam("fbclid"),
    meta_fbc: getCookie("_fbc"),
    meta_fbp: getCookie("_fbp"),
    meta_eventId: generateEventId(),
    meta_eventName: eventName,
    meta_sourceUrl: typeof window !== "undefined" ? window.location.href : "",
    meta_userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "",
  };
}
