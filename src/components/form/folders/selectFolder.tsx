"use client";
import FolderSmallCard from "@/components/UI/folder-small-card";
import { Search } from "@mui/icons-material";
import { InputAdornment, SelectProps, TextField } from "@mui/material";
import { useState } from "react";

interface SelectFolderProps extends Omit<SelectProps<string>, "children"> {
  folders: Folder[];
}
const filterItems = (items: Folder[], searchTerm: string) => {
  return items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

const SelectFolder: React.FC<SelectFolderProps> = ({
  folders,
  onChange,
  value,
  label,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="p-2">
      {/* <h3 className="mb-4 text-lg font-semibold">Recently Used</h3> */}
      <div className="mb-4 flex items-center justify-between bg-white">
        <h2 className="text-lg font-semibold">{label}</h2>
        <TextField
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search folders"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            classes: {
              input: "p-2", // Add padding to the input element
            },
          }}
        />
      </div>
      <div className="h-[calc(70dvh-200px)] overflow-y-auto scroll-bar-minimal">
        {folders.length > 0 && (
          <div className="grid grid-cols-3 gap-1 md:grid-cols-4 md:gap-2">
            {filterItems(folders, searchTerm).map((folder, index) => (
              <FolderSmallCard
                key={index}
                folder={folder}
                onChange={onChange}
                value={value}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectFolder;
