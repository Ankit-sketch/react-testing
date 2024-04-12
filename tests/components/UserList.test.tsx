import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("UserList", () => {
  it("should render no users when there are no users", () => {
    render(<UserList users={[]} />);
    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });
  it("should render users", () => {
    const users: User[] = [
      {
        id: 1,
        name: "Ankit Thakur",
        isAdmin: false,
      },
      {
        id: 2,
        name: "Sandeep Sori",
        isAdmin: false,
      },
    ];
    render(<UserList users={users} />);
    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});
