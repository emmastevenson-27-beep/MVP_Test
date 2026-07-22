# Restore Testing-Phase Survey — Handoff Spec for Claude Code

## Goal
Turn the finalized survey artifact (branded, paginated, three-stage) into a deployed
app: Next.js frontend on Vercel, Supabase Postgres as the source of truth, and a
weekly automated snapshot into a Google Sheet. No SQL knowledge required day-to-day —
Claude (chat) will write and explain any query needed.

## Reference
The finalized question set, branding tokens, and paginated UI pattern live in the
attached `restore_pilot_survey.html` artifact. Treat it as the design and content
source of truth — same three stages (Getting Started / Check-In / Wrap-Up), same
questions, same navy/ice-blue/gold Restore branding, same 1–5-question-per-slide
pagination with the circular progress ring. Port it into React components rather
than rebuilding from scratch.

## Tech stack
- **Frontend**: Next.js (App Router), deployed on Vercel (repo + Vercel already connected)
- **Database**: Supabase Postgres (new project — needs to be created first, see Setup below)
- **Weekly sync**: Vercel Cron job → queries Supabase → writes to Google Sheets via
  a service account (new service account — needs to be created, see Setup below)

## Database schema
Three tables, one per survey stage, each keyed by `participant_id` so the three
stages can be joined for a given person. Scale questions are constrained `smallint`
1–5; radio and checkbox answers are stored as their selected label text (checkbox
answers pipe-delimited, e.g. `"Notion | Trello | Other: Bullet journal"`) so the
raw table stays human-readable without a join to a separate options table.

```sql
create table onboarding_responses (
  id bigint generated always as identity primary key,
  participant_id text not null,
  submitted_at timestamptz not null default now(),
  day_description text,
  daily_rhythm text,
  tools_productivity text,
  tools_scheduling text,
  tools_wellbeing text,
  chrono_familiarity text,
  chrono_clarity smallint check (chrono_clarity between 1 and 5),
  drained_freq text,
  recovery_time smallint check (recovery_time between 1 and 5),
  low_energy_pressure smallint check (low_energy_pressure between 1 and 5),
  out_of_control smallint check (out_of_control between 1 and 5),
  fulfilling smallint check (fulfilling between 1 and 5),
  trouble_focusing smallint check (trouble_focusing between 1 and 5),
  trust_support smallint check (trust_support between 1 and 5),
  schedule_around_energy text,
  biggest_challenge text,
  wearable_connected text,
  wearable_familiarity text,
  wearable_check_freq smallint check (wearable_check_freq between 1 and 5),
  security_confidence smallint check (security_confidence between 1 and 5),
  security_concerns text,
  optimism text,
  intuitive_or_forced text
);

create table midprogram_responses (
  id bigint generated always as identity primary key,
  participant_id text not null,
  submitted_at timestamptz not null default now(),
  understanding_improved smallint check (understanding_improved between 1 and 5),
  chronotype_accurate smallint check (chronotype_accurate between 1 and 5),
  windows_align_wearable smallint check (windows_align_wearable between 1 and 5),
  drained_freq text,
  stress_vs_start text,
  more_in_control smallint check (more_in_control between 1 and 5),
  out_of_control smallint check (out_of_control between 1 and 5),
  more_fulfillment smallint check (more_fulfillment between 1 and 5),
  focus_when_aligned smallint check (focus_when_aligned between 1 and 5),
  trust_support smallint check (trust_support between 1 and 5),
  adjusted_deep_work smallint check (adjusted_deep_work between 1 and 5),
  moved_declined_meetings smallint check (moved_declined_meetings between 1 and 5),
  specific_change text,
  nudge_response_freq text,
  nudge_relevant smallint check (nudge_relevant between 1 and 5),
  nudge_too_much_effort smallint check (nudge_too_much_effort between 1 and 5),
  heatmap_useful smallint check (heatmap_useful between 1 and 5),
  timeblocks_realistic smallint check (timeblocks_realistic between 1 and 5),
  features_valuable text,
  features_not_working text,
  missing_feature text,
  security_confidence smallint check (security_confidence between 1 and 5),
  security_concerns text,
  satisfaction_so_far smallint check (satisfaction_so_far between 1 and 5),
  could_do_better text
);

create table endprogram_responses (
  id bigint generated always as identity primary key,
  participant_id text not null,
  submitted_at timestamptz not null default now(),
  understanding_improved smallint check (understanding_improved between 1 and 5),
  chronotype_accurate smallint check (chronotype_accurate between 1 and 5),
  windows_matched_wearable smallint check (windows_matched_wearable between 1 and 5),
  drained_freq text,
  more_equipped smallint check (more_equipped between 1 and 5),
  reduced_pressure smallint check (reduced_pressure between 1 and 5),
  more_in_control_vs_start smallint check (more_in_control_vs_start between 1 and 5),
  more_fulfillment_recent smallint check (more_fulfillment_recent between 1 and 5),
  focus_when_aligned smallint check (focus_when_aligned between 1 and 5),
  trust_support smallint check (trust_support between 1 and 5),
  adjust_freq_overall text,
  positive_impact smallint check (positive_impact between 1 and 5),
  meaningful_change text,
  nudges_helped_awareness smallint check (nudges_helped_awareness between 1 and 5),
  nudge_frequency_appropriate text,
  heatmap_useful_overall smallint check (heatmap_useful_overall between 1 and 5),
  timeblocks_helped_structure smallint check (timeblocks_helped_structure between 1 and 5),
  features_valuable_overall text,
  features_least_useful text,
  feature_to_add text,
  security_confidence smallint check (security_confidence between 1 and 5),
  overall_satisfaction smallint check (overall_satisfaction between 1 and 5),
  want_to_continue smallint check (want_to_continue between 1 and 5),
  would_recommend smallint check (would_recommend between 1 and 5),
  most_valuable_thing text,
  wish_different text
);
```

