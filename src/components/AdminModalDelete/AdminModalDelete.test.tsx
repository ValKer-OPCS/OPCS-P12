import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminModalDelete from "./AdminModalDelete";

describe("AdminModalDelete", () => {
  const onCancelMock = jest.fn();
  const onSuccessMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("returns null when open=false", () => {
    const { container } = render(
      <AdminModalDelete open={false} projectId="123" onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null when projectId=null", () => {
    const { container } = render(
      <AdminModalDelete open={true} projectId={null} onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("calls onCancel when clicking Annuler", () => {
    render(
      <AdminModalDelete open={true} projectId="123" onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /annuler/i })
    );

    expect(onCancelMock).toHaveBeenCalled();
  });

  it("calls onSuccess after successful delete", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    render(
      <AdminModalDelete open={true} projectId="123" onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /confirmer/i })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/projects/123",
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      expect(onSuccessMock).toHaveBeenCalledWith("123");
    });
  });

  it("logs error when delete request fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(
      <AdminModalDelete open={true} projectId="123" onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /confirmer/i })
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur suppression"
      );

      expect(onSuccessMock).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("handles network error gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (fetch as jest.Mock).mockRejectedValueOnce( new Error("Network error"));

    render(
      <AdminModalDelete open={true} projectId="123" onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /confirmer/i })
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(onSuccessMock).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});