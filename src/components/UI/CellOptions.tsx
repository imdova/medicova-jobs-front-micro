"use client";
import { MoreVert } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";

type CellOptionsProps<T> = {
  options: ActionOption<T>[];
  item?: T;
};

export default function CellOptions<T>({ item, options }: CellOptionsProps<T>) {
  const [anchorEl, selAnchorEl] = useState<null | HTMLElement>(null);
  const onOpen = (e: MouseEvent<HTMLButtonElement>) =>
    selAnchorEl(e.currentTarget);
  const onClose = () => selAnchorEl(null);
  if (!options || !options.length) return null;
  return (
    <div>
      <IconButton onClick={onOpen}>
        <MoreVert />
      </IconButton>
      <Menu
        className="mt-2"
        disableAutoFocusItem={true}
        disableScrollLock={true}
        slotProps={{
          paper: {
            sx: { maxHeight: 300, borderRadius: "10px" },
            className: "scroll-bar-minimal",
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        {options.map((option, index) => {
          const isHidden = option.hidden?.(item);
          if (isHidden) return null;
          return (
            <MenuItem
              key={index}
              className="group min-w-40"
              onClick={() => {
                option?.action?.(item);
                onClose();
              }}
            >
              {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
              {typeof option.label === "function"
                ? option.label(item)
                : option.label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
