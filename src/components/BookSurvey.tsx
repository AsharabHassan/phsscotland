"use client";

import { useAppStore } from "@/store/useAppStore";

export function BookSurvey() {
  const leadData = useAppStore((s) => s.leadData);

  const baseUrl = process.env.NEXT_PUBLIC_GHL_CALENDAR_URL ?? "";

  const params = new URLSearchParams();
  if (leadData) {
    params.set("name", leadData.name);
    params.set("email", leadData.email);
    params.set("phone", leadData.phone);
  }

  const iframeSrc = baseUrl + (baseUrl.includes("?") ? "&" : "?") + params.toString();

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-5 pb-3 text-center">
        <h2 className="text-lg font-extrabold text-foreground">
          📅 Book Your FREE Survey
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Pick a date and time that works for you
        </p>
      </div>

      {baseUrl ? (
        <div className="mx-5 mb-5 overflow-hidden rounded-xl border-2 border-gray-200">
          <iframe
            src={iframeSrc}
            title="Book a survey"
            className="h-[500px] w-full border-0"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mx-5 mb-5 rounded-xl border-2 border-gray-200 p-8 text-center">
          <p className="text-sm font-semibold text-gray-600 mb-3">
            Calendar loading...
          </p>
          <p className="text-xs text-gray-400">
            Having trouble?{" "}
            <a href="tel:+447000000000" className="font-bold text-phs-navy">
              Call us to book
            </a>
          </p>
        </div>
      )}

      <p className="px-5 pb-5 text-center text-xs text-gray-400">
        We&apos;ll WhatsApp you a reminder before your survey 💬
      </p>
    </div>
  );
}
