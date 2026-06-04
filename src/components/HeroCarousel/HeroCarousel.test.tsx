/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { render, screen, fireEvent, act } from "@testing-library/react";
import HeroCarousel from "./HeroCarousel";
import { Project } from "@/types/project";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} data-testid="mock-image" />
  ),
}));

describe("HeroCarousel", () => {
  const projects: Project[] = [
    {
      _id: "1",
      title: "Projet A",
      shortDescription: "Description A",
      longDescription: "",
      slug: "a",
      technologies: [],
      github: "",
      demo: "",
      date: 2024,
      hero: false,
      thumbnail: {
        original: "/a.webp",
        originalPath: "/a.webp",
        responsive: [],
      },
      carouselImages: [],
    },
    {
      _id: "2",
      title: "Projet B",
      shortDescription: "Description B",
      longDescription: "",
      slug: "b",
      technologies: [],
      github: "",
      demo: "",
      date: 2024,
      hero: false,
      thumbnail: {
        original: "/b.webp",
        originalPath: "/b.webp",
        responsive: [],
      },
      carouselImages: [],
    },
  ];

  const onSelectMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    onSelectMock.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the first project initially", () => {
    render(<HeroCarousel projects={projects} onSelect={onSelectMock} />);

    expect(screen.getByRole("heading", { name: "Projet A" })).toBeInTheDocument();
    expect(screen.getByText("Description A")).toBeInTheDocument();

    const img = screen.getByTestId("mock-image");
    expect(img).toHaveAttribute("src", "/a.webp");
  });

  it("automatically changes slide after 6 seconds", () => {
    render(<HeroCarousel projects={projects} onSelect={onSelectMock} />);

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(screen.getByRole("heading", { name: "Projet B" })).toBeInTheDocument();
  });

  it("loops back to first slide", () => {
    render(<HeroCarousel projects={projects} onSelect={onSelectMock} />);

    act(() => {
      jest.advanceTimersByTime(6000);
      jest.advanceTimersByTime(6000);
    });

    expect(screen.getByRole("heading", { name: "Projet A" })).toBeInTheDocument();
  });

  it("changes slide when clicking a label", () => {
    render(<HeroCarousel projects={projects} onSelect={onSelectMock} />);

    fireEvent.click(screen.getByText("Projet B"));

    expect(screen.getByRole("heading", { name: "Projet B" })).toBeInTheDocument();
  });

  it("calls onSelect with current project when clicking Découvrir", () => {
    render(<HeroCarousel projects={projects} onSelect={onSelectMock} />);

    fireEvent.click(screen.getByRole("button", { name: /découvrir/i }));

    expect(onSelectMock).toHaveBeenCalledWith(projects[0]);
  });

  it("calls onSelect with second project after auto-slide", () => {
    render(<HeroCarousel projects={projects} onSelect={onSelectMock} />);

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    fireEvent.click(screen.getByRole("button", { name: /découvrir/i }));

    expect(onSelectMock).toHaveBeenCalledWith(projects[1]);
  });

  it("uses placeholder when thumbnail is missing", () => {
    const broken = [{ ...projects[0], thumbnail: null }];

    render(<HeroCarousel projects={broken} onSelect={onSelectMock} />);

    const img = screen.getByTestId("mock-image");
    expect(img).toHaveAttribute("src", "/placeholder.webp");
  });
});
