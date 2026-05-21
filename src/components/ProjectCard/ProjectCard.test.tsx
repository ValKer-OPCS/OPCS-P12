import { render, screen, fireEvent } from "@testing-library/react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types/project";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => (
    <div data-testid="mock-image" data-src={props.src} data-alt={props.alt} />
  ),
}));

describe("ProjectCard", () => {
  const openModalMock = jest.fn();

  const project: Project = {
    _id: "1",
    slug: "my-project",
    title: "My Project",
    shortDescription: "Short description",
    longDescription: "Long description",
    technologies: ["React", "TypeScript"],
    github: "https://github.com/example",
    demo: "https://example.com",

    thumbnail: {
      original: "/thumb.webp",
      responsive: [
        { name: "small", width: 400, url: "/thumb-small.webp" },
      ],
    },

    carouselImages: [
      {
        original: "/img1.jpg",
        responsive: [
          { name: "small", width: 400, url: "/img1-small.jpg" },
        ],
      },
    ],

    date: 2024,
    hero: false,
  };

  beforeEach(() => {
    openModalMock.mockClear();
  });

  it("renders the project title, description and technologies", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders the thumbnail image using ImageSet.original", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    const img = screen.getByTestId("mock-image");
    const expectedSrc = project.thumbnail?.responsive?.[0]?.url ?? null;

    expect(img).toHaveAttribute("data-src", expectedSrc);

    expect(img).toHaveAttribute("data-alt", project.title);
  });

  it("calls openModal when clicking the card", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    const card = screen.getByRole("button");
    fireEvent.click(card);

    expect(openModalMock).toHaveBeenCalledTimes(1);
    expect(openModalMock).toHaveBeenCalledWith(project);
  });

  it("renders GitHub and Demo links when provided", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    const githubLink = screen.getByRole("link", { name: /github/i });
    const demoLink = screen.getByRole("link", { name: /demo/i });

    expect(githubLink).toHaveAttribute("href", project.github!);
    expect(demoLink).toHaveAttribute("href", project.demo!);
  });

  it("does not call openModal when clicking GitHub or Demo links", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    const githubLink = screen.getByRole("link", { name: /github/i });
    fireEvent.click(githubLink);

    expect(openModalMock).not.toHaveBeenCalled();
  });
});
