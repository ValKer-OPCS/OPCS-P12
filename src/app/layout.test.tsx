import { render, screen } from "@testing-library/react";
import RootLayout from "./layout";

jest.mock("next/font/google", () => ({
   Inter: () => ({ className: "mocked-inter", variable: "--font-inter" }),
  Montserrat: () => ({
    variable: "--mock-font",
  }),
}));

jest.mock("@/containers/Header/Header", () => ({
  __esModule: true,
  default: () => <header data-testid="mock-header" />,
}));

jest.mock("@/containers/Footer/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="mock-footer" />,
}));

describe("RootLayout", () => {
  it("renders html and body structure", () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>
    );

    expect(document.querySelector("html")).toBeTruthy();
    expect(document.querySelector("body")).toBeTruthy();
  });

  it("applies the font variable class to <html>", () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>
    );

    const html = document.querySelector("html");
    expect(html?.className).toContain("--mock-font");
  });

  it("renders the Header", () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  it("renders the Footer", () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>
    );

    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("renders children inside the layout", () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
