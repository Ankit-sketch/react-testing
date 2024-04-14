import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const user = userEvent.setup();
    const onchange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onchange} />
      </Theme>
    );
    return {
      user,
      button: screen.getByRole("combobox"),
      getOptions: () => screen.findAllByRole("option"),
      onchange,
    };
  };
  it("should render new as default value", () => {
    const { button } = renderComponent();
    expect(button).toHaveTextContent(/new/i);
  });
  it("should render correct statuses", async () => {
    const { button, user, getOptions } = renderComponent();
    await user.click(button);
    const options = await getOptions();
    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });
  it.each([
    {
      label: /processed/i,
      value: "processed",
    },
    {
      label: /fulfilled/i,
      value: "fulfilled",
    },
  ])(
    "should call onChange with $value when $label is pressed ",
    async ({ label, value }) => {
      const { button, user, onchange } = renderComponent();
      await user.click(button);
      const option = await screen.findByRole("option", { name: label });
      await user.click(option);
      expect(onchange).toHaveBeenCalledWith(value);
    }
  );
});
