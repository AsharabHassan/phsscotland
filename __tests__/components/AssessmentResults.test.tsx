import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AssessmentResults } from "@/components/AssessmentResults";

const mockGoToStep = jest.fn();
const mockAssessment = {
  propertyType: "semi-detached",
  overallCondition: "fair",
  summary: "Your property shows signs of weathering.",
  issues: [
    { name: "Moss Growth", severity: "high", description: "Significant moss on north wall" },
    { name: "Hairline Cracks", severity: "medium", description: "Small cracks near windows" },
  ],
  recommendations: [
    { service: "wall-coating", label: "Wall Coating", reason: "Protect against moisture" },
  ],
};

jest.mock("@/store/useAppStore", () => ({
  useAppStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      assessment: mockAssessment,
      photoPreview: "blob:before",
      afterImage: "data:image/png;base64,after",
      goToStep: mockGoToStep,
    }),
}));

describe("AssessmentResults", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows the overall condition badge", () => {
    render(<AssessmentResults />);
    expect(screen.getByText(/fair condition/i)).toBeInTheDocument();
  });

  it("lists all detected issues", () => {
    render(<AssessmentResults />);
    expect(screen.getByText("Moss Growth")).toBeInTheDocument();
    expect(screen.getByText("Hairline Cracks")).toBeInTheDocument();
  });

  it("clicking book survey goes to step 5", () => {
    render(<AssessmentResults />);
    fireEvent.click(screen.getByRole("button", { name: /book/i }));
    expect(mockGoToStep).toHaveBeenCalledWith(5);
  });
});
