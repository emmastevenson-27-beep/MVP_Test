"use client";

import { getDefaultScaleLabels } from "@/lib/surveyConfig";

type Props = {
  value: string;
  scaleLabels?: string[];
  onChange: (value: string) => void;
};

export default function ScaleQuestion({ value, scaleLabels, onChange }: Props) {
  const labels = scaleLabels ?? getDefaultScaleLabels();
  const selected = value ? Number(value) : null;

  return (
    <div className="scale">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`sc${selected === n ? " checked" : ""}`}
          onClick={() => onChange(String(n))}
        >
          <span className="num">{n}</span>
          <span className="lbl">{labels[n - 1]}</span>
        </div>
      ))}
    </div>
  );
}
