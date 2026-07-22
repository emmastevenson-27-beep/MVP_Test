// Ported verbatim (question set, ids, copy, ordering) from docs/restore_pilot_survey.html
// Question `id`s match the Supabase column names in supabase/schema.sql exactly.

export type QuestionType = "text" | "radio" | "checkbox" | "scale";

export type Question = {
  id: string;
  type: QuestionType;
  label: string;
  options?: string[];
  scaleLabels?: string[];
};

export type QuestionGroup = {
  title: string;
  note?: string;
  questions: Question[];
};

export type SectionConfig = {
  title: string;
  subtitle: string;
  groups: QuestionGroup[];
};

export type SectionKey = "onboarding" | "midprogram" | "endprogram";

export const SECTION_ORDER: SectionKey[] = ["onboarding", "midprogram", "endprogram"];

export const SECTION_TAB_LABELS: Record<SectionKey, string> = {
  onboarding: "Getting Started",
  midprogram: "Check-In",
  endprogram: "Wrap-Up",
};

const AGREE_SCALE = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
const FOCUS_SCALE = ["Strongly Disagree", "Disagree", "Neutral / haven't changed", "Agree", "Strongly Agree"];
const SATISFACTION_SCALE = ["Very dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very satisfied"];

export const CONFIGS: Record<SectionKey, SectionConfig> = {
  onboarding: {
    title: "Getting Started",
    subtitle: "Before you start using Restore",
    groups: [
      {
        title: "About you",
        questions: [
          { id: "day_description", type: "text", label: "In a sentence or two, what does a typical day look like for you right now (work, school, caregiving, etc.)?" },
          { id: "daily_rhythm", type: "radio", label: "Which best fits your daily rhythm?", options: ["Traditional 9-5 schedule", "Flexible or remote schedule", "Student schedule", "Caregiving / stay-at-home schedule", "Retired or no fixed schedule", "Other"] },
        ],
      },
      {
        title: "How you plan your day",
        questions: [
          { id: "tools_productivity", type: "checkbox", label: "Which planning or productivity tools do you use regularly? (Select all that apply)", options: ["Notion", "Todoist", "Reminders / Notes app", "Trello", "Paper planner or journal", "None", "Other"] },
          { id: "tools_scheduling", type: "checkbox", label: "Which scheduling or calendar tools do you rely on? (Select all that apply)", options: ["Google Calendar", "Apple Calendar", "Outlook", "Calendly", "None", "Other"] },
          { id: "tools_wellbeing", type: "checkbox", label: "Which wellbeing or health tracking tools do you currently use? (Select all that apply)", options: ["Oura", "Whoop", "Apple Health", "Fitbit", "Headspace", "Calm", "None", "Other"] },
        ],
      },
      {
        title: "Chronotype awareness",
        questions: [
          { id: "chrono_familiarity", type: "radio", label: "Before using Restore, how familiar were you with chronobiology — the study of your body's internal energy rhythms?", options: ["Not at all familiar", "Slightly familiar", "Moderately familiar", "Very familiar"] },
          { id: "chrono_clarity", type: "scale", label: "I have a clear sense of when I do my best focused or creative work during the day." },
        ],
      },
      {
        title: "Energy & stress baseline",
        questions: [
          { id: "drained_freq", type: "radio", label: "Over the past two weeks, how often have you felt mentally drained by the end of the day?", options: ["Rarely", "Sometimes", "Often", "Almost always"] },
          { id: "recovery_time", type: "scale", label: "I feel I have enough time to recover between demanding days." },
          { id: "low_energy_pressure", type: "scale", label: "I often feel pressure to keep going during times when I feel low energy or fatigued." },
          { id: "out_of_control", type: "scale", label: "I feel out of control when it comes to what happens in my day." },
          { id: "fulfilling", type: "scale", label: "I find my day-to-day life to be fulfilling." },
          { id: "trouble_focusing", type: "scale", label: "When I'm trying to focus, I have trouble concentrating." },
          { id: "trust_support", type: "scale", label: "I feel like the people around me support how I manage my energy and wellbeing." },
        ],
      },
      {
        title: "How you plan around energy",
        questions: [
          { id: "schedule_around_energy", type: "radio", label: "How often do you intentionally plan your most demanding tasks around your energy levels?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
          { id: "biggest_challenge", type: "text", label: "What's your biggest challenge when it comes to managing your energy during the day?" },
        ],
      },
      {
        title: "Wearable device",
        note: "Skip if you don't use a wearable",
        questions: [
          { id: "wearable_connected", type: "radio", label: "Have you connected a wearable to Restore?", options: ["Yes — Apple Watch", "Yes — Apple Health", "Yes — Fitbit", "Yes — Whoop", "Yes — Oura", "No, I don't have one", "No, but I plan to"] },
          { id: "wearable_familiarity", type: "radio", label: "How familiar are you with the metrics your wearable tracks (e.g. HRV, resting heart rate, sleep stages)?", options: ["Not at all", "Slightly", "Moderately", "Very familiar"] },
          { id: "wearable_check_freq", type: "scale", label: "I regularly check my wearable data to inform how I plan my day." },
        ],
      },
      {
        title: "Data & trust",
        questions: [
          { id: "security_confidence", type: "scale", label: "I feel confident that Restore will handle my personal and wearable data securely." },
          { id: "security_concerns", type: "text", label: "If you have any concerns about data privacy or security, please describe them." },
          { id: "optimism", type: "radio", label: "How optimistic are you that Restore will surface insights that feel personally relevant?", options: ["Not optimistic", "Slightly", "Moderately", "Very optimistic"] },
          { id: "intuitive_or_forced", type: "radio", label: "Does the idea of planning your day around your biology feel intuitive or forced?", options: ["Intuitive", "Forced", "A bit of both", "Not sure yet"] },
        ],
      },
    ],
  },

  midprogram: {
    title: "Mid-Point Check-In",
    subtitle: "~6 weeks in",
    groups: [
      {
        title: "Chronotype awareness",
        questions: [
          { id: "understanding_improved", type: "scale", label: "Since starting Restore, my understanding of my own energy patterns has improved." },
          { id: "chronotype_accurate", type: "scale", label: "The chronotype Restore assigned to me feels accurate." },
          { id: "windows_align_wearable", type: "scale", label: "The predicted high-energy windows align with when I actually feel sharp and focused." },
        ],
      },
      {
        title: "Energy & stress",
        questions: [
          { id: "drained_freq", type: "radio", label: "Over the past two weeks, how often have you felt mentally drained by the end of the day?", options: ["Rarely", "Sometimes", "Often", "Almost always"] },
          { id: "stress_vs_start", type: "radio", label: "Compared to when you started, your day-to-day stress level feels:", options: ["Much worse", "Slightly worse", "About the same", "Slightly better", "Much better"] },
          { id: "more_in_control", type: "scale", label: "I feel more in control of how I manage my energy day-to-day than I did before I started using Restore." },
          { id: "out_of_control", type: "scale", label: "I feel out of control when it comes to what happens in my day." },
          { id: "more_fulfillment", type: "scale", label: "I have been finding more fulfillment in my day-to-day life." },
          { id: "focus_when_aligned", type: "scale", label: "I have been able to focus more easily when I align my schedule with my biology.", scaleLabels: FOCUS_SCALE },
          { id: "trust_support", type: "scale", label: "I feel like the people around me support how I manage my energy and wellbeing." },
        ],
      },
      {
        title: "Planning around energy",
        questions: [
          { id: "adjusted_deep_work", type: "scale", label: "Since using Restore, I have adjusted when I schedule deep focus or creative time." },
          { id: "moved_declined_meetings", type: "scale", label: "I have rescheduled or skipped plans and commitments based on my energy insights." },
          { id: "specific_change", type: "text", label: "What is one specific change you've made or considered making to your schedule based on Restore?" },
        ],
      },
      {
        title: "Daily nudges",
        questions: [
          { id: "nudge_response_freq", type: "radio", label: "How often do you respond to Restore's daily nudge prompts?", options: ["Never", "Rarely (1–2x per week)", "Sometimes (3–4x per week)", "Almost always (daily)"] },
          { id: "nudge_relevant", type: "scale", label: "The nudge questions feel relevant to my actual day." },
          { id: "nudge_too_much_effort", type: "scale", label: "Responding to nudges takes too much effort relative to the value I get from them." },
        ],
      },
      {
        title: "Features",
        questions: [
          { id: "heatmap_useful", type: "scale", label: "How useful has the energy heatmap been in helping you understand your high- and low-energy windows?" },
          { id: "timeblocks_realistic", type: "scale", label: "The time block suggestions Restore provides feel realistic and actionable within your actual schedule." },
          { id: "features_valuable", type: "checkbox", label: "Which features have you found most valuable so far? (Select all that apply)", options: ["Energy heatmap", "Time block suggestions", "Daily nudge prompts", "Chronotype profile", "Wearable data integration", "Other"] },
          { id: "features_not_working", type: "text", label: "Which features do you wish worked differently, or aren't using?" },
          { id: "missing_feature", type: "text", label: "Is there a feature Restore doesn't currently have that would make it significantly more useful to you?" },
        ],
      },
      {
        title: "Data, trust & satisfaction",
        questions: [
          { id: "security_confidence", type: "scale", label: "I feel confident that Restore handles my personal and wearable data securely." },
          { id: "security_concerns", type: "text", label: "If you have any concerns about data privacy or security, please describe them." },
          { id: "satisfaction_so_far", type: "scale", label: "Overall, how satisfied are you with Restore so far?", scaleLabels: SATISFACTION_SCALE },
          { id: "could_do_better", type: "text", label: "What is one thing Restore could do better at this stage?" },
        ],
      },
    ],
  },

  endprogram: {
    title: "Wrap-Up",
    subtitle: "At the close of this testing phase",
    groups: [
      {
        title: "Chronotype awareness",
        questions: [
          { id: "understanding_improved", type: "scale", label: "My understanding and awareness of my own energy patterns has meaningfully improved since using Restore." },
          { id: "chronotype_accurate", type: "scale", label: "The chronotype Restore assigned to me accurately reflects how I actually experience my energy." },
          { id: "windows_matched_wearable", type: "scale", label: "Over the course of this testing phase, the predicted high-energy windows consistently matched when I felt most capable of focused work." },
        ],
      },
      {
        title: "Energy & stress",
        questions: [
          { id: "drained_freq", type: "radio", label: "Over the past two weeks, how often have you felt mentally drained by the end of the day?", options: ["Rarely", "Sometimes", "Often", "Almost always"] },
          { id: "more_equipped", type: "scale", label: "By the end of this testing phase, I feel more equipped to manage my energy across the day than I did at the start." },
          { id: "reduced_pressure", type: "scale", label: "Using Restore reduced how often I felt pressured to push through during low-energy periods." },
          { id: "more_in_control_vs_start", type: "scale", label: "I feel more in control of what happens in my day than I did before this testing phase started." },
          { id: "more_fulfillment_recent", type: "scale", label: "I have been finding more fulfillment in my day-to-day life recently." },
          { id: "focus_when_aligned", type: "scale", label: "I have been able to focus more easily when I align my schedule with my biology.", scaleLabels: FOCUS_SCALE },
          { id: "trust_support", type: "scale", label: "I feel like the people around me support how I manage my energy and wellbeing." },
        ],
      },
      {
        title: "Planning around energy",
        questions: [
          { id: "adjust_freq_overall", type: "radio", label: "How often did you adjust your schedule based on Restore's insights over the course of this testing phase?", options: ["Never", "Rarely", "Sometimes", "Often", "Consistently"] },
          { id: "positive_impact", type: "scale", label: "The schedule adjustments I made based on Restore had a positive impact on my focus or wellbeing." },
          { id: "meaningful_change", type: "text", label: "Describe the most meaningful change you made to how you approach your day as a result of Restore." },
        ],
      },
      {
        title: "Daily nudges",
        questions: [
          { id: "nudges_helped_awareness", type: "scale", label: "Over the course of this testing phase, nudge prompts helped me stay more aware of my energy state during the day." },
          { id: "nudge_frequency_appropriate", type: "radio", label: "The frequency of nudge prompts felt appropriate.", options: ["Too frequent", "About right", "Not frequent enough"] },
        ],
      },
      {
        title: "Features",
        questions: [
          { id: "heatmap_useful_overall", type: "scale", label: "How useful was the energy heatmap in helping you understand and plan around your high- and low-energy windows?" },
          { id: "timeblocks_helped_structure", type: "scale", label: "The time block suggestions Restore provided helped me structure my day more effectively." },
          { id: "features_valuable_overall", type: "checkbox", label: "Which features were most valuable to you over the course of this testing phase? (Select all that apply)", options: ["Energy heatmap", "Time block suggestions", "Daily nudge prompts", "Chronotype profile", "Wearable data integration", "Other"] },
          { id: "features_least_useful", type: "text", label: "Which features were least useful or hardest to engage with?" },
          { id: "feature_to_add", type: "text", label: "If you could add one feature to Restore, what would it be?" },
        ],
      },
      {
        title: "Overall satisfaction",
        questions: [
          { id: "security_confidence", type: "scale", label: "I feel confident that Restore handles my personal and wearable data securely." },
          { id: "overall_satisfaction", type: "scale", label: "Overall, how satisfied are you with your Restore experience?", scaleLabels: SATISFACTION_SCALE },
          { id: "want_to_continue", type: "scale", label: "I would want to continue using Restore after this testing phase ends." },
          { id: "would_recommend", type: "scale", label: "I would recommend Restore to a friend." },
          { id: "most_valuable_thing", type: "text", label: "What is the single most valuable thing Restore gave you during this testing phase?" },
          { id: "wish_different", type: "text", label: "What is the one thing you wish Restore did differently?" },
        ],
      },
    ],
  },
};

export const MAX_PER_SLIDE = 5;

export type Slide = {
  title: string;
  note?: string;
  questions: Question[];
};

// Chunk each group into slides of at most MAX_PER_SLIDE questions
export function buildSlides(cfg: SectionConfig): Slide[] {
  const slides: Slide[] = [];
  cfg.groups.forEach((group) => {
    const qs = group.questions;
    for (let i = 0; i < qs.length; i += MAX_PER_SLIDE) {
      const chunk = qs.slice(i, i + MAX_PER_SLIDE);
      const isContinuation = i > 0;
      slides.push({
        title: group.title + (isContinuation ? " (cont.)" : ""),
        note: isContinuation ? undefined : group.note,
        questions: chunk,
      });
    }
  });
  return slides;
}

export function getDefaultScaleLabels(): string[] {
  return AGREE_SCALE;
}

// Flattened list of every question in a section — the single source of truth
// the API route derives its column allowlist from, so the form and the
// database insert can never drift out of sync.
export function getSectionQuestions(section: SectionKey): Question[] {
  return CONFIGS[section].groups.flatMap((g) => g.questions);
}
