import { render, screen } from "@testing-library/react";
import Home from "./page";

jest.mock("@/containers/Header/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-header" />,
}));

jest.mock("@/containers/Footer/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-footer" />,
}));

jest.mock("@/containers/AboutMe/AboutMe", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-about" />,
}));

jest.mock("@/containers/Projects/Projects", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-projects" />,
}));

jest.mock("@/containers/HeroProject/HeroProject", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-hero-projects" />,
}));

jest.mock("@/containers/Contact/Contact", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-contact" />,
}));

describe("Home page", () => {
  it("renders all main sections", () => {
    render(<Home />);

    expect(screen.getByTestId("mock-about")).toBeInTheDocument();
    expect(screen.getByTestId("mock-hero-projects")).toBeInTheDocument();
    expect(screen.getByTestId("mock-projects")).toBeInTheDocument();
    expect(screen.getByTestId("mock-contact")).toBeInTheDocument();
  });

  it("renders the main container", () => {
    render(<Home />);
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
