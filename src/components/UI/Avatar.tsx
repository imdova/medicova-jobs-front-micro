"use client";
import React from "react";
import { cn, formatDistanceToNow } from "@/util";
import { isFileWithPreview } from "@/util/forms";
import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarPrimitive,
} from "./AvatarHelper";
import { Tooltip } from "@mui/material";

interface FileWithPreview extends File {
  preview?: string;
}

function getFontSize(size: number): number {
  // Adjust divisor to control how quickly font grows
  const scale = size / 4;
  // Clamp between 9 and 18
  return Math.max(9, Math.min(18, Math.round(scale)));
}

interface AvatarProps {
  src?: string | FileWithPreview | null; // Image source URL or File with preview
  alt?: string; // Alt text for the image
  fallback?: string; // Fallback text for the avatar
  size?: number | "full"; // Size of the avatar (width and height)
  shape?: "circle" | "square"; // Shape of the avatar
  placeholderSrc?: string; // Custom placeholder image source
  className?: string; // Additional Tailwind CSS classes
  imageClass?: string; // Additional Tailwind CSS classes
  priority?: boolean;
  lastSeen?: string | Date;
}
const DEFAULT_IMAGE = "/images/placeholder-avatar.svg";

export function getStatusColor(lastSeen?: string | Date) {
  if (!lastSeen) return "red-500";
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - lastSeenDate.getTime()) / 1000,
  );

  if (diffInSeconds <= 60) {
    return "bg-green-500"; // Online
  } else if (diffInSeconds <= 300) {
    return "bg-amber-600"; // Active recently
  } else {
    return "bg-gray-500"; // Offline
  }
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  fallback,
  size = 40,
  shape = "circle",
  placeholderSrc = DEFAULT_IMAGE, // Default placeholder image
  className = "",
  imageClass = "",
  priority = false,
  lastSeen,
}) => {
  const imageSrc = isFileWithPreview(src) ? src.preview : (src as string);
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  const sizeStyle = size === "full" ? "100%" : `${size}px`;
  const statusColor = getStatusColor(lastSeen);
  return (
    <div
      style={{
        width: sizeStyle,
        height: sizeStyle,
      }}
      className="relative w-fit"
    >
      <AvatarPrimitive
        className={cn("flex-grow-0 bg-primary/10", shapeClass, className)}
        style={{
          width: sizeStyle,
          height: sizeStyle,
        }}
      >
        <AvatarImage
          src={imageSrc}
          className={cn("object-cover", shapeClass, imageClass)}
          style={{
            width: sizeStyle,
            height: sizeStyle,
          }}
        />
        <AvatarFallback
          style={{
            fontSize: size ? getFontSize(Number(size)) + "px" : "14px",
            width: sizeStyle,
            height: sizeStyle,
          }}
        >
          {fallback || alt.slice(0, 1)}
        </AvatarFallback>
      </AvatarPrimitive>
      {lastSeen && (
        <Tooltip title={formatDistanceToNow(lastSeen) + " ago" } placement="top">
          <span
            className={cn(
              "absolute end-0 top-0 size-3 rounded-full border-2 border-background",
              statusColor,
            )}
          >
            <span className="sr-only">Away</span>
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export default Avatar;
