import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NavBar from "./NavBar";

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
  const Link = ({ href, children, onClick,
  }: { href: string; children: React.ReactNode; onClick?: React.MouseEventHandler<HTMLAnchorElement>; }) => (
    <a href={href} onClick={onClick} data-testid="mock-link" >
      {children}
    </a>
  );

  Link.displayName = "NextLinkMock";

  return Link;
});

describe("NavBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders home navigation items when pathname = '/'", () => {
    pathnameMock = "/";

    render(<NavBar />);

    expect(screen.getByText("A propos")).toBeInTheDocument();
    expect(screen.getByText("Projets")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getAllByTestId("icon")).toHaveLength(3);
  });

  it("renders 'Retour à l'accueil' when pathname starts with /login", () => {
    pathnameMock = "/login";

    render(<NavBar />);

    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
  });

  it("renders logout button when pathname starts with /dashboard", () => {
    pathnameMock = "/dashboard";

    render(<NavBar />);

    expect(screen.getByText("Déconnexion")).toBeInTheDocument();
  });

  it("calls logout API and redirects", async () => {
    pathnameMock = "/dashboard";

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    render(<NavBar />);

    fireEvent.click(
      screen.getByTestId("mock-link")
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("does NOT prevent default navigation when item has no onClick", () => {
    pathnameMock = "/";

    render(<NavBar />);

    const aboutLink = screen.getByText("A propos");

    const preventDefaultMock = jest.fn();

    fireEvent.click(aboutLink, {preventDefault: preventDefaultMock,});

    expect(preventDefaultMock).not.toHaveBeenCalled();
  });

  it("renders a nav with a list", () => {
    pathnameMock = "/";

    render(<NavBar />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders fallback navigation on unknown route", () => {
    pathnameMock = "/unknown";

    render(<NavBar />);

    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
  });
});