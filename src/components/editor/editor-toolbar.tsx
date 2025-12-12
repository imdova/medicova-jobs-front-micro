"use client";

import type { Editor } from "@tiptap/react";
import { ToolbarButton } from "./toolbar-button";
import { Divider } from "@mui/material";
import {
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatUnderlined,
  Rotate90DegreesCcw,
  Link as LinkIcon,
} from "@mui/icons-material";
import { cn } from "@/util";

interface EditorToolbarProps {
  editor: Editor;
  className?: string;
  hasLinks?: boolean;
}

export function EditorToolbar({ editor, className, hasLinks = true }: EditorToolbarProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b bg-white p-2",
        className,
      )}
    >
      <ToolbarButton
        icon={FormatBold}
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      />
      <ToolbarButton
        icon={FormatItalic}
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      />
      <ToolbarButton
        icon={FormatUnderlined}
        label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
      />
      <Divider />
      <ToolbarButton
        icon={FormatListBulleted}
        label="Bullet List"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
      />
      <Divider />
      <ToolbarButton
        icon={FormatAlignLeft}
        label="Align Left"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
      />
      <ToolbarButton
        icon={FormatAlignCenter}
        label="Align Center"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
      />
      <ToolbarButton
        icon={FormatAlignRight}
        label="Align Right"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
      />
      {hasLinks && (
        <ToolbarButton
          icon={LinkIcon}
          label="Add Link"
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }}
          isActive={editor.isActive("link")}
        />
      )}
      <div className="flex-1" />
      <ToolbarButton
        icon={Rotate90DegreesCcw}
        label="Clear Formatting"
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
      />
    </div>
  );
}
export function BlockEditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <EditorToolbar
      editor={editor}
      className="absolute top-0 z-10 flex -translate-y-1/2 items-center gap-1 border-b-0"
    />
  );
}
