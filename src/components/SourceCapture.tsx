"use client";

import { useEffect } from "react";

const KEY = "landing_src";

/**
 * Remembers how the visitor arrived (utm_source / ref param, or the external
 * referrer's hostname) for this browser session only. It's attached to the
 * resume download link so the notification can say "Source: LinkedIn".
 * No cookies, nothing persistent, nothing personal.
 */
export function SourceCapture() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) !== null) return;
      const params = new URLSearchParams(location.search);
      let src = params.get("utm_source") || params.get("ref") || params.get("src") || "";
      if (!src && document.referrer) {
        const host = new URL(document.referrer).hostname;
        if (host && host !== location.hostname) src = host;
      }
      sessionStorage.setItem(KEY, src.slice(0, 60));
    } catch {
      /* storage blocked — source just shows as unknown */
    }
  }, []);
  return null;
}

export function landingSource(): string {
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}
