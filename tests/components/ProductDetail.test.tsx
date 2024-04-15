import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { products } from "../mocks/data";

describe("ProductDetail", () => {
  it("should render list of products", async () => {
    render(<ProductDetail productId={1} />);
    expect(
      await screen.findByText(new RegExp(products[0].name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(products[0].price.toString()))
    ).toBeInTheDocument();
  });
  it("should render a meaasge when no product is found", async () => {
    render(<ProductDetail productId={122121} />);
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });
});
