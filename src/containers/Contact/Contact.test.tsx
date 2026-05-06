import { render, screen } from "@testing-library/react";
import Contact from "./Contact";

jest.mock("@/components/ContactForm/ContactForm", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-contact-form" />,
}));

describe("Contact", () => {
  it("renders the contact section", () => {
    render(<Contact />);
    expect(screen.getByTestId("contact-section")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { level: 2, name: "Contact" })).toBeInTheDocument();
  });

  it("renders the ContactForm component", () => {
    render(<Contact />);
    expect(screen.getByTestId("mock-contact-form")).toBeInTheDocument();
  });

  it("applies the correct CSS class", () => {
    render(<Contact />);
    const section = screen.getByTestId("contact-section");
    expect(section.className).toContain("contactContainer");
  });
});
