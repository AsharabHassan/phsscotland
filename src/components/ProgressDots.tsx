"use client";

interface ProgressDotsProps {
  current: number;
  total: number;
}

export function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <ol className="flex gap-1.5" aria-label="Progress">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const state =
          step < current ? "done" : step === current ? "active" : "pending";
        return (
          <li
            key={step}
            role="listitem"
            data-state={state}
            className={`h-2 w-2 rounded-full transition-colors ${
              state === "done"
                ? "bg-phs-navy"
                : state === "active"
                  ? "bg-phs-green"
                  : "bg-gray-300"
            }`}
            aria-label={`Step ${step}: ${state}`}
          />
        );
      })}
    </ol>
  );
}
