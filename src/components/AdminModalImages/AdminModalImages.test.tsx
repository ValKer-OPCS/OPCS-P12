/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminProjectImagesModal from "./AdminModalImages";
import { Project } from "@/types/project";
import { AuthContext, AuthContextType } from "@/context/AuthContext";

// Mock Next/Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} data-testid="mock-image" />
  ),
}));

// Mock FontAwesome
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="icon" />,
}));

describe("AdminProjectImagesModal", () => {
  const project: Project = {
    _id: "1",
    title: "Test",
    slug: "test",
    shortDescription: "",
    longDescription: "",
    github: "",
    demo: "",
    date: 2024,
    hero: false,
    technologies: [],
    thumbnail: {
      original: "/thumb.webp",
      originalPath: "/thumb.webp",
      responsive: [],
    },
    carouselImages: [
      {
        original: "/c1.webp",
        originalPath: "/c1.webp",
        responsive: [],
      },
    ],
  };

  const onCloseMock = jest.fn();
  const onUpdatedMock = jest.fn();

  const defaultAuthValue: AuthContextType = {
    token: "TOKEN123",
    setToken: jest.fn(),
    logout: jest.fn(),
  };

  const renderWithAuth = (
    ui: React.ReactNode,
    authValue: Partial<AuthContextType> = {}
  ) => {
    const mergedValue: AuthContextType = {
      ...defaultAuthValue,
      ...authValue,
    };

    return render(
      <AuthContext.Provider value={mergedValue}>
        {ui}
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders thumbnail and carousel images", () => {
    renderWithAuth(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );

    expect(screen.getByAltText("thumbnail")).toBeInTheDocument();
    expect(screen.getByAltText("carousel-0")).toBeInTheDocument();
  });

  it("calls onClose when clicking close button", () => {
    renderWithAuth(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );

    fireEvent.click(screen.getByTestId("close-button"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("uploads thumbnail and updates project", async () => {
    const updatedProject = {
      ...project,
      thumbnail: {
        original: "/new-thumb.webp",
        originalPath: "/new-thumb.webp",
        responsive: [],
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        project: updatedProject,
      }),
    });

    renderWithAuth(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );

    const file = new File(["test"], "image.webp", { type: "image/webp" });
    const input = screen.getByTestId("thumbnail-input");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onUpdatedMock).toHaveBeenCalledWith(updatedProject);
    });
  });

  it("deletes thumbnail and updates project", async () => {
    const updatedProject = { ...project, thumbnail: null };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        project: updatedProject,
      }),
    });

    renderWithAuth(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );

    fireEvent.click(screen.getAllByTestId("icon")[1]);

    await waitFor(() => {
      expect(onUpdatedMock).toHaveBeenCalledWith(updatedProject);
    });
  });

  it("deletes carousel image and updates project", async () => {
    const updatedProject = { ...project, carouselImages: [] };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        project: updatedProject,
      }),
    });

    renderWithAuth(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );

    fireEvent.click(screen.getAllByTestId("icon")[2]);

    await waitFor(() => {
      expect(onUpdatedMock).toHaveBeenCalledWith(updatedProject);
    });
  });
});
