"use client";
import { FilterList } from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";

const ApplicationsFilter = () => {
  const [anchorEl, selAnchorEl] = useState<null | HTMLElement>(null);
  const onOpen = (e: MouseEvent<HTMLButtonElement>) =>
    selAnchorEl(e.currentTarget);
  const onClose = () => selAnchorEl(null);
  return (
    <div>
      <Button variant="contained" startIcon={<FilterList />} onClick={onOpen}>
        Filter
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        <MenuItem onClick={onClose}>Date: Newest First</MenuItem>
        <MenuItem onClick={onClose}>Date: Oldest First</MenuItem>
        <MenuItem onClick={onClose}>Status: Active</MenuItem>
        <MenuItem onClick={onClose}>Status: Closed</MenuItem>
      </Menu>
    </div>
  );
};
export default ApplicationsFilter;
