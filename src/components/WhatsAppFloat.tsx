"use client";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/447000000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white text-2xl shadow-lg shadow-green-500/40 transition-transform hover:scale-110"
    >
      💬
    </a>
  );
}
