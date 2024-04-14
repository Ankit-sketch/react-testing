import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderComponent = () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<SearchBox onChange={mockOnClick} />);
    return {
      textbox: screen.queryByPlaceholderText(/search/i),
      mockOnClick,
      user,
    };
  };

  it("should render the input box", () => {
    const { textbox } = renderComponent();
    expect(textbox).toBeInTheDocument();
  });

  it("should call when the value of input box is changed", async () => {
    const { mockOnClick, textbox, user } = renderComponent();
    if (textbox) {
      await user.type(textbox, "World{enter}");
      expect(mockOnClick).toHaveBeenCalledWith("World");
    }
  });

  it("should not call when no value is in input box", async () => {
    const { mockOnClick, textbox, user } = renderComponent();
    if (textbox) {
      await user.type(textbox, "{enter}");
      expect(mockOnClick).not.toHaveBeenCalled();
    }
  });
});
