// Answers are stored per-question as the same flattened string format the
// original artifact submits to the server (radio/checkbox selections as
// their label text, "Other: <text>" for free text, checkboxes pipe-joined).
// These helpers convert that string back into the selection state a
// controlled <input> needs to render, and back again on change.

export const OTHER_LABEL = "Other";

export function formatOtherAware(label: string, otherText: string): string {
  if (label !== OTHER_LABEL) return label;
  const trimmed = otherText.trim();
  return trimmed ? `${OTHER_LABEL}: ${trimmed}` : OTHER_LABEL;
}

export function parseRadioValue(
  value: string,
  options: string[]
): { selected: string; otherText: string } {
  if (!value) return { selected: "", otherText: "" };
  if (value === OTHER_LABEL || value.startsWith(`${OTHER_LABEL}: `)) {
    if (options.includes(OTHER_LABEL)) {
      return { selected: OTHER_LABEL, otherText: value.slice(`${OTHER_LABEL}: `.length) === value ? "" : value.slice(`${OTHER_LABEL}: `.length) };
    }
  }
  return { selected: options.includes(value) ? value : "", otherText: "" };
}

export function parseCheckboxValue(
  value: string,
  options: string[]
): { selected: Set<string>; otherText: string } {
  const selected = new Set<string>();
  let otherText = "";
  if (!value) return { selected, otherText };
  const parts = value.split(" | ").map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    if (part === OTHER_LABEL || part.startsWith(`${OTHER_LABEL}: `)) {
      if (options.includes(OTHER_LABEL)) {
        selected.add(OTHER_LABEL);
        otherText = part === OTHER_LABEL ? "" : part.slice(`${OTHER_LABEL}: `.length);
      }
    } else if (options.includes(part)) {
      selected.add(part);
    }
  }
  return { selected, otherText };
}

export function formatCheckboxValue(selected: Set<string>, otherText: string, options: string[]): string {
  const labels = options.filter((opt) => selected.has(opt));
  return labels.map((label) => formatOtherAware(label, otherText)).join(" | ");
}
