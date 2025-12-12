"use client";
import { Close, PersonAdd } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Avatar from "./Avatar";

type User = {
  id: string;
  name: string;
  image?: string | null;
};

interface UserListSelectorProps {
  users: User[];
}

const UserListSelector: React.FC<UserListSelectorProps> = ({ users }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center rounded-full bg-gray-100 p-1"
          >
            <Avatar src={user.image} alt={user.name} size={24} />
            <span className="text-xs max-w-28 line-clamp-1 font-medium px-2">{user.name}</span>
            {/* <IconButton
              size="small"
              //   onClick={() => onRemoveUser(user.id)}
              className="h-4 w-4"
            >
              <Close className="h-3 w-3" />
            </IconButton> */}
          </div>
        ))}
        {/* <button
          //   onClick={() => setIsModalOpen(true)}
          className="bg-primary-50 text-primary-600 flex items-center gap-2 rounded-full px-3 py-1 hover:bg-primary/10"
        >
          <PersonAdd className="h-4 w-4" />
          <span className="text-sm">Add User</span>
        </button> */}
      </div>

      {/* <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="flex items-center justify-center"
      >
        <div className="w-[500px] rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Select Users</h2>
          <TextField
            fullWidth
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <div className="max-h-[400px] overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onAddUser(user);
                  setIsModalOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
              >
                <Avatar src={user.image} alt={user.name} />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </button>
            ))}
            {filteredUsers.length === 0 && (
              <div className="py-4 text-center text-gray-500">
                No users found
              </div>
            )}
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default UserListSelector;
