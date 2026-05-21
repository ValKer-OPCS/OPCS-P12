import { render, screen } from "@testing-library/react";
import NamePlate from "./NamePlate";

jest.mock("../Logo/Logo", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-logo" />,
}));

describe("NamePlate", () => {
  it("renders without crashing", () => {
    render(<NamePlate />);
    expect(screen.getByTestId("nameplate")).toBeInTheDocument();
  });

  it("renders the Logo component", () => {
    render(<NamePlate />);
    expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
  });

  it("renders the name text", () => {
    render(<NamePlate />);
    expect(screen.getByText("Valker, développeur web")).toBeInTheDocument();
  });

  it("applies the correct CSS classes", () => {
    render(<NamePlate />);
    const container = screen.getByTestId("nameplate");

    expect(container.className).toContain("namePlate");
  });
});
