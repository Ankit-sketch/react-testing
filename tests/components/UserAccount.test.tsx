import { render, screen } from "@testing-library/react";
import { User } from "../../src/entities";
import UserAccount from "../../src/components/UserAccount";

describe("UserAccount", () => {
  it("It should render user name ", () => {
    const user: User = {
      id: 1,
      name: "Ankit Thakur",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });
  it("It should render Edit button if user is admin", () => {
    const user: User = {
      id: 1,
      name: "Ankit Thakur",
      isAdmin: true,
    };
    render(<UserAccount user={user} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
  it("It should not render Edit button if user is not admin", () => {
    const user: User = {
      id: 1,
      name: "Ankit Thakur",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);
    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
});
