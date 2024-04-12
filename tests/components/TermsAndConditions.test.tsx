import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    const user = userEvent.setup();
    render(<TermsAndConditions />);
    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button", { name: "Submit" }),
      user,
    };
  };
  it("should render correct heading and correct initial state", () => {
    const { heading, checkbox, button } = renderComponent();
    expect(heading).toHaveTextContent(/Terms & Conditions/i);
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });
  it("should enable the button when the checkbox is checked", async () => {
    const { user, checkbox, button } = renderComponent();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(button).toBeEnabled();
  });
});
