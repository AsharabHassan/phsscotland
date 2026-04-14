export type PropertyType =
  | "mid-terrace"
  | "end-terrace"
  | "bungalow"
  | "semi-detached"
  | "detached";

export type IssueSeverity = "low" | "medium" | "high";

export interface ExteriorIssue {
  name: string;
  severity: IssueSeverity;
  description: string;
}

export type ServiceType =
  | "wall-coating"
  | "roof-coating"
  | "chemical-cleaning"
  | "exterior-painting";

export interface ServiceRecommendation {
  service: ServiceType;
  label: string;
  reason: string;
}

export interface AssessmentResult {
  propertyType: PropertyType;
  issues: ExteriorIssue[];
  recommendations: ServiceRecommendation[];
  overallCondition: "good" | "fair" | "poor";
  summary: string;
}

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  postcode: string;
}

export interface PricingEntry {
  wallCoating: number;
  roofCoating: number;
}

export interface AppState {
  photo: File | null;
  photoPreview: string | null;
  setPhoto: (file: File, preview: string) => void;

  assessment: AssessmentResult | null;
  setAssessment: (result: AssessmentResult) => void;

  afterImage: string | null;
  setAfterImage: (url: string) => void;

  leadData: LeadData | null;
  setLeadData: (data: LeadData) => void;

  isAnalysing: boolean;
  setIsAnalysing: (v: boolean) => void;

  reset: () => void;
}
