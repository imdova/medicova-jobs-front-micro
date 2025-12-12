"use client";
import React, { useState } from "react";
import { Button } from "@mui/material";
import { FileUploadModal } from "@/components/form/FileUploadModal";
import uploadFiles from "@/lib/files/imageUploader";
import { PDF_ICON } from "@/components/icons/icons";
import { Upload } from "@mui/icons-material";
import { getFileNameFromUrl } from "@/util/user";
import { UserProfile } from "@/types/seeker";
import { useAppDispatch } from "@/store/hooks";
import { useUserData } from "@/hooks/useUserData";
import { updateUserProfile } from "@/store/slices/profileSlice";

const SeekerResumeUploadCard: React.FC<{
  user: UserProfile;
}> = ({ user }) => {
  const dispatch = useAppDispatch();
  useUserData(user?.userName, "resume");
  const myCv = user.resume;
  const fileName = getFileNameFromUrl(myCv);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    const [resume] = await uploadFiles([file]);
    dispatch(
      updateUserProfile({ id: user.id, updates: { resume }, key: "resume" }),
    );
  };

  const handleReviewCV = () => {
    myCv && window.open(myCv, "_blank"); // Open the PDF in a new tab
  };
  return (
    <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      {/* Title and Description */}
      <h3 className="mb-2 text-xl font-semibold text-main">Resume</h3>

      {/* Uploaded CV Display */}
      <div className="my-2 flex items-center gap-2 rounded bg-primary/10 p-2">
        <PDF_ICON
          width={32}
          height={32}
          className="min-w-[40px] text-[#EF5350]"
        />
        {fileName ? (
          <a
            href={myCv as string}
            target="_blank"
            className="break-all line-clamp-1 text-sm text-primary underline hover:no-underline"
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
            disabled={!myCv}
            onClick={handleReviewCV}
            className="flex-1 text-sm"
          >
            Download
          </Button>
        )}
        {myCv ? (
          <Button
            variant="contained"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex-1 text-sm"
          >
            Change
          </Button>
        ) : (
          <Button
            variant="contained"
            className="flex-1 text-sm"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload <Upload className="ml-2" />
          </Button>
        )}
      </div>

      <FileUploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        acceptedFileTypes={["application/pdf"]}
        title={"Upload a your resume"}
        previewType="pdf"
        uploadButtonText={"Upload"}
        description="choose a pdf file as your resume. Supported formats: PDF"
      />
    </div>
  );
};

export default SeekerResumeUploadCard;
