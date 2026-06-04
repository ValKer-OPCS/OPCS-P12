import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminModalUpdater from "./AdminModalUpdater";
import { Project } from "@/types/project";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="icon" />,
}));

describe("AdminModalUpdater", () => {
  const project: Project = {
    _id: "1",
    title: "Projet A",
    slug: "projet-a",
    shortDescription: "Courte",
    longDescription: "Longue",
    github: "https://github.com/test",
    demo: "https://demo.com",
    date: 2024,
    hero: true,
    technologies: ["React", "TS"],
    thumbnail: {
      original: "/img.webp",
      originalPath: "/img.webp",
      responsive: [],
    },
    carouselImages: [],
  };

  const onCloseMock = jest.fn();
  const onUpdatedMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    Storage.prototype.getItem = jest.fn();
  });

  it("returns null when project is null", () => {
    const { container } = render(
      <AdminModalUpdater project={null} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders form with project values", () => {
    render(<AdminModalUpdater project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />);

    expect(screen.getByDisplayValue("Projet A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Courte")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Longue")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://github.com/test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://demo.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("React, TS")).toBeInTheDocument();
  });

  it("updates fields on change", () => {
    render(<AdminModalUpdater project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />);

    const titleInput = screen.getByLabelText("Titre") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "Nouveau titre" } });

    expect(titleInput.value).toBe("Nouveau titre");
  });

  it("shows error when token is missing", async () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValue(null);

    render(<AdminModalUpdater project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />);

    fireEvent.submit(screen.getByRole("button", { name: /mettre à jour/i }));

    await waitFor(() => {
      expect(screen.getByText("Token manquant")).toBeInTheDocument();
    });
  });

  it("shows API error message", async () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValue("TOKEN123");

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: "Erreur API",
      }),
    });

    render(<AdminModalUpdater project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />);

    fireEvent.submit(screen.getByRole("button", { name: /mettre à jour/i }));

    await waitFor(() => {
      expect(screen.getByText("Erreur API")).toBeInTheDocument();
    });
  });

  it("shows network error", async () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValue("TOKEN123");

    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<AdminModalUpdater project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />);

    fireEvent.submit(screen.getByRole("button", { name: /mettre à jour/i }));

    await waitFor(() => {
      expect(screen.getByText("Erreur réseau")).toBeInTheDocument();
    });
  });

  it("calls onUpdated and shows success message", async () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValue("TOKEN123");

    const updatedProject = {
      ...project,
      title: "Projet modifié",
      date: "2024-01-01",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: updatedProject,
      }),
    });

    render(<AdminModalUpdater project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />);

    fireEvent.submit(screen.getByRole("button", { name: /mettre à jour/i }));

    await waitFor(() => {
      expect(screen.getByText("Projet mis à jour")).toBeInTheDocument();
      expect(onUpdatedMock).toHaveBeenCalledWith({
        ...updatedProject,
        date: "2024-01-01",
      });
    });
  });

  it("calls onClose when clicking close button", () => {
    render(<AdminModalUpdater project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />);

    const closeBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
