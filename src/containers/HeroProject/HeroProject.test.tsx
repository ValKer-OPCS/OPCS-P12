/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen } from "@testing-library/react";
import HeroProjects from "./HeroProject";

// Mock HeroCard
jest.mock("@/components/HeroCard/HeroCard", () => ({
  __esModule: true,
  default: ({ project }: any) => (
    <div data-testid="mock-hero-card">{project.title}</div>
  ),
}));

// 🔥 Mock conforme au type Project
const mockProjects = [
  {
    _id: "1",
    title: "Projet Hero 1",
    slug: "projet-hero-1",
    shortDescription: "desc",
    longDescription: "long desc",
    technologies: ["react"],
    github: "",
    demo: "",
    thumbnail: null,
    carouselImages: [],
    date: null,
    hero: true,
  },
  {
    _id: "2",
    title: "Projet Hero 2",
    slug: "projet-hero-2",
    shortDescription: "desc",
    longDescription: "long desc",
    technologies: ["ts"],
    github: "",
    demo: "",
    thumbnail: null,
    carouselImages: [],
    date: null,
    hero: true,
  },
];

describe("HeroProjects", () => {
  it("renders the section", () => {
    render(<HeroProjects projects={mockProjects} />);
    expect(screen.getByTestId("hero-projects")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(<HeroProjects projects={mockProjects} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Projets mis en avant" })
    ).toBeInTheDocument();
  });

  it("renders one HeroCard per project", () => {
    render(<HeroProjects projects={mockProjects} />);

    const cards = screen.getAllByTestId("mock-hero-card");
    expect(cards.length).toBe(mockProjects.length);

    mockProjects.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    });
  });

  it("applies the correct CSS class to the section", () => {
    render(<HeroProjects projects={mockProjects} />);
    const section = screen.getByTestId("hero-projects");

    expect(section.className).toMatch(/heroSection/);
  });
});
