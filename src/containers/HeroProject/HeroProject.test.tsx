/* eslint-disable @typescript-eslint/no-explicit-any */


import { render, screen } from "@testing-library/react";
import HeroProjects from "./HeroProject";
import HeroProject from "@/data/heroProject.json";

jest.mock("@/components/HeroCard/HeroCard", () => ({
  __esModule: true,
  default: ({ project }: any) => (
    <div data-testid="mock-hero-card">{project.title}</div>
  ),
}));

describe("HeroProjects", () => {
  it("renders the section", () => {
    render(<HeroProjects />);
    expect(screen.getByTestId("hero-projects")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(<HeroProjects />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Projets mis en avant" })
    ).toBeInTheDocument();
  });

  it("renders one HeroCard per project", () => {
    render(<HeroProjects />);

    const cards = screen.getAllByTestId("mock-hero-card");
    expect(cards.length).toBe(HeroProject.projects.length);

    HeroProject.projects.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    });
  });

  it("applies the correct CSS class to the section", () => {
    render(<HeroProjects />);
    const section = screen.getByTestId("hero-projects");
    expect(section.className).toContain("section");
  });
});
