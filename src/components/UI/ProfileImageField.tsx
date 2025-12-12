"use client";

import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/UI/AvatarHelper";
import { cn } from "@/util";
import { Camera, Loader } from "lucide-react";
import uploadFiles from "@/lib/files/imageUploader";
import { AspectRatio } from "./aspect-ratio";
import { toast } from "sonner";

// Placeholder upload function (replace with your real API call)
async function uploadImage(file: File): Promise<string> {
  const [avatar] = await uploadFiles([file]);
  return avatar;
}

type ProfileImageFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  fallbackText?: string; // initials like "BD"
  maxSizeMB?: number; // default: 1MB
};

export function ProfileImageField({
  value,
  onChange,
  className,
  fallbackText = "U",
  maxSizeMB = 1,
}: ProfileImageFieldProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🔍 Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File must be smaller than ${maxSizeMB}MB`, {
        position: "bottom-right",
        style: {
          "--normal-bg": "color-mix(in oklab, var(--destructive) 5%, white)",
          "--normal-text": "var(--destructive)",
          "--normal-border":
            "color-mix(in oklab, var(--destructive) 25%, white)",
        } as React.CSSProperties,
      });
      e.target.value = ""; // reset input
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setLoading(true);

    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      console.error("Image upload failed:", err);
      setPreview(null);
      toast.error("Upload failed. Please try again.", {
        position: "bottom-right",
        style: {
          "--normal-bg": "color-mix(in oklab, var(--destructive) 5%, white)",
          "--normal-text": "var(--destructive)",
          "--normal-border":
            "color-mix(in oklab, var(--destructive) 25%, white)",
        } as React.CSSProperties,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <AspectRatio
        ratio={1}
        className={cn(
          "group relative w-full max-w-[160px] overflow-hidden rounded-full ring-1 ring-gray-200 dark:ring-gray-700",
          className,
        )}
      >
        {/* Avatar */}
        <Avatar className="h-full w-full">
          {preview ? (
            <AvatarImage src={preview} className="object-cover" alt="Preview" />
          ) : value ? (
            <AvatarImage src={value} className="object-cover" alt="Profile" />
          ) : (
            <AvatarFallback>{fallbackText}</AvatarFallback>
          )}
        </Avatar>

        {/* Overlay with camera */}
        <button
          type="button"
          role="button"
          tabIndex={0}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          aria-label="Update profile picture"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          {loading ? (
            <Loader className="h-7 w-7 animate-spin text-white" />
          ) : (
            <Camera className="h-7 w-7 text-white" />
          )}
        </button>

        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </AspectRatio>

      {/* Error message */}
    </div>
  );
}
