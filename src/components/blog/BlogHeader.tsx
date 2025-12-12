import { Menu, MenuItem, Select, TextareaAutosize } from "@mui/material";
import Image from "next/image";
import React, { memo, useState } from "react";
import { FileUploadModal } from "../form/FileUploadModal";
import { DeleteOutline, PhotoCamera } from "@mui/icons-material";
import { DEFAULT_COVER_IMAGE } from "@/constants";

const authors = [
  {
    id: "1",
    name: "Medicova",
    image: "/images/logo.png",
    title: "The best Platform",
  },
  {
    id: "2",
    name: "Jane Smith",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    title: "Content Editor",
  },
  {
    id: "3",
    name: "Alice Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    title: "Junior Writer",
  },
];

const initialData = {
  title: "",
  slug: "",
  cover: "",
  category: "",
  shortDescription: "",
  author: "1",
};

const categories = [
  {
    id: "1",
    name: "my categories here",
  },
];

const BlogHeader = () => {
  const [data, setData] = useState(initialData);
  const [image, setImage] = useState<File | null>(null);

  const updateImage = async (file: File) => {
    setImage(file);
  };
  return (
    <div className="flex w-full items-center justify-center">
      <div className="mb-4 w-full">
        <div>
          <CoverImage
            currentImageUrl={image ? URL.createObjectURL(image) : data.cover}
            onImageUpdate={updateImage}
          />
        </div>
        <div className="mx-auto max-w-[450px]">
          <input
            placeholder="Title"
            value={data.title}
            onChange={(e) =>
              setData((pv) => ({ ...pv, title: e.target.value }))
            }
            className="mb-2 w-full resize-none border-b border-dashed text-3xl font-bold tracking-tight focus:outline-none md:text-4xl"
          />
          <input
            placeholder="slug"
            value={data.slug}
            onChange={(e) => setData((pv) => ({ ...pv, slug: e.target.value }))}
            className="mb-2 w-full resize-none border-b border-dashed focus:outline-none"
          />

          <TextareaAutosize
            minRows={3}
            maxRows={8}
            placeholder="Description"
            value={data.shortDescription}
            onChange={(e) =>
              setData((pv) => ({ ...pv, shortDescription: e.target.value }))
            }
            className="mb-2 w-full resize-none border-b border-dashed focus:outline-none"
          />

          <Select
            className="mb-2 w-full"
            variant="standard"
            onChange={(e) =>
              setData((pv) => ({ ...pv, category: e.target.value as string }))
            }
            displayEmpty
            MenuProps={{
              disableScrollLock: true,
              PaperProps: {
                sx: { maxHeight: 300 },
              },
            }}
            renderValue={(selected) => {
              const category = categories.find((i) => i.id === selected);
              if (!category) {
                return <span className="text-gray-400">Job Category</span>;
              }
              return category.name;
            }}
          >
            <MenuItem value="" disabled>
              <em>Select Job Category</em>
            </MenuItem>
            {categories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            className="mb-4 w-full"
            variant="standard"
            defaultValue="1"
            value={data.author}
            onChange={(e) =>
              setData((pv) => ({ ...pv, author: e.target.value as string }))
            }
            displayEmpty
            MenuProps={{
              disableScrollLock: true,
              PaperProps: {
                sx: { maxHeight: 300 },
              },
            }}
            renderValue={(selected) => {
              const item = authors.find((i) => i.id === selected);
              if (!item) {
                return <span className="text-gray-400">Select autho</span>;
              }
              return (
                <div className="flex gap-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={35}
                    height={35}
                    className="h-[35px] w-[35px] max-w-[35px] rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs">{item.title}</p>
                  </div>
                </div>
              );
            }}
          >
            {authors.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <div className="flex gap-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={35}
                    height={35}
                    className="h-[35px] w-[35px] max-w-[35px] rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs">{item.title}</p>
                  </div>
                </div>
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default memo(BlogHeader);

interface AvatarProps {
  currentImageUrl?: string;
  onImageUpdate: (file: File) => Promise<void>;
  onImageRemove?: () => Promise<void>;
}

export const CoverImage = memo(
  ({ currentImageUrl, onImageUpdate, onImageRemove }: AvatarProps) => {
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
      <div className="group relative">
        <Image
          src={currentImageUrl || DEFAULT_COVER_IMAGE}
          width={450}
          height={450}
          alt="cover Image"
          className="mb-4 aspect-[4/1] w-full object-cover"
        />

        {/* Overlay with PhotoCamera icon */}
        <button
          onClick={handleMenuOpen}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Update profile picture"
        >
          <PhotoCamera className="h-6 w-6 text-white" />
        </button>

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

CoverImage.displayName = "CoverImage";
