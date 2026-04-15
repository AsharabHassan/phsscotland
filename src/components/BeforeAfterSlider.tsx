"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(85);
  const [isDragging, setIsDragging] = useState(false);
  const [animated, setAnimated] = useState(false);

  // Intro sweep: start at 85% (mostly "before") then glide to 50%
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setPosition(50);
      // After the CSS transition finishes, mark animated
      const timer = setTimeout(() => setAnimated(true), 800);
      return () => clearTimeout(timer);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    setIsDragging(true);
    setAnimated(true);

    const onMove = (ev: PointerEvent) => handleMove(ev.clientX);
    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    handleMove(e.clientX);
  }

  // Smooth transition for intro animation; instant updates while dragging
  const smooth = !isDragging && !animated;

  return (
    <div className="mx-5 my-4">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Before &amp; After Preview
        </span>
        <span className="text-[10px] text-gray-400">Drag to compare</span>
      </div>

      {/* Slider container */}
      <div
        ref={containerRef}
        className="relative h-64 overflow-hidden rounded-2xl shadow-lg select-none touch-none cursor-ew-resize"
        onPointerDown={onPointerDown}
      >
        {/* After image (full background) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt="After treatment"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* Before image (clipped from right) */}
        <div
          className={`absolute inset-0 ${smooth ? "transition-[clip-path] duration-700 ease-out" : ""}`}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeSrc}
            alt="Before treatment"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </div>

        {/* Divider line */}
        <div
          className={`absolute top-0 bottom-0 w-[3px] -translate-x-1/2 bg-white/90 ${smooth ? "transition-[left] duration-700 ease-out" : ""}`}
          style={{
            left: `${position}%`,
            boxShadow: "0 0 12px rgba(0,0,0,0.4)",
          }}
        >
          {/* Drag handle */}
          <div
            className={`absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl ${isDragging ? "scale-110" : ""} transition-transform duration-150`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 5L3 11L8 17"
                stroke="#222"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 5L19 11L14 17"
                stroke="#222"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          BEFORE
        </span>
        <span className="absolute bottom-2.5 right-2.5 rounded-lg bg-phs-green/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          AFTER
        </span>
      </div>
    </div>
  );
}
