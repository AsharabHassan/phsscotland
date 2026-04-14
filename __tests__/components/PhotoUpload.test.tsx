import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PhotoUpload } from "@/components/PhotoUpload";

const mockSetPhoto = jest.fn();
const mockSetIsAnalysing = jest.fn();

jest.mock("@/store/useAppStore", () => ({
  useAppStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      photo: null,
      photoPreview: null,
      isAnalysing: false,
      setPhoto: mockSetPhoto,
      setIsAnalysing: mockSetIsAnalysing,
      goToStep: jest.fn(),
      setAssessment: jest.fn(),
      setAfterImage: jest.fn(),
    }),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "blob:mock-url");

describe("PhotoUpload", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders upload area when no photo selected", () => {
    render(<PhotoUpload />);
    expect(screen.getByText(/upload or take a photo/i)).toBeInTheDocument();
  });

  it("calls setPhoto when a file is selected", () => {
    render(<PhotoUpload />);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(["pixels"], "house.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockSetPhoto).toHaveBeenCalledWith(file, "blob:mock-url");
  });
});
