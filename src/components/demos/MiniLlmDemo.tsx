"use client";

import { track } from "@vercel/analytics";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Refresh } from "../icons";
import { btn, cx, StatusDot } from "../ui";

type SpaceState = "idle" | "checking" | "ready" | "waking" | "asleep" | "paused" | "error" | "timeout";
type Turn = { id: number; prompt: string; response?: string; latencyMs?: number; error?: string; pending?: boolean };

const SPACE_PAGE = "https://huggingface.co/spaces/ElJayy/mini-llm";
const POLL_MS = 5_000;
const WAKE_TIMEOUT_MS = 180_000;
const SUGGESTIONS = ["What are your skills?", "Where did you study?", "What is your Text-to-SQL project?", "What research have you published?"];

const ERRORS: Record<string, string> = {
  asleep: "The model went back to sleep mid-request. Give it a few seconds and try again.",
  rate_limited: "That's a lot of prompts in a minute — wait a moment and try again.",
  invalid_input: "Prompts need to be between 1 and 200 characters.",
  unavailable: "Demo temporarily unavailable. You can open the full project on Hugging Face instead.",
  network: "Couldn't reach the server. Check your connection and try again.",
};

export function MiniLlmDemo({ compact = false }: { compact?: boolean }) {
  const [space, setSpace] = useState<SpaceState>("idle");
  const wakeStarted = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.8);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const inputId = useId();
  const tempId = useId();

  const check = useCallback(async (wake: boolean) => {
    try {
      const res = await fetch(`/api/demos/mini-llm/status${wake ? "?wake=1" : ""}`, { cache: "no-store" });
      const data = (await res.json()) as { state: SpaceState };
      setSpace(data.state);
      return data.state;
    } catch {
      setSpace("error");
      return "error" as const;
    }
  }, []);

  // Only check (and wake) the model once the demo is actually on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          io.disconnect();
          setSpace("checking");
          void check(true);
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [check]);

  // Poll while the Space boots; give up after WAKE_TIMEOUT_MS.
  useEffect(() => {
    if (space !== "waking") return;
    const started = (wakeStarted.current ??= Date.now());
    const tick = setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 1000);
    const poll = setInterval(() => {
      if (Date.now() - started > WAKE_TIMEOUT_MS) setSpace("timeout");
      else void check(false);
    }, POLL_MS);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [space, check]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  function retry() {
    wakeStarted.current = null;
    setElapsed(0);
    setSpace("checking");
    void check(true);
  }

  async function run(text: string) {
    const p = text.trim();
    if (!p || busy) return;
    const id = nextId.current++;
    setTurns((t) => [...t.slice(-5), { id, prompt: p, pending: true }]);
    setPrompt("");
    setBusy(true);
    track("demo_run", { project: "mini-llm" });

    let patch: Partial<Turn>;
    try {
      const res = await fetch("/api/demos/mini-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p, temperature }),
      });
      const data = (await res.json().catch(() => ({ error: "unavailable" }))) as {
        response?: string;
        latencyMs?: number;
        error?: string;
      };
      if (res.ok && typeof data.response === "string") {
        patch = { response: data.response || "(the model produced an empty completion — try another prompt)", latencyMs: data.latencyMs };
      } else {
        patch = { error: ERRORS[data.error ?? "unavailable"] ?? ERRORS.unavailable };
        if (data.error === "asleep") {
          wakeStarted.current = null;
          setSpace("waking");
        }
      }
    } catch {
      patch = { error: ERRORS.network };
    }
    setTurns((t) => t.map((x) => (x.id === id ? { ...x, ...patch, pending: false } : x)));
    setBusy(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run(prompt);
  }

  const ready = space === "ready";
  const failed = space === "error" || space === "timeout" || space === "paused";

  return (
    <div ref={rootRef} className="overflow-hidden rounded-xl border border-line bg-elev shadow-[0_1px_0_0_var(--line)]">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-subtle/60 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted">
          <StatusDot tone={ready ? "live" : failed ? "offline" : "warn"} />
          <span className="truncate">
            mini-llm · 273K params ·{" "}
            <span className={ready ? "text-accent" : failed ? "text-danger" : "text-warn"}>
              {
                {
                  idle: "standby",
                  checking: "connecting…",
                  ready: "online",
                  waking: "waking up",
                  asleep: "asleep",
                  paused: "paused",
                  error: "unreachable",
                  timeout: "slow to start",
                }[space]
              }
            </span>
          </span>
        </div>
        <span className="hidden font-mono text-[11px] text-faint sm:inline">Hugging Face Space · CPU</span>
      </div>

      {/* Status banners */}
      <div aria-live="polite">
        {(space === "waking" || space === "asleep") && (
          <div className="flex items-start gap-3 border-b border-line bg-warn/5 px-4 py-3 text-sm">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warn pulse-dot" aria-hidden />
            <p className="text-muted">
              <span className="font-medium text-fg">Model is waking up</span> — free-tier Spaces sleep when idle. This
              usually takes under two minutes.{" "}
              <span className="font-mono text-xs tabular-nums text-faint">{elapsed}s</span>
            </p>
          </div>
        )}
        {failed && (
          <div className="flex flex-col gap-3 border-b border-line bg-danger/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted">
              <span className="font-medium text-fg">Demo temporarily unavailable.</span>{" "}
              {space === "timeout"
                ? "The model is taking longer than usual to start."
                : space === "paused"
                  ? "The Space is paused on Hugging Face."
                  : "The model host isn't responding right now."}
            </p>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={retry} className={cx(btn.secondary, "!py-1.5 !text-xs")}>
                <Refresh className="size-3.5" /> Retry
              </button>
              <a href={SPACE_PAGE} target="_blank" rel="noopener noreferrer" className={cx(btn.ghost, "!py-1.5 !text-xs")}>
                Open on Hugging Face <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Transcript */}
      <div
        ref={logRef}
        className={cx("overflow-y-auto px-4 py-4", compact ? "h-56 sm:h-64" : "h-72 sm:h-80")}
        role="log"
        aria-live="polite"
        aria-label="Model responses"
      >
        {turns.length === 0 ? (
          <div className="flex h-full flex-col justify-center">
            <p className="text-sm text-muted">
              Ask it something about me. It was trained from scratch on ~100 Q&amp;A pairs, so expect a small model&apos;s
              answers — that&apos;s the point.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={!ready || busy}
                  onClick={() => void run(s)}
                  className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-accent/60 hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ol className="space-y-4">
            {turns.map((t) => (
              <li key={t.id} className="space-y-2 text-sm">
                <p className="font-mono text-xs text-faint">
                  <span className="text-accent">›</span> {t.prompt}
                </p>
                {t.pending ? (
                  <div className="space-y-1.5" aria-label="Generating">
                    <div className="h-3 w-3/4 rounded shimmer" />
                    <div className="h-3 w-1/2 rounded shimmer" />
                  </div>
                ) : t.error ? (
                  <p className="text-danger">{t.error}</p>
                ) : (
                  <div>
                    <p className="leading-relaxed">{t.response}</p>
                    {t.latencyMs !== undefined && (
                      <p className="mt-1 font-mono text-[11px] text-faint tabular-nums">{t.latencyMs} ms round-trip</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="border-t border-line p-3">
        <div className="flex gap-2">
          <label htmlFor={inputId} className="sr-only">
            Prompt
          </label>
          <input
            id={inputId}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={200}
            placeholder={ready ? "Ask the model a question…" : "Waiting for the model…"}
            autoComplete="off"
            className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2.5 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
          />
          <button type="submit" disabled={!ready || busy || !prompt.trim()} className={btn.accent} aria-label="Generate">
            <span className="hidden sm:inline">{busy ? "Generating…" : "Generate"}</span>
            <ArrowRight />
          </button>
        </div>
        <div className="mt-2.5 flex items-center gap-3 px-1">
          <label htmlFor={tempId} className="font-mono text-[11px] text-faint">
            temperature
          </label>
          <input
            id={tempId}
            type="range"
            min={0.2}
            max={1.2}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="h-1 w-28 cursor-pointer accent-[var(--accent)]"
          />
          <span className="font-mono text-[11px] tabular-nums text-muted">{temperature.toFixed(1)}</span>
        </div>
      </form>
    </div>
  );
}
