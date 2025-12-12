"use client";
import { formatDistanceToNow } from "@/util";
import { Search } from "@mui/icons-material";
import {
  InputAdornment,
  SelectChangeEvent,
  SelectProps,
  TextField,
  Avatar,
} from "@mui/material";
import { useState } from "react";

// Updated Dummy Data
const accountManagers: AccountManagerData[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    country: "USA",
    city: "New York",
    created_at: "2024-01-01T10:00:00Z",
    employersCount: 12,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    country: "UK",
    city: "London",
    created_at: "2024-02-15T15:30:00Z",
    employersCount: 8,
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    country: "Canada",
    city: "Toronto",
    created_at: "2024-03-22T09:00:00Z",
    employersCount: 15,
  },
];

// Types
interface AccountManagerData {
  id: string;
  name: string;
  email: string;
  image: string;
  country?: string;
  city?: string;
  created_at: string;
  employersCount: number;
}

interface SelectAccountManagerProps
  extends Omit<SelectProps<string>, "children"> {
  label?: string;
  onChange?: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  value?: string;
}

const filterItems = (items: AccountManagerData[], searchTerm: string) => {
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

const SelectAccountManager: React.FC<SelectAccountManagerProps> = ({
  onChange,
  value,
  label = "Select Account Manager",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-main">{label}</h2>
        <TextField
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className="scroll-bar-minimal grid max-h-[300px] grid-flow-row gap-2 overflow-y-auto overflow-x-hidden p-2">
        {filterItems(accountManagers, searchTerm).map((accountManager) => (
          <AccountManagerItem
            key={accountManager.id}
            accountManager={accountManager}
            onChange={onChange}
            value={value}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectAccountManager;

// Subcomponent
interface AccountManagerItemProps {
  accountManager: AccountManagerData;
  onChange?: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  value?: string;
}

const AccountManagerItem: React.FC<AccountManagerItemProps> = ({
  accountManager,
  onChange,
  value,
}) => {
  const isSelected = accountManager.id === value;
  const location = `${accountManager.city || ""}, ${accountManager.country || ""}`;
  const clickHandler = () => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: accountManager.id },
      } as unknown as SelectChangeEvent<string>;
      onChange(syntheticEvent, null);
    }
  };

  return (
    <button
      type="button"
      onClick={clickHandler}
      className={`flex items-center gap-3 rounded-base border bg-white p-3 text-left duration-150 hover:scale-[1.01] hover:border-primary hover:shadow-lg ${
        isSelected ? "border-primary shadow-lg" : "border-gray-200"
      }`}
    >
      <Avatar src={accountManager.image} alt={accountManager.name} />
      <div className="flex flex-col text-left">
        <span className="font-semibold text-main">{accountManager.name}</span>
        <span className="text-sm text-gray-600">{accountManager.email}</span>
        <span className="text-sm text-gray-500">
          {location} | {accountManager.employersCount} employers |{" "}
          {formatDistanceToNow(accountManager.created_at)}
        </span>
      </div>
    </button>
  );
};
