"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import type { IssueSeverity, ServiceType } from "@/types";

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

interface ServicePricing {
  rateLabel: string;
  startsFrom: string | null;
}

const servicePricing: Record<ServiceType, ServicePricing> = {
  "wall-coating": {
    rateLabel: "£40/sqm",
    startsFrom: "£1,950",
  },
  "roof-coating": {
    rateLabel: "£25–£40/sqm",
    startsFrom: "£1,450",
  },
  "chemical-cleaning": {
    rateLabel: "Price on consultation",
    startsFrom: null,
  },
  "exterior-painting": {
    rateLabel: "Price on consultation",
    startsFrom: null,
  },
};

export function AssessmentResults() {
  const assessment = useAppStore((s) => s.assessment);
  const photoPreview = useAppStore((s) => s.photoPreview);
  const afterImage = useAppStore((s) => s.afterImage);
  const goToStep = useAppStore((s) => s.goToStep);
  const [expanded, setExpanded] = useState(false);

  if (!assessment) {
    return (
      <div className="flex flex-col items-center px-5 py-16 text-center">
        <span className="mb-4 text-5xl">⚠️</span>
        <h2 className="text-lg font-extrabold text-foreground mb-2">
          Assessment Unavailable
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          We couldn&apos;t analyse your photo. Please try again with a clear
          image of your property&apos;s exterior.
        </p>
        <button
          onClick={() => goToStep(2)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-phs-green to-phs-green-dark px-6 text-sm font-bold text-white"
        >
          ↩ Try Again
        </button>
      </div>
    );
  }

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

      {/* Pricing Section */}
      {assessment.recommendations.length > 0 && (
        <div className="mx-5 my-3">
          <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-gray-500">
            Estimated Pricing
          </h3>
          <div className="space-y-2">
            {assessment.recommendations.map((rec) => {
              const pricing = servicePricing[rec.service];
              return (
                <div
                  key={rec.service}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {rec.label}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {pricing.rateLabel}
                    </div>
                  </div>
                  {pricing.startsFrom ? (
                    <div className="text-right">
                      <div className="text-[10px] font-semibold uppercase text-gray-400">
                        Starts from
                      </div>
                      <div className="text-base font-extrabold text-phs-green-dark">
                        {pricing.startsFrom}
                      </div>
                    </div>
                  ) : (
                    <span className="rounded-lg bg-phs-navy/10 px-2.5 py-1 text-[11px] font-bold text-phs-navy">
                      Get Quote
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[10px] text-gray-400">
            * Final pricing confirmed after FREE on-site survey
          </p>
        </div>
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
