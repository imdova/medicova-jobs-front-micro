"use client";

import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { X } from "lucide-react";

interface Snippet {
  id: string;
  name: string;
  position: "head" | "footer";
  content: string;
  isActive: boolean;
  type: "script" | "style" | "meta" | "custom";
  order: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  pages?: string[];
}

interface SnippetPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet?: Snippet;
}

export function SnippetPreviewDialog({
  open,
  onOpenChange,
  snippet,
}: SnippetPreviewDialogProps) {
  if (!snippet) return null;

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <DialogTitle className="m-0 p-0 text-lg font-semibold">
          Snippet Preview: <span className="text-primary">{snippet.name}</span>
        </DialogTitle>
        <button
          onClick={() => onOpenChange(false)}
          className="rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <DialogContent className="space-y-6 p-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoBlock label="Name" value={snippet.name} />

          <div>
            <Label text="Position" />
            <Badge
              text={snippet.position}
              color={snippet.position === "head" ? "blue" : "green"}
            />
          </div>

          <InfoBlock label="Type" value={snippet.type} capitalize />
          <InfoBlock label="Order" value={String(snippet.order)} />

          <div>
            <Label text="Status" />
            <Badge
              text={snippet.isActive ? "Active" : "Inactive"}
              color={snippet.isActive ? "green" : "gray"}
            />
          </div>

          <InfoBlock
            label="Pages"
            value={
              snippet.pages && snippet.pages.length > 0
                ? snippet.pages.join(", ")
                : "All pages"
            }
          />
        </div>

        {/* Notes */}
        {snippet.notes && (
          <div>
            <Label text="Notes" />
            <p className="mt-1 text-sm text-gray-900">{snippet.notes}</p>
          </div>
        )}

        {/* Code Content */}
        <div>
          <Label text="Code Content" />
          <div className="mt-2 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm text-gray-800">
              {snippet.content}
            </pre>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2">
          <div>
            <span className="font-medium">Created:</span>{" "}
            {new Date(snippet.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{" "}
            {new Date(snippet.updatedAt).toLocaleString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Reusable sub-components
function Label({ text }: { text: string }) {
  return <label className="text-sm font-medium text-gray-700">{text}</label>;
}

function InfoBlock({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <Label text={label} />
      <p className={`text-sm text-gray-900 ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function Badge({
  text,
  color,
}: {
  text: string;
  color: "blue" | "green" | "gray";
}) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${colorMap[color]}`}
    >
      {text}
    </span>
  );
}
