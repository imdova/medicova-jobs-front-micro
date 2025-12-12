"use client";

import type { Editor } from "@tiptap/react";

interface EditorPreviewProps {
  editor: Editor;
}

export function EditorPreview({ editor }: EditorPreviewProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">Preview</h3>
      <div
        className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl"
        dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
      />
    </div>
  );
}
