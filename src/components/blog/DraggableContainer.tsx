import { Block, DraggedBlock } from "@/types/blog";
import { BlockRenderer } from "./BlockRenderer";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useAutoScrollOnDrag } from "@/hooks/useAutoScrollOnDrag";
import { DragIndicator } from "@mui/icons-material";
import { Plus, Square, X } from "lucide-react";
import { BlockAction } from "@/types/pageBuilder";
import { IconButton, Tooltip } from "@mui/material";
import { cn } from "@/util";
import { useBlogStore } from "@/lib/blog/blog-store";

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
];

interface DraggableBlockProps {
  block: Block;
  path: string;
}

export function DraggableContainer({ block, path }: DraggableBlockProps) {
  const { selectedBlockId, removeBlock, duplicateBlock, selectBlock } =
    useBlogStore();

  const isSelected = selectedBlockId === block.id;
  const mainContainer = path.split("-").length === 1;
  const dragRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;
  const previewRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;

  const [{ isDragging }, drag, preview] = useDrag({
    type: block.type,
    item: {
      ...block,
      path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const dropRef = useRef<HTMLDivElement | null>(null);
  const [{ isOver }, drop] = useDrop<DraggedBlock, void, { isOver: boolean }>({
    accept: ACCEPTS,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Combine both refs using a callback
  const setRef = (node: HTMLDivElement | null) => {
    if (node) {
      drop(node); // connect DnD
      dropRef.current = node; // store DOM reference
    }
  };

  const opacity = isDragging ? 0 : 1;

  drag(dragRef);
  preview(previewRef);

  useAutoScrollOnDrag({
    isDragging,
    className: ".scrollable-container",
  });

  const onAction = (block: Block, action: BlockAction) => {
    switch (action) {
      case "Delete":
        removeBlock(block?.id);
        break;
      case "Duplicate":
        duplicateBlock(block?.id);
        break;
    }
  };

  // group/supContainer-0 group/supContainer-1 group/supContainer-2 group/supContainer-3 group/supContainer-4
  // group-hover/supContainer-0:block group-hover/supContainer-1:block group-hover/supContainer-2:block  group-hover/supContainer-3:block group-hover/supContainer-4:block

  return (
    <div ref={previewRef} style={{ opacity }} className="DRAG_CONTAINER h-full">
      <div
        ref={setRef}
        className={cn(
          "relative h-full border border-transparent p-[1px]",
          mainContainer
            ? "group/container hover:border-primary"
            : `group/supContainer-${path.split("-").length - 2} hover:border-neutral-400`,
          {
            "border-2 border-primary p-0 hover:border-primary": isSelected,
          },
          { "border-primary": isOver },
        )}
      >
        {mainContainer ? (
          <div
            className={`absolute right-1/2 top-0 z-10 hidden -translate-y-full translate-x-1/2 overflow-hidden rounded-xl bg-secondary transition-all duration-500 group-hover/container:block`}
          >
            <div className="flex h-[24px] items-center justify-center">
              <Tooltip placement="top" arrow title="Duplicate Block">
                <IconButton
                  className="h-[24px] w-[24px] rounded-none p-1 hover:bg-primary"
                  onClick={() => onAction(block, "Duplicate")}
                >
                  <Plus className="h-4 w-4 cursor-pointer text-white" />
                </IconButton>
              </Tooltip>
              <div
                ref={dragRef}
                className={cn(
                  "flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-none hover:bg-primary",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  selectBlock(block.id);
                }}
              >
                <DragIndicator className={"h-4 w-4 text-white"} />
              </div>
              <Tooltip placement="top" arrow title="Duplicate Block">
                <IconButton
                  className="h-[24px] w-[24px] rounded-none p-1 hover:bg-primary"
                  onClick={() => onAction(block, "Delete")}
                >
                  <X className="h-4 w-4 cursor-pointer text-white" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div
            ref={dragRef}
            onClick={(e) => {
              e.stopPropagation();
              selectBlock(block.id);
            }}
            className={`absolute left-0 top-0 z-10 hidden h-6 w-6 cursor-pointer rounded-br-md bg-gray-600 p-1 group-hover/supContainer-${path.split("-").length - 2}:block`}
          >
            <Square className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        <BlockRenderer block={block} path={path} />
      </div>
    </div>
  );
}
