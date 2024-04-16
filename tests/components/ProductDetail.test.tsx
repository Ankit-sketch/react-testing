import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { products } from "../mocks/data";
import { db } from "../mocks/db";
import { HttpResponse, http } from "msw";
import { server } from "../mocks/server";
describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render product details", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });
    render(<ProductDetail productId={productId} />);
    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });
  it("should render a error when an error occured", async () => {
    const productId = 0;
    server.use(
      http.get(`/products/${productId}`, () => {
        return HttpResponse.error();
      })
    );
    render(<ProductDetail productId={productId} />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
  it("should render product was not found when there is no product", async () => {
    const productId = 1233434;
    server.use(
      http.get(`/products/${productId}`, () => {
        return HttpResponse.json(null);
      })
    );
    render(<ProductDetail productId={productId} />);
    expect(await screen.findByText(/found/i)).toBeInTheDocument();
  });
});
