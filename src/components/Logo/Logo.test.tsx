import { render, screen } from "@testing-library/react";
import Logo from "./Logo";

describe("Logo", () => {
  it("renders without crashing", () => {
    render(<Logo />);
    expect(screen.getByTestId("logo-container")).toBeInTheDocument();
  });

  it("renders the SVG", () => {
    render(<Logo />);
    const svg = screen.getByTestId("logo-container").querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("applies the correct CSS class", () => {
    render(<Logo />);
    const container = screen.getByTestId("logo-container");
    expect(container.className).toContain("logoContainer");
  });
});
