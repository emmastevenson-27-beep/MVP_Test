"use client";

import { formatOtherAware, parseRadioValue, OTHER_LABEL } from "@/lib/answers";

type Props = {
  qid: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function RadioQuestion({ qid, options, value, onChange }: Props) {
  const { selected, otherText } = parseRadioValue(value, options);

  function selectOption(label: string) {
    onChange(formatOtherAware(label, label === OTHER_LABEL ? otherText : ""));
  }

  function updateOtherText(text: string) {
    onChange(formatOtherAware(OTHER_LABEL, text));
  }

  return (
    <div className="options">
      {options.map((opt) => {
        const checked = selected === opt;
        return (
          <div key={opt}>
            <label className={`opt${checked ? " checked" : ""}`}>
              <input
                type="radio"
                name={qid}
                checked={checked}
                onChange={() => selectOption(opt)}
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
