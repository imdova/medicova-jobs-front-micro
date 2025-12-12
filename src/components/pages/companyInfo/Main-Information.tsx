import TextEditor from "@/components/editor/editor";
import ProfileImage from "@/components/UI/ProfileImage";
import uploadFiles from "@/lib/files/imageUploader";
import { Company } from "@/types";
import { TextField } from "@mui/material";
import { Controller, Path, UseFormReturn } from "react-hook-form";

interface MainInfoProps {
  formMethods: UseFormReturn<Company>;
}

const MainInformation: React.FC<MainInfoProps> = ({ formMethods }) => {
  const {
    control,
    formState: { errors },
    getValues,
    setValue,
  } = formMethods;
  const avatar = getValues("avatar");
  const updateImage = async (file: File) => {
    const [avatar] = await uploadFiles([file]);
    setValue("avatar" as Path<Company>, avatar, { shouldDirty: true });
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <ProfileImage
          currentImageUrl={avatar || ""}
          alt={" user image"}
          size="xLarge"
          onImageUpdate={updateImage}
          imageClassName="border-4 border-white shadow-soft"
        />
        <div className="mb-4 md:w-1/2 md:pr-5">
          <label className="mb-2 text-lg font-semibold text-main">Name *</label>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: "Company Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                className="w-full"
                placeholder="Enter your company name"
                error={!!errors?.name?.message}
              />
            )}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label className="mb-2 text-lg font-semibold text-main">Title *</label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Company Title is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              className="w-full"
              placeholder="Enter The Company Title"
            />
          )}
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 text-lg font-semibold text-main">About</label>
        <Controller
          name="about"
          control={control}
          render={({ field }) => (
            <TextEditor {...field} hasLinks={false} className="p-2" />
          )}
        />
      </div>
    </div>
  );
};

export default MainInformation;
