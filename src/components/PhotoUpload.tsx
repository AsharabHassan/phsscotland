"use client";

import { useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

export function PhotoUpload() {
  const photo = useAppStore((s) => s.photo);
  const photoPreview = useAppStore((s) => s.photoPreview);
  const isAnalysing = useAppStore((s) => s.isAnalysing);
  const setPhoto = useAppStore((s) => s.setPhoto);
  const setIsAnalysing = useAppStore((s) => s.setIsAnalysing);
  const setAssessment = useAppStore((s) => s.setAssessment);
  const setAfterImage = useAppStore((s) => s.setAfterImage);
  const goToStep = useAppStore((s) => s.goToStep);

  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const preview = URL.createObjectURL(file);
    setPhoto(file, preview);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clearPhoto() {
    setPhoto(null as unknown as File, null as unknown as string);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function analyse() {
    if (!photo) return;
    setIsAnalysing(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];

      try {
        const [assessRes, afterRes] = await Promise.all([
          fetch("/api/assess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64 }),
          }),
          fetch("/api/generate-after", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64 }),
          }),
        ]);

        if (assessRes.ok) {
          const data = await assessRes.json();
          setAssessment(data);
        }

        if (afterRes.ok) {
          const afterData = await afterRes.json();
          setAfterImage(afterData.image);
        }
      } catch {
        // Error handled — user sees retry in UI
      } finally {
        setIsAnalysing(false);
        goToStep(3);
      }
    };
    reader.readAsDataURL(photo);
  }

  if (isAnalysing) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <div className="mb-4 h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-phs-green" />
        <div className="text-base font-bold text-foreground">
          Analysing your property...
        </div>
        <div className="mt-1 text-xs text-gray-400">
          Our AI is inspecting the exterior
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-5 py-6">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/webp"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />

      {!photo ? (
        <>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-3 rounded-2xl border-3 border-dashed border-phs-green bg-phs-green-50 px-5 py-10 text-center"
          >
            <span className="text-5xl">📸</span>
            <span className="text-base font-bold text-foreground">
              Upload or Take a Photo
            </span>
            <span className="text-xs text-gray-400">
              of your property&apos;s exterior
            </span>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-phs-green to-phs-green-dark text-sm font-bold text-white"
          >
            📷 Open Camera
          </button>
        </>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoPreview!}
              alt="Property preview"
              className="h-48 w-full object-cover"
            />
            <button
              onClick={clearPhoto}
              className="absolute right-2 top-2 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white"
            >
              ↻ Retake
            </button>
          </div>

          <button
            onClick={analyse}
            className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-phs-green to-phs-green-dark text-base font-extrabold text-white shadow-lg shadow-phs-green/40 transition-transform active:scale-[0.98]"
          >
            🔍 Analyse My Property
          </button>
        </>
      )}
    </div>
  );
}
