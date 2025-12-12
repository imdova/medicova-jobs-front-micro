import React from "react";
import { DraggableBlock } from "./DraggableBlock";
import DropArea from "./dropArea";
import { Block } from "@/types/blog";
import { DraggableContainer } from "./DraggableContainer";
import { useBlogStore } from "@/lib/blog/blog-store";
import { extractCssFromResponsive } from "@/util/blog";

interface BlockComponentProps {
  block: Block;
  isHorizontal?: boolean;
  pathTop: string;
  pathBottom: string;
}

const BlockComponent: React.FC<BlockComponentProps> = ({
  block,
  pathTop,
  pathBottom,
  isHorizontal,
}) => {
  const { handleDrop, currentBreakpoint } = useBlogStore();
  const styles = extractCssFromResponsive(
    block.styles.dimensions,
    currentBreakpoint,
  );

  if (block.type === "container") {
    return (
      <DropArea
        key={block.id}
        data={{
          pathTop,
          pathBottom,
        }}
        isHorizontal={isHorizontal}
        onDrop={handleDrop}
        styles={styles}
      >
        <DraggableContainer key={block.id} block={block} path={pathTop} />
      </DropArea>
    );
  }

  return (
    <DropArea
      key={block.id}
      data={{
        pathTop,
        pathBottom,
      }}
      isHorizontal={isHorizontal}
      onDrop={handleDrop}
      styles={styles}
    >
      <DraggableBlock key={block.id} block={block} path={pathTop} />
    </DropArea>
  );
};

export default BlockComponent;
