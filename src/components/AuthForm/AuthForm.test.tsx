import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "./AuthForm";
import { AuthContext, AuthContextType } from "@/context/AuthContext";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("AuthForm", () => {
  const defaultAuthValue: AuthContextType = {
    token: null,
    setToken: jest.fn(),
    logout: jest.fn(),
    loaded: true,
  };

  const renderWithAuth = ( ui: React.ReactNode, authValue: Partial<AuthContextType> = {} ) => {
    const mergedValue: AuthContextType = { ...defaultAuthValue, ...authValue };

    return render(
      <AuthContext.Provider value={mergedValue}>
        {ui}
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    Storage.prototype.setItem = jest.fn();
  });

  it("renders the login form", () => {
    renderWithAuth(<AuthForm />);

    expect(screen.getByText("Connexion admin")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom d'utilisateur")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Se connecter" })).toBeInTheDocument();
  });

  it("updates username and password fields", () => {
    renderWithAuth(<AuthForm />);

    const userInput = screen.getByLabelText("Nom d'utilisateur") as HTMLInputElement;
    const passInput = screen.getByLabelText("Mot de passe") as HTMLInputElement;

    fireEvent.change(userInput, { target: { value: "admin" } });
    fireEvent.change(passInput, { target: { value: "1234" } });

    expect(userInput.value).toBe("admin");
    expect(passInput.value).toBe("1234");
  });

  it("logs in successfully and redirects", async () => {
    const setTokenMock = jest.fn();

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        token: "abc123",
      }),
    });

    renderWithAuth(<AuthForm />, { setToken: setTokenMock });

    fireEvent.change(screen.getByLabelText("Nom d'utilisateur"), {
      target: { value: "admin" },
    });

    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "1234" },
    });

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(setTokenMock).toHaveBeenCalledWith("abc123");
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message when API returns error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: "Identifiants invalides",
      }),
    });

    renderWithAuth(<AuthForm />);

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Identifiants invalides")).toBeInTheDocument();
    });
  });

  it("shows server error when fetch throws", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Server error"));

    renderWithAuth(<AuthForm />);

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Erreur serveur")).toBeInTheDocument();
    });
  });

  it("disables button while loading", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, token: "abc" }),
    });

    renderWithAuth(<AuthForm />);

    const button = screen.getByRole("button");

    fireEvent.submit(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Connexion...");

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
