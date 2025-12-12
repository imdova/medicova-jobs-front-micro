"use client";
import { Delete, Edit, MoreHoriz } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Folder } from "@/types";
import { formatDistanceToNow, getLastEdit } from "@/util";

interface FolderMainCardProps {
  folder: Folder;
  onEdit?: (folder: Folder) => void;
  onDelete?: (folder: Folder) => void;
}

const FolderMainCard: React.FC<FolderMainCardProps> = ({
  folder,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const onOpen = (event: any) => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);

  return (
    <div>
      <Menu
        id="Action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        className="mt-2"
      >
        {onEdit && (
          <MenuItem
            onClick={() => {
              onEdit(folder);
              onClose();
            }}
            className="group flex min-w-36 items-center gap-2 px-2 text-sm text-muted-foreground hover:bg-primary/10"
          >
            <Edit className="h-4 w-4 group-hover:text-primary" />
            Edit
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem
            onClick={() => {
              onDelete(folder);
              onClose();
            }}
            className="group flex min-w-24 items-center gap-2 px-2 text-sm text-muted-foreground hover:bg-red-100"
          >
            <Delete className="h-4 w-4 group-hover:text-red-500" />
            Delete
          </MenuItem>
        )}
      </Menu>
      <div className="relative">
        <Link
          href={`/employer/search/saved-search/${folder.id}`}
          className="group relative flex h-[100px] items-center justify-center rounded-md bg-[#ECF0F3] duration-150 hover:bg-[#D6DDEB] md:min-w-40"
        >
          <Image
            src="/images/folder.svg"
            width={40}
            height={40}
            alt="folder icon"
            className="object-contain duration-300 group-hover:scale-110"
          />
        </Link>
        {(onDelete || onEdit) && (
          <IconButton
            onClick={onOpen}
            aria-controls={open ? "save-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-muted-foreground"
          >
            <MoreHoriz className="h-6 w-6" />
          </IconButton>
        )}
        <p className="absolute bottom-2 right-2 text-sm">
          {folder.seekersCount || 0}
        </p>
      </div>

      <Link
        href={`/employer/search/saved-search/${folder.id}`}
        className="mt-2 line-clamp-2 px-2 text-base font-semibold hover:underline md:text-lg"
      >
        {folder.name}
      </Link>
      <p className="mb-2 px-2 text-xs text-black/50 md:text-sm">
        {formatDistanceToNow(folder.created_at)}
      </p>
    </div>
  );
};

export default FolderMainCard;
