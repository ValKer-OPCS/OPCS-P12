/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen, fireEvent, within } from "@testing-library/react";
import HeroProjects from "./HeroProject";

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

jest.mock("@/components/HeroCarousel/HeroCarousel", () => ({
  __esModule: true,
  default: ({ projects, onSelect }: any) => (
    <div data-testid="mock-carousel">
      {projects.map((p: any) => (
        <button
          key={p._id}
          data-testid="mock-carousel-item"
          onClick={() => onSelect(p)}
        >
          {p.title}
        </button>
      ))}
    </div>
  ),
}));

jest.mock("@/components/ProjectModal/ProjectModal", () => ({
  __esModule: true,
  default: ({ project, onClose }: any) => (
    <div data-testid="mock-modal">
      <p>{project.title}</p>
      <button onClick={onClose}>close</button>
    </div>
  ),
}));

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

  it("renders the carousel", () => {
    render(<HeroProjects projects={mockProjects} />);
    expect(screen.getByTestId("mock-carousel")).toBeInTheDocument();
  });

  it("opens the modal when a carousel item is clicked", () => {
    render(<HeroProjects projects={mockProjects} />);

    const firstItem = screen.getAllByTestId("mock-carousel-item")[0];
    fireEvent.click(firstItem);

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
    expect(within(screen.getByTestId("mock-modal")).getByText("Projet Hero 1")).toBeInTheDocument();
  });

  it("closes the modal when clicking the close button", () => {
    render(<HeroProjects projects={mockProjects} />);

    const firstItem = screen.getAllByTestId("mock-carousel-item")[0];
    fireEvent.click(firstItem);

    const closeButton = screen.getByText("close");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });

  it("applies the correct CSS class to the section", () => {
    render(<HeroProjects projects={mockProjects} />);
    const section = screen.getByTestId("hero-projects");

    expect(section.className).toMatch(/heroSection/);
  });
});
