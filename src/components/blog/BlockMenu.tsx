// not used use or delete this file

import { Block } from "@/types/blog";
import { BlockAction } from "@/types/pageBuilder";
import {
  ContentCopy,
  ContentCut,
  DeleteOutline,
  WidthFullOutlined,
} from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";

interface BlockMenuProps {
  block: Block;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  setSelectedBlock: React.Dispatch<React.SetStateAction<Block | null>>;
}

export function BlockMenu({
  block,
  anchorEl,
  isOpen,
  onClose,
  setBlocks,
  setSelectedBlock,
}: BlockMenuProps) {
  const onAction = (block: Block, action: BlockAction) => {
    switch (action) {
      case "Delete":
        setBlocks((prev) => prev.filter((x) => x.id !== block.id));
        break;
      case "Duplicate":
        const newBlock = {
          ...block,
          id: Math.random().toString(36).slice(2, 11),
        };
        setBlocks((prev) => [...prev, newBlock]);
        setSelectedBlock(newBlock);
        break;
      case "Split":
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === block.id ? { ...b, gridProps: { xs: 12, sm: 6 } } : b,
          ),
        );
        break;
      case "Full-Width":
        setBlocks((prev) =>
          prev.map((b) => (b.id === block.id ? { ...b, gridProps: {} } : b)),
        );
        break;
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      anchorOrigin={{ vertical: "center", horizontal: "left" }}
      transformOrigin={{ vertical: "center", horizontal: "right" }}
    >
      <MenuItem onClick={() => onAction(block, "Split")}>
        <ContentCut className="mr-2 h-4 w-4" /> Split
      </MenuItem>
      <MenuItem onClick={() => onAction(block, "Full-Width")}>
        <WidthFullOutlined className="mr-2 h-4 w-4" /> Full Width
      </MenuItem>
      <MenuItem onClick={() => onAction(block, "Duplicate")}>
        <ContentCopy className="mr-2 h-4 w-4" /> Duplicate
      </MenuItem>
      <MenuItem
        className="text-red-500"
        onClick={() => onAction(block, "Delete")}
      >
        <DeleteOutline className="mr-2 h-4 w-4" /> Delete
      </MenuItem>
    </Menu>
  );
}
