import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProgressDots } from "@/components/ProgressDots";

describe("ProgressDots", () => {
  it("renders 5 dots", () => {
    render(<ProgressDots current={1} total={5} />);
    const dots = screen.getAllByRole("listitem");
    expect(dots).toHaveLength(5);
  });

  it("marks completed steps as done", () => {
    render(<ProgressDots current={3} total={5} />);
    const dots = screen.getAllByRole("listitem");
    expect(dots[0]).toHaveAttribute("data-state", "done");
    expect(dots[1]).toHaveAttribute("data-state", "done");
    expect(dots[2]).toHaveAttribute("data-state", "active");
    expect(dots[3]).toHaveAttribute("data-state", "pending");
  });
});
