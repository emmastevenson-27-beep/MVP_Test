# Restore — Testing Phase Survey

Next.js (App Router) port of the branded, three-stage pilot survey
(`docs/restore_pilot_survey.html`), backed by Supabase Postgres, with a
weekly Vercel Cron job that snapshots all responses into a Google Sheet.

Full handoff spec: [`docs/restore_survey_handoff_spec.md`](docs/restore_survey_handoff_spec.md).

## Local development

```bash
npm install
cp .env.local.example .env.local   # fill in real values, see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.local.example`. Required:

- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — from a Supabase project (Project Settings -> API)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GOOGLE_SHEET_ID` — from a Google Cloud service account with Sheets access
- `CRON_SECRET` (optional) — if set, `/api/cron/sheet-sync` requires it as a bearer token

Add the same variables in Vercel: Project Settings -> Environment Variables.

## Database

Schema lives in `supabase/schema.sql` — run it once in the Supabase SQL
editor. Three append-only tables (`onboarding_responses`,
`midprogram_responses`, `endprogram_responses`), one row per submission.

## Weekly Google Sheet sync

`vercel.json` schedules `GET /api/cron/sheet-sync` for Monday 12:00 UTC
(8am Eastern Daylight Time). Vercel Cron schedules are fixed UTC and don't
shift for daylight saving — once clocks fall back in November, this will
run at 7am Eastern instead of 8am. Update the `schedule` in `vercel.json`
to `"0 13 * * 1"` if you want to correct for that.

The target Google Sheet needs three tabs named exactly `onboarding`,
`midprogram`, and `endprogram` — the sync route clears and rewrites each
tab's contents on every run.

You can trigger a sync manually by visiting `/api/cron/sheet-sync` in a
browser (or `curl`) once env vars are set.

## Deploying

This repo is already connected to Vercel. Push to `main` (or open a PR) to
deploy; set the environment variables above in the Vercel dashboard before
the first deploy that needs them.
