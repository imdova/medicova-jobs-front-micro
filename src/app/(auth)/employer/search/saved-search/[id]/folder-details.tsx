"use client";
import {
  Box,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Menu,
  Divider,
  Snackbar,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import StarIcon from "@mui/icons-material/Star";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import DeselectIcon from "@mui/icons-material/Deselect";
import { Delete, Mail } from "@mui/icons-material";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import CandidateCard from "@/components/UI/candidate-card";
import { filterCandidates } from "@/util/user/candidates";
import Link from "next/link";
import { CandidateType, TapType } from "@/types/seeker";

const tabs: { type: TapType; icon: React.ReactNode }[] = [
  { type: "all", icon: null },
  { type: "locked", icon: <LockIcon className="mr-2 h-4 w-4 text-red-500" /> },
  {
    type: "unlocked",
    icon: <LockOpenIcon className="mr-2 h-4 w-4 text-green-500" />,
  },
  {
    type: "shortListed",
    icon: <StarIcon className="mr-2 h-4 w-4 text-yellow-500" />,
  },
];

const FolderDetails: React.FC<{ candidates: CandidateType[] }> = ({
  candidates,
}) => {
  const [selectedTab, setSelectedTab] = useState<TapType>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const isAllSelect = selected.length === candidates.length;
  const toggleSelectAll = () => {
    if (isAllSelect) {
      setSelected([]);
    } else {
      setSelected(candidates.map((x) => x.id));
    }
  };

  // actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // - // short list action
  const removeFromShortListed = () => console.log("remove from shortlisted");
  const addToShortListed = () => console.log("add to shortlisted");

  // export
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const exportOpen = Boolean(exportAnchorEl);
  const exportHandleClick = (event: any) => {
    setExportAnchorEl(event.currentTarget);
  };
  const exportHandleClose = () => {
    setExportAnchorEl(null);
  };

  // add to available
  const addToAvailable = () => console.log("add to available");
  return (
    <>
      <div className="flex justify-between pl-[32px]">
        <div className="max-w-[calc(100vw-64px)]">
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            // variant="scrollable"
            // scrollButtons="auto"
            aria-label="responsive tabs example"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.type}
                value={tab}
                label={
                  <span className="flex items-center normal-case">
                    {tab.icon}
                    {tab.type} ({filterCandidates(candidates, tab.type).length})
                  </span>
                }
              />
            ))}
          </Tabs>
        </div>

        <Select
          className="hidden h-12 md:flex"
          value="time-desc"
          onChange={(e) => console.log(e.target.value)}
        >
          <MenuItem value="time-desc">Newest</MenuItem>
          <MenuItem value="time-asc">Oldest</MenuItem>
        </Select>
      </div>
      <div className="mb-4 mt-2 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleSelectAll}
            className="h-fit rounded-md bg-primary/10"
          >
            {isAllSelect ? (
              <DeselectIcon className="m-2 h-6 w-6" />
            ) : (
              <SelectAllIcon className="m-2 h-6 w-6" />
            )}
          </button>
          {selected.length > 0 && (
            <div>
              <button
                onClick={handleClick}
                aria-controls={open ? "Action-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                className="h-fit rounded-md bg-primary/10 p-2 px-4 duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                <p className="inline-block">Action</p>
                <ExpandMoreIcon className="ml-2 inline-block h-6 w-6" />
              </button>
              <Menu
                id="Action-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                className="mt-2"
              >
                <MenuItem
                  onClick={handleClose}
                  className="flex items-center gap-2 hover:bg-gray-200"
                >
                  <Mail color="primary" className="h-5 w-5" />
                  Invite to Apply
                </MenuItem>
                <Divider className="!m-0" />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    addToAvailable();
                  }}
                  className="flex items-center gap-2 hover:bg-gray-200"
                >
                  <LockOpenIcon color="primary" className="h-5 w-5" />
                  Unlock Profile
                </MenuItem>
                <Divider className="!m-0" />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    addToShortListed();
                  }}
                  className="flex items-center gap-2 hover:bg-gray-200"
                >
                  <StarIcon color="primary" className="h-5 w-5" />
                  Add to Shortlist
                </MenuItem>
                <Divider className="!m-0" />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    removeFromShortListed();
                  }}
                  className="flex items-center gap-2 hover:bg-gray-200"
                >
                  <StarBorderOutlinedIcon color="warning" className="h-5 w-5" />
                  remove from Shortlist
                </MenuItem>
                <Divider className="!m-0" />
                <MenuItem
                  onClick={handleClose}
                  className="flex items-center gap-2 hover:bg-gray-200"
                >
                  <Delete className="h-5 w-5" color="error" />
                  Delete
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
        <div>
          <button
            onClick={exportHandleClick}
            aria-controls={exportOpen ? "export-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={exportOpen ? "true" : undefined}
            className="h-fit rounded-md bg-primary/10 p-2 px-4 duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <p className="inline-block w-16">Export</p>
            <ExpandMoreIcon className="ml-2 inline-block h-6 w-6" />
          </button>
          <Menu
            id="export-menu"
            anchorEl={exportAnchorEl}
            open={exportOpen}
            onClose={exportHandleClose}
            className="mt-2"
          >
            <MenuItem className="hover:bg-gray-200">PDF</MenuItem>
            <MenuItem className="hover:bg-gray-200">Excel (CSV)</MenuItem>
          </Menu>
        </div>
      </div>
      {candidates.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 p-5">
          <h3 className="text-center text-xl font-semibold text-muted-foreground">
            No candidates in this folder
          </h3>
          <p className="text-center text-sm text-muted-foreground">
            You can add candidates to this folder by adding them to the folder
          </p>
          <Button
            LinkComponent={Link}
            href="/employer/search/"
            variant="contained"
          >
            Search for Candidates
          </Button>
        </div>
      )}
      {filterCandidates(candidates, selectedTab).map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          selected={selected}
          setSelected={setSelected}
        />
      ))}
      <Snackbar
        open={showCopyAlert}
        autoHideDuration={3000}
        onClose={() => setShowCopyAlert(false)}
        message="Link copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default FolderDetails;
