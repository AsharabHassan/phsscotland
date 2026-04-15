import { create } from "zustand";
import type { AppState, StepNumber, EntryPath } from "@/types";

interface ExtendedAppState extends AppState {
  currentStep: StepNumber;
  entryPath: EntryPath | null;
  selectedColor: string | null;
  goToStep: (step: StepNumber) => void;
  setEntryPath: (path: EntryPath) => void;
  setSelectedColor: (color: string) => void;
}

export const useAppStore = create<ExtendedAppState>((set) => ({
  currentStep: 1,
  entryPath: null,
  selectedColor: null,
  goToStep: (step) => set({ currentStep: step }),
  setEntryPath: (path) => set({ entryPath: path }),
  setSelectedColor: (color) => set({ selectedColor: color }),

  photo: null,
  photoPreview: null,
  setPhoto: (file, preview) => set({ photo: file, photoPreview: preview }),

  assessment: null,
  setAssessment: (result) => set({ assessment: result }),

  afterImage: null,
  setAfterImage: (url) => set({ afterImage: url }),

  leadData: null,
  setLeadData: (data) => set({ leadData: data }),

  isAnalysing: false,
  setIsAnalysing: (v) => set({ isAnalysing: v }),

  reset: () =>
    set({
      currentStep: 1,
      entryPath: null,
      selectedColor: null,
      photo: null,
      photoPreview: null,
      assessment: null,
      afterImage: null,
      leadData: null,
      isAnalysing: false,
    }),
}));
