import { Block, DraggedBlock, DropZoneData } from "@/types/blog";
import { cn } from "@/util";
import React, { useRef } from "react";
import { useDragLayer, useDrop } from "react-dnd";

type DataDropZone = {
  pathTop: string;
  pathBottom: string;
};

type DropZoneProps = {
  data: DataDropZone;
  onDrop: (data: DropZoneData, item: DraggedBlock) => void;
  isLast?: boolean;
  isHorizontal?: boolean;
  children?: React.ReactNode;
  styles?: React.CSSProperties | null;
};

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

const canDropItem = (dropZonePath: string, itemPath: string): boolean => {
  if (!itemPath) return true;
  if (itemPath === dropZonePath) return false;

  const splitDropZonePath = dropZonePath.split("-");
  const splitItemPath = itemPath.split("-");

  if (splitItemPath.length === splitDropZonePath.length) {
    const itemParentPath = splitItemPath.slice(0, -1).join("-");
    const dropZoneParentPath = splitDropZonePath.slice(0, -1).join("-");
    const itemIndex = Number(splitItemPath.at(-1));
    const dropZoneIndex = Number(splitDropZonePath.at(-1));

    if (itemParentPath === dropZoneParentPath) {
      if (itemIndex + 1 === dropZoneIndex || itemIndex === dropZoneIndex) {
        return false;
      }
    }
  }

  return true;
};

// ✅ Custom hook for reusable drop logic
const useBlockDrop = (
  path: string,
  onDrop: (data: DropZoneData, item: DraggedBlock) => void,
) => {
  const dropRef = useRef<HTMLDivElement | null>(
    null,
  ) as React.MutableRefObject<HTMLDivElement | null>;

  const [{ isOver, canDrop }, drop] = useDrop<
    DraggedBlock,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: ACCEPTS,
    canDrop: (item) => canDropItem(path, item.path),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop: (item, monitor) => {
      onDrop({ path }, item);
    },
  });

  const ref = (node: HTMLDivElement | null) => {
    drop(node);
    dropRef.current = node;
  };

  return { ref, isOver, canDrop };
};

const DropArea: React.FC<DropZoneProps> = ({
  data,
  onDrop,
  isLast = false,
  isHorizontal,
  children,
  styles,
}) => {
  const isDragging = useDragLayer((monitor) => monitor.isDragging());
  const top = useBlockDrop(data.pathTop, onDrop);
  const bottom = useBlockDrop(data.pathBottom, onDrop);
  const zIndex = data.pathTop.split("-").length + 5;

  const isTopActive = top.isOver && top.canDrop;
  const isBottomActive = bottom.isOver && bottom.canDrop;

  return (
    <div className="DROP_AREA relative max-w-full" style={styles ? styles : {}}>
      {/* Top Drop Zone */}
      <div
        ref={top.ref}
        className={cn(
          "absolute",
          {
            "pointer-events-none": !isDragging,
          },
          isHorizontal
            ? "left-0 flex h-full w-2/5 max-w-40"
            : "top-0 h-2/5 max-h-12 w-full",
        )}
        style={{ zIndex }}
      >
        {/* TODO: fix horizontal  */}
        <div
          className={cn(
            isHorizontal ? "h-full w-0" : "h-0 w-full",
            isTopActive &&
              (isHorizontal ? "w-3 bg-secondary" : "h-3 bg-secondary"),
          )}
        >
          {/* <span className="text-xs text-blue-600">{data.pathTop}</span> */}
        </div>
      </div>
      {children}
      {/* Bottom Drop Zone */}
      <div
        ref={bottom.ref}
        className={cn(
          "absolute",
          {
            "pointer-events-none": !isDragging,
          },
          isHorizontal
            ? "right-0 top-0 flex h-full w-2/5 max-w-40 flex-row justify-end"
            : "bottom-0 flex h-2/5 max-h-12 w-full flex-col justify-end",
        )}
        style={{ zIndex }}
      >
        <div
          className={cn(
            isHorizontal ? "h-full w-0" : "h-0 w-full",
            isBottomActive &&
              (isHorizontal ? "w-3 bg-secondary" : "h-3 bg-secondary"),
          )}
        >
          {/* <span className="text-xs text-orange-600">{data.pathBottom}</span> */}
        </div>
      </div>
    </div>
  );
};

export default DropArea;
