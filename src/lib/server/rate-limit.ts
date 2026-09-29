import "server-only";

/**
 * Fixed-window, in-memory rate limiter.
 *
 * On Vercel each function instance has its own memory, so this is a
 * best-effort guard, not a global quota: it stops a single client from
 * hammering one warm instance (the common abuse case) without adding a
 * database. For hard global limits, swap the Map for Upstash Redis / Vercel KV.
 */
type Bucket = { count: number; resetAt: number };

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  return function check(key: string): { ok: boolean; retryAfterSec: number } {
    const now = Date.now();

    // Opportunistic cleanup so the map can't grow without bound.
    if (buckets.size > 5_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }

    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true, retryAfterSec: 0 };
    }
    bucket.count += 1;
    if (bucket.count > limit) {
      return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
    }
    return { ok: true, retryAfterSec: 0 };
  };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
