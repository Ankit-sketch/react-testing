import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import { server } from "../mocks/server";
import { HttpResponse, delay, http } from "msw";

describe("BrowseProducts", () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
    );
    return {
      heading: screen.getByRole("heading"),
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
    renderComponent();
    expect(
      screen.getByRole("progressbar", {
        name: /categories/i,
      })
    );
  });
  it("should remove category skelton on successfull data fetching", async () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", {
        name: /categories/i,
      })
    );
  });
  it("should render table skelton on loading during data fetching", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    expect(
      screen.getByRole("progressbar", {
        name: /Loading products/i,
      })
    );
  });
  it("should remove table skelton on successfull data fetching", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", {
        name: /Loading products/i,
      })
    );
  });
  it("should not render error if categories can not be fetched", async () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.error();
      })
    );
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", {
        name: /categories/i,
      })
    );
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
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", {
        name: /Loading products/i,
      })
    );
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
