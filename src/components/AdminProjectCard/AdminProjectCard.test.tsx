/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { render, screen, fireEvent } from "@testing-library/react";
import AdminProjectCard from "./AdminProjectCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} data-testid="mock-image" />
  ),
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="icon" />,
}));

describe("AdminProjectCard", () => {
  const baseProps = {
    _id: "123",
    title: "Projet Test",
    shortDescription: "Une description",
    thumbnail: {
      original: "/thumb.webp",
      responsive: [{ name: "small", width: 400, url: "/thumb-small.webp" }],
    },
    hero: false,
    onToggleHero: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
    onEditImages: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title, description and thumbnail", () => {
    render(<AdminProjectCard {...baseProps} />);

    expect(screen.getByText("Projet Test")).toBeInTheDocument();
    expect(screen.getByText("Une description")).toBeInTheDocument();

    const img = screen.getByTestId("mock-image");
    expect(img).toHaveAttribute("src", "/thumb-small.webp");
    expect(img).toHaveAttribute("alt", "Projet Test");
  });

 it("uses fallback thumbnail when missing", () => {
  const props = {
    ...baseProps,
    thumbnail: {
      original: "",
      responsive: [],
    },
  };

  render(<AdminProjectCard {...props} />);

  const img = screen.getByTestId("mock-image");
  expect(img).toHaveAttribute("src", "/placeholder.webp");
});



  it("calls onToggleHero when clicking hero button", () => {
    render(<AdminProjectCard {...baseProps} />);

    const btn = screen.getAllByRole("button")[0];
    fireEvent.click(btn);

    expect(baseProps.onToggleHero).toHaveBeenCalledWith("123", false);
  });

  it("applies active class when hero=true", () => {
    const props = { ...baseProps, hero: true };

    render(<AdminProjectCard {...props} />);

    const btn = screen.getAllByRole("button")[0];
    expect(btn.className).toMatch(/active/);
  });

  it("calls onEdit when clicking edit button", () => {
    render(<AdminProjectCard {...baseProps} />);

    const btn = screen.getAllByRole("button")[1];
    fireEvent.click(btn);

    expect(baseProps.onEdit).toHaveBeenCalledWith("123");
  });

  it("calls onEditImages when clicking images button", () => {
    render(<AdminProjectCard {...baseProps} />);

    const btn = screen.getAllByRole("button")[2];
    fireEvent.click(btn);

    expect(baseProps.onEditImages).toHaveBeenCalledWith("123");
  });

  it("calls onDelete when clicking delete button", () => {
    render(<AdminProjectCard {...baseProps} />);

    const btn = screen.getAllByRole("button")[3];
    fireEvent.click(btn);

    expect(baseProps.onDelete).toHaveBeenCalledWith("123");
  });
});
