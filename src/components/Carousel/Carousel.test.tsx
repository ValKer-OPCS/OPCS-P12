import { render, screen, fireEvent } from "@testing-library/react";
import Carousel from "./Carousel";

const makeImage = (url: string) => ({
  original: url,
  responsive: [
    { name: "sm", width: 480, url: url.replace(".jpg", "-sm.jpg") },
    { name: "md", width: 1024, url: url.replace(".jpg", "-md.jpg") },
  ],
});

describe("Carousel", () => {
  const images = [
    makeImage("/img1.jpg"),
    makeImage("/img2.jpg"),
    makeImage("/img3.jpg"),
  ];

  it("renders the first image initially", () => {
    render(<Carousel images={images} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("/img1-sm.jpg"));
  });

  it("shows navigation buttons when multiple images", () => {
    render(<Carousel images={images} />);

    expect(screen.getByRole("button", { name: "‹" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "›" })).toBeInTheDocument();
  });

  it("does NOT show navigation buttons when only one image", () => {
    render(<Carousel images={[makeImage("/single.jpg")]} />);

    expect(screen.queryByRole("button", { name: "‹" })).toBeNull();
    expect(screen.queryByRole("button", { name: "›" })).toBeNull();
  });

  it("goes to next image when clicking ›", () => {
    render(<Carousel images={images} />);

    const nextBtn = screen.getByRole("button", { name: "›" });

    fireEvent.click(nextBtn);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("/img2-sm.jpg")
    );

    fireEvent.click(nextBtn);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("/img3-sm.jpg")
    );
  });

  it("loops back to first image when clicking next at the end", () => {
    render(<Carousel images={images} />);

    const nextBtn = screen.getByRole("button", { name: "›" });

    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("/img1-sm.jpg")
    );
  });

  it("goes to previous image when clicking ‹", () => {
    render(<Carousel images={images} />);

    const prevBtn = screen.getByRole("button", { name: "‹" });

    fireEvent.click(prevBtn);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("/img3-sm.jpg")
    );
  });

  it("clicking a dot changes the image", () => {
    render(<Carousel images={images} />);

    const dots = screen.getAllByRole("button").filter(
      (btn) => btn.textContent === ""
    );

    fireEvent.click(dots[2]);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("/img3-sm.jpg")
    );

    fireEvent.click(dots[0]);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("/img1-sm.jpg")
    );
  });
});
