import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, delay, http } from "msw";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { db } from "../mocks/db";
import { server } from "../mocks/server";
import { CartProvider } from "../../src/providers/CartProvider";

describe("BrowseProducts", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach((item) => {
      const category = db.categories.create({ name: "Category" + item });
      const product = db.product.create();
      categories.push(category);
      products.push(product);
    });
  });
  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    db.categories.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((product) => product.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });
  const renderComponent = () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );
    return {
      heading: screen.getByRole("heading"),
      user,
      getCategorySkelton: () =>
        screen.getByRole("progressbar", {
          name: /categories/i,
        }),
      getProductSkelton: () =>
        screen.getByRole("progressbar", {
          name: /products/i,
        }),
    };
  };

  it("should render correct page Title", () => {
    const { heading } = renderComponent();
    expect(heading).toHaveTextContent(/products/i);
  });
  it("should render category skelton on loading during data fetching", async () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    const { getCategorySkelton } = renderComponent();
    expect(getCategorySkelton);
  });
  it("should remove category skelton on successfull data fetching", async () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    const { getCategorySkelton } = renderComponent();
    await waitForElementToBeRemoved(getCategorySkelton);
  });
  it("should render table skelton on loading during data fetching", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    const { getProductSkelton } = renderComponent();
    expect(getProductSkelton);
  });
  it("should remove table skelton on successfull data fetching", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    const { getProductSkelton } = renderComponent();
    await waitForElementToBeRemoved(getProductSkelton);
    // renderComponent();
    // await waitForElementToBeRemoved(() =>
    //   screen.getByRole("progressbar", {
    //     name: /Loading products/i,
    //   })
    // );
  });
  it("should not render error if categories can not be fetched", async () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.error();
      })
    );
    const { getCategorySkelton } = renderComponent();
    await waitForElementToBeRemoved(getCategorySkelton);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
  it("should render error if products can not be fetched", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.error();
      })
    );
    const { getProductSkelton } = renderComponent();
    await waitForElementToBeRemoved(getProductSkelton);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
  it("should render correct values inside the category box", async () => {
    const { user } = renderComponent();

    const combobox = await screen.findByRole("combobox");
    await user.click(combobox);
    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    // const options = await screen.findAllByRole("option");
    // expect(options.length).toBeGreaterThan(0);
    categories.forEach((category) => {
      expect(screen.getByRole("option", { name: category.name }));
    });
  });
  it("should render each and every products correctly", async () => {
    // renderComponent();
    // const options = await screen.findAllByRole("option");
    // expect(options.length).toBeGreaterThan(0);
    const { getProductSkelton } = renderComponent();
    await waitForElementToBeRemoved(getProductSkelton);
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
