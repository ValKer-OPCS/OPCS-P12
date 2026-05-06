import { render, screen, fireEvent } from "@testing-library/react";
import ProjectModal from "./ProjectModal";
import { Project } from "@/context/ProjectModalContext";

// --- Mock Carousel ---
jest.mock("../Carousel/Carousel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-carousel" />,
}));

// --- Mock du contexte ---
const closeModalMock = jest.fn();

let mockProject: Project | null = null;

jest.mock("@/context/ProjectModalContext", () => ({
  __esModule: true,
  useProjectModal: () => ({
    project: mockProject,
    closeModal: closeModalMock,
  }),
}));

describe("ProjectModal", () => {
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
    date: 20240612,
  };

  beforeEach(() => {
    closeModalMock.mockClear();
  });

  it("returns null when no project is selected", () => {
    mockProject = null;
    const { container } = render(<ProjectModal />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the modal when a project is provided", () => {
    mockProject = project;
    render(<ProjectModal />);

    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(screen.getByText("Long description")).toBeInTheDocument();
  });

  it("renders the technologies list", () => {
    mockProject = project;
    render(<ProjectModal />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders the Carousel", () => {
    mockProject = project;
    render(<ProjectModal />);

    expect(screen.getByTestId("mock-carousel")).toBeInTheDocument();
  });

  it("calls closeModal when clicking the overlay", () => {
    mockProject = project;
    render(<ProjectModal />);

    fireEvent.click(screen.getByTestId("modal-overlay"));
    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT close the modal when clicking inside the modal content", () => {
    mockProject = project;
    render(<ProjectModal />);

    fireEvent.click(screen.getByTestId("modal-content"));
    expect(closeModalMock).not.toHaveBeenCalled();
  });

  it("calls closeModal when clicking the close button", () => {
    mockProject = project;
    render(<ProjectModal />);

    fireEvent.click(screen.getByRole("button"));
    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });
});
