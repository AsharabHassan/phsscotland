"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function LeadCaptureForm() {
  const entryPath = useAppStore((s) => s.entryPath);
  const setLeadData = useAppStore((s) => s.setLeadData);
  const goToStep = useAppStore((s) => s.goToStep);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postcode, setPostcode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [thankYou, setThankYou] = useState(false);
  const [error, setError] = useState("");

  const isPhoto = entryPath === "photo";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const lead = { name, email, phone, postcode };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, path: entryPath }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setLeadData(lead);

      if (isPhoto) {
        goToStep(4);
      } else {
        setThankYou(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (thankYou) {
    return (
      <div className="flex flex-col items-center px-5 py-12 text-center">
        <span className="mb-4 text-5xl">✅</span>
        <h2 className="text-xl font-extrabold text-foreground mb-2">
          Check Your Email &amp; WhatsApp!
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          We&apos;ve sent you the link to get your FREE assessment. Open it
          anytime to analyse your property.
        </p>
        <a
          href="https://wa.me/447000000000"
          className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-green-500 px-6 text-sm font-bold text-white"
        >
          💬 WhatsApp Us
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-5 pb-2 text-center">
        {isPhoto ? (
          <>
            <span className="inline-block rounded-full bg-phs-green px-2.5 py-1 text-[10px] font-extrabold text-white mb-2.5">
              ✅ ASSESSMENT READY
            </span>
            <h2 className="text-lg font-extrabold text-foreground">
              Your Results Are Ready!
            </h2>
            <p className="mt-1.5 text-xs text-gray-400">
              Enter your details to see your FREE assessment
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-extrabold text-foreground">
              Get Your Assessment Link
            </h2>
            <p className="mt-1.5 text-xs text-gray-400">
              We&apos;ll send you the link to assess your property
            </p>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col px-5 pt-4 pb-5">
        <div className="mb-3">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
            Your Name
          </label>
          <input
            type="text"
            required
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-3.5 py-3 text-sm outline-none focus:border-phs-green"
          />
        </div>
        <div className="mb-3">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-3.5 py-3 text-sm outline-none focus:border-phs-green"
          />
        </div>
        <div className="mb-3">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
            Phone Number
          </label>
          <input
            type="tel"
            required
            placeholder="07700 900000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-3.5 py-3 text-sm outline-none focus:border-phs-green"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
            Postcode
          </label>
          <input
            type="text"
            required
            placeholder="EH1 1AA"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-3.5 py-3 text-sm outline-none focus:border-phs-green"
          />
        </div>

        {error && (
          <p className="mb-3 text-center text-xs font-semibold text-urgency-red">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`flex h-14 w-full items-center justify-center rounded-2xl text-base font-extrabold text-white shadow-lg transition-transform active:scale-[0.98] ${
            isPhoto
              ? "bg-gradient-to-r from-urgency-red to-urgency-orange shadow-urgency-red/30"
              : "bg-gradient-to-br from-phs-green to-phs-green-dark shadow-phs-green/40"
          } ${submitting ? "opacity-60" : ""}`}
        >
          {submitting
            ? "Submitting..."
            : isPhoto
              ? "🔓 Show My Results"
              : "📩 Send Me The Link"}
        </button>

        <p className="mt-3 text-center text-[10px] text-gray-400">
          🔒 Your data is safe. We never share your information.
        </p>
      </form>
    </div>
  );
}
