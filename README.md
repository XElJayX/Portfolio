# Jayanth Ravimurugan — Portfolio

Personal site for an AI Engineer: interactive project demos, case studies, and a
one-click resume with privacy-conscious download notifications.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Vercel

## Structure

```
src/
  app/
    page.tsx                         Home: hero → projects → about → experience → skills → resume → contact
    projects/[slug]/page.tsx         Case studies (statically generated)
    api/resume/download/route.ts     Tracked resume download + email notification
    api/demos/mini-llm/route.ts      Proxy → Hugging Face Space (POST /generate)
    api/demos/mini-llm/status/…      Space runtime stage + wake-up
    api/demos/text-to-sql/route.ts   Proxy → Text-to-SQL FastAPI backend (Railway)
    sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg, not-found.tsx
  components/                        UI, sections, demos
  lib/
    content.ts                       ALL portfolio content (projects, experience, skills)
    site.ts                          Identity, links, resume file name
    server/                          Server-only: email, rate limiting, HF client, request metadata
public/Jayanth_Ravimurugan_Resume.pdf
```

To update content, edit `src/lib/content.ts` and `src/lib/site.ts`. To replace
the resume, overwrite `public/Jayanth_Ravimurugan_Resume.pdf` (keep the name, or
update `site.resume.file`).

## Local development

```bash
npm install
cp .env.example .env.local   # optional; everything works without it except email
npm run dev                  # http://localhost:3000
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | For email | Resend API key (https://resend.com/api-keys) |
| `NOTIFY_EMAIL_TO` | For email | Where download notifications go |
| `NOTIFY_EMAIL_FROM` | No | Sender. Default `onboarding@resend.dev` only delivers to the Resend account owner's address |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for SEO. Defaults to Vercel's production domain |
| `HF_SPACE_ID`, `HF_SPACE_URL` | No | Mini LLM Space. Defaults to `ElJayy/mini-llm` |
| `HF_TOKEN` | No | Raises Hugging Face Hub API rate limits for status checks |
| `TEXT_TO_SQL_API_URL` | No | Text-to-SQL backend. Defaults to the Railway deployment |

Secrets are only read in server code (`src/lib/server/*`, marked `server-only`).

## How resume tracking works

1. Every "Download resume" button links to `GET /api/resume/download` (plain link — works without JS).
2. The route streams the PDF immediately with `Content-Disposition: attachment`.
3. Using Next's `after()` (Vercel `waitUntil` under the hood), *after* the response is sent it:
   - logs a structured `resume_download` event (visible in Vercel → Logs),
   - skips bots/link unfurlers,
   - throttles to one email per visitor per 10 minutes (and 30/hour per instance),
   - emails you via Resend: time, source, browser/OS, city-level location, event ID.
4. If Resend is down or unconfigured, the download is unaffected; the failure is logged.

**Source attribution:** on landing, the site stores (per tab, in `sessionStorage`) the
`utm_source`/`ref` param or the external referrer's hostname and appends it as `?src=` to
the download link. Share links like `https://your-site/?ref=linkedin` to see "Source: LinkedIn".

**Privacy:** no cookies, no IP stored or emailed, no fingerprinting. Location comes from
Vercel's `x-vercel-ip-*` headers at city granularity.

**Limits:** rate limits are in-memory per serverless instance (best effort). For hard
global limits, back `createRateLimiter` with Upstash Redis.

## How the live demos work

**Mini LLM (Hugging Face Space `ElJayy/mini-llm`):** public Docker Space running FastAPI
(`POST /generate`, `GET /health`). `huggingface.co/spaces/...` refuses framing
(`X-Frame-Options: DENY`), so rather than an iframe the portfolio has a native UI that calls
`/api/demos/mini-llm`, which proxies to the Space. The model stays where it is.
Free Spaces sleep after 48h idle: the UI checks the Hub API's runtime stage when the demo
scrolls into view, wakes the Space if needed, and shows a "waking up" state with elapsed
time (up to 3 minutes) before falling back to an error with Retry and an external link.

**Text-to-SQL:** native UI → `/api/demos/text-to-sql` → Railway FastAPI `POST /query`.
Shows retrieved tables, generated SQL, and results. Rate-limited to 6/min per visitor
because each query spends Groq quota. On backend failure it shows a clear fallback.

**AutoReviewer:** the Railway deployment is offline, so the case study shows unedited
screenshots of a real review the agent posted.

## Analytics

Vercel Web Analytics (`@vercel/analytics`) is cookie-less. Enable it under
Vercel → Project → Analytics. Page views cover visitors, referrers, countries, and which
project pages are viewed. Custom events (`resume_download`, `demo_run`) are sent too;
Vercel shows them on Pro plans.

## Deploying

The Vercel project deploys from this repo. `vercel.json` pins the framework to Next.js,
so the switch from the old static `index.html` needs no dashboard changes. Add the
environment variables above in Vercel → Settings → Environment Variables and redeploy.
