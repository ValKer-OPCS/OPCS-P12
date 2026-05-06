import { render, screen, fireEvent } from "@testing-library/react";
import HeroCard from "./HeroCard";
import { Project } from "@/context/ProjectModalContext";


jest.mock("../Carousel/Carousel", () => ({
  __esModule: true,
  default: () => <div data-testid="carousel" />,
}));

const openModalMock = jest.fn();
jest.mock("@/context/ProjectModalContext", () => ({
    useProjectModal: () => ({
        openModal: openModalMock,
    }),
}));

describe("HeroCard", () => {
    const project: Project = {
        id: 1,
        slug: "my-project",
        title: "My Project",
        shortDescription: "Short description",
        longDescription: "A long description of the project",
        thumbnail: "/thumb.webp",
        carouselImages: ["/img1.jpg", "/img2.jpg"],
        technologies: ["React", "TypeScript", "Next.js"],
        github: "https://github.com/example",
        demo: "https://example.com",
        date: 2026,
    };

    beforeEach(() => {
        openModalMock.mockClear();
    });

    it("renders the project title, description and technologies", () => {
        render(<HeroCard project={project} />);

        expect(screen.getByText("My Project")).toBeInTheDocument();
        expect(screen.getByText("A long description of the project")).toBeInTheDocument();

        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
        expect(screen.getByText("Next.js")).toBeInTheDocument();
    });

    it("renders the Carousel", () => {
        render(<HeroCard project={project} />);
        expect(screen.getByTestId("carousel")).toBeInTheDocument();
    });

    it("calls openModal when clicking the card", () => {
        render(<HeroCard project={project} />);

        const card = screen.getByRole("button");
        fireEvent.click(card);

        expect(openModalMock).toHaveBeenCalledTimes(1);
        expect(openModalMock).toHaveBeenCalledWith(project);
    });

    it("renders GitHub and Demo links", () => {
        render(<HeroCard project={project} />);

        const githubLink = screen.getByRole("link", { name: /github/i });
        const demoLink = screen.getByRole("link", { name: /demo/i });

        expect(githubLink).toHaveAttribute("href", project.github);
        expect(demoLink).toHaveAttribute("href", project.demo);
    });

    it("stops propagation when clicking GitHub or Demo links", () => {
        render(<HeroCard project={project} />);

        const githubLink = screen.getByRole("link", { name: /github/i });
        fireEvent.click(githubLink);

        expect(openModalMock).not.toHaveBeenCalled();
    });
});
