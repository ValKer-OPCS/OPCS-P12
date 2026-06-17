/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminProjectImagesModal from "./AdminModalImages";
import { Project } from "@/types/project";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} data-testid="mock-image" />
  ),
}));

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

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders thumbnail and carousel images", () => {
    render(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );

    expect(screen.getByAltText("thumbnail")).toBeInTheDocument();

    expect(screen.getByAltText("carousel-0")).toBeInTheDocument();
  });

  it("calls onClose when clicking close button", () => {
    render(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock}/>
    );

    fireEvent.click(screen.getByTestId("close-button") );

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

    render(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );

    const file = new File(
      ["test"],
      "image.webp",
      { type: "image/webp" }
    );

    fireEvent.change(
      screen.getByTestId("thumbnail-input"),
      {
        target: {
          files: [file],
        },
      }
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/images/upload?projectId=1&type=thumbnail",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );

      expect(onUpdatedMock).toHaveBeenCalledWith(
        updatedProject
      );
    });
  });

  it("shows error when upload fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: "Erreur upload",
      }),
    });

    render(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} /> 
    );

    const file = new File(
      ["test"],
      "image.webp",
      { type: "image/webp" }
    );

    fireEvent.change(
      screen.getByTestId("thumbnail-input"),
      {
        target: {
          files: [file],
        },
      }
    );

    expect(
      await screen.findByText("Erreur upload")
    ).toBeInTheDocument();

    expect(onUpdatedMock).not.toHaveBeenCalled();
  });

  it("deletes thumbnail and updates project", async () => {
    const updatedProject = {
      ...project,
      thumbnail: null,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        project: updatedProject,
      }),
    });

    render(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );

    fireEvent.click(
      screen.getByTestId("delete-thumbnail")
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/images/delete?projectId=1&type=thumbnail",
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );

      expect(onUpdatedMock).toHaveBeenCalledWith(
        updatedProject
      );
    });
  });

  it("deletes carousel image and updates project", async () => {
    const updatedProject = {
      ...project,
      carouselImages: [],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        project: updatedProject,
      }),
    });

    render(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );

    fireEvent.click(
      screen.getByTestId("delete-carousel-0")
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/images/delete?projectId=1&type=carousel",
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );

      expect(onUpdatedMock).toHaveBeenCalledWith(
        updatedProject
      );
    });
  });

  it("shows error when thumbnail deletion fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: "Erreur suppression",
      }),
    });

    render(
      <AdminProjectImagesModal project={project} onClose={onCloseMock} onUpdated={onUpdatedMock} />
    );

    fireEvent.click(
      screen.getByTestId("delete-thumbnail")
    );

    expect(
      await screen.findByText("Erreur suppression")
    ).toBeInTheDocument();

    expect(onUpdatedMock).not.toHaveBeenCalled();
  });
});