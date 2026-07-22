-- Run this once in the Supabase SQL editor (or via the Supabase CLI) after
-- creating the project. Source of truth: docs/restore_survey_handoff_spec.md

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

-- RLS is enabled with no policies attached. The app never exposes a
-- Supabase key to the browser — all access goes through API routes using
-- the service_role key, which always bypasses RLS. This just makes sure
-- nothing else (an anon/authenticated key, if one is ever added later)
-- can read or write these tables.
alter table onboarding_responses enable row level security;
alter table midprogram_responses enable row level security;
alter table endprogram_responses enable row level security;
