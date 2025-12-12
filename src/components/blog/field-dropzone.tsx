import React from "react";
import { FieldType } from "@/types";
import { useDrop } from "react-dnd";

const ACCEPTS: FieldType[] = [
  "text",
  "textArea",
  "number",
  "email",
  "phone",
  "password",
  "date",
  "textEditor",
  "select",
  "search-select",
  "checkbox",
  "component",
  "radio",
  "file",
  "otp",
];

type DropZoneData = {
  path: string;
};

type DragItem = {
  id: string;
  path?: string;
  type: FieldType;
};
type DropZoneProps = {
  data: DropZoneData;
  onDrop: (data: DropZoneData, item: DragItem) => void;
  isLast?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const FieldDropZone: React.FC<DropZoneProps> = ({
  data,
  onDrop,
  isLast = false,
  className,
  children,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: ACCEPTS,
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

  const baseClasses = "flex-none transition-all";

  const heightClass = isActive ? "h-[50px] bg-gray-200" : "h-[20px]";
  const widthClass = "w-auto";

  const flexGrowClass = isLast ? "flex-auto" : "";

  const bgClass = isActive
    ? "bg-gray-400/12 duration-100"
    : "bg-transparent duration-200";

  return (
    <div
      className={`${baseClasses} ${heightClass} ${widthClass} ${flexGrowClass} ${bgClass}`}
      ref={drop as any}
    >
      {children}
    </div>
  );
};

export default FieldDropZone;
