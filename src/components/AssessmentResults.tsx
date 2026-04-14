"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import type { IssueSeverity } from "@/types";

const conditionStyles = {
  good: { bg: "bg-green-100", text: "text-green-800", label: "GOOD CONDITION" },
  fair: { bg: "bg-amber-100", text: "text-amber-800", label: "FAIR CONDITION" },
  poor: { bg: "bg-red-100", text: "text-red-800", label: "POOR CONDITION" },
};

const severityColor: Record<IssueSeverity, string> = {
  high: "bg-severity-high",
  medium: "bg-severity-med",
  low: "bg-severity-low",
};

export function AssessmentResults() {
  const assessment = useAppStore((s) => s.assessment);
  const photoPreview = useAppStore((s) => s.photoPreview);
  const afterImage = useAppStore((s) => s.afterImage);
  const goToStep = useAppStore((s) => s.goToStep);
  const [expanded, setExpanded] = useState(false);

  if (!assessment) return null;

  const style = conditionStyles[assessment.overallCondition];

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-4 pb-2 text-center">
        <span
          className={`inline-block rounded-full px-4 py-1.5 text-xs font-extrabold ${style.bg} ${style.text} mb-2`}
        >
          {assessment.overallCondition === "poor" ? "🔴" : assessment.overallCondition === "fair" ? "⚠️" : "✅"}{" "}
          {style.label}
        </span>
        <h2 className="text-base font-bold text-foreground">
          We found {assessment.issues.length} issue
          {assessment.issues.length !== 1 && "s"} with your exterior
        </h2>
      </div>

      <div className="px-5 pb-3">
        {assessment.issues.map((issue) => (
          <div
            key={issue.name}
            className="flex items-start gap-2.5 border-b border-gray-100 py-2.5"
          >
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityColor[issue.severity]}`}
            />
            <div>
              <div className="text-sm font-bold text-foreground">
                {issue.name}
              </div>
              <div className="text-xs text-gray-400">{issue.description}</div>
            </div>
          </div>
        ))}
      </div>

      {photoPreview && afterImage && (
        <BeforeAfterSlider beforeSrc={photoPreview} afterSrc={afterImage} />
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="mx-5 my-3 rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-center text-xs font-semibold text-phs-navy"
      >
        📋 View Full Report &amp; Recommendations{" "}
        {expanded ? "▴" : "▾"}
      </button>

      {expanded && (
        <div className="px-5 pb-4">
          <p className="mb-3 text-sm text-gray-600 leading-relaxed">
            {assessment.summary}
          </p>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
            Recommended Services
          </h3>
          {assessment.recommendations.map((rec) => (
            <div
              key={rec.service}
              className="mb-2 rounded-lg border border-phs-green-100 bg-phs-green-50 p-3"
            >
              <div className="text-sm font-bold text-phs-green-dark">
                {rec.label}
              </div>
              <div className="text-xs text-gray-500">{rec.reason}</div>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 pb-5">
        <button
          onClick={() => goToStep(5)}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-phs-navy to-phs-navy-dark text-base font-extrabold text-white shadow-lg shadow-phs-navy/30 transition-transform active:scale-[0.98]"
        >
          📅 Book Your FREE Survey
        </button>
      </div>
    </div>
  );
}
