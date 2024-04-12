import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  const limit = 255;
  const longText =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus obcaecati autem sint ipsum sequi repellat enim blanditiis dolorum laborum, ducimus facilis ex ipsam corporis, sunt vitae. Perspiciatis illo dolor repudiandae? Lorem ipsum dolor sit amet consectetur adipisicing elit.";
  const truncatedText = longText.substring(0, limit) + "...";
  it("should render full text if length is less than 255 character", () => {
    const shortText = "Short text";
    render(<ExpandableText text={shortText} />);

    expect(screen.getByText(shortText));
  });
  it("should render truncated text if length is greater than 255 character", () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent(/show more/i);
  });
  it("should expand text when show more button is pressed", async () => {
    const user = userEvent.setup();
    render(<ExpandableText text={longText} />);
    const button = screen.getByRole("button");

    await user.click(button);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });
  it("should collapse text when show less button is pressed", async () => {
    const user = userEvent.setup();
    render(<ExpandableText text={longText} />);
    const showMoreButton = screen.getByRole("button", { name: /more/i });
    await user.click(showMoreButton);

    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(showMoreButton).toHaveTextContent(/more/i);
  });
});
