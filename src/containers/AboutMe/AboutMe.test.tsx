/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { render, screen } from "@testing-library/react";
import AboutMe from "./AboutMe";
import aboutMe from "@/data/aboutMe.json";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("AboutMe", () => {
  it("renders the about section", () => {
    render(<AboutMe />);
    expect(screen.getByTestId("about-section")).toBeInTheDocument();
  });

  it("renders the profile image", () => {
    render(<AboutMe />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Picture of ValKer");
    expect(img).toHaveAttribute("src");
  });

  it("renders all text lines from aboutMe.json", () => {
    render(<AboutMe />);

    aboutMe.text.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });
  });

  it("applies correct CSS classes", () => {
    render(<AboutMe />);

    const section = screen.getByTestId("about-section");
    expect(section.className).toContain("aboutContainer");
  });
});
