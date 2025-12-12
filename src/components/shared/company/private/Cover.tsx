"use client";
import React, { useState } from "react";
import { Company } from "@/types";
import uploadFiles from "@/lib/files/imageUploader";
import { ProfileCoverImage } from "@/components/pages/co/ProfileCoverImage";
import ProfileImage from "@/components/UI/ProfileImage";
import { useAppDispatch } from "@/store/hooks";
import { updateCompany } from "@/store/slices/companySlice";

interface CompanyCoverProps {
  company: Company;
}

const Cover: React.FC<CompanyCoverProps> = ({ company }) => {
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  const updateImage = async (file: File) => {
    const [avatar] = await uploadFiles([file]);
    handleUpdateCompany({ avatar });
    setImage(file);
  };
  const updateCoverImage = async (file: File) => {
    const [cover] = await uploadFiles([file]);
    handleUpdateCompany({ cover });
    setCover(file);
  };

  const handleUpdateCompany = async (formData: Partial<Company>) => {
    dispatch(updateCompany({ id: company?.id, updates: formData }));
  };

  return (
    <div className="grid grid-cols-1 grid-rows-1">
      {/* Avatar Positioned on Background Image */}
      <div className="col-start-1 row-start-1 min-h-24 w-full">
        <ProfileCoverImage
          currentImageUrl={
            cover ? URL.createObjectURL(cover) : company.cover || ""
          }
          onImageUpdate={updateCoverImage}
        />
      </div>
      <div className="col-start-1 row-start-1 h-fit w-fit self-end px-4">
        <ProfileImage
          currentImageUrl={
            image ? URL.createObjectURL(image) : company.avatar || ""
          }
          alt={company.name}
          size="xLarge"
          onImageUpdate={updateImage}
          imageClassName="border-4 border-white shadow-soft"
        />
      </div>
    </div>
  );
};

export default Cover;
