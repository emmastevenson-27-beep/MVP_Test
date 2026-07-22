import { getSectionQuestions, SECTION_ORDER, type SectionKey } from "./surveyConfig";

// Maps each survey stage to its Supabase table, per docs/restore_survey_handoff_spec.md.
export const SECTION_TABLES: Record<SectionKey, string> = {
  onboarding: "onboarding_responses",
  midprogram: "midprogram_responses",
  endprogram: "endprogram_responses",
};

export function isSectionKey(value: string): value is SectionKey {
  return (SECTION_ORDER as string[]).includes(value);
}

// Column allowlist per section, derived from the question set so the API
// route can never insert a column that isn't an actual survey question.
export function getSectionColumns(section: SectionKey): string[] {
  return getSectionQuestions(section).map((q) => q.id);
}

// "scale" questions map to smallint (1-5) columns; everything else is text.
export function getSmallintColumns(section: SectionKey): Set<string> {
  return new Set(
    getSectionQuestions(section)
      .filter((q) => q.type === "scale")
      .map((q) => q.id)
  );
}
