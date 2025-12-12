import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Popover,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const DummyActionMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Handle menu open
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Icon Button to Open Menu */}
      <IconButton
        aria-label="more"
        aria-controls="dummy-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="text-gray-600 hover:text-gray-900"
      >
        <MoreVertIcon />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        id="dummy-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="mt-2"
      >
        {/* Menu Items */}
        <MenuItem onClick={handleClose}>
          <Typography variant="body2" className="text-sm">
            Edit
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Typography variant="body2" className="text-sm">
            Delete
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Typography variant="body2" className="text-sm">
            View Details
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DummyActionMenu;
