import { render, screen, fireEvent } from "@testing-library/react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types/project";

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
      originalPath: "/thumb.webp",
      responsive: [
        {
          name: "small",
          width: 400,
          url: "/thumb-small.webp",
          path: "/thumb-small.webp",
        },
      ],
    },

    carouselImages: [
      {
        original: "/img1.jpg",
        originalPath: "/img1.jpg",
        responsive: [
          {
            name: "small",
            width: 400,
            url: "/img1-small.jpg",
            path: "/img1-small.jpg",
          },
        ],
      },
    ],

    date: 2024,
    hero: false,
  };

  beforeEach(() => {
    openModalMock.mockClear();
  });

  it("renders title, description and technologies", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders the thumbnail image with correct src and alt", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    const img = screen.getByTestId("project-thumbnail");

    expect(img).toHaveAttribute("src", "/thumb.webp");
    expect(img).toHaveAttribute(
      "alt",
      `${project.title} - aperçu du projet`
    );
  });

  it("renders srcSet and sizes when responsive images exist", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    const img = screen.getByTestId("project-thumbnail");

    expect(img).toHaveAttribute("srcset", "/thumb-small.webp 400w");
    expect(img).toHaveAttribute("sizes", "(max-width: 768px) 100vw, 768px");
  });

  it("uses placeholder image when no thumbnail is provided", () => {
    const noThumbProject: Project = { ...project, thumbnail: null };


    render(<ProjectCard project={noThumbProject} openModal={openModalMock} />);

    const img = screen.getByTestId("project-thumbnail");
    expect(img).toHaveAttribute("src", "/placeholder.webp");
  });


  it("calls openModal when clicking the card", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    fireEvent.click(screen.getByTestId("project-card"));

    expect(openModalMock).toHaveBeenCalledTimes(1);
    expect(openModalMock).toHaveBeenCalledWith(project);
  });

  it("does NOT call openModal when clicking GitHub or Demo links", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    fireEvent.click(screen.getByRole("link", { name: /github/i }));
    fireEvent.click(screen.getByRole("link", { name: /demo/i }));

    expect(openModalMock).not.toHaveBeenCalled();
  });


  it("renders GitHub and Demo links when provided", () => {
    render(<ProjectCard project={project} openModal={openModalMock} />);

    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      project.github!
    );

    expect(screen.getByRole("link", { name: /demo/i })).toHaveAttribute(
      "href",
      project.demo!
    );
  });

  it("does not render links when github/demo are missing", () => {
    const noLinksProject = { ...project, github: undefined, demo: undefined };

    render(<ProjectCard project={noLinksProject} openModal={openModalMock} />);

    expect(screen.queryByRole("link")).toBeNull();
  });

});
