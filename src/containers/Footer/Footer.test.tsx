import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "./Footer";
import footerPrivacy from "@/data/footerPrivacy.json";
import footerTerms from "@/data/footerTerms.json";

describe("Footer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the footer", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders the current year", () => {
    const year = new Date().getFullYear();
    render(<Footer />);
    expect(screen.getByText(`© ${year} ValKer. All rights reserved`)).toBeInTheDocument();
  });

  it("opens the Privacy modal when clicking Privacy", () => {
    render(<Footer />);

    fireEvent.click(screen.getByText("Privacy"));

    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();

    footerPrivacy.text.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });
  });

  it("opens the Terms modal when clicking Terms", () => {
    render(<Footer />);

    fireEvent.click(screen.getByText("Terms"));

    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();

    footerTerms.text.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });
  });

  it("closes the modal when clicking the overlay", () => {
    render(<Footer />);

    fireEvent.click(screen.getByText("Privacy"));
    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("modal-overlay"));
    expect(screen.queryByTestId("modal-overlay")).toBeNull();
  });

  it("does NOT close the modal when clicking inside modal content", () => {
    render(<Footer />);

    fireEvent.click(screen.getByText("Privacy"));
    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("modal-content"));
    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
  });

  it("closes the modal when clicking the close button", () => {
    render(<Footer />);

    fireEvent.click(screen.getByText("Privacy"));
    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "X" }));
    expect(screen.queryByTestId("modal-overlay")).toBeNull();
  });
});
