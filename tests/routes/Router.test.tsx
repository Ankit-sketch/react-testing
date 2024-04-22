import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../../src/routes";

describe("Router", () => {
  it("should render home page for /", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    }); // we can not use 'createBrowserRouter' because it is used in browser and we are doing testing and in testing there is no browser,
    render(<RouterProvider router={router} />);
    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });
});
