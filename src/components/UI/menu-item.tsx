import { Divider, Typography } from "@mui/material";
import { LinkType } from "@/types/side-bar";
import LinkItem from "./LinkItem";
import CollapseItem from "./CollapseIem";

const ItemSelector: React.FC<{
  isOpen?: boolean;
  link: LinkType;
  onClick?: () => void;
  collapseOnClick?: () => void;
}> = ({ link, isOpen, onClick, collapseOnClick }) => {
  switch (link.kind) {
    case "divider":
      return <Divider sx={{ my: 2 }} />;
    case "title":
      return (
        <Typography
          className={`${isOpen === false ? "hidden" : ""} ml-2 font-medium opacity-50`}
          variant="caption"
        >
          SETTINGS
        </Typography>
      );
    case "collapse":
      return (
        <CollapseItem
          onClick={onClick}
          {...link}
          collapseOnClick={collapseOnClick}
        />
      );
    default:
      return <LinkItem onClick={onClick} {...link} />;
  }
};

export default ItemSelector;
