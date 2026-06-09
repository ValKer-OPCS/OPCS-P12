import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminModalDelete from "./AdminModalDelete";
import { AuthContext, AuthContextType } from "@/context/AuthContext";


describe("AdminModalDelete", () => {
  const onCancelMock = jest.fn();
  const onSuccessMock = jest.fn();

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

  it("returns null when open=false", () => {
    const { container } = renderWithAuth(
      <AdminModalDelete open={false} projectId="123" onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null when projectId=null", () => {
    const { container } = renderWithAuth(
      <AdminModalDelete open={true} projectId={null} onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("calls onCancel when clicking Annuler", () => {
    renderWithAuth(
      <AdminModalDelete open={true} projectId="123" onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    fireEvent.click(screen.getByRole("button", { name: /annuler/i }));
    expect(onCancelMock).toHaveBeenCalled();
  });

  it("calls onSuccess after successful delete", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({}),
    });

    renderWithAuth(
      <AdminModalDelete open={true} projectId="123" onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    fireEvent.click(screen.getByRole("button", { name: /confirmer/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith( "/api/projects/123", expect.any(Object) );
      expect(onSuccessMock).toHaveBeenCalledWith("123");
    });
  });

  it("logs error when token is missing", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    renderWithAuth(
      <AdminModalDelete open={true} projectId="123" onCancel={onCancelMock} onSuccess={onSuccessMock} />,
      { token: null }
    );

    fireEvent.click(screen.getByRole("button", { name: /confirmer/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("JWT manquant");
      expect(onSuccessMock).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("handles network error gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    renderWithAuth(
      <AdminModalDelete open={true} projectId="123" onCancel={onCancelMock} onSuccess={onSuccessMock} />
    );

    fireEvent.click(screen.getByRole("button", { name: /confirmer/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(onSuccessMock).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
