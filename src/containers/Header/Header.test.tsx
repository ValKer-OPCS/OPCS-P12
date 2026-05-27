/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen } from "@testing-library/react";
import Header from "./Header";


jest.mock("../../components/NamePlate/NamePlate", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-nameplate" />,
}));


jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

describe("Header", () => {
  it("renders the header container", () => {
    render(<Header />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renders the NamePlate component inside the Link", () => {
    render(<Header />);
    const link = screen.getByRole("link", { name: "" });
    expect(link).toHaveAttribute("href", "/");
    expect(screen.getByTestId("mock-nameplate")).toBeInTheDocument();
  });

  it("renders the navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "A propos" })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: "Projets" })).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
  });

  it("applies the correct CSS class to the header", () => {
    render(<Header />);
    const header = screen.getByTestId("header");
    expect(header.className).toContain("headerContainer");
  });
});
