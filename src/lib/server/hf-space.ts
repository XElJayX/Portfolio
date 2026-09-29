import "server-only";

/**
 * Hugging Face Space integration for the Mini LLM demo.
 *
 * Findings from inspecting the Space (ElJayy/mini-llm):
 *  - Public Docker Space; no auth needed.
 *  - FastAPI app exposes POST /generate {prompt, max_new_tokens, temperature}
 *    and GET /health, with permissive CORS.
 *  - Free cpu-basic hardware sleeps after 48h idle. Any request to the
 *    *.hf.space origin wakes it; the Hub API reports the runtime stage.
 *
 * We still proxy through our own route instead of calling it from the browser,
 * so we can validate input, rate-limit, cap generation length, and turn cold
 * starts into a clear UI state.
 */
export const SPACE_ID = process.env.HF_SPACE_ID || "ElJayy/mini-llm";
export const SPACE_URL = (process.env.HF_SPACE_URL || "https://eljayy-mini-llm.hf.space").replace(/\/$/, "");

export type SpaceState = "ready" | "waking" | "asleep" | "paused" | "error";

function authHeaders(): HeadersInit {
  return process.env.HF_TOKEN ? { Authorization: `Bearer ${process.env.HF_TOKEN}` } : {};
}

async function stageFromHub(): Promise<string | null> {
  try {
    const res = await fetch(`https://huggingface.co/api/spaces/${SPACE_ID}`, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { runtime?: { stage?: string } };
    return data.runtime?.stage ?? null;
  } catch {
    return null;
  }
}

export async function healthy(timeoutMs = 4_000): Promise<boolean> {
  try {
    const res = await fetch(`${SPACE_URL}/health`, { signal: AbortSignal.timeout(timeoutMs), cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

/** Fire-and-forget request that makes Hugging Face start a sleeping Space. */
export function poke(): void {
  fetch(`${SPACE_URL}/health`, { signal: AbortSignal.timeout(3_000), cache: "no-store" }).catch(() => {});
}

export async function getSpaceState(): Promise<{ state: SpaceState; stage: string | null }> {
  const stage = await stageFromHub();

  switch (stage) {
    case "RUNNING":
      // Hub says running; confirm the app itself answers.
      return { state: (await healthy()) ? "ready" : "waking", stage };
    case "SLEEPING":
    case "STOPPED":
      return { state: "asleep", stage };
    case "PAUSED":
      return { state: "paused", stage };
    case "BUILDING":
    case "APP_STARTING":
    case "RUNNING_BUILDING":
    case "RUNNING_APP_STARTING":
      return { state: "waking", stage };
    case null:
      // Hub API unreachable — fall back to probing the app directly.
      return { state: (await healthy()) ? "ready" : "error", stage };
    default:
      return { state: "error", stage }; // BUILD_ERROR, RUNTIME_ERROR, CONFIG_ERROR, …
  }
}

export async function generate(prompt: string, temperature: number): Promise<string> {
  const res = await fetch(`${SPACE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, temperature, max_new_tokens: 100 }),
    signal: AbortSignal.timeout(25_000),
    cache: "no-store",
  });
  if (!res.ok) throw new UpstreamError(res.status);
  const data = (await res.json().catch(() => null)) as { response?: unknown } | null;
  if (!data || typeof data.response !== "string") throw new UpstreamError(502);
  return data.response;
}

export class UpstreamError extends Error {
  constructor(public status: number) {
    super(`Upstream responded ${status}`);
  }
}
