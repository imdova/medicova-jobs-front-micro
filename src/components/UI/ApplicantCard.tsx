"use client";
import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import { formatName, formatDistanceToNow } from "@/util";
import {
  Check,
  Download,
  Email,
  KeyOutlined,
  LocalPhone,
  LocationOn,
  Lock,
  LockOpen,
  MedicalServices,
  Message,
  PeopleAlt,
  Person,
  School,
  Star,
  StarBorderOutlined,
  WhatsApp,
  WorkspacePremium,
} from "@mui/icons-material";
import {
  formatLocation,
  getExperienceDetail,
  toggleId,
  whatsAppLink,
} from "@/util/general";
import useUpdateApi from "@/hooks/useUpdateApi";
import { API_UPDATE_JOB_APPLICATION, UNLOCKED_SEEKERS } from "@/api/employer";
import { TAGS } from "@/api";
import CopyButton from "../form/CopyButton";
import Link from "next/link";
import Avatar from "./Avatar";
import { educationOptions } from "@/constants/job";
import { ApplicationsType } from "@/types/seeker";

interface ApplicationCardProps {
  application: ApplicationsType;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  companyId: string;
  sendMessage: (item: ApplicationsType["applicant"]) => void;
}

const ApplicantCard: React.FC<ApplicationCardProps> = ({
  application,
  selected,
  setSelected,
  companyId,
  sendMessage,
}) => {
  const applicant = application.applicant;
  const isSelected = selected.includes(application.id);
  const isShortListed = application.status === "Shortlisted";
  const isLocked = applicant.isLocked;
  const name = formatName(applicant, !isLocked);
  const location = formatLocation(applicant);

  const toggleSelect = () => setSelected((pv) => toggleId(pv, application.id));

  const { isLoading, error, reset, update } = useUpdateApi();
  const unlock = () =>
    update(
      UNLOCKED_SEEKERS,
      { method: "POST", body: { companyId, seekerId: applicant.id } },
      TAGS.applicants,
    );
  const {
    isLoading: isShortListing,
    error: shortListingError,
    reset: shortListingReset,
    update: shortListing,
  } = useUpdateApi();

  const toggleShortListed = () =>
    shortListing(
      API_UPDATE_JOB_APPLICATION,
      {
        body: {
          id: application.id,
          status: isShortListed ? "Viewed" : "Shortlisted",
        },
      },
      TAGS.applicants,
    );
  const title = getExperienceDetail(application.applicant.title || "");
  const degree =
    educationOptions.find((x) => x.id === applicant.lastEducation?.degree)
      ?.label || "";
  return (
    <div className="flex flex-col md:flex-row">
      <button
        onClick={toggleSelect}
        className={`${
          isSelected ? "border-primary bg-primary" : "border-gray-100 bg-white"
        } mr-1 h-[28px] w-[28px] rounded-base rounded-bl-none border-2 shadow-lg md:rounded-bl-base md:rounded-tr-none`}
      >
        {isSelected && <Check className="m-auto h-5 w-5 text-white" />}
      </button>
      <div className="mb-2 flex w-full flex-col rounded-base rounded-tl-none border border-gray-100 bg-white p-2 shadow-xl md:p-5">
        <div className="w-full">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Link href={`/me/${applicant.userName}`}>
                <Avatar src={applicant.avatar} alt={name} size={70} />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/me/${applicant.userName}`}
                    className="font-semibold text-main hover:underline md:text-xl"
                  >
                    {name}
                  </Link>
                  {isLocked ? (
                    <Lock className="h-5 w-5 text-red-500" />
                  ) : (
                    <LockOpen className="h-5 w-5 text-primary" />
                  )}
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {formatDistanceToNow(application.created_at)}
                  </p>
                </div>
                <p className="text-muted-foreground">{title}</p>
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
                  <LocalPhone className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                  {!isLocked ? (
                    <span className="text-xs md:text-base">
                      {applicant.phone}
                    </span>
                  ) : (
                    <div className="col-span-1 row-span-1 grid h-fit">
                      <span className="z-10 col-start-1 row-start-1 bg-white/20 px-2 text-sm backdrop-blur-[3px] md:text-base"></span>
                      <span className="col-start-1 row-start-1 select-none px-2 text-sm md:text-base">
                        this is dumy number
                      </span>
                    </div>
                  )}

                  <CopyButton
                    text={applicant.phone || ""}
                    disabled={isLocked}
                  />
                </div>
                <div className="flex items-center rounded-base bg-primary/10 px-2 py-1 text-main">
                  <Email className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                  {!isLocked ? (
                    <span className="h-fit text-sm text-main md:text-base">
                      {applicant.email}
                    </span>
                  ) : (
                    <div className="col-span-1 row-span-1 grid h-fit">
                      <span className="z-10 col-start-1 row-start-1 bg-white/20 px-2 text-sm backdrop-blur-[3px] md:text-base"></span>
                      <span className="col-start-1 row-start-1 select-none px-2 text-sm md:text-base">
                        this is dumy number
                      </span>
                    </div>
                  )}
                  <CopyButton
                    text={applicant.email || ""}
                    disabled={isLocked}
                  />
                </div>
              </div>
              <div className="my-1 flex flex-wrap gap-2 text-main">
                {location && (
                  <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                    <LocationOn className="h-4 w-4 md:h-5 md:w-5" />
                    <p className="text-xs md:text-base">{location}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                  <PeopleAlt className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">{applicant.category}</p>
                </div>
                <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                  <WorkspacePremium className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">
                    {applicant.yearsOfExperience.totalYears} years Experience
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                  <School className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">{degree}</p>
                </div>
                <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                  <Person className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">
                    {applicant.careerLevel}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-base bg-primary/10 px-2 py-1 text-muted-foreground">
                  <MedicalServices className="h-4 w-4 md:h-5 md:w-5" />
                  <p className="text-xs md:text-base">{applicant.specialty}</p>
                </div>
              </div>
            </div>
            <div className="mt-2 flex w-full flex-row gap-2 md:w-auto md:flex-col">
              <div className="flex justify-between gap-2">
                <IconButton
                  disabled={isLocked}
                  LinkComponent={Link}
                  href={whatsAppLink(applicant.phone || "")}
                  className="rounded border border-solid border-gray-200 p-2 text-primary hover:border-primary"
                >
                  <WhatsApp className="h-5 w-5 md:h-6 md:w-6" />
                </IconButton>
                <IconButton
                  disabled={isLocked}
                  onClick={() => sendMessage(applicant)}
                  // LinkComponent={Link}
                  // href={`/chat?id=${applicant.id}`}
                  className="rounded border border-solid border-gray-200 p-2 text-primary hover:border-primary"
                >
                  <Message className="h-5 w-5 md:h-6 md:w-6" />
                </IconButton>
                <IconButton
                  onClick={toggleShortListed}
                  className="rounded border border-solid border-gray-200 p-2 text-primary hover:border-primary"
                >
                  {isShortListed ? (
                    <Star className="h-5 w-5 md:h-6 md:w-6" />
                  ) : (
                    <StarBorderOutlined className="h-5 w-5 md:h-6 md:w-6" />
                  )}
                </IconButton>
              </div>
              {isLocked ? (
                <Button
                  startIcon={<KeyOutlined />}
                  disabled={isLoading}
                  className="flex-1 text-nowrap"
                  onClick={unlock}
                  variant="contained"
                >
                  {isLoading ? "...loading" : "Unlock Profile"}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  className="w-full text-sm md:text-base"
                  startIcon={<Download className="h-5 w-5 md:h-6 md:w-6" />}
                  // TODO : add link
                  // href={applicant.}
                  // download
                >
                  Download CV
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={!!error || !!shortListingError}
        autoHideDuration={6000}
        onClose={() => {
          reset();
          shortListingReset();
        }}
      >
        <Alert
          onClose={() => {
            reset();
            shortListingReset();
          }}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error?.message || shortListingError?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ApplicantCard;
