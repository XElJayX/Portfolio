import { generate, UpstreamError } from "@/lib/server/hf-space";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const limiter = createRateLimiter({ limit: 12, windowMs: 60_000 });
const MAX_PROMPT = 200;

type ErrorCode = "invalid_input" | "rate_limited" | "asleep" | "unavailable";
const fail = (error: ErrorCode, status: number, extra?: HeadersInit) =>
  Response.json({ error }, { status, headers: extra });

/** POST /api/demos/mini-llm { prompt, temperature? } → { response, latencyMs } */
export async function POST(req: Request) {
  const rl = limiter(clientIp(req));
  if (!rl.ok) return fail("rate_limited", 429, { "Retry-After": String(rl.retryAfterSec) });

  const body = (await req.json().catch(() => null)) as { prompt?: unknown; temperature?: unknown } | null;
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt || prompt.length > MAX_PROMPT) return fail("invalid_input", 400);

  const t = typeof body?.temperature === "number" && Number.isFinite(body.temperature) ? body.temperature : 0.8;
  const temperature = Math.min(1.2, Math.max(0.2, t));

  const started = Date.now();
  try {
    const response = await generate(prompt, temperature);
    return Response.json({ response, latencyMs: Date.now() - started });
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    // HF returns 503 / HTML while a Space is starting.
    if (timedOut || (err instanceof UpstreamError && [502, 503, 504].includes(err.status))) {
      return fail("asleep", 503);
    }
    console.error("[mini-llm] generate failed", err);
    return fail("unavailable", 502);
  }
}
