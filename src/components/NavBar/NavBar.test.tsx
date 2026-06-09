import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "./NavBar";
import { AuthContext, AuthContextType } from "@/context/AuthContext";

const pushMock = jest.fn();
let pathnameMock = "/";

jest.mock("next/navigation", () => ({
  usePathname: () => pathnameMock,
  useRouter: () => ({ push: pushMock }),
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="icon" />,
}));

jest.mock("next/link", () => {
  const Link = ({ href, children, onClick, }: { href: string; children: React.ReactNode; onClick?: React.MouseEventHandler<HTMLAnchorElement>; }) => (
    <a href={href} onClick={onClick} data-testid="mock-link">
      {children}
    </a>
  );
  Link.displayName = "NextLinkMock";
  return Link;
});

describe("NavBar", () => {
  const defaultAuthValue: AuthContextType = {
    token: "123",
    setToken: jest.fn(),
    logout: jest.fn(),
    loaded: true,
  };

  const renderWithAuth = (
    ui: React.ReactNode,
    authValue: Partial<AuthContextType> = {}
  ) => {
    const mergedValue: AuthContextType = { ...defaultAuthValue, ...authValue };

    return render(
      <AuthContext.Provider value={mergedValue}>
        {ui}
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    pushMock.mockClear();
    localStorage.clear();
  });

  it("renders home navigation items when pathname = '/'", () => {
    pathnameMock = "/";

    renderWithAuth(<NavBar />);

    expect(screen.getByText("A propos")).toBeInTheDocument();
    expect(screen.getByText("Projets")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();

    expect(screen.getAllByTestId("icon").length).toBe(3);
  });

  it("renders 'Retour à l'accueil' when pathname starts with /login", () => {
    pathnameMock = "/login";

    renderWithAuth(<NavBar />);

    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
  });

  it("renders logout button when pathname starts with /dashboard", () => {
    pathnameMock = "/dashboard";

    renderWithAuth(<NavBar />);

    expect(screen.getByText("Déconnexion")).toBeInTheDocument();
  });

  it("calls logout() and redirects when clicking Déconnexion", () => {
    pathnameMock = "/dashboard";

    const logoutMock = jest.fn();

    renderWithAuth(<NavBar />, { logout: logoutMock });

    const logoutLink = screen.getByTestId("mock-link");

    fireEvent.click(logoutLink);

    expect(logoutMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("prevents default navigation when item has onClick", () => {
    pathnameMock = "/dashboard";

    const logoutMock = jest.fn();

    renderWithAuth(<NavBar />, { logout: logoutMock });

    const logoutLink = screen.getByTestId("mock-link");

    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = jest.spyOn(clickEvent, "preventDefault");

    logoutLink.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(logoutMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("does NOT prevent default navigation when item has no onClick", () => {
    pathnameMock = "/";

    renderWithAuth(<NavBar />);

    const aboutLink = screen.getByText("A propos");

    const preventDefaultMock = jest.fn();

    fireEvent.click(aboutLink, { preventDefault: preventDefaultMock });

    expect(preventDefaultMock).not.toHaveBeenCalled();
  });

  it("renders a <nav> with a list", () => {
    pathnameMock = "/";

    renderWithAuth(<NavBar />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(3);
  });
});
