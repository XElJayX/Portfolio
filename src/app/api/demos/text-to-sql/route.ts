import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 40;

/**
 * Proxy to the Text-to-SQL FastAPI backend on Railway (POST /query).
 * Proxying lets us validate input, rate-limit (each call spends Groq quota),
 * cap result size, and avoid surfacing raw backend error strings.
 */
const API_URL = (process.env.TEXT_TO_SQL_API_URL || "https://texttosql-production-b579.up.railway.app").replace(/\/$/, "");
const MAX_ROWS = 50;

const limiter = createRateLimiter({ limit: 6, windowMs: 60_000 });

type Upstream = {
  sql?: string;
  results?: unknown[][] | null;
  success?: boolean;
  error?: string | null;
  retrieved_tables?: string[] | null;
  columns?: string[] | null;
};

const cell = (v: unknown): string | number | null =>
  v === null || v === undefined ? null : typeof v === "number" ? v : String(v).slice(0, 200);

export async function POST(req: Request) {
  const rl = limiter(clientIp(req));
  if (!rl.ok) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });
  }

  const body = (await req.json().catch(() => null)) as { question?: unknown } | null;
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (question.length < 3 || question.length > 300) {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  const started = Date.now();
  let data: Upstream;
  try {
    const res = await fetch(`${API_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, execute: true }),
      signal: AbortSignal.timeout(30_000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    data = (await res.json()) as Upstream;
  } catch (err) {
    console.error("[text-to-sql] upstream failed", err);
    return Response.json({ error: "unavailable" }, { status: 502 });
  }

  const latencyMs = Date.now() - started;
  const rows = (data.results ?? []).slice(0, MAX_ROWS).map((r) => (Array.isArray(r) ? r.map(cell) : []));

  if (!data.success) {
    // The model produced SQL that failed validation or execution — a real,
    // showable outcome. Anything else is treated as backend unavailability.
    if (data.sql) {
      return Response.json({ status: "sql_failed", sql: data.sql, tables: data.retrieved_tables ?? [], latencyMs });
    }
    return Response.json({ error: "unavailable" }, { status: 502 });
  }

  return Response.json({
    status: "ok",
    sql: data.sql ?? "",
    tables: data.retrieved_tables ?? [],
    columns: data.columns ?? [],
    rows,
    totalRows: data.results?.length ?? 0,
    latencyMs,
  });
}
