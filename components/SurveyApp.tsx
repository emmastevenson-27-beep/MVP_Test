"use client";

import { useState } from "react";
import { SECTION_ORDER, SECTION_TAB_LABELS, type SectionKey } from "@/lib/surveyConfig";
import Hero from "./Hero";
import SectionWizard from "./SectionWizard";

export default function SurveyApp() {
  const [activeTab, setActiveTab] = useState<SectionKey>(SECTION_ORDER[0]);

  return (
    <div className="app">
      <Hero />

      <div className="tabs">
        {SECTION_ORDER.map((key) => (
          <div
            key={key}
            className={`tab${activeTab === key ? " active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {SECTION_TAB_LABELS[key]}
          </div>
        ))}
      </div>

      <div id="panels">
        {SECTION_ORDER.map((key) => (
          <SectionWizard key={key} sectionKey={key} active={activeTab === key} />
        ))}
      </div>

      <div className="footer-note">
        Your responses are shared with the Restore team running this testing phase, so we can see how the whole group is doing.
      </div>
    </div>
  );
}
