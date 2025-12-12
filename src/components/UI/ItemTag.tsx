"use Client";

import { IconButton } from "@mui/material";
import { X } from "lucide-react";

const ItemTag: React.FC<{
  item?: string;
  label: React.ReactNode;
  onRemove?: (item: string) => void;
}> = ({ item, label, onRemove }) => (
  <div className="space-x-2 rounded-base border bg-primary/10 py-1 pl-2 pr-1 text-main duration-100">
    {typeof label === "string" ? (
      <span className="text-xs">{label}</span>
    ) : (
      label
    )}
    {onRemove && item && (
      <IconButton
        className="p-1 hover:bg-red-100 hover:text-red-500"
        onClick={() => onRemove(item)}
      >
        <X className="h-4 w-4" />
      </IconButton>
    )}
  </div>
);

export default ItemTag;
