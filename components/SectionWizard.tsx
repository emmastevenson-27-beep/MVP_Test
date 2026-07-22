"use client";

import { useState } from "react";
import { CONFIGS, buildSlides, type SectionKey } from "@/lib/surveyConfig";
import Question from "./questions/Question";
import ProgressRing from "./ProgressRing";
import DoneCard from "./DoneCard";

type Props = {
  sectionKey: SectionKey;
  active: boolean;
};

export default function SectionWizard({ sectionKey, active }: Props) {
  const cfg = CONFIGS[sectionKey];
  const slides = buildSlides(cfg);

  const [started, setStarted] = useState(false);
  const [pid, setPid] = useState("");
  const [pidDraft, setPidDraft] = useState("");
  const [pidError, setPidError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [statusKind, setStatusKind] = useState<"" | "err">("");

  function updateAnswer(qid: string, value: string) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function handleStart() {
    const val = pidDraft.trim();
    if (!val) {
      setPidError(true);
      return;
    }
    setPid(val);
    setPidError(false);
    setStarted(true);
    setCurrent(0);
  }

  async function handleNext(isLast: boolean) {
    if (!isLast) {
      setCurrent((c) => c + 1);
      return;
    }
    setSubmitting(true);
    setStatusText("Saving…");
    setStatusKind("");
    try {
      const res = await fetch(`/api/responses/${sectionKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: pid, answers }),
      });
      if (!res.ok) throw new Error("request failed");
      setDone(true);
    } catch (err) {
      console.error(err);
      setStatusText("Could not save — please try again.");
      setStatusKind("err");
      setSubmitting(false);
    }
  }

  function handleBack() {
    setCurrent((c) => c - 1);
  }

  return (
    <div className={`panel${active ? " active" : ""}`}>
      {done ? (
        <DoneCard />
      ) : !started ? (
        <div className="gate">
          <h2>{cfg.title}</h2>
          <p className="desc">{cfg.subtitle} — this will take about 3-5 minutes, in short bite-sized steps.</p>
          <label>Your name or email</label>
          <input
            type="text"
            placeholder="e.g. jane@email.com"
            value={pidDraft}
            onChange={(e) => {
              setPidDraft(e.target.value);
              if (pidError) setPidError(false);
            }}
            style={pidError ? { borderColor: "#B4483B" } : undefined}
          />
          <div className="hint">
            Use the same name or email each time so we can match up your Getting Started, Check-In, and Wrap-Up answers.
          </div>
          <button className="primary" onClick={handleStart}>
            Start
          </button>
        </div>
      ) : (
        (() => {
          const slide = slides[current];
          const total = slides.length;
          const isLast = current === total - 1;
          return (
            <>
              <ProgressRing currentIndex={current} total={total} title={slide.title} note={slide.note} />
              <div className="slide">
                {slide.questions.map((q) => (
                  <Question key={q.id} question={q} value={answers[q.id] ?? ""} onChange={(v) => updateAnswer(q.id, v)} />
                ))}
              </div>
              <div className="nav-row">
                {current > 0 && (
                  <button className="ghost" onClick={handleBack} disabled={submitting}>
                    Back
                  </button>
                )}
                <button className="primary" onClick={() => handleNext(isLast)} disabled={submitting}>
                  {isLast ? "Submit response" : "Next"}
                </button>
              </div>
              <div className={`status${statusKind ? ` ${statusKind}` : ""}`}>{statusText}</div>
            </>
          );
        })()
      )}
    </div>
  );
}
