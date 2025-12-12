"use client";
import React, { useEffect } from "react";

import BlockComponent from "./BlockComponent";
import { useBlogStore } from "@/lib/blog/blog-store";
import AddNewBlockDropZone from "./AddNewBlockDropZone";

const BlogBuilder = () => {
  const {
    blocks,
    selectedBlockId,
    cutBlock,
    copyBlock,
    removeBlock,
    duplicateBlock,
    pasteBlock,
  } = useBlogStore();

  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInput =
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable;

    if (isInput) return;
    if (selectedBlockId) {
      if (e.ctrlKey && e.key === "x") {
        cutBlock(selectedBlockId);
      }
      if (e.ctrlKey && e.key === "c") {
        copyBlock(selectedBlockId);
      }
      if (e.key === "Delete") {
        removeBlock(selectedBlockId);
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        e.stopPropagation();
        duplicateBlock(selectedBlockId);
      }
    }
    if (e.ctrlKey && e.key === "v") {
      pasteBlock();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlockId]);

  return (
    <>
      {blocks.map((block, index) => (
        <BlockComponent
          key={index}
          pathTop={`${index}`}
          pathBottom={`${index + 1}`}
          block={block}
        />
      ))}
      <AddNewBlockDropZone />
    </>
  );
};
export default BlogBuilder;
