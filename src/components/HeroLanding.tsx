"use client";

import { useAppStore } from "@/store/useAppStore";

export function HeroLanding() {
  const goToStep = useAppStore((s) => s.goToStep);
  const setEntryPath = useAppStore((s) => s.setEntryPath);

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <div className="w-full bg-gradient-to-b from-phs-green-50 to-white px-5 pt-7 pb-5 text-center">
        <span className="inline-block rounded-full bg-urgency-red px-3 py-1 text-xs font-extrabold text-white mb-3.5">
          🎯 FREE AI ASSESSMENT
        </span>
        <h1 className="text-2xl font-extrabold leading-tight text-foreground mb-3">
          Get Your <span className="text-phs-green">FREE</span> Exterior
          Assessment in <span className="text-phs-green">60 Seconds!</span>
        </h1>
        <p className="text-sm leading-relaxed text-gray-500 mb-6">
          Upload a photo of your property and our AI instantly identifies issues
          &amp; recommends solutions
        </p>
      </div>

      {/* Stats */}
      <div className="flex w-full justify-center gap-6 bg-gray-50 py-3">
        {[
          { num: "2,400+", label: "Homes Treated" },
          { num: "15+", label: "Years Experience" },
          { num: "10yr", label: "Guarantee" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-xl font-extrabold text-phs-navy">
              {stat.num}
            </div>
            <div className="text-[9px] font-semibold uppercase text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex w-full flex-col gap-3 px-5 py-5">
        <button
          onClick={() => {
            setEntryPath("photo");
            goToStep(2);
          }}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-br from-phs-green to-phs-green-dark text-[17px] font-extrabold text-white shadow-lg shadow-phs-green/40 transition-transform active:scale-[0.98]"
        >
          📸 Upload / Take a Photo
        </button>
        <button
          onClick={() => {
            setEntryPath("no-photo");
            goToStep(3);
          }}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-phs-navy text-[15px] font-bold text-phs-navy transition-transform active:scale-[0.98]"
        >
          📝 No Photo? Get Your Link
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex w-full justify-center gap-5 border-t border-gray-100 py-4">
        {[
          { icon: "🛡️", label: "Fully Insured" },
          { icon: "✅", label: "Certified" },
          { icon: "🏆", label: "Award Winner" },
          { icon: "💬", label: "Free Quotes" },
        ].map((badge) => (
          <div key={badge.label} className="text-center">
            <div className="text-xl">{badge.icon}</div>
            <div className="text-[9px] font-semibold uppercase text-gray-400 tracking-tight">
              {badge.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
