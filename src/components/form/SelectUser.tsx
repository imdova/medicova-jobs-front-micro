"use client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface SelectUserProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
}

const SelectUser: React.FC<SelectUserProps> = ({ value, onChange, label }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Autocomplete
      options={users}
      loading={loading}
      getOptionLabel={(option) => `${option.name} (${option.email})`}
      onChange={(_, newValue) => onChange?.(newValue?.id || "")}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || "Select User"}
          placeholder="Search users..."
        />
      )}
    />
  );
};

export default SelectUser; 