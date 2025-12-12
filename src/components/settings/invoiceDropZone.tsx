import React, { CSSProperties } from "react";
import { useDrop } from "react-dnd";
import { cn } from "@/util";
import { Block, DraggedBlock, DropZoneData } from "@/types/blog";

const ACCEPTS: Block["type"][] = [
  "h1",
  "h2",
  "h3",
  "text",
  "paragraph",
  "image",
  "button",
  "html",
  "divider",
  "container",
  "quote",
  "code",
  "video",
  "form",
];

type DropZoneProps = {
  data: DropZoneData;
  onDrop: (data: DropZoneData, item: DraggedBlock) => void;
  isLast?: boolean;
  className?: string;
  children?: React.ReactNode;
  accepts?: string[];
  styles?: CSSProperties;
};

const DropZone: React.FC<DropZoneProps> = ({
  data,
  onDrop,
  className,
  children,
  accepts,
  styles,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop<
    DraggedBlock,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: accepts || ACCEPTS,
    drop: (item) => {
      onDrop(data, item);
    },
    canDrop: (item) => {
      const dropZonePath = data.path;
      const splitDropZonePath = dropZonePath.split("-");
      const itemPath = item.path;

      if (!itemPath) return true;

      const splitItemPath = itemPath.split("-");

      if (itemPath === dropZonePath) return false;

      if (splitItemPath.length === splitDropZonePath.length) {
        const pathToItem = splitItemPath.slice(0, -1).join("-");
        const currentItemIndex = Number(splitItemPath.at(-1));

        const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");
        const currentDropZoneIndex = Number(splitDropZonePath.at(-1));

        if (pathToItem === pathToDropZone) {
          const nextDropZoneIndex = currentItemIndex + 1;
          if (nextDropZoneIndex === currentDropZoneIndex) return false;
        }
      }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      style={styles}
      className={cn(
        "min-h-4 flex-grow-0",
        isActive && "h-full bg-secondary",
        className,
      )}
      ref={drop as any}
    >
      {children}
    </div>
  );
};

export default DropZone;
