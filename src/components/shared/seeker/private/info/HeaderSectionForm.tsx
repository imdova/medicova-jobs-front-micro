"use client";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import uploadFiles from "@/lib/files/imageUploader";
import { UseFormReturn } from "react-hook-form";
import ProfileImage from "@/components/UI/ProfileImage";
import { cn } from "@/util";
import { UserProfile } from "@/types/seeker";

interface HeaderSectionProps {
  formMethods: UseFormReturn<Partial<UserProfile>>;
  className?: string;
}

const HeaderSectionForm: React.FC<HeaderSectionProps> = ({
  formMethods,
  className,
}) => {
  const { control, getValues, setValue, watch } = formMethods;
  const avatar = watch("avatar");

  const updateImage = async (file: File) => {
    const [avatar] = await uploadFiles([file]);
    setValue("avatar" as keyof UserProfile, avatar, { shouldDirty: true });
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-8 overflow-hidden rounded-base rounded-t-base border border-gray-200 bg-white p-5 shadow-soft lg:flex-row lg:items-start",
        className,
      )}
    >
      <div>
        <ProfileImage
          currentImageUrl={avatar || ""}
          alt={" user image"}
          size="large"
          onImageUpdate={updateImage}
          imageClassName="border-4 border-white shadow-soft"
        />
      </div>
      <div className="flex w-full gap-3">
        <div className="flex-1">
          <FormField
            field={{
              label: "First Name*",
              name: "firstName",
              type: "text",
              required: true,
              rules: {
                minLength: {
                  value: 2,
                  message: "First Name must be larger than 2 word",
                },
              },
            }}
            control={control}
            formValues={getValues()}
          />
        </div>
        <div className="flex-1">
          <FormField
            field={{
              label: "Last Name*",
              name: "lastName",
              type: "text",
              required: true,
              rules: {
                minLength: {
                  value: 2,
                  message: "Last Name must be larger than 2 word",
                },
              },
            }}
            control={control}
            formValues={getValues()}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderSectionForm;
