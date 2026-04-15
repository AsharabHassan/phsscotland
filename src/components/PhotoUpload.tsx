"use client";

import { useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

/** Resize an image to maxSide px on the longest edge and re-encode as JPEG.
 *  This keeps payloads small and normalises iPhone HEIC (iOS auto-converts
 *  to JPEG before the File reaches JS when heic is absent from accept). */
function resizeImage(file: File, maxSide: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas toBlob failed"));
          resolve(new File([blob], "photo.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.88
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

const MOCKUP_OPTIONS = [
  {
    file: "Before 1.jpg",
    label: "Bungalow",
    desc: "Single storey",
    icon: "🏡",
  },
  {
    file: "Before 2.jpg",
    label: "Detached",
    desc: "Standalone house",
    icon: "🏠",
  },
  {
    file: "Before 3.jpg",
    label: "Semi-Detached",
    desc: "Joined pair",
    icon: "🏘️",
  },
  {
    file: "Before 5.jpg",
    label: "Terraced",
    desc: "Row house",
    icon: "🏚️",
  },
];

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

  async function handleFile(file: File) {
    const resized = await resizeImage(file, 1600);
    const preview = URL.createObjectURL(resized);
    setPhoto(resized, preview);
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

  async function loadMockup(filename: string) {
    const res = await fetch(`/images/${encodeURIComponent(filename)}`);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: "image/jpeg" });
    handleFile(file);
  }

  async function analyse() {
    if (!photo) return;
    setIsAnalysing(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const mimeType = dataUrl.split(";")[0].split(":")[1];
      const base64 = dataUrl.split(",")[1];

      const assessPromise = fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType }),
      })
        .then(async (res) => {
          if (res.ok) setAssessment(await res.json());
        })
        .catch((err) => console.error("Assessment failed:", err));

      const afterPromise = fetch("/api/generate-after", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, color: selectedColor, mimeType }),
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
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      {/* Camera only — capture forces rear camera */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
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

          <div className="mt-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[11px] font-semibold text-gray-400">or try a similar property</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {MOCKUP_OPTIONS.map((opt) => (
              <button
                key={opt.file}
                onClick={() => loadMockup(opt.file)}
                className="flex flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-white text-left transition-all active:scale-[0.97] hover:border-phs-navy/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/${encodeURIComponent(opt.file)}`}
                  alt={opt.label}
                  className="h-24 w-full object-cover"
                />
                <div className="px-2.5 py-2">
                  <div className="text-xs font-extrabold text-foreground">
                    {opt.icon} {opt.label}
                  </div>
                  <div className="text-[10px] text-gray-400">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
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
