"use client";

import type { Question as QuestionConfig } from "@/lib/surveyConfig";
import TextQuestion from "./TextQuestion";
import RadioQuestion from "./RadioQuestion";
import CheckboxQuestion from "./CheckboxQuestion";
import ScaleQuestion from "./ScaleQuestion";

type Props = {
  question: QuestionConfig;
  value: string;
  onChange: (value: string) => void;
};

export default function Question({ question, value, onChange }: Props) {
  return (
    <div className="q" data-qid={question.id} data-type={question.type}>
      <div className="qlabel">{question.label}</div>
      {question.type === "text" && <TextQuestion value={value} onChange={onChange} />}
      {question.type === "radio" && (
        <RadioQuestion qid={question.id} options={question.options ?? []} value={value} onChange={onChange} />
      )}
      {question.type === "checkbox" && (
        <CheckboxQuestion qid={question.id} options={question.options ?? []} value={value} onChange={onChange} />
      )}
      {question.type === "scale" && (
        <ScaleQuestion value={value} scaleLabels={question.scaleLabels} onChange={onChange} />
      )}
    </div>
  );
}
