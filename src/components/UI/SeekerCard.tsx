"use client";
import {
  Alert,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import React, { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CheckIcon from "@mui/icons-material/Check";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import Image from "next/image";
import { Add, BookmarkBorderOutlined, KeyOutlined } from "@mui/icons-material";
import { formatName } from "@/util";
import Link from "next/link";
import { formatLocation, getExperienceDetail, toggleId } from "@/util/general";
import Avatar from "./Avatar";
import CopyButton from "../form/CopyButton";
import useUpdateApi from "@/hooks/useUpdateApi";
import { UNLOCKED_SEEKERS } from "@/api/employer";
import { TAGS } from "@/api";
import { UserProfile } from "@/types/seeker";

interface SeekerCardProps {
  seeker: UserProfile;
  selected: string[];
  companyId: string;
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  onSave: (id: string) => void;
  onCreate: (id: string) => void;
  onInvite: (id: string) => void;
  unlockedSeekers: {
    seekerId: string;
  }[];
}

const SeekerCard: React.FC<SeekerCardProps> = ({
  seeker,
  selected,
  setSelected,
  onSave,
  companyId,
  onCreate,
  onInvite,
  unlockedSeekers,
}) => {
  const isAvailable = !unlockedSeekers?.find(
    (item) => item.seekerId === seeker.id,
  );
  const name = formatName(seeker, isAvailable);
  const location = formatLocation(seeker);
  const isSelected = selected.includes(seeker.id);
  const { isLoading, error, reset, update } = useUpdateApi();

  const toggleSelect = () => setSelected((pv) => toggleId(pv, seeker.id));
  const unlock = () =>
    update(
      UNLOCKED_SEEKERS,
      { method: "POST", body: { companyId, seekerId: seeker.id } },
      TAGS.applicants,
    );

  // save to folder
  const [saveAnchorEl, setSaveAnchorEl] = useState(null);
  const saveOpen = Boolean(saveAnchorEl);
  const handleSaveClick = (event: any) => {
    setSaveAnchorEl(event.currentTarget);
  };
  const handleSaveClose = () => {
    setSaveAnchorEl(null);
  };

  const title = getExperienceDetail(seeker.title || "");

  return (
    <div className="flex flex-col md:flex-row">
      <button
        onClick={toggleSelect}
        className={`${
          isSelected ? "border-primary bg-primary" : "border-gray-100 bg-white"
        } mr-1 h-[28px] w-[28px] rounded-base rounded-bl-none border-2 shadow-lg md:rounded-bl-base md:rounded-tr-none`}
      >
        {isSelected && <CheckIcon className="m-auto h-5 w-5 text-white" />}
      </button>

      <div className="mb-2 flex w-full flex-col rounded-base rounded-tl-none border border-gray-100 bg-white p-2 shadow-xl md:p-5">
        <div className="w-full">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Avatar src={seeker.avatar} alt={name} size={70} />
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/me/${seeker.userName}`}
                    className="font-semibold text-main hover:underline md:text-[20px]"
                  >
                    {name}
                  </Link>
                  {isAvailable ? (
                    <LockOpenIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <LockIcon className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <p className="text-muted-foreground">{title}</p>
                {/* // TODO: lastEducation */}
                {/* {seeker.lastEducation && (
                  <div className="flex items-center gap-2 rounded-base text-muted-foreground">
                    <SchoolIcon className="h-4 w-4 text-secondary md:h-5 md:w-5" />
                    <p className="text-xs md:text-base">{degree}</p>
                  </div>
                )} */}
              </div>
            </div>
            <IconButton
              onClick={handleSaveClick}
              aria-controls={saveOpen ? "save-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={saveOpen ? "true" : undefined}
              size="medium"
            >
              <BookmarkBorderOutlined className="h-8 w-8 text-muted-foreground" />
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
                  handleSaveClose();
                  onCreate(seeker.id);
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
                  onSave(seeker.id);
                  handleSaveClose();
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
          <div className="flex flex-col items-end md:flex-row">
            <div className="flex-1">
              <div className="mt-1 flex flex-wrap items-center gap-2 md:flex-nowrap">
                <h6 className="mr-2 hidden rounded-base bg-primary/10 px-2 py-1 text-main md:block">
                  Contact Info :
                </h6>
                {/* <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                  <LocalPhoneIcon className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">{seeker.location}</p>
                </div> */}
                {seeker.phone && (
                  <div className="flex min-w-[80px] items-center rounded-base bg-primary/10 px-2 py-1 text-main">
                    <LocalPhoneIcon className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                    {isAvailable ? (
                      <span className="text-xs md:text-base">
                        {seeker.phone}
                      </span>
                    ) : (
                      <div className="col-span-1 row-span-1 grid h-fit">
                        <span className="z-10 col-start-1 row-start-1 bg-white/20 px-2 text-sm backdrop-blur-[3px] md:text-base"></span>
                        <span className="col-start-1 row-start-1 select-none px-2 text-sm md:text-base">
                          this is dumy number
                        </span>
                      </div>
                    )}
                    <CopyButton text={seeker.phone} disabled={!isAvailable} />
                  </div>
                )}
                {seeker.email && (
                  <div className="flex items-center rounded-base bg-primary/10 px-2 py-1 text-main">
                    <EmailIcon className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                    {isAvailable ? (
                      <span className="h-fit text-sm text-main md:text-base">
                        {seeker.email}
                      </span>
                    ) : (
                      <div className="col-span-1 row-span-1 grid h-fit">
                        <span className="z-10 col-start-1 row-start-1 bg-white/20 px-2 text-sm backdrop-blur-[3px] md:text-base"></span>
                        <span className="col-start-1 row-start-1 select-none px-2 text-sm md:text-base">
                          this is dumy number
                        </span>
                      </div>
                    )}
                    <CopyButton text={seeker.email} disabled={!isAvailable} />
                  </div>
                )}
              </div>
              <div className="my-1 flex flex-wrap gap-2 text-main">
                {location && (
                  <div className="flex items-center gap-2 rounded-base text-muted-foreground">
                    <LocationOnIcon className="h-4 w-4 md:h-5 md:w-5" />
                    <p className="text-xs md:text-base">{location}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-base text-muted-foreground">
                  <PeopleAltIcon className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">{seeker.category}</p>
                </div>
                {/* <div className="flex items-center gap-2 rounded-base text-muted-foreground">
                  <WorkspacePremiumIcon className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">
                    {Number(seeker.total_years_experience).toFixed(0)} years
                    Experience
                  </p>
                </div> */}
                <div className="flex items-center gap-2 rounded-base text-muted-foreground">
                  <PersonIcon className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">{seeker.careerLevel}</p>
                </div>
                <div className="flex items-center gap-2 rounded-base text-muted-foreground">
                  <MedicalServicesIcon className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">{seeker.speciality}</p>
                </div>
              </div>
            </div>
            <div
              className={`${isAvailable ? "mt-10" : "mt-2"} flex w-full flex-row md:w-auto md:flex-col`}
            >
              {!isAvailable && (
                <Button
                  startIcon={<KeyOutlined />}
                  variant="text"
                  disabled={isLoading}
                  className="mb-2 flex-1 text-nowrap p-0"
                  onClick={unlock}
                >
                  {isLoading ? "Loading..." : "Unlock Now"}
                </Button>
              )}
              <Button
                className="flex-1 text-nowrap"
                onClick={() => onInvite(seeker.id)}
                variant="contained"
              >
                Invite To Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={reset}>
        <Alert
          onClose={reset}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SeekerCard;
