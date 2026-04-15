"use client";

import { useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

const COLOUR_OPTIONS = [
  { name: "White", hex: "#F5F5F0" },
  { name: "Cream", hex: "#F5E6C8" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Sandstone", hex: "#D2B48C" },
  { name: "Light Grey", hex: "#C8C8C8" },
  { name: "Dark Grey", hex: "#6B6B6B" },
  { name: "Sage Green", hex: "#9CAF88" },
  { name: "Duck Egg Blue", hex: "#B0D0D3" },
  { name: "Terracotta", hex: "#C67B4E" },
];

export function PhotoUpload() {
  const photo = useAppStore((s) => s.photo);
  const photoPreview = useAppStore((s) => s.photoPreview);
  const isAnalysing = useAppStore((s) => s.isAnalysing);
  const selectedColor = useAppStore((s) => s.selectedColor);
  const setPhoto = useAppStore((s) => s.setPhoto);
  const setSelectedColor = useAppStore((s) => s.setSelectedColor);
  const setIsAnalysing = useAppStore((s) => s.setIsAnalysing);
  const setAssessment = useAppStore((s) => s.setAssessment);
  const setAfterImage = useAppStore((s) => s.setAfterImage);
  const goToStep = useAppStore((s) => s.goToStep);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

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
    if (cameraRef.current) cameraRef.current.value = "";
  }

  async function analyse() {
    if (!photo) return;
    setIsAnalysing(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];

      const assessPromise = fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      })
        .then(async (res) => {
          if (res.ok) setAssessment(await res.json());
        })
        .catch((err) => console.error("Assessment failed:", err));

      const afterPromise = fetch("/api/generate-after", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, color: selectedColor }),
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            setAfterImage(data.image);
          }
        })
        .catch((err) => console.error("After-image failed:", err));

      await Promise.all([assessPromise, afterPromise]);
      setIsAnalysing(false);
      goToStep(3);
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
      {/* Upload from gallery — no capture attribute */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      {/* Camera only — capture forces rear camera */}
      <input
        ref={cameraRef}
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
            onClick={() => cameraRef.current?.click()}
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

          {/* Colour Picker */}
          <div className="mt-4">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
              Choose your preferred colour
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOUR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2.5 py-2 transition-all ${
                    selectedColor === c.name
                      ? "border-phs-green bg-phs-green-50 shadow-sm"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span
                    className={`h-7 w-7 rounded-full border border-gray-300 ${
                      selectedColor === c.name
                        ? "ring-2 ring-phs-green ring-offset-1"
                        : ""
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] font-semibold text-gray-600">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
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
