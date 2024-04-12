import { User } from "../entities";
type CombinedProps = {
  user: User;
};
const UserAccount = ({ user }: CombinedProps) => {
  return (
    <>
      <h2>User Profile</h2>
      {user.isAdmin && <button>Edit</button>}
      <div>
        <strong>Name:</strong> {user.name}
      </div>
    </>
  );
};

export default UserAccount;
