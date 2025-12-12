"use client";
import React from "react";
import { Button } from "@mui/material";
import { PDF_ICON } from "@/components/icons/icons";
import { getFileNameFromUrl } from "@/util/user";
import { UserProfile } from "@/types/seeker";

const SeekerPublicResumeCard: React.FC<{
  user: UserProfile;
}> = ({ user }) => {
  const myCv = user.resume;
  const fileName = getFileNameFromUrl(myCv);

  if (!myCv) {
    return null;
  }
  return (
    <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      {/* Title and Description */}
      <h3 className="mb-2 text-xl font-semibold text-main">SeekerPublicRes</h3>

      {/* Uploaded CV Display */}
      <div className="my-2 flex items-center gap-2 rounded bg-primary/10 p-2">
        <PDF_ICON
          width={32}
          height={32}
          className="min-w-[40px] text-[#EF5350]"
        />
        {fileName ? (
          <a
            href={myCv}
            target="_blank"
            className="break-all text-sm text-main"
          >
            {fileName}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">No file uploaded</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-3">
        {myCv && (
          <Button
            variant="outlined"
            component="a"
            href={myCv}
            target="_blank"
            disabled={!myCv}
            className="flex-1 text-sm"
          >
            Download
          </Button>
        )}
      </div>
    </div>
  );
};

export default SeekerPublicResumeCard;
