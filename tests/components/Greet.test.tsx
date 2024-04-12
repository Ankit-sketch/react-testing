import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Greet from "../../src/components/Greet";
import "@testing-library/jest-dom/vitest";
describe("Greet", () => {
  it("should render Hello with the name when name is provided", () => {
    render(<Greet name="Ankit Thakur" />);
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
  });
});
