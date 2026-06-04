import { render, screen, fireEvent } from "@testing-library/react";
import ProjectModal from "./ProjectModal";
import { Project } from "@/types/project";

jest.mock("../Carousel/Carousel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-carousel" />,
}));

describe("ProjectModal", () => {
  const onCloseMock = jest.fn();

  const baseProject: Project = {
    slug: "my-project",
    title: "My Project",
    shortDescription: "Short description",
    longDescription: "A long description of the project",

    thumbnail: {
      original: "/thumb.webp",
      originalPath: "/thumb.webp",
      responsive: [],
    },

    carouselImages: [
      {
        original: "/img1.jpg",
        originalPath: "/img1.jpg",
        responsive: [],
      },
      {
        original: "/img2.jpg",
        originalPath: "/img2.jpg",
        responsive: [],
      },
    ],

    technologies: ["React", "TypeScript", "Next.js"],
    github: "https://github.com/example",
    demo: "https://example.com",
    date: 2026,
    _id: "",
    hero: false,
  };

  beforeEach(() => {
    onCloseMock.mockClear();
  });

  it("returns null when no project is provided", () => {
    const { container } = render(
      <ProjectModal project={null as unknown as Project} onClose={onCloseMock} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders the modal when a project is provided", () => {
    render(<ProjectModal project={baseProject} onClose={onCloseMock} />);

    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(
      screen.getByText("A long description of the project")
    ).toBeInTheDocument();
  });

  it("renders the technologies list", () => {
    render(<ProjectModal project={baseProject} onClose={onCloseMock} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("renders an empty list when no technologies are provided", () => {
    const project = { ...baseProject, technologies: [] };

    render(<ProjectModal project={project} onClose={onCloseMock} />);

    const list = screen.getByRole("list");
    expect(list.children.length).toBe(0);
  });

  it("renders the Carousel", () => {
    render(<ProjectModal project={baseProject} onClose={onCloseMock} />);
    expect(screen.getByTestId("mock-carousel")).toBeInTheDocument();
  });

  it("renders placeholder image when no carouselImages are provided", () => {
    const project = { ...baseProject, carouselImages: [] };

    render(<ProjectModal project={project} onClose={onCloseMock} />);

    expect(screen.getByTestId("mock-carousel")).toBeInTheDocument();
  });

  it("calls onClose when clicking the overlay", () => {
    render(<ProjectModal project={baseProject} onClose={onCloseMock} />);

    fireEvent.click(screen.getByTestId("modal-overlay"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT close the modal when clicking inside modal content", () => {
    render(<ProjectModal project={baseProject} onClose={onCloseMock} />);

    fireEvent.click(screen.getByTestId("modal-content"));
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("calls onClose when clicking the close button", () => {
    render(<ProjectModal project={baseProject} onClose={onCloseMock} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("has a close button with an accessible role", () => {
    render(<ProjectModal project={baseProject} onClose={onCloseMock} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders the title with correct tag", () => {
    render(<ProjectModal project={baseProject} onClose={onCloseMock} />);
    const title = screen.getByText("My Project");
    expect(title.tagName).toBe("H2");
  });

  it("does NOT close when clicking inside modal content", () => {
    render(<ProjectModal project={baseProject} onClose={onCloseMock} />);

    fireEvent.click(screen.getByTestId("modal-content"));

    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("renders the long description exactly", () => {
    render(<ProjectModal project={baseProject} onClose={onCloseMock} />);
    expect(
      screen.getByText("A long description of the project")
    ).toBeInTheDocument();
  });

  it("renders no description if longDescription is empty", () => {
    const project = { ...baseProject, longDescription: "" };

    render(<ProjectModal project={project} onClose={onCloseMock} />);

    expect(screen.getByTestId("modal-content").textContent).not.toContain(
      "undefined"
    );
  });

});
