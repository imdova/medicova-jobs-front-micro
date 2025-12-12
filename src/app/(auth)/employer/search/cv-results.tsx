"use client";
import {
  MenuItem,
  Menu,
  InputAdornment,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import DeselectIcon from "@mui/icons-material/Deselect";
import { Add, BookmarkBorderOutlined, Mail, Search } from "@mui/icons-material";
import Image from "next/image";
import InviteModal from "@/components/UI/invite-to-apply-modal";
import FolderModal from "@/components/UI/folder-modal";
import AddToFolderModal from "@/components/UI/add-to-folder-modal";
import SearchInput from "@/components/UI/search-Input";
import SeekerCard from "@/components/UI/SeekerCard";
import { useSession } from "next-auth/react";
import { API_GET_FOLDERS } from "@/api/seeker";
import useFetch from "@/hooks/useFetch";
import { UserProfile } from "@/types/seeker";

const CvResults: React.FC<{
  seekers: UserProfile[];
  unlockedSeekers: {
    seekerId: string;
  }[];
  total: number;
}> = ({ seekers, total, unlockedSeekers }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const companyId = user?.companyId || "";

  const [selected, setSelected] = useState<string[]>([]);
  const isAllSelect = selected.length === seekers.length;
  const toggleSelectAll = () => {
    if (isAllSelect) {
      setSelected([]);
    } else {
      setSelected(seekers.map((x) => x.id));
    }
  };

  const { data, refetch } = useFetch<PaginatedResponse<Folder>>(
    companyId ? API_GET_FOLDERS + companyId + "&page=1&limit=100" : null,
  );
  const folders = data?.data || [];

  // open actions dropdown menu // appear on select
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // open drop down menu for save selected seekers
  const [saveAnchorEl, setSaveAnchorEl] = useState(null);
  const saveOpen = Boolean(saveAnchorEl);
  const handleSaveClick = (event: any) => {
    setSaveAnchorEl(event.currentTarget);
  };
  const handleSaveClose = () => {
    setSaveAnchorEl(null);
  };

  const [saveToFolder, setSaveToFolder] = useState<string[] | null>(null);
  const onSave = (id: string) => setSaveToFolder([id]);
  const onBulkSave = () => setSaveToFolder(selected);
  const onCloseSave = () => setSaveToFolder(null);

  const [saveToNewFolder, setSaveToNewFolder] = useState<string[] | null>(null);
  const onCreate = (id: string) => setSaveToNewFolder([id]);
  const onCreateBulk = () => setSaveToNewFolder(selected);
  const onCloseCreate = () => setSaveToNewFolder(null);

  const [inviteSeeker, setInviteSeeker] = useState<string[] | null>(null);
  const onInvite = (id: string) => setInviteSeeker([id]);
  const onBulkInvite = () => setInviteSeeker(selected);
  const onCloseInvite = () => setInviteSeeker(null);

  // TODO Allow Bulk save to folder and invite to job
  return (
    <div className="min-h-dvh">
      <InviteModal
        companyId={companyId}
        seekers={inviteSeeker}
        onClose={onCloseInvite}
      />
      <FolderModal
        companyId={companyId}
        seekers={saveToNewFolder}
        onClose={onCloseCreate}
        refetch={refetch}
      />
      <AddToFolderModal
        folders={folders}
        seekers={saveToFolder}
        onClose={onCloseSave}
        refetch={refetch}
      />
      {/* search  */}
      <div className="h-[80px] w-full pl-[39px]">
        <SearchInput
          formClassName="flex gap-3"
          fullWidth
          variant="outlined"
          placeholder="Job Candidates CV's"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
        >
          <Button type="submit" variant="contained" className="w-1/5">
            Search
          </Button>
        </SearchInput>
        <p className="mt-2 text-sm text-muted-foreground">Showing {total} Results</p>
      </div>
      {/* select Seeker actions and bulk save */}
      <div className="mb-4 mt-2 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleSelectAll}
            className="h-[32px] w-[32px] bg-primary/10 p-[5px]"
          >
            {isAllSelect ? (
              <DeselectIcon className="h-6 w-6" />
            ) : (
              <SelectAllIcon className="h-6 w-6" />
            )}
          </button>

          {selected.length > 0 && (
            <>
              <div>
                <IconButton
                  onClick={handleSaveClick}
                  aria-controls={saveOpen ? "save-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={saveOpen ? "true" : undefined}
                  size="medium"
                  className="p-0"
                >
                  <BookmarkBorderOutlined color="primary" className="h-8 w-8" />
                </IconButton>
                <Menu
                  id="save-menu"
                  anchorEl={saveAnchorEl}
                  open={saveOpen}
                  onClose={handleSaveClose}
                  className="mt-2"
                >
                  <MenuItem
                    onClick={() => {
                      onCreateBulk();
                      handleClose();
                    }}
                    className="flex items-center gap-4 hover:bg-gray-200"
                  >
                    <Image
                      src={"/images/folder.svg"}
                      alt="save"
                      width={24}
                      height={24}
                    />
                    Add New Folder
                    <Add className="h-5 w-5 rounded-full bg-green-500 text-white" />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onBulkSave();
                      handleClose();
                    }}
                    className="flex items-center gap-4 hover:bg-gray-200"
                  >
                    <Image
                      src={"/images/folder.svg"}
                      alt="save"
                      width={24}
                      height={24}
                    />
                    Save in existing folder
                  </MenuItem>
                </Menu>
              </div>
              <div>
                <button
                  onClick={handleClick}
                  aria-controls={open ? "Action-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  className="flex h-[32px] items-center rounded-md bg-primary/10 px-4 duration-300 hover:bg-primary hover:text-primary-foreground"
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
                    onClick={() => {
                      handleClose();
                      onBulkInvite();
                    }}
                    className="flex items-center gap-2 hover:bg-gray-200"
                  >
                    <Mail color="primary" className="h-5 w-5" />
                    Invite to Apply
                  </MenuItem>
                  <Divider className="!m-0" />
                </Menu>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Candidates Cards */}
      {seekers.map((seeker) => (
        <SeekerCard
          key={seeker.id}
          seeker={seeker}
          selected={selected}
          setSelected={setSelected}
          companyId={companyId}
          onSave={onSave}
          onCreate={onCreate}
          onInvite={onInvite}
          unlockedSeekers={unlockedSeekers}
        />
      ))}
    </div>
  );
};

export default CvResults;
