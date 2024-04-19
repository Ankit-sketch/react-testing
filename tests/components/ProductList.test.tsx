import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { HttpResponse, delay, http } from "msw";
import ProductList from "../../src/components/ProductList";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductList", () => {
  const productIds: number[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });
  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  // it("should render loading initially", () => {
  //   const { container } = render(<ProductList />, { wrapper: AllProviders });
  //   expect(container).toHaveTextContent(/loading/i);
  // });
  it("should render list of products", async () => {
    render(<ProductList />, { wrapper: AllProviders });
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });
  it("should render No products available when product length is 0", async () => {
    server.use(
      http.get("/products", async () => {
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />, { wrapper: AllProviders });
    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });
  it("should render a error when an error occured", async () => {
    server.use(
      http.get("/products", async () => {
        return HttpResponse.error();
      })
    );
    render(<ProductList />, { wrapper: AllProviders });
    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });
  it("should render a loading state until the data is getting fetched", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.error();
      })
    );
    render(<ProductList />, { wrapper: AllProviders });
    const loading = await screen.findByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });
  it("should remove the loading state when the data got fetched", async () => {
    render(<ProductList />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
  it("should remove the loading state when the data fetching got failed", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.error();
      })
    );
    render(<ProductList />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
