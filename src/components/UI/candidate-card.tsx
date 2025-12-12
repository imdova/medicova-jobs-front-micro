"use client";
import { Button, IconButton } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import StarIcon from "@mui/icons-material/Star";
import CheckIcon from "@mui/icons-material/Check";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MessageIcon from "@mui/icons-material/Message";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";

import DownloadIcon from "@mui/icons-material/Download";
import { formatName } from "@/util";
import { KeyOutlined } from "@mui/icons-material";
import { formatLocation, toggleId } from "@/util/general";
import Avatar from "./Avatar";
import { useRef, useState } from "react";
import Link from "next/link";
import CopyButton from "../form/CopyButton";
import { CandidateType } from "@/types/seeker";

interface CandidateCardProps {
  candidate: CandidateType;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  selected,
  setSelected,
}) => {
  const isAvailable = !candidate.isLocked;
  /// TODO: isShortlisted
  // TODO : Unlock users
  const isShortlisted = "isShortlisted";
  const name = formatName(candidate, isAvailable);
  const location = formatLocation(candidate);
  const isSelected = selected.includes(candidate.id);
  const [isCopied, setIsCopied] = useState<"phone" | "email" | null>(null);

  // functions
  const toggleSelect = () => setSelected((pv) => toggleId(pv, candidate.id));
  const toggleShortListed = () => console.log("shortlisted");
  const unlock = () => console.log("shortlisted");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const copyText = (type: "phone" | "email", text: string) => {
    setIsCopied(type);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => setIsCopied(null), 2000);
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

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
              <Link href={`/me/${candidate.userName}`}>
                <Avatar src={candidate.avatar} alt={name} size={70} />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/me/${candidate.userName}`}
                    className="font-semibold text-main hover:underline md:text-xl"
                  >
                    {name}
                  </Link>
                  {isAvailable ? (
                    <LockOpenIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <LockIcon className="h-5 w-5 text-red-500" />
                  )}
                  <p className="text-xs text-muted-foreground md:text-sm">3d ago</p>
                </div>
                {candidate.title && (
                  <p className="text-muted-foreground">{candidate.title}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end md:flex-row">
            <div className="flex-1">
              <div className="mt-1 flex flex-wrap items-center gap-2 md:flex-nowrap">
                <h6 className="mr-2 hidden rounded-base bg-primary/10 px-2 py-1 text-main md:block">
                  Contact Info :
                </h6>
                <div className="flex min-w-[80px] items-center rounded-base bg-primary/10 px-2 py-1 text-main">
                  <LocalPhoneIcon className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                  {isAvailable ? (
                    <span className="text-xs md:text-base">
                      {candidate.phone}
                    </span>
                  ) : (
                    <div className="col-span-1 row-span-1 grid h-fit">
                      <span className="z-10 col-start-1 row-start-1 bg-white/20 px-2 text-sm backdrop-blur-[3px] md:text-base"></span>
                      <span className="col-start-1 row-start-1 select-none px-2 text-sm md:text-base">
                        +00 000 000 000
                      </span>
                    </div>
                  )}
                  <CopyButton text={candidate.phone} disabled={!isAvailable} />
                </div>
                <div className="flex items-center rounded-base bg-primary/10 px-2 py-1 text-main">
                  <EmailIcon className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                  {isAvailable ? (
                    <span className="h-fit text-sm text-main md:text-base">
                      {candidate.email}
                    </span>
                  ) : (
                    <div className="col-span-1 row-span-1 grid h-fit">
                      <span className="z-10 col-start-1 row-start-1 bg-white/20 px-2 text-sm backdrop-blur-[3px] md:text-base"></span>
                      <span className="col-start-1 row-start-1 select-none px-2 text-sm md:text-base">
                        email@example.com
                      </span>
                    </div>
                  )}
                  <CopyButton text={candidate.phone} disabled={!isAvailable} />
                </div>
              </div>
              <div className="my-1 flex flex-wrap gap-2 text-main">
                {location && (
                  <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                    <LocationOnIcon className="h-4 w-4 md:h-5 md:w-5" />
                    <p className="text-xs md:text-base">{location}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                  <PeopleAltIcon className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">
                    Doctors{candidate.category}
                  </p>
                </div>
                {/* <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                  <WorkspacePremiumIcon className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">
                    {candidate.yearsOfExperience.totalYears} years Experience
                  </p>
                </div> */}
                {/* {candidate.lastEducation && (
                  <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                    <SchoolIcon className="h-4 w-4 md:h-5 md:w-5" />
                    <p className="text-xs md:text-base">
                      {candidate.lastEducation.degree} Degree
                    </p>
                  </div>
                )} */}
                {candidate.careerLevel && (
                  <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                    <PersonIcon className="h-4 w-4 md:h-5 md:w-5" />
                    <p className="text-xs md:text-base">
                      {candidate.careerLevel}
                    </p>
                  </div>
                )}
                {candidate.speciality && (
                  <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                    <MedicalServicesIcon className="h-4 w-4 md:h-5 md:w-5" />
                    <p className="text-xs md:text-base">
                      {candidate.speciality}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex w-full flex-row gap-2 md:w-auto md:flex-col">
              <div className="flex justify-between gap-2">
                <IconButton
                  disabled={!isAvailable}
                  size="small"
                  color="primary"
                  sx={{
                    border: 1,
                    padding: "6px",
                    borderColor: "grey.300",
                    borderRadius: 0,
                    "&:hover": { border: 1, borderColor: "primary.main" },
                  }}
                >
                  <WhatsAppIcon className="h-5 w-5 md:h-6 md:w-6" />
                </IconButton>
                <IconButton
                  disabled={!isAvailable}
                  size="small"
                  color="primary"
                  sx={{
                    border: 1,
                    padding: "6px",
                    borderColor: "grey.300",
                    borderRadius: 0,
                    "&:hover": { border: 1, borderColor: "primary.main" },
                  }}
                >
                  <MessageIcon className="h-5 w-5 md:h-6 md:w-6" />
                </IconButton>
                <IconButton
                  onClick={toggleShortListed}
                  size="small"
                  color="primary"
                  sx={{
                    border: 1,
                    padding: "6px",
                    borderColor: "grey.300",
                    borderRadius: 0,
                    "&:hover": { border: 1, borderColor: "primary.main" },
                  }}
                >
                  {isShortlisted ? (
                    <StarIcon className="h-5 w-5 md:h-6 md:w-6" />
                  ) : (
                    <StarBorderOutlinedIcon className="h-5 w-5 md:h-6 md:w-6" />
                  )}
                </IconButton>
              </div>
              {isAvailable ? (
                <Button
                  variant="outlined"
                  className="w-full text-sm md:text-base"
                  startIcon={<DownloadIcon className="h-5 w-5 md:h-6 md:w-6" />}
                >
                  Download CV
                </Button>
              ) : (
                <Button
                  startIcon={<KeyOutlined />}
                  className="flex-1 text-nowrap"
                  onClick={unlock}
                  variant="contained"
                >
                  Unlock Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
