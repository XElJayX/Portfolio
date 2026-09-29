import "server-only";

/**
 * Coarse, non-identifying request context for the resume-download
 * notification. No IP address, no fingerprinting — only what the browser
 * and Vercel's edge already provide at city granularity.
 */
export type RequestMeta = {
  browser: string;
  os: string;
  device: "Desktop" | "Mobile" | "Tablet";
  location: string | null;
  source: string;
  isBot: boolean;
};

const BOT_RE =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|quora link|whatsapp|slack|discord|telegram|linkedinbot|headless|curl|wget|python-requests|httpclient|go-http|axios|node-fetch/i;

export function parseUserAgent(ua: string): Pick<RequestMeta, "browser" | "os" | "device" | "isBot"> {
  const isBot = !ua || BOT_RE.test(ua);

  let browser = "Unknown browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";
  else if (/SamsungBrowser/.test(ua)) browser = "Samsung Internet";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Chrome\/|CriOS/.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua)) browser = "Safari";

  let os = "Unknown OS";
  if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Mac OS X|Macintosh/.test(ua)) os = "macOS";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/CrOS/.test(ua)) os = "ChromeOS";
  else if (/Linux/.test(ua)) os = "Linux";

  const device = /iPad|Tablet/.test(ua) ? "Tablet" : /Mobi|iPhone|Android/.test(ua) ? "Mobile" : "Desktop";

  return { browser, os, device, isBot };
}

function decode(v: string | null): string | null {
  if (!v) return null;
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

/** City-level location from Vercel's geo headers (absent locally). */
export function approximateLocation(headers: Headers): string | null {
  const city = decode(headers.get("x-vercel-ip-city"));
  const region = headers.get("x-vercel-ip-country-region");
  const country = headers.get("x-vercel-ip-country");
  const parts = [city, region, country].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

const KNOWN_SOURCES: [RegExp, string][] = [
  [/linkedin|lnkd\.in/, "LinkedIn"],
  [/github/, "GitHub"],
  [/google\./, "Google"],
  [/bing\./, "Bing"],
  [/duckduckgo/, "DuckDuckGo"],
  [/t\.co$|twitter|x\.com/, "X / Twitter"],
  [/huggingface/, "Hugging Face"],
  [/handshake|joinhandshake/, "Handshake"],
  [/mail\.|outlook|gmail/, "Email"],
];

/**
 * Where the visitor came from. `src` is sent by the client (captured from the
 * landing page's referrer / ?utm_source / ?ref) because the download request's
 * own Referer is always this site.
 */
export function resolveSource(src: string | null, referer: string | null, ownHost: string): string {
  const cleaned = (src ?? "").toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 60);
  if (cleaned) {
    for (const [re, name] of KNOWN_SOURCES) if (re.test(cleaned)) return name;
    return cleaned;
  }
  if (referer) {
    try {
      const host = new URL(referer).hostname;
      if (host && host !== ownHost) {
        for (const [re, name] of KNOWN_SOURCES) if (re.test(host)) return name;
        return host;
      }
      return "Portfolio (direct visit)";
    } catch {
      /* fall through */
    }
  }
  return "Direct link";
}

export function collectMeta(req: Request): RequestMeta {
  const url = new URL(req.url);
  const ua = req.headers.get("user-agent") ?? "";
  return {
    ...parseUserAgent(ua),
    location: approximateLocation(req.headers),
    source: resolveSource(url.searchParams.get("src"), req.headers.get("referer"), url.hostname),
  };
}
