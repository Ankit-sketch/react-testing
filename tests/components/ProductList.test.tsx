import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { HttpResponse, delay, http } from "msw";
import { server } from "../mocks/server";
import { db } from "../mocks/db";

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
      http.get("/products", async () => {
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />);

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });
  it("should render a error when an error occured", async () => {
    server.use(
      http.get("/products", async () => {
        return HttpResponse.error();
      })
    );
    render(<ProductList />);

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
    render(<ProductList />);
    const loading = await screen.findByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });
  it("should remove the loading state when the data got fetched", async () => {
    render(<ProductList />);
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
  it("should remove the loading state when the data fetching got failed", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.error();
      })
    );
    render(<ProductList />);
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
