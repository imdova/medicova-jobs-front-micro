import { FileUploadModal } from "@/components/form/FileUploadModal";
import { DEFAULT_COVER_IMAGE } from "@/constants";
import { DeleteOutline, PhotoCamera } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { memo, useState } from "react";

interface CoverImageProps {
    currentImageUrl?: string;
    onImageUpdate?: (file: File) => Promise<void>;
    onImageRemove?: () => Promise<void>;
}

export const ProfileCoverImage = memo(
    ({ currentImageUrl, onImageUpdate, onImageRemove }: CoverImageProps) => {
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
            await onImageUpdate?.(file);
        };
        return (
            <div className="group relative">
                <Image
                    src={currentImageUrl || DEFAULT_COVER_IMAGE}
                    width={1080}
                    height={200}
                    alt="cover Image"
                    className="aspect-[4/1] min-h-24 w-full object-cover"
                />

                {/* Overlay with PhotoCamera icon */}
                {onImageUpdate && <button
                    onClick={handleMenuOpen}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Update profile picture"
                >
                    <PhotoCamera className="h-6 w-6 text-white" />
                </button>}

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

                <FileUploadModal
                    open={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={handleUpload}
                    title={"Upload a cover image for your blog"}
                    uploadButtonText={"Upload"}
                    description="choose a picture as your blog cover photo. Supported formats: JPG, PNG, GIF"
                />
            </div>
        );
    },
);

ProfileCoverImage.displayName = "ProfileCoverImage";