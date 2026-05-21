import { render, screen, fireEvent } from "@testing-library/react";
import ProjectModal from "./ProjectModal";
import { Project } from "@/types/project";

jest.mock("../Carousel/Carousel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-carousel" />,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => (
    <div data-testid="mock-image" data-src={props.src} data-alt={props.alt} />
  ),
}));

describe("ProjectModal", () => {
  const onCloseMock = jest.fn();

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
    onCloseMock.mockClear();
  });

  it("returns null when no project is provided", () => {
    const { container } = render(<ProjectModal project={null as unknown as Project} onClose={onCloseMock} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders the modal when a project is provided", () => {
    render(<ProjectModal project={project} onClose={onCloseMock} />);

    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(screen.getByText("A long description of the project")).toBeInTheDocument();
  });

  it("renders the technologies list", () => {
    render(<ProjectModal project={project} onClose={onCloseMock} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders the Carousel", () => {
    render(<ProjectModal project={project} onClose={onCloseMock} />);

    expect(screen.getByTestId("mock-carousel")).toBeInTheDocument();
  });

  it("calls onClose when clicking the overlay", () => {
    render(<ProjectModal project={project} onClose={onCloseMock} />);

    fireEvent.click(screen.getByTestId("modal-overlay"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT close the modal when clicking inside modal content", () => {
    render(<ProjectModal project={project} onClose={onCloseMock} />);

    fireEvent.click(screen.getByTestId("modal-content"));
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("calls onClose when clicking the close button", () => {
    render(<ProjectModal project={project} onClose={onCloseMock} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
