"use client";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";
import useIsLeaving from "@/hooks/useIsLeaving";
import LeaveConfirmationModal from "@/components/UI/LeaveConfirmationModal";
import React from "react";
import ProfileForm from "./ProfileForm";
import { UserProfile } from "@/types/seeker";
import { useUserData } from "@/hooks/useUserData";
import { useFormState } from "@/hooks/useFormState";
import { useAppDispatch } from "@/store/hooks";
import { updateUserProfile } from "@/store/slices/profileSlice";
import { areMainFieldsEqual, UserProfileToUser } from "@/util/user";
import HeaderSectionForm from "./HeaderSectionForm";

const getDefaultUserData = (user: UserProfile) => {
  const defaultValues = {
    avatar: user?.avatar || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || null,
    whatsapp: user?.whatsapp || null,
    birthDate: user?.birthDate || null,
    gender: user?.gender || null,
    nationality: user?.nationality || null,
    maritalStatus: user?.maritalStatus || null,
    hasDrivingLicence: user?.hasDrivingLicence || false,
    country: user?.country || {
      code: "",
      name: "",
    },
    state: user?.state || {
      code: "",
      name: "",
    },
    city: user.city,
    categoryId: user?.categoryId,
    specialityId: user?.specialityId,
    careerLevelId: user?.careerLevelId,
  } as Partial<UserProfile>;
  return defaultValues;
};

interface ProfileInfoFormProps {
  user: UserProfile;
}
export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ user }) => {
  const { update, data } = useSession();
  const sessionUser = data?.user;

  const dispatch = useAppDispatch();
  useUserData(user.userName, "user-form");

  const formMethods = useFormState(
    true,
    [],
    getDefaultUserData(user),
    "onChange",
  );

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
    prevDefaultsRef,
  } = formMethods;

  const { isLeaving, setLeavingManually, handleUserDecision } = useIsLeaving({
    preventDefault: isDirty,
  });

  const handleUpdate = async (formData: Partial<UserProfile>) => {
    const body: Partial<UserProfile> = {
      id: user?.id,
      ...formData,
      hasDrivingLicence:
        String(formData.hasDrivingLicence) === "true" ? true : false,
      country: formData.country?.code ? formData.country : null,
      state: formData.state?.code ? formData.state : null,
    };
    prevDefaultsRef.current = formData;
    dispatch(
      updateUserProfile({
        id: user.id,
        updates: body,
        key: "quick-edit",
      }),
    );
    if (sessionUser) {
      const newData = UserProfileToUser(formData);
      if (!areMainFieldsEqual(sessionUser, newData)) {
        update(newData);
      }
    }
    reset(formData);
  };

  return (
    <>
      <LeaveConfirmationModal
        isOpen={isLeaving}
        onLeave={() => {
          handleUserDecision(true);
          // handleCancel();
        }}
        onStay={() => {
          setLeavingManually(false);
          handleUserDecision(false);
        }}
      />
      <form onSubmit={handleSubmit(handleUpdate)} className="space-y-2">
        <HeaderSectionForm formMethods={formMethods} />
        <ProfileForm formMethods={formMethods} />
        {isDirty && (
          <div className="sticky bottom-2 z-30 flex justify-end rounded-base border border-gray-200 bg-white p-3 shadow-soft md:justify-start md:p-5">
            <Button type="submit" variant="contained" size="large">
              Save Changes
            </Button>
            <Button
              onClick={() => reset(getDefaultUserData(user))}
              variant="text"
              size="large"
              className="ml-2"
            >
              Reset
            </Button>
          </div>
        )}
      </form>
    </>
  );
};
