import { readFile } from "node:fs/promises";
import path from "node:path";
import { after } from "next/server";
import { site } from "@/lib/site";
import { notifyResumeDownload } from "@/lib/server/email";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";
import { collectMeta } from "@/lib/server/request-meta";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Downloads: generous, only stops scripted hammering.
const downloadLimiter = createRateLimiter({ limit: 20, windowMs: 60_000 });
// Emails: one per visitor per 10 minutes (re-clicks don't spam the inbox)…
const emailPerIp = createRateLimiter({ limit: 1, windowMs: 10 * 60_000 });
// …and a per-instance ceiling so a distributed flood can't burn the email quota.
const emailGlobal = createRateLimiter({ limit: 30, windowMs: 60 * 60_000 });

let cachedPdf: Buffer | null = null;
async function loadPdf(): Promise<Buffer> {
  cachedPdf ??= await readFile(path.join(process.cwd(), "public", site.resume.file));
  return cachedPdf;
}

function pdfHeaders(length: number): HeadersInit {
  return {
    "Content-Type": "application/pdf",
    "Content-Length": String(length),
    "Content-Disposition": `attachment; filename="${site.resume.downloadName}"`,
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
  };
}

export async function GET(req: Request) {
  const ip = clientIp(req);
  const limited = downloadLimiter(ip);
  if (!limited.ok) {
    return new Response("Too many requests. Please try again shortly.", {
      status: 429,
      headers: { "Retry-After": String(limited.retryAfterSec) },
    });
  }

  let pdf: Buffer;
  try {
    pdf = await loadPdf();
  } catch (err) {
    console.error("[resume] PDF missing from bundle", err);
    // Fall back to the static copy so the visitor still gets the file.
    return Response.redirect(new URL(`/${site.resume.file}`, req.url), 302);
  }

  const event = { id: crypto.randomUUID().slice(0, 8), at: new Date(), meta: collectMeta(req) };

  // Everything below runs after the file has been sent. A slow or failing
  // email provider can never delay or block the download.
  after(async () => {
    console.log(
      JSON.stringify({
        type: "resume_download",
        id: event.id,
        at: event.at.toISOString(),
        source: event.meta.source,
        device: `${event.meta.browser}/${event.meta.os}`,
        location: event.meta.location,
        bot: event.meta.isBot,
      }),
    );

    if (event.meta.isBot) return;
    if (!emailPerIp(ip).ok || !emailGlobal("global").ok) {
      console.log(`[resume] notification throttled for ${event.id}`);
      return;
    }

    const result = await notifyResumeDownload(event);
    if (!result.ok) console.warn(`[resume] notification skipped for ${event.id}: ${result.reason}`);
  });

  return new Response(new Uint8Array(pdf), { status: 200, headers: pdfHeaders(pdf.byteLength) });
}

// Link unfurlers and download managers often probe with HEAD; answer without notifying.
export async function HEAD() {
  try {
    const pdf = await loadPdf();
    return new Response(null, { status: 200, headers: pdfHeaders(pdf.byteLength) });
  } catch {
    return new Response(null, { status: 404 });
  }
}
