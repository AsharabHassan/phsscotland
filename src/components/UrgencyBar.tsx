"use client";

import { useState, useEffect } from "react";

export function UrgencyBar() {
  const [seconds, setSeconds] = useState(24 * 60 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return (
    <div className="bg-gradient-to-r from-urgency-red to-urgency-orange text-white text-center py-2 px-3 text-xs font-bold tracking-wide animate-pulse">
      ⚡ LIMITED OFFER — FREE Assessment Ends In: {h}:{m}:{s}
    </div>
  );
}
