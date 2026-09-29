import "server-only";
import { site } from "@/lib/site";
import type { RequestMeta } from "./request-meta";

/**
 * Sends email through Resend's REST API (no SDK needed).
 * Returns a result instead of throwing: callers run this after the response
 * has been sent, and a failure must never affect the visitor.
 */
type SendResult = { ok: true; id: string } | { ok: false; reason: string };

async function sendEmail(input: { subject: string; text: string; html: string }): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!apiKey || !to) return { ok: false, reason: "RESEND_API_KEY or NOTIFY_EMAIL_TO not set" };

  const from = process.env.NOTIFY_EMAIL_FROM || "Portfolio <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), ...input }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return { ok: false, reason: `Resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id ?? "unknown" };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function notifyResumeDownload(event: {
  id: string;
  at: Date;
  meta: RequestMeta;
}): Promise<SendResult> {
  // dateStyle/timeStyle can't be combined with timeZoneName, so spell out the parts.
  const time = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: site.timezone,
    timeZoneName: "short",
  }).format(event.at);

  const rows: [string, string][] = [
    ["Time", time],
    ["Source", event.meta.source],
    ["Device", `${event.meta.browser} / ${event.meta.os} (${event.meta.device})`],
    ["Approx. location", event.meta.location ?? "Unavailable"],
    ["Event ID", event.id],
  ];

  const subject = `Resume downloaded${event.meta.location ? ` · ${event.meta.location}` : ""}`;
  const text = `Someone downloaded your resume.\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n`;
  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;color:#111;padding:24px">
<p style="font-size:15px;margin:0 0 16px">Someone downloaded your resume.</p>
<table style="border-collapse:collapse;font-size:14px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:6px 0;font-family:ui-monospace,monospace">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>
<p style="font-size:12px;color:#888;margin-top:24px">Location is city-level from Vercel's edge network. No IP address or personal data is stored.</p>
</body></html>`;

  return sendEmail({ subject, text, html });
}
