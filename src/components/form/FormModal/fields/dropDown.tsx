"use client";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { Option } from "@/types";
import { ChevronDown } from "lucide-react";

interface Props {
  className?: string;
  options?: Option[];
  onChange?: (option: Option) => void;
  children: React.ReactNode;
  showIcon?: boolean;
}
const DropDown = ({
  className = "flex items-center justify-between gap-2",
  options,
  onChange,
  children,
  showIcon = true,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className={className}
        type="button"
      >
        {children}{" "}
        {showIcon && (
          <ChevronDown className={`h-3 w-3 ${anchorEl ? "rotate-180" : ""}`} />
        )}
      </button>
      <Menu
        id="breakpoint-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        disableAutoFocusItem={true}
        disableScrollLock={true}
        slotProps={{
          paper: {
            sx: {
              "& .MuiList-padding": {
                padding: 0,
              },
              maxHeight: 300,
              padding: 0,
              borderRadius: "4px",
            },
            className:
              "scroll-bar-minimal min-w-36 mt-1 shadow-lg border border-gray-200",
          },
        }}
      >
        {options?.length === 0 && (
          <MenuItem disabled className="text-xs">
            No options
          </MenuItem>
        )}
        {options?.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              setAnchorEl(null);
              onChange?.(option);
            }}
            className="text-xs hover:bg-gray-100"
          >
            {option.icon && option.icon}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropDown;
