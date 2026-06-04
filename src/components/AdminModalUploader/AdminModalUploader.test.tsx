import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminModalUploader from "./AdminModalUploader";
import { Project } from "@/types/project";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="icon" />,
}));

describe("AdminModalUploader", () => {
  const onCloseMock = jest.fn();
  const onCreatedMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
  });

  it("renders the modal", () => {
    render(<AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />);

    expect(screen.getByText("Créer un projet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument();
  });

  it("updates title and auto-generates slug", () => {
    render(<AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />);

    const titleInput = screen.getByLabelText("Titre du projet") as HTMLInputElement;
    const slugInput = screen.getByLabelText("Slug") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "Mon Projet Test" } });

    expect(titleInput.value).toBe("Mon Projet Test");
    expect(slugInput.value).toBe("mon-projet-test");
  });

  it("submits form and calls onCreated + onClose on success", async () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValue("TOKEN123");

    const fakeProject: Project = {
      _id: "1",
      title: "Test",
      slug: "test",
      shortDescription: "",
      longDescription: "",
      technologies: [],
      github: "",
      demo: "",
      date: 2024,
      hero: false,
      thumbnail: {
        original: "/img.webp",
        originalPath: "/img.webp",
        responsive: [],
      },
      carouselImages: [],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: fakeProject,
      }),
    });

    render(<AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />);

    fireEvent.change(screen.getByLabelText("Titre du projet"), {
      target: { value: "Test" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(onCreatedMock).toHaveBeenCalledWith(fakeProject);
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("does not call onCreated when API returns error", async () => {
    (Storage.prototype.getItem as jest.Mock).mockReturnValue("TOKEN123");

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: "Erreur API",
      }),
    });

    render(<AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />);

    fireEvent.submit(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(onCreatedMock).not.toHaveBeenCalled();
      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });

  it("logs error when token is missing", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (Storage.prototype.getItem as jest.Mock).mockReturnValue(null);

    render(<AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />);

    fireEvent.submit(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Token manquant");
    });

    consoleSpy.mockRestore();
  });

  it("calls onClose when clicking close button", () => {
    render(<AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />);

    const closeBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
