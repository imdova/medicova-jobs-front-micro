"use client";

import { Box } from "@mui/material";
import { EditorContent, type Editor } from "@tiptap/react";

interface EditorContentProps {
  editor: Editor;
  className?: string;
}

export function EditorContentWrapper({
  editor,
  className,
}: EditorContentProps) {
  return (
    <Box
      sx={{
        "& .ProseMirror ": {
          border: "none",
          p: 0,
          // minHeight: "unset",
        },
        "& .ProseMirror:focus": {
          border: "none",
        },
        "& a": {
          color: "blue",
          textDecoration: "underline",
          cursor: "pointer",
        },
      }}
      className={className}
    >
      <EditorContent
        editor={editor}
        placeholder="<p>Start writing...<p/>"
        className="prose prose-sm w-full focus:border-none focus:outline-none"
      />
    </Box>
  );
}
