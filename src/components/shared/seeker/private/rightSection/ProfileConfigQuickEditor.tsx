"use client";
import React, { useState } from "react";
import { Switch, IconButton, InputAdornment } from "@mui/material";
import Link from "next/link";
import { CareerPreference, FieldConfig } from "@/types";
import { useSession } from "next-auth/react";
import FormModal from "@/components/form/FormModal/FormModal";
import { Edit } from "@mui/icons-material";
import { User } from "next-auth";
import { UserProfile } from "@/types/seeker";
import { useAppDispatch } from "@/store/hooks";
import { useUserData } from "@/hooks/useUserData";
import {
  createUserCareerPreference,
  updateUserCareerPreference,
  updateUserProfile,
} from "@/store/slices/profileSlice";
import { areMainFieldsEqual, UserProfileToUser } from "@/util/user";

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

const ProfileConfigQuickEditor: React.FC<{ user: UserProfile }> = ({
  user,
}) => {
  const dispatch = useAppDispatch();
  const { data, update: updateSession } = useSession();
  const { user: sessionUser } = data || {};
  const { updating, error } = useUserData(
    user?.userName,
    "user-name",
    onSuccess,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const open = () => setIsModalOpen(true);
  const close = () => {
    setIsModalOpen(false);
  };

  async function onSuccess(updatedUser: UserProfile | null) {
    if (!updatedUser) return;
    close();
    if (updatedUser?.userName) {
      const newUser = UserProfileToUser(updatedUser);
      if (sessionUser && areMainFieldsEqual(sessionUser, newUser)) return;
      await updateSession({
        userName: updatedUser.userName,
      } as User);
      window.history.replaceState(null, "", `/me/${updatedUser?.userName}`);
    }
  }

  const handleUpdate = async (formData: Partial<UserProfile>) => {
    dispatch(
      updateUserProfile({ id: user.id, updates: formData, key: "user-name" }),
    );
  };

  const availableForHiringDate = async (isAvailable: boolean) => {
    const body: Partial<CareerPreference> = {
      id: user.careerPreference?.id,
      availableForImmediateHiring: isAvailable,
    };
    if (user.careerPreference?.id) {
      dispatch(
        updateUserCareerPreference({
          id: user.careerPreference.id,
          updates: body,
          key: "user-name",
        }),
      );
    } else {
      dispatch(
        createUserCareerPreference({
          id: user.id,
          updates: body,
          key: "user-name",
        }),
      );
    }
  };

  return (
    <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <FormModal
        open={isModalOpen}
        onClose={close}
        onSubmit={handleUpdate}
        error={error || ""}
        loading={updating}
        fields={userNameField}
        title="Enter Your user Name"
        mode="onChange"
        initialValues={{ userName: user.userName }}
      />
      {/* Title and Description */}
      <h3 className="mb-2 text-xl font-semibold text-main">
        Your Public Profile
      </h3>

      <div className="flex items-center justify-between">
        <label className="font-semibold text-main">Public Profile</label>
        <Switch
          color="primary"
          checked={user.isPublic}
          onChange={(event) => {
            const isChecked = event.target.checked;
            handleUpdate({ isPublic: isChecked });
          }}
        />
      </div>
      {user.isPublic && (
        <div className="my-1 flex items-center justify-between rounded-md border border-gray-200 bg-primary/10 p-2 py-3">
          <div>
            <p className="text-sm text-muted-foreground">Public profile link:</p>
            <Link
              target="_blank"
              href={`https://www.medicova.net/me/${user.userName}?public=true`}
              className="text-sm text-primary underline"
            >
              me/{user.userName}
            </Link>
          </div>
          <IconButton
            onClick={open}
            className="rounded border border-solid border-gray-200 p-2"
          >
            <Edit className="h-5 w-5" />
          </IconButton>
        </div>
      )}
      <div className="flex items-center justify-between">
        <label className="font-semibold text-main">
          Available for immediate start
        </label>
        <Switch
          color="primary"
          checked={Boolean(user.careerPreference?.availableForImmediateHiring)}
          onChange={(event) => {
            const isChecked = event.target.checked;
            availableForHiringDate(isChecked);
          }}
        />
      </div>
    </div>
  );
};

export default ProfileConfigQuickEditor;
