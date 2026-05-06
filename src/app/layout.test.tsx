/* eslint-disable @typescript-eslint/no-explicit-any */


import { render, screen } from "@testing-library/react";
import RootLayout from "./layout";

jest.mock("next/font/google", () => ({
  Montserrat: () => ({
    variable: "--mock-font",
  }),
}));

jest.mock("@/context/ProjectModalContext", () => ({
  __esModule: true,
  ProjectModalProvider: ({ children }: any) => (
    <div data-testid="mock-provider">{children}</div>
  ),
}));


jest.mock("@/components/ProjectModal/ProjectModal", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-project-modal" />,
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

  it("renders the ProjectModalProvider", () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>
    );

    expect(screen.getByTestId("mock-provider")).toBeInTheDocument();
  });

  it("renders the ProjectModal inside the provider", () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>
    );

    expect(screen.getByTestId("mock-project-modal")).toBeInTheDocument();
  });

  it("renders children inside the provider", () => {
    render(
      <RootLayout>
        <div data-testid="child">Hello</div>
      </RootLayout>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
