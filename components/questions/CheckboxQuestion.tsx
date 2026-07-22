"use client";

import { formatCheckboxValue, parseCheckboxValue, OTHER_LABEL } from "@/lib/answers";

type Props = {
  qid: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function CheckboxQuestion({ qid, options, value, onChange }: Props) {
  const { selected, otherText } = parseCheckboxValue(value, options);

  function toggle(label: string) {
    const next = new Set(selected);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    onChange(formatCheckboxValue(next, otherText, options));
  }

  function updateOtherText(text: string) {
    onChange(formatCheckboxValue(selected, text, options));
  }

  return (
    <div className="options">
      {options.map((opt) => {
        const checked = selected.has(opt);
        return (
          <div key={opt}>
            <label className={`opt${checked ? " checked" : ""}`}>
              <input
                type="checkbox"
                name={`${qid}_${opt}`}
                checked={checked}
                onChange={() => toggle(opt)}
              />
              {opt}
            </label>
            {opt === OTHER_LABEL && (
              <input
                className={`other-input${checked ? " show" : ""}`}
                type="text"
                placeholder="Please specify"
                value={otherText}
                onChange={(e) => updateOtherText(e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
