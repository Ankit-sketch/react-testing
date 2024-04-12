import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";
describe("Greet", () => {
  it("should render Hello with the name when name is provided", () => {
    render(<Greet name="Ankit Thakur" />);
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
  });
  it("should render login button when name is not present in props", () => {
    render(<Greet />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
