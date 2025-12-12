import Link from "next/link";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { LinkType } from "@/types/side-bar";

const LinkItem: React.FC<LinkType & { onClick?: () => void }> = ({
  title,
  url,
  icon,
  onClick,
}) => {
  const IconComponent = icon;

  return (
    <ListItem disablePadding>
      <ListItemButton
        className="hover:bg-[#2EAE7D]/50"
        component={Link}
        disabled={!url}
        href={url || "#"}
        onClick={onClick}
      >
        {IconComponent && (
          <ListItemIcon>
            <Tooltip
              title={title}
              // disableHoverListener={isOpen}
              disableInteractive
              placement="right"
              arrow
            >
              <IconComponent sx={{ color: "white", fontSize: "20px" }} />
            </Tooltip>
          </ListItemIcon>
        )}
        <ListItemText
          primaryTypographyProps={{
            sx: { fontSize: "14px", fontWeight: "bold" },
          }}
          primary={title}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default LinkItem;
