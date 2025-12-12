import React, { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { FileUploadModal } from "../form/FileUploadModal";
import { DeleteOutline, PhotoCamera } from "@mui/icons-material";
import Avatar from "./Avatar";
import { cn } from "@/util";

interface ProfileImageProps {
  currentImageUrl?: string;
  size?: "small" | "medium" | "large" | "xLarge";
  onImageUpdate: (file: File) => Promise<void>;
  onImageRemove?: () => Promise<void>;
  maxFileSizeMB?: number;
  alt: string;
  // Style props
  className?: string;
  imageClassName?: string;
  // Custom styling
  avatarStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  // Labels
  uploadModalTitle?: string;
  uploadButtonText?: string;
  removeButtonText?: string;
}

// constants.ts
const SIZE_MAP = {
  small: { width: 32, height: 32 },
  medium: { width: 48, height: 48 },
  large: { width: 78, height: 78 },
  xLarge: { width: 96, height: 96 },
} as const;

const DEFAULT_IMAGE = "/images/placeholder-avatar.svg";
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const ProfileImage: React.FC<ProfileImageProps> = ({
  currentImageUrl,
  size = "medium",
  onImageUpdate,
  onImageRemove,
  maxFileSizeMB = 1,
  alt = "User",
  // Style props
  className,
  imageClassName,
  // Custom styling
  avatarStyle,
  imageStyle,
  // Labels
  uploadModalTitle = "Update Profile Picture",
  uploadButtonText = "Upload",
  removeButtonText = "Remove",
}) => {
  // State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUploadClick = () => {
    handleMenuClose();
    setIsUploadModalOpen(true);
  };

  const handleRemoveClick = async () => {
    handleMenuClose();
    if (onImageRemove) {
      await onImageRemove();
    }
  };

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    await onImageUpdate(file);
  };

  return (
    <div className="relative inline-block w-fit h-fit">
      {/* ProfileImage Image */}
      <div
        className={cn(
          "group relative rounded-full",
          className,
        )}
        style={avatarStyle}
      >
        <Avatar
          src={currentImageUrl || DEFAULT_IMAGE}
          size={SIZE_MAP[size].width}
          alt={alt}
          shape="circle"
          className={cn("object-cover", imageClassName)}
          priority={true}
        />

        {/* Overlay with camera icon */}
        <button
          type="button"
          onClick={handleMenuOpen}
          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Update profile picture"
        >
          <PhotoCamera className="h-7 w-7 text-white" />
        </button>
      </div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleUploadClick}>
          <PhotoCamera className="mr-2 h-4 w-4" />
          Update Photo
        </MenuItem>
        {onImageRemove && currentImageUrl && (
          <MenuItem onClick={handleRemoveClick} className="text-red-600">
            <DeleteOutline className="mr-2 h-4 w-4" />
            Remove Photo
          </MenuItem>
        )}
      </Menu>

      {/* Upload Modal */}
      <FileUploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        title={uploadModalTitle}
        uploadButtonText={uploadButtonText}
        maxFileSizeMB={maxFileSizeMB}
        acceptedFileTypes={ACCEPTED_IMAGE_TYPES}
        previewType="image"
        description="Choose a new profile picture. Supported formats: JPG, PNG, GIF"
      />
    </div>
  );
};

export default ProfileImage;
