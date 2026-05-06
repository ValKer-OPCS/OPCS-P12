import { render, screen, fireEvent } from "@testing-library/react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/context/ProjectModalContext";



// --- Mock du contexte ---
const openModalMock = jest.fn();
jest.mock("@/context/ProjectModalContext", () => ({
  __esModule: true,
  useProjectModal: () => ({
    openModal: openModalMock,
  }),
}));

describe("ProjectCard", () => {
  const project: Project = {
    id: 1,
    slug: "my-project",
    title: "My Project",
    shortDescription: "Short description",
    longDescription: "Long description",
    thumbnail: "/thumb.webp",
    carouselImages: ["/img1.jpg"],
    technologies: ["React", "TypeScript"],
    github: "https://github.com/example",
    demo: "https://example.com",
    date: 2024,
  };

  beforeEach(() => {
    openModalMock.mockClear();
  });

  it("renders the project title, description and technologies", () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders the thumbnail image", () => {
    render(<ProjectCard project={project} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", project.thumbnail);
    expect(img).toHaveAttribute("alt", project.title);
  });

  it("calls openModal when clicking the card", () => {
    render(<ProjectCard project={project} />);

    const card = screen.getByRole("button");
    fireEvent.click(card);

    expect(openModalMock).toHaveBeenCalledTimes(1);
    expect(openModalMock).toHaveBeenCalledWith(project);
  });

  it("renders GitHub and Demo links", () => {
    render(<ProjectCard project={project} />);

    const githubLink = screen.getByRole("link", { name: /github/i });
    const demoLink = screen.getByRole("link", { name: /demo/i });

    expect(githubLink).toHaveAttribute("href", project.github);
    expect(demoLink).toHaveAttribute("href", project.demo);
  });

  it("stops propagation when clicking GitHub or Demo links", () => {
    render(<ProjectCard project={project} />);

    const githubLink = screen.getByRole("link", { name: /github/i });
    fireEvent.click(githubLink);

    expect(openModalMock).not.toHaveBeenCalled();
  });
});
