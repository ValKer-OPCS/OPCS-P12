import { render, screen, fireEvent } from "@testing-library/react";
import HeroCard from "./HeroCard";
import { Project } from "@/types/project";

jest.mock("../Carousel/Carousel", () => ({
  __esModule: true,
  default: () => <div data-testid="carousel" />,
}));

describe("HeroCard", () => {
  const openModalMock = jest.fn();

  const project: Project = {
    slug: "my-project",
    title: "My Project",
    shortDescription: "Short description",
    longDescription: "A long description of the project",

    thumbnail: {
      original: "/thumb.webp",
      responsive: [],
    },

    carouselImages: [
      { original: "/img1.jpg", responsive: [] },
      { original: "/img2.jpg", responsive: [] },
    ],

    technologies: ["React", "TypeScript", "Next.js"],
    github: "https://github.com/example",
    demo: "https://example.com",
    date: 2026,
    _id: "",
    hero: false
  };

  beforeEach(() => {
    openModalMock.mockClear();
  });

  it("renders the project title, description and technologies", () => {
    render(<HeroCard project={project} openModal={openModalMock} />);

    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(
      screen.getByText("A long description of the project")
    ).toBeInTheDocument();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("renders the Carousel", () => {
    render(<HeroCard project={project} openModal={openModalMock} />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("calls openModal when clicking the card", () => {
    render(<HeroCard project={project} openModal={openModalMock} />);

    const card = screen.getByRole("button");
    fireEvent.click(card);

    expect(openModalMock).toHaveBeenCalledTimes(1);
    expect(openModalMock).toHaveBeenCalledWith(project);
  });

  it("renders GitHub and Demo links", () => {
    render(<HeroCard project={project} openModal={openModalMock} />);

    const githubLink = screen.getByRole("link", { name: /github/i });
    const demoLink = screen.getByRole("link", { name: /demo/i });

    expect(githubLink).toHaveAttribute("href", project.github);
    expect(demoLink).toHaveAttribute("href", project.demo);
  });

  it("stops propagation when clicking GitHub or Demo links", () => {
    render(<HeroCard project={project} openModal={openModalMock} />);

    const githubLink = screen.getByRole("link", { name: /github/i });
    fireEvent.click(githubLink);

    expect(openModalMock).not.toHaveBeenCalled();
  });
});
