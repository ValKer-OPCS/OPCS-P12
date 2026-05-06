/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen, fireEvent } from "@testing-library/react";
import Projects from "./Projects";
import ProjectsList from "@/data/projects.json";


jest.mock("@/components/ProjectCard/ProjectCard", () => ({
  __esModule: true,
  default: ({ project }: any) => (
    <div data-testid="mock-project-card">{project.title}</div>
  ),
}));

describe("Projects", () => {
  const allProjects = ProjectsList.projects;
  const allTechnologies = Array.from(
    new Set(allProjects.flatMap((p) => p.technologies))
  );

  it("renders the section", () => {
    render(<Projects />);
    expect(screen.getByTestId("projects-section")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(<Projects />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Projects" })
    ).toBeInTheDocument();
  });

  it("renders all projects initially", () => {
    render(<Projects />);
    const cards = screen.getAllByTestId("mock-project-card");
    expect(cards.length).toBe(allProjects.length);

    allProjects.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    });
  });

  it("renders all technology filter buttons", () => {
    render(<Projects />);

    expect(screen.getByRole("button", { name: "Tous" })).toBeInTheDocument();

    allTechnologies.forEach((tech) => {
      expect(screen.getByRole("button", { name: tech })).toBeInTheDocument();
    });
  });

  it("filters projects when clicking a technology button", () => {
    render(<Projects />);

    const tech = allTechnologies[0];

    fireEvent.click(screen.getByRole("button", { name: tech }));

    const filtered = allProjects.filter((p) => p.technologies.includes(tech));

    const cards = screen.getAllByTestId("mock-project-card");
    expect(cards.length).toBe(filtered.length);

    filtered.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    });
  });

  it("shows all projects again when clicking 'Tous'", () => {
    render(<Projects />);

    const tech = allTechnologies[0];
    fireEvent.click(screen.getByRole("button", { name: tech }));

    fireEvent.click(screen.getByRole("button", { name: "Tous" }));

    const cards = screen.getAllByTestId("mock-project-card");
    expect(cards.length).toBe(allProjects.length);
  });

  it("applies the active class to the selected filter", () => {
    render(<Projects />);

    const tech = allTechnologies[0];
    const button = screen.getByRole("button", { name: tech });

    fireEvent.click(button);

    expect(button.className).toContain("active");
  });
});
