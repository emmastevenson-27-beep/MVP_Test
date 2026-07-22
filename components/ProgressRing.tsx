"use client";

import type { CSSProperties } from "react";

type Props = {
  currentIndex: number; // 0-based
  total: number;
  title: string;
  note?: string;
};

export default function ProgressRing({ currentIndex, total, title, note }: Props) {
  const pctBeforeThisSlide = Math.round((currentIndex / total) * 100);
  const pctThroughThisSlide = Math.round(((currentIndex + 1) / total) * 100);
  const ringStyle = { "--deg": `${pctBeforeThisSlide * 3.6}deg` } as CSSProperties;

  return (
    <>
      <div className="progress-row">
        <div className="ring">
          <div className="fill" style={ringStyle} />
          <div className="hole">
            {currentIndex + 1}/{total}
          </div>
        </div>
        <div className="progress-meta">
          <p className="group-title">{title}</p>
          {note && <p className="group-note">{note}</p>}
        </div>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pctThroughThisSlide}%` }} />
      </div>
    </>
  );
}
