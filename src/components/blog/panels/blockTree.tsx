import React, { useRef, useState } from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { useBlogStore } from "@/lib/blog/blog-store";
import { Collapse, IconButton } from "@mui/material";
import {
  basicBlocks,
  contentBlocks,
  layoutBlocks,
} from "@/constants/pagebuilder/blocks";
import { Block, DraggedBlock, DropZoneData } from "@/types/blog";
import DropZone from "../dropzone";
import { useDrag } from "react-dnd";

const ACCEPTS = [
  "t-h1",
  "t-h2",
  "t-h3",
  "t-text",
  "t-paragraph",
  "t-image",
  "t-button",
  "t-html",
  "t-divider",
  "t-container",
  "t-flex-row",
  "t-flex-column",
  "t-quote",
  "t-code",
  "t-video",
];

type BlockNodeProps = {
  block: Block;
  level?: number;
  selectedBlockId?: string | null;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  handleDrop: (dropZone: DropZoneData, draggableBlock: DraggedBlock) => void;
  path: string;
};

const BlockNode: React.FC<BlockNodeProps> = ({
  block,
  level = 0,
  selectedBlockId,
  onClick,
  onDelete,
  handleDrop,
  path,
}) => {
  const dragRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;

  const [{ isDragging }, drag] = useDrag({
    type: `t-${block.type}`,
    item: {
      ...block,
      path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  drag(dragRef);

  const [isOpen, setIsOpen] = useState(true);

  const Icon = getBlockIcon(block.type);

  return (
    <div className={`pl-${level * 4} flex flex-col`}>
      <div
        className={`group flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition hover:bg-gray-50 ${
          selectedBlockId === block.id ? "bg-blue-50" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onClick(block.id);
        }}
        ref={dragRef}
        style={{ opacity }}
      >
        {block.allowNesting ? (
          <IconButton
            //   className="p-0"
            onClick={(e) => {
              e.stopPropagation();
              block.allowNesting && setIsOpen(!isOpen);
            }}
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </IconButton>
        ) : (
          <span className="w-4" />
        )}

        {Icon && <Icon size={18} />}
        <span className="line-clamp-1 flex-1 text-xs text-muted-foreground">
          {block.content ? block.content : block.type}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
          {block.id !== "root" && (
            <IconButton
              className="text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </IconButton>
          )}
        </div>
      </div>

      {block.allowNesting && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <div className="ml-6 border-l border-gray-300 pl-2">
            {block.blocks!.map((child, index) => (
              <React.Fragment key={child.id}>
                <DropZone
                  data={{
                    path: `${path}-${index}`,
                  }}
                  onDrop={handleDrop}
                  accepts={ACCEPTS}
                />
                <BlockNode
                  key={child.id}
                  block={child}
                  path={`${path}-${index}`}
                  handleDrop={handleDrop}
                  selectedBlockId={selectedBlockId}
                  onClick={(id) => onClick(id)}
                  onDelete={(id) => onDelete(id)}
                  level={level + 1}
                />
              </React.Fragment>
            ))}
            <DropZone
              data={{
                path: `${path}-${block.blocks?.length}`,
              }}
              onDrop={handleDrop}
              accepts={ACCEPTS}
            />
          </div>
        </Collapse>
      )}
    </div>
  );
};

const BlockTree: React.FC = () => {
  const { blocks, selectedBlockId, selectBlock, removeBlock, handleDrop } =
    useBlogStore();

  return (
    <div className="rounded-md bg-white p-4 shadow">
      {blocks.map((block, index) => (
        <React.Fragment key={block.id}>
          <DropZone
            data={{
              path: String(index),
            }}
            onDrop={handleDrop}
            accepts={ACCEPTS}
          />
          <BlockNode
            key={block.id}
            block={block}
            path={String(index)}
            handleDrop={handleDrop}
            selectedBlockId={selectedBlockId}
            onClick={(id) => selectBlock(id)}
            onDelete={(id) => removeBlock(id)}
          />
        </React.Fragment>
      ))}
      <DropZone
        data={{
          path: String(blocks.length),
        }}
        onDrop={handleDrop}
        accepts={ACCEPTS}
      />
    </div>
  );
};

const getBlockIcon = (type: Block["type"]) => {
  const blocks = [...basicBlocks, ...layoutBlocks, ...contentBlocks];
  const block = blocks.find((x) => x.id === type);
  return block?.icon;
};

export default BlockTree;
