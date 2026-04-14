import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HeroLanding } from "@/components/HeroLanding";

const mockGoToStep = jest.fn();
const mockSetEntryPath = jest.fn();

jest.mock("@/store/useAppStore", () => ({
  useAppStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      goToStep: mockGoToStep,
      setEntryPath: mockSetEntryPath,
    }),
}));

describe("HeroLanding", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the headline", () => {
    render(<HeroLanding />);
    expect(
      screen.getByRole("heading", { name: /get your/i })
    ).toBeInTheDocument();
  });

  it("clicking upload CTA sets photo path and goes to step 2", () => {
    render(<HeroLanding />);
    fireEvent.click(screen.getByRole("button", { name: /upload/i }));
    expect(mockSetEntryPath).toHaveBeenCalledWith("photo");
    expect(mockGoToStep).toHaveBeenCalledWith(2);
  });

  it("clicking no-photo CTA sets no-photo path and goes to step 3", () => {
    render(<HeroLanding />);
    fireEvent.click(screen.getByRole("button", { name: /no photo/i }));
    expect(mockSetEntryPath).toHaveBeenCalledWith("no-photo");
    expect(mockGoToStep).toHaveBeenCalledWith(3);
  });
});
