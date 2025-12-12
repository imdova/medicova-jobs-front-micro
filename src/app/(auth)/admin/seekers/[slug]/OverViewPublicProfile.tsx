"use client";
import React, { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import Link from "next/link";
import { CareerPreference, FieldConfig } from "@/types";
import useUpdateApi from "@/hooks/useUpdateApi";
import {
  API_CREATE_CAREER_PREFERENCE,
  API_GET_CAREER_PREFERENCES_BY_SEEKER_ID,
  API_UPDATE_CAREER_PREFERENCE,
  API_UPDATE_SEEKER,
} from "@/api/seeker";
import { TAGS } from "@/api";
import FormModal from "@/components/form/FormModal/FormModal";
import { Edit } from "@mui/icons-material";
import useFetch from "@/hooks/useFetch";
import { Check, Download, File } from "lucide-react";
import { getFileNameFromUrl } from "@/util/user";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/seeker";

const userNameField: FieldConfig[] = [
  {
    name: "userName",
    type: "text",
    required: true,
    textFieldProps: {
      placeholder: "Enter User Name",
      InputProps: {
        startAdornment: <InputAdornment position="start">me/</InputAdornment>,
      },
    },
    rules: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters long",
      },
      maxLength: {
        value: 50,
        message: "Username cannot exceed 50 characters",
      },
      pattern: {
        value: /^[a-z0-9-_]+$/,
        message:
          "Username must contain only lowercase letters, numbers, hyphens, or underscores (no spaces or uppercase)",
      },
    },
  },
];

const OverViewPublicProfile: React.FC<{
  user: UserProfile;
  onUpdate: (data: UserProfile) => void;
}> = ({ user, onUpdate }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const myCv = user.resume;
  const fileName = getFileNameFromUrl(myCv);

  const { isLoading, error, update, reset } = useUpdateApi<UserProfile>(
    (newSeeker) => {
      onUpdate(newSeeker);
      router.replace(`/admin/seekers/${newSeeker.userName}`, { scroll: false });
    },
  );
  const { update: updateCareerPreference } = useUpdateApi<CareerPreference>();
  const onOpen = () => setIsModalOpen(true);
  const onClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const { data: careerPreference, setData } = useFetch<CareerPreference>(
    user?.id ? API_GET_CAREER_PREFERENCES_BY_SEEKER_ID + user.id : null,
    {
      defaultLoading: true,
    },
  );

  const handleUpdate = async (formData: Partial<UserProfile>) => {
    const body = { id: user.id, ...formData };
    await update(API_UPDATE_SEEKER, { body }, TAGS.profile, {
      error: {
        title: "Failed to update seeker profile",
        description: "Please try again.",
      },
      success: {
        title: "Seeker Profile Updated Successfully",
        description: "Your seeker profile has been updated successfully.",
      },
    });
    onClose();
    setIsModalOpen(false);
  };

  const handleReviewCV = () => {
    myCv && window.open(myCv, "_blank"); // Open the PDF in a new tab
  };

  const availableForHiringDate = async (isAvailable: boolean) => {
    const body: Partial<CareerPreference> = {
      id: careerPreference?.id,
      seekerId: user.id,
      availableForImmediateHiring: isAvailable,
    };
    let updatedCareerPreference = {} as CareerPreference;
    if (careerPreference?.id) {
      updatedCareerPreference = (await updateCareerPreference(
        API_UPDATE_CAREER_PREFERENCE,
        {
          body,
        },
        "Profile Data",
      )) as CareerPreference;
    } else {
      updatedCareerPreference = (await updateCareerPreference(
        API_CREATE_CAREER_PREFERENCE,
        {
          method: "POST",
          body,
        },
        "Profile Data",
      )) as CareerPreference;
    }
    setData?.(updatedCareerPreference);
  };

  return (
    <>
      <FormModal
        open={isModalOpen}
        onClose={onClose}
        onSubmit={handleUpdate}
        error={error?.message}
        loading={isLoading}
        fields={userNameField}
        title="Enter Your user Name"
        initialValues={{ userName: user.userName }}
        mode="onChange"
      />
      {/* Title and Description */}
      <div className="space-y-4 bg-white p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Your Public Profile
            </h1>
          </div>
        </div>

        {/* Profile Link Section with Toggle */}
        <div className="overflow-hidden">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">Public Profile Link</p>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={user.isPublic}
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    handleUpdate({ isPublic: isChecked });
                  }}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
            {user.isPublic && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 overflow-hidden rounded-md bg-gray-100 p-3">
                  <div className="truncate font-mono text-blue-600">
                    <Link
                      target="_blank"
                      href={`https://www.medicova.net/me/${user.userName}?public=true`}
                      className="text-sm text-primary underline"
                    >
                      me/{user.userName}
                    </Link>
                  </div>
                </div>
                <IconButton
                  onClick={onOpen}
                  className="rounded border border-solid border-gray-200 p-2"
                >
                  <Edit />
                </IconButton>
              </div>
            )}
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-600">
                  Immediate Availability
                </p>
                <p className="text-xs text-gray-500">
                  Let companies know you can start immediately
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={Boolean(
                    careerPreference?.availableForImmediateHiring,
                  )}
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    availableForHiringDate(isChecked);
                  }}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>

            {Boolean(careerPreference?.availableForImmediateHiring) && (
              <div className="mt-3 flex items-start rounded-md border border-green-200 bg-green-50 p-3">
                <Check className="mt-0.5 flex-shrink-0 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Available for immediate start
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Your profile will show youre available to companies
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* CV Section */}
        <div className="overflow-hidden">
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <File size={17} className="flex-shrink-0 text-blue-500" />
                {fileName ? (
                  <p className="ml-3 line-clamp-1 max-w-40 truncate text-sm font-medium text-blue-800">
                    {fileName}
                  </p>
                ) : (
                  <p className="ml-3 truncate text-sm font-medium text-blue-800">
                    No file uploaded
                  </p>
                )}
              </div>
              {myCv && (
                <div className="flex gap-2">
                  <button
                    onClick={handleReviewCV}
                    className="rounded-md p-1 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-800"
                    title="Download CV"
                  >
                    <Download size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverViewPublicProfile;
