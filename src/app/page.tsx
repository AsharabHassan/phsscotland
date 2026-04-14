"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { UrgencyBar } from "@/components/UrgencyBar";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ProgressDots } from "@/components/ProgressDots";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { HeroLanding } from "@/components/HeroLanding";
import { PhotoUpload } from "@/components/PhotoUpload";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { AssessmentResults } from "@/components/AssessmentResults";
import { BookSurvey } from "@/components/BookSurvey";
import Image from "next/image";

const stepComponents: Record<number, React.FC> = {
  1: HeroLanding,
  2: PhotoUpload,
  3: LeadCaptureForm,
  4: AssessmentResults,
  5: BookSurvey,
};

export default function Home() {
  const currentStep = useAppStore((s) => s.currentStep);
  const StepComponent = stepComponents[currentStep];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white">
      {/* Urgency Bar */}
      <UrgencyBar />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Image
            src="/images/phs-logo.png"
            alt="Premier Home Solutions"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <div>
            <div className="text-xs font-bold text-phs-navy">
              Premier Home
            </div>
            <div className="text-[9px] font-semibold tracking-wide text-phs-teal">
              SOLUTIONS SCOTLAND
            </div>
          </div>
        </div>
        <ProgressDots current={currentStep} total={5} />
      </header>

      {/* Google Reviews */}
      <GoogleReviews />

      {/* Step Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* WhatsApp Float */}
      <WhatsAppFloat />
    </div>
  );
}
