"use client";

import { track } from "@vercel/analytics";
import { useId, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight } from "../icons";
import { btn, cx, StatusDot, Tag } from "../ui";

type Result =
  | { kind: "ok"; sql: string; tables: string[]; columns: string[]; rows: (string | number | null)[][]; totalRows: number; latencyMs: number }
  | { kind: "sql_failed"; sql: string; tables: string[]; latencyMs: number }
  | { kind: "error"; code: string };

const EXAMPLES = [
  "How many active subscriptions are there?",
  "Which companies have cancelled their subscriptions?",
  "What is the total revenue collected per plan?",
  "Which users have never logged in?",
];

const FULL_DEMO = "https://texttosql-frontend.vercel.app";

const ERRORS: Record<string, string> = {
  rate_limited: "Each query spends real LLM quota, so it's limited to a few per minute. Try again shortly.",
  invalid_input: "Questions need to be between 3 and 300 characters.",
  unavailable: "Demo temporarily unavailable — the backend isn't responding right now.",
  network: "Couldn't reach the server. Check your connection and try again.",
};

export function TextToSqlDemo() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const inputId = useId();

  async function run(q: string) {
    const text = q.trim();
    if (!text || loading) return;
    setQuestion(text);
    setLoading(true);
    setResult(null);
    track("demo_run", { project: "text-to-sql" });
    try {
      const res = await fetch("/api/demos/text-to-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json().catch(() => ({ error: "unavailable" }));
      if (!res.ok || data.error) setResult({ kind: "error", code: data.error ?? "unavailable" });
      else if (data.status === "sql_failed") setResult({ kind: "sql_failed", ...data });
      else setResult({ kind: "ok", ...data });
    } catch {
      setResult({ kind: "error", code: "network" });
    }
    setLoading(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run(question);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-elev">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-subtle/60 px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <StatusDot tone={result?.kind === "error" ? "offline" : "idle"} />
          text-to-sql · SaaS metrics DB · 7 tables
        </div>
        <span className="hidden font-mono text-[11px] text-faint sm:inline">FastAPI on Railway</span>
      </div>

      <form onSubmit={onSubmit} className="border-b border-line p-3">
        <label htmlFor={inputId} className="sr-only">
          Question for the database
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={300}
            placeholder="Ask the database a question in plain English…"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2.5 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
          />
          <button type="submit" disabled={loading || question.trim().length < 3} className={btn.accent} aria-label="Run query">
            <span className="hidden sm:inline">{loading ? "Running…" : "Run"}</span>
            <ArrowRight />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((q) => (
            <button
              key={q}
              type="button"
              disabled={loading}
              onClick={() => void run(q)}
              className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-accent/60 hover:text-fg disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </form>

      <div className="min-h-56 p-4" aria-live="polite" aria-busy={loading}>
        {loading && (
          <div className="space-y-3">
            <p className="font-mono text-xs text-muted">
              retrieve tables <span className="text-faint">→</span> generate SQL <span className="text-faint">→</span> validate{" "}
              <span className="text-faint">→</span> execute
            </p>
            <div className="h-16 rounded-lg shimmer" />
            <div className="h-24 rounded-lg shimmer" />
          </div>
        )}

        {!loading && !result && (
          <p className="text-sm text-muted">
            Pick an example or write your own. You&apos;ll see which tables retrieval selected, the SQL the model wrote, and
            the rows PostgreSQL returned.
          </p>
        )}

        {result?.kind === "error" && (
          <div className="space-y-4">
            <p className="text-sm">
              <span className="font-medium">{ERRORS[result.code] ?? ERRORS.unavailable}</span>
            </p>
            {result.code === "unavailable" && (
              <p className="text-sm text-muted">
                The architecture, evaluation results, and source code are all on this page.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <a href={FULL_DEMO} target="_blank" rel="noopener noreferrer" className={cx(btn.secondary, "!text-xs")}>
                Open full demo <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        )}

        {(result?.kind === "ok" || result?.kind === "sql_failed") && (
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">Retrieved tables</p>
              <div className="flex flex-wrap gap-1.5">
                {result.tables.length ? result.tables.map((t) => <Tag key={t}>{t}</Tag>) : <span className="text-sm text-muted">—</span>}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
                Generated SQL <span className="normal-case tracking-normal">· {result.latencyMs} ms end-to-end</span>
              </p>
              <pre className="overflow-x-auto rounded-lg border border-line bg-bg p-3 font-mono text-[12.5px] leading-relaxed">
                <code>{result.sql}</code>
              </pre>
            </div>

            {result.kind === "sql_failed" ? (
              <p className="rounded-lg border border-warn/30 bg-warn/5 p-3 text-sm text-muted">
                <span className="font-medium text-fg">This query didn&apos;t pass validation or execution.</span> It&apos;s one of the
                failure modes the evaluation measures — usually a retrieval miss or a misplaced aggregate.
              </p>
            ) : (
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
                  Results · {result.totalRows} row{result.totalRows === 1 ? "" : "s"}
                  {result.totalRows > result.rows.length ? ` (showing ${result.rows.length})` : ""}
                </p>
                {result.rows.length === 0 ? (
                  <p className="text-sm text-muted">The query ran successfully and returned no rows.</p>
                ) : (
                  <div className="max-h-72 overflow-auto rounded-lg border border-line">
                    <table className="w-full border-collapse text-left font-mono text-xs">
                      <thead className="sticky top-0 bg-subtle">
                        <tr>
                          {result.columns.map((c) => (
                            <th key={c} scope="col" className="whitespace-nowrap border-b border-line px-3 py-2 font-medium">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((r, i) => (
                          <tr key={i} className="odd:bg-bg/50">
                            {r.map((v, j) => (
                              <td key={j} className="whitespace-nowrap border-b border-line/60 px-3 py-1.5 text-muted">
                                {v === null ? <span className="text-faint">null</span> : String(v)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
