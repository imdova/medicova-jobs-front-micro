"use client";
import Link from "next/link";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { LinkType } from "@/types/side-bar";
const CollapseItem: React.FC<
  LinkType & { onClick?: () => void; collapseOnClick?: () => void }
> = ({ title, links, icon, onClick, collapseOnClick }) => {
  const IconComponent = icon;
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
    if (collapseOnClick) collapseOnClick();
  };
  return (
    <div>
      <ListItem disablePadding>
        <ListItemButton className="hover:bg-[#2EAE7D]/50" onClick={toggle}>
          {IconComponent && (
            <ListItemIcon>
              {isOpen ? (
                <IconComponent sx={{ color: "white", fontSize: "20px" }} />
              ) : (
                <Tooltip
                  title={title}
                  disableInteractive
                  placement="right"
                  arrow
                >
                  <IconComponent sx={{ color: "white", fontSize: "20px" }} />
                </Tooltip>
              )}
            </ListItemIcon>
          )}
          <ListItemText
            primaryTypographyProps={{
              sx: { fontSize: "14px", fontWeight: "bold" },
            }}
            primary={title}
          />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {links &&
            links.length > 0 &&
            links.map((link, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component={Link}
                  disabled={!link.url}
                  href={link.url || "#"}
                  onClick={() => {
                    onClick && onClick();
                    setIsOpen(false);
                  }}
                  sx={{
                    pl: 7,
                  }}
                  className="hover:bg-[#2EAE7D]/50"
                >
                  <ListItemText primary={link.title} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Collapse>
    </div>
  );
};

export default CollapseItem;
