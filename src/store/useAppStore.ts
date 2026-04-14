import { create } from "zustand";
import type { AppState } from "@/types";

export const useAppStore = create<AppState>((set) => ({
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
      photo: null,
      photoPreview: null,
      assessment: null,
      afterImage: null,
      leadData: null,
      isAnalysing: false,
    }),
}));
