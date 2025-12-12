"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./extensions";
import { EditorToolbar } from "./editor-toolbar";
import { EditorContentWrapper } from "./editor-content";
import { CSSProperties, useEffect } from "react";
import { Box, TextFieldProps } from "@mui/material";

const TextEditor: React.FC<TextFieldProps & { hasLinks?: boolean }> = ({
  value,
  onChange,
  className,
  hasLinks,
}) => {
  const editor = useEditor({
    extensions,
    content: value as string | undefined,
    onUpdate: ({ editor }) => {
      onChange &&
        onChange({
          target: { value: editor.getHTML() },
        } as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>);
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value as string);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }
  return (
    <div className="rounded-lg border border-input-border bg-white shadow-sm overflow-y-auto">
      <EditorToolbar editor={editor} hasLinks={hasLinks} />
      <EditorContentWrapper className={className} editor={editor} />
    </div>
  );
};

export const BlockTextEditor: React.FC<{
  value: string;
  onChange: (e: string) => void;
  isSelected: Boolean;
  style?: CSSProperties | null;
}> = ({ value, onChange, style, isSelected }) => {
  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value as string);
    }
  }, [value, editor]);

  // Remove the problematic effect that was creating issues
  // The onUpdate handler above will handle changes instead

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      {/* <div className={isSelected ? "block" : "hidden group-hover/block:block"}>
        <BlockEditorToolbar editor={editor} />
      </div> */}
      <Box
        sx={{
          "& *": {
            ...style,
          },
          "& .ProseMirror ": {
            border: "none",
            p: 0,
            minHeight: "unset",
          },
          "& .ProseMirror:focus": {
            border: "none",
          },
          "& a, a *": {
            color: "blue !important",
            textDecoration: "underline !important",
            cursor: "pointer !important",
            "&:hover": {
              textDecoration: "none !important",
            },
          },
        }}
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm w-full focus:border-none focus:outline-none"
        />
      </Box>
    </div>
  );
};

export default TextEditor;
