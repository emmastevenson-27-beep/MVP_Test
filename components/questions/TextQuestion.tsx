"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TextQuestion({ value, onChange }: Props) {
  return (
    <textarea
      rows={2}
      placeholder="Type your answer…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
