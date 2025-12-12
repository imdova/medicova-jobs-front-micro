import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import Link from "next/link";
import { JobData } from "@/types";
import { ContentCopy, Pause, PlayArrow } from "@mui/icons-material";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { removeJob, updateJob } from "@/store/slices/jobSlice";
import { useAppDispatch } from "@/store/hooks";

export const DropdownMenu = ({ job }: { job: JobData }) => {
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenDialog(false);
  };
  const toggleActive = () => {
    setAnchorEl(null);
    if (job.id) {
      dispatch(updateJob({ id: job.id, updates: { active: !job.active } }));
    }
  };
  const handleDelete = async () => {
    if (job.id) {
      dispatch(removeJob(job.id));
    }
    setAnchorEl(null);
    setOpenDialog(false);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  return (
    <React.Fragment>
      <IconButton
        size="medium"
        onClick={handleClick}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MoreVertIcon className="h-7 w-7" />
      </IconButton>
      <DeleteConfirmationDialog
        open={openDialog}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${job.title}"? This action cannot be undone.`}
        onDelete={handleDelete}
        onClose={handleClose}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="mt-2"
      >
        <MenuItem>
          <Link
            className="flex w-60 items-center gap-2"
            href={`/employer/job/posted/${job.id}`}
            onClick={handleClose}
          >
            <EditIcon color="primary" fontSize="small" />
            <span>Edit </span>
          </Link>
        </MenuItem>
        <Divider className="!m-0" />
        <MenuItem>
          <Link
            className="flex w-60 items-center gap-2"
            href={`/employer/job/posted/${job.id}?duplicate=true`}
            onClick={handleClose}
          >
            <ContentCopy color="primary" fontSize="small" />
            <span>Duplicate</span>
          </Link>
        </MenuItem>
        {!job.draft && (
          <>
            <Divider className="!m-0" />
            <MenuItem
              onClick={toggleActive}
              className="flex items-center gap-2"
            >
              {job.active ? (
                <Pause color="warning" fontSize="small" />
              ) : (
                <PlayArrow color="primary" fontSize="small" />
              )}
              <span>{job.active ? "Close Job" : "Open Job"}</span>
            </MenuItem>
          </>
        )}
        <Divider className="!m-0" />
        <MenuItem onClick={handleClickOpen} className="flex items-center gap-2">
          <DeleteIcon color="error" fontSize="small" />
          <span>Remove</span>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
