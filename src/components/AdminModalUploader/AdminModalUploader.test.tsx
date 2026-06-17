import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminModalUploader from "./AdminModalUploader";
import { Project } from "@/types/project";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="icon" />,
}));

describe("AdminModalUploader", () => {
  const onCloseMock = jest.fn();
  const onCreatedMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders the modal", () => {
    render(
      <AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />
    );

    expect(screen.getByText("Créer un projet")).toBeInTheDocument();
    expect(screen.getByTestId("close-button")).toBeInTheDocument();
  });

  it("updates title and auto-generates slug", () => {
    render(
      <AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />
    );

    const titleInput = screen.getByLabelText("Titre du projet") as HTMLInputElement;
    const slugInput = screen.getByLabelText("Slug") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "Mon Projet Test" }, });
    expect(titleInput.value).toBe("Mon Projet Test");
    expect(slugInput.value).toBe("mon-projet-test");
  });

  it("submits form and calls API with credentials include", async () => {
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

    render(
      <AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />
    );

    fireEvent.change(screen.getByLabelText("Titre du projet"),
      {
        target: { value: "Test" },
      }
    );

    fireEvent.change(screen.getByLabelText("Courte description"),
      {
        target: { value: "Description courte" },
      }
    );

    fireEvent.change(screen.getByLabelText("Longue description"),
      {
        target: { value: "Description longue" },
      }
    );

    fireEvent.submit(screen.getByRole("button", { name: /enregistrer/i, }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/projects",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );
    });
  });

  it("calls onCreated and onClose on success", async () => {
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

    render(
      <AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />
    );

    fireEvent.change(screen.getByLabelText("Titre du projet"),
      {
        target: { value: "Test" },
      }
    );

    fireEvent.change(screen.getByLabelText("Courte description"),
      {
        target: { value: "Description courte" },
      }
    );

    fireEvent.change(screen.getByLabelText("Longue description"),
      {
        target: { value: "Description longue" },
      }
    );

    fireEvent.submit(screen.getByRole("button", {
      name: /enregistrer/i,
    })
    );

    await waitFor(() => {
      expect(onCreatedMock).toHaveBeenCalledWith(fakeProject);
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("does not call onCreated when API returns error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: "Erreur API",
      }),
    });

    render(
      <AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />
    );

    fireEvent.change(screen.getByLabelText("Titre du projet"),
      {
        target: { value: "Test" },
      }
    );

    fireEvent.change(screen.getByLabelText("Courte description"),
      {
        target: { value: "Description courte" },
      }
    );

    fireEvent.change(screen.getByLabelText("Longue description"),
      {
        target: { value: "Description longue" },
      }
    );

    fireEvent.submit(screen.getByRole("button", {
      name: /enregistrer/i,
    })
    );

    await waitFor(() => {
      expect(onCreatedMock).not.toHaveBeenCalled();
      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });

  it("calls onClose when clicking close button", () => {
    render(
      <AdminModalUploader onClose={onCloseMock} onCreated={onCreatedMock} />
    );

    fireEvent.click(screen.getByTestId("close-button")
    );

    expect(onCloseMock).toHaveBeenCalled();
  });
});