// __tests__/components/LeadCaptureForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const mockSetLeadData = jest.fn();
const mockGoToStep = jest.fn();

jest.mock("@/store/useAppStore", () => ({
  useAppStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      entryPath: "photo",
      setLeadData: mockSetLeadData,
      goToStep: mockGoToStep,
    }),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
) as jest.Mock;

describe("LeadCaptureForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows photo-path heading when entryPath is photo", () => {
    render(<LeadCaptureForm />);
    expect(screen.getByText(/your results are ready/i)).toBeInTheDocument();
  });

  it("renders all four input fields", () => {
    render(<LeadCaptureForm />);
    expect(screen.getByPlaceholderText(/john/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/07/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/EH/i)).toBeInTheDocument();
  });
});
