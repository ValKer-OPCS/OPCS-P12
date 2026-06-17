import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "./AuthForm";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("AuthForm", () => {
  beforeEach(() => { jest.clearAllMocks(); global.fetch = jest.fn(); });

  it("renders the login form", () => {
    render(<AuthForm />);

    expect(screen.getByText("Connexion admin")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom d'utilisateur")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe") ).toBeInTheDocument();
    expect( screen.getByRole("button", { name: "Se connecter", }) ).toBeInTheDocument();
  });

  it("updates username and password fields", () => {
    render(<AuthForm />);

    const userInput = screen.getByLabelText( "Nom d'utilisateur" ) as HTMLInputElement;
    const passInput = screen.getByLabelText( "Mot de passe" ) as HTMLInputElement;

    fireEvent.change(userInput, { target: { value: "admin" }, });
    fireEvent.change(passInput, { target: { value: "1234" }, });

    expect(userInput.value).toBe("admin");
    expect(passInput.value).toBe("1234");
  });

  it("calls login API with credentials include", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
      }),
    });

    render(<AuthForm />);

    fireEvent.change( screen.getByLabelText("Nom d'utilisateur"),
      {
        target: { value: "admin" },
      }
    );

    fireEvent.change( screen.getByLabelText("Mot de passe"),
      {
        target: { value: "1234" },
      }
    );

    fireEvent.submit( screen.getByRole("button")
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username: "admin",
            password: "1234",
          }),
        }
      );
    });
  });

  it("redirects to dashboard after successful login", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
      }),
    });

    render(<AuthForm />);

    fireEvent.change( screen.getByLabelText("Nom d'utilisateur"),
      {
        target: { value: "admin" },
      }
    );

    fireEvent.change( screen.getByLabelText("Mot de passe"),
      {
        target: { value: "1234" },
      }
    );

    fireEvent.submit( screen.getByRole("button")
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        "/dashboard"
      );
    });
  });

  it("shows error message when API returns error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message:
          "Identifiants invalides",
      }),
    });

    render(<AuthForm />);

    fireEvent.submit( screen.getByRole("button")
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Identifiants invalides"
        )
      ).toBeInTheDocument();
    });
  });

  it("shows server error when fetch throws", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Server error")
    );

    render(<AuthForm />);

    fireEvent.submit( screen.getByRole("button")
    );

    await waitFor(() => {
      expect( screen.getByText("Erreur serveur") ).toBeInTheDocument(); });
  });

  it("disables button while loading", async () => {
    let resolveFetch: (
      value: unknown
    ) => void;

    const fetchPromise = new Promise(
      (resolve) => {
        resolveFetch = resolve;
      }
    );

    (fetch as jest.Mock).mockReturnValueOnce(
      fetchPromise
    );

    render(<AuthForm />);

    const button = screen.getByRole("button");

    fireEvent.submit(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent( "Connexion..." );

    resolveFetch!({
      json: async () => ({
        success: true,
      }),
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});