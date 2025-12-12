"use client";
import { API_UPDATE_SEEKER } from "@/api/seeker";
import { Dialog, DialogContent } from "@mui/material";
import useUpdateApi from "@/hooks/useUpdateApi";
import useIsLeaving from "@/hooks/useIsLeaving";
import { useForm } from "react-hook-form";
import LeaveConfirmationModal from "@/components/UI/LeaveConfirmationModal";
import { TAGS } from "@/api";
import React from "react";
import { ModalHeader } from "@/components/form/FormModal/ModalHeader";
import { FormActions } from "@/components/form/FormModal/FormActions";
import { UserProfile } from "@/types/seeker";
import HeaderSectionForm from "@/components/shared/seeker/private/info/HeaderSectionForm";
import ProfileForm from "@/components/shared/seeker/private/info/ProfileForm";

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
const socialPlatforms = [
  "website",
  "facebook",
  "twitter",
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "snapchat",
  "pinterest",
  "reddit",
  "discord",
  "telegram",
  "whatsapp",
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (data: UserProfile) => void;
}

const EditSeekerModal = ({ isOpen, onClose, user, onSave }: Props) => {
  const { isLoading, update, error } = useUpdateApi<UserProfile>();

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: getDefaultUserData(user),
  });

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
  } = formMethods;

  const { isLeaving, setLeavingManually, handleUserDecision } = useIsLeaving({
    preventDefault: isDirty,
  });

  const handleUpdate = async (formData: Partial<UserProfile>) => {
    const body: Partial<UserProfile> = {
      id: user?.id,
      ...formData,
      country: formData.country?.code ? formData.country : null,
      state: formData.state?.code ? formData.state : null,
    };
    const newProfile = await update(
      API_UPDATE_SEEKER,
      { body },
      TAGS.profile,
      {
        error: {
          title: "Failed to update seeker profile",
          description: "Please try again.",
        },
        success: {
          title: "Seeker Profile Updated Successfully",
          description: "Your seeker profile has been updated successfully.",
        },
      },
    );
    onClose();
    onSave(newProfile);
    reset(getDefaultUserData(newProfile));
  };

  return (
    <>
      <LeaveConfirmationModal
        isOpen={isLeaving}
        onLeave={() => {
          handleUserDecision(true);
        }}
        onStay={() => {
          setLeavingManually(false);
          handleUserDecision(false);
        }}
      />
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { borderRadius: "10px" },
          "& .MuiPaper-root": {
            overflowX: "hidden",
            margin: 0,
            width: "calc(100% - 32px)",
          },
        }}
      >
        <ModalHeader
          title={"Edit User Profile"}
          error={error?.message}
          handleCancel={onClose}
        />
        <DialogContent className="m-0 h-full max-h-[calc(100dvh-200px)] p-0">
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-2">
            <div className="scroll-bar-minimal max-h-[calc(100dvh-270px)] overflow-y-auto bg-background">
              <HeaderSectionForm
                formMethods={formMethods}
                className="border-none shadow-none"
              />
              <ProfileForm
                formMethods={formMethods}
                className="border-none shadow-none"
              />
            </div>

            <FormActions
              onCancel={onClose}
              isDirty={isDirty}
              loading={isLoading}
            />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditSeekerModal;