## API contract
One route per stage (or one parameterized route `/api/responses/[section]`):

- `POST /api/responses/onboarding`
- `POST /api/responses/midprogram`
- `POST /api/responses/endprogram`

Request body:
```json
{
  "participantId": "jane@email.com",
  "answers": {
    "day_description": "...",
    "daily_rhythm": "Flexible or remote schedule",
    "chrono_clarity": 4
  }
}
```

Server inserts a new row into the matching table (`submitted_at` defaults to
`now()` — don't rely on client clocks). Upsert behavior is a decision point: allow
multiple rows per participant per stage (append-only, simplest, lets you see if
someone re-submits) vs. one row per participant per stage (upsert on
`participant_id`). Recommend **append-only** for the testing phase — it's simpler,
nothing is ever silently overwritten, and duplicates are trivial to filter out later
with SQL (`DISTINCT ON` or `MAX(submitted_at)`).

## Environment variables (Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only, used in API routes — never exposed to the client)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`

## Weekly Google Sheet sync
A Vercel Cron job (`vercel.json` schedule, e.g. every Monday 8am) hits an API route
that:
1. Queries all three Supabase tables
2. Writes each to its own tab in the target Google Sheet (`onboarding`,
   `midprogram`, `endprogram`), overwriting the tab contents each run so it's
   always a clean current snapshot
3. Uses the Google service account credentials (see Setup) via the
   `googleapis` npm package's Sheets API

## Setup — steps that need a human in a browser
Claude Code can't click through account-creation UIs, so these need to happen once,
either by Emma before Claude Code starts, or walked through live:

1. **Supabase**: go to supabase.com → New Project → note the project URL and
   service role key (Project Settings → API). Claude Code can then run the schema
   above via the Supabase SQL editor or CLI.
2. **Google Cloud service account** (for Sheets access):
   - Create a Google Cloud project (console.cloud.google.com)
   - Enable the "Google Sheets API"
   - Create a service account, generate a JSON key
   - Create (or reuse) a target Google Sheet, share it with the service account's
     email address (found in the JSON key) as **Editor**
   - Copy the Sheet's ID (from its URL) for `GOOGLE_SHEET_ID`

## Testing checklist
- [ ] Submit one full response per stage through the live Vercel URL
- [ ] Confirm three rows land in the correct Supabase tables with correct types
      (scale columns numeric, checkbox columns pipe-delimited)
- [ ] Manually trigger the cron route once and confirm the Google Sheet tabs populate
- [ ] Confirm a bad/partial submission doesn't crash the form (missing participant ID, etc.)
