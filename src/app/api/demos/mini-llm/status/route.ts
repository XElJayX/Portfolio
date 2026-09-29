import { getSpaceState, poke } from "@/lib/server/hf-space";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = createRateLimiter({ limit: 60, windowMs: 60_000 });

/** GET /api/demos/mini-llm/status[?wake=1] → { state, stage } */
export async function GET(req: Request) {
  if (!limiter(clientIp(req)).ok) {
    return Response.json({ state: "error", error: "rate_limited" }, { status: 429 });
  }

  const { state, stage } = await getSpaceState();
  const wake = new URL(req.url).searchParams.get("wake") === "1";
  if (wake && state === "asleep") poke();

  return Response.json(
    { state: wake && state === "asleep" ? "waking" : state, stage },
    { headers: { "Cache-Control": "no-store" } },
  );
}
