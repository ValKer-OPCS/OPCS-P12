import { render, screen, fireEvent } from "@testing-library/react";
import Carousel from "./Carousel";

describe("Carousel", () => {
    const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];

    it("renders the first image initially", () => {
        render(<Carousel images={images} />);

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", images[0]);
    });

    it("shows navigation buttons when multiple images", () => {
        render(<Carousel images={images} />);

        expect(screen.getByRole("button", { name: "‹" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "›" })).toBeInTheDocument();
    });

    it("does NOT show navigation buttons when only one image", () => {
        render(<Carousel images={["/single.jpg"]} />);

        expect(screen.queryByRole("button", { name: "‹" })).toBeNull();
        expect(screen.queryByRole("button", { name: "›" })).toBeNull();
    });

    it("goes to next image when clicking ›", () => {
        render(<Carousel images={images} />);

        const nextBtn = screen.getByRole("button", { name: "›" });

        fireEvent.click(nextBtn);
        expect(screen.getByRole("img")).toHaveAttribute("src", images[1]);

        fireEvent.click(nextBtn);
        expect(screen.getByRole("img")).toHaveAttribute("src", images[2]);
    });

    it("loops back to first image when clicking next at the end", () => {
        render(<Carousel images={images} />);

        const nextBtn = screen.getByRole("button", { name: "›" });

        fireEvent.click(nextBtn);
        fireEvent.click(nextBtn);
        fireEvent.click(nextBtn);

        expect(screen.getByRole("img")).toHaveAttribute("src", images[0]);
    });

    it("goes to previous image when clicking ‹", () => {
        render(<Carousel images={images} />);

        const prevBtn = screen.getByRole("button", { name: "‹" });

        fireEvent.click(prevBtn);
        expect(screen.getByRole("img")).toHaveAttribute("src", images[2]);
    });

    it("clicking a dot changes the image", () => {
        render(<Carousel images={images} />);

        const allButtons = screen.getAllByRole("button", { hidden: true });
        const dots = allButtons.filter((btn) => btn.textContent !== "‹" && btn.textContent !== "›");

        fireEvent.click(dots[2]);
        expect(screen.getByRole("img")).toHaveAttribute("src", images[2]);

        fireEvent.click(dots[0]);
        expect(screen.getByRole("img")).toHaveAttribute("src", images[0]);
    });
});
