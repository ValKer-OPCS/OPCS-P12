import { render, screen, fireEvent } from "@testing-library/react";
import Projects from "./Projects";
import { Project } from "@/types/project";


jest.mock("@/components/ProjectCard/ProjectCard", () => ({
  __esModule: true,
  default: ({ project }: { project: Project }) => (
    <div data-testid="mock-project-card">{project.title}</div>
  ),
}));


const mockProjects: Project[] = [
  {
    _id: "1",
    title: "Projet 1",
    slug: "projet-1",
    shortDescription: "desc",
    longDescription: "long desc",
    technologies: ["react"],
    github: "",
    demo: "",
    thumbnail: null,
    carouselImages: [],
    date: null,
    hero: false,
  },
  {
    _id: "2",
    title: "Projet 2",
    slug: "projet-2",
    shortDescription: "desc",
    longDescription: "long desc",
    technologies: ["ts"],
    github: "",
    demo: "",
    thumbnail: null,
    carouselImages: [],
    date: null,
    hero: false,
  },
];

describe("Projects", () => {
  const allTechnologies = Array.from(
    new Set(mockProjects.flatMap((p) => p.technologies ?? []))
  );

  it("renders the section", () => {
    render(<Projects projects={mockProjects} />);
    expect(screen.getByTestId("projects-section")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(<Projects projects={mockProjects} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Projects" })
    ).toBeInTheDocument();
  });

  it("renders all projects initially", () => {
    render(<Projects projects={mockProjects} />);
    const cards = screen.getAllByTestId("mock-project-card");
    expect(cards.length).toBe(mockProjects.length);
  });

  it("renders all technology filter buttons", () => {
    render(<Projects projects={mockProjects} />);

    expect(screen.getByRole("button", { name: "Tous" })).toBeInTheDocument();

    allTechnologies.forEach((tech) => {
      expect(screen.getByRole("button", { name: tech })).toBeInTheDocument();
    });
  });

  it("filters projects when clicking a technology button", () => {
    render(<Projects projects={mockProjects} />);

    const tech = allTechnologies[0];

    fireEvent.click(screen.getByRole("button", { name: tech }));

    const filtered = mockProjects.filter((p) =>
      (p.technologies ?? []).includes(tech)
    );

    const cards = screen.getAllByTestId("mock-project-card");
    expect(cards.length).toBe(filtered.length);
  });

  it("shows all projects again when clicking 'Tous'", () => {
    render(<Projects projects={mockProjects} />);

    const tech = allTechnologies[0];
    fireEvent.click(screen.getByRole("button", { name: tech }));

    fireEvent.click(screen.getByRole("button", { name: "Tous" }));

    const cards = screen.getAllByTestId("mock-project-card");
    expect(cards.length).toBe(mockProjects.length);
  });

  it("applies the active class to the selected filter", () => {
    render(<Projects projects={mockProjects} />);

    const tech = allTechnologies[0];
    const button = screen.getByRole("button", { name: tech });

    fireEvent.click(button);

    expect(button.className).toContain("active");
  });
});
