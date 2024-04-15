import { render, screen } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { HttpResponse, http } from "msw";
import { server } from "../mocks/server";

describe("ProductList", () => {
  it("should render loading initially", () => {
    const { container } = render(<ProductList />);
    expect(container).toHaveTextContent(/loading/i);
  });
  it("should render list of products", async () => {
    render(<ProductList />);
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });
  it("should render No products available when product length is 0", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />);

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });
});
