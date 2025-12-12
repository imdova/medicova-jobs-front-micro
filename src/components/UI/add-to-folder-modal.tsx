"use client";
import { FieldConfig, Folder } from "@/types";
import FormModal from "../form/FormModal/FormModal";
import SelectFolder from "../form/folders/selectFolder";
import useUpdateApi from "@/hooks/useUpdateApi";
import { API_ADD_SEEKERS_TO_FOLDER } from "@/api/seeker";

interface NewUserModalProps {
  folders: Folder[];
  seekers: string[] | null;
  refetch: () => void;
  onClose: () => void;
}

const AddToFolderModal: React.FC<NewUserModalProps> = ({
  seekers,
  onClose,
  folders,
  refetch,
}) => {
  const { isLoading, error, update } = useUpdateApi();
  const fields: FieldConfig[] = [
    {
      name: "id",
      type: "component",
      componentProps: {
        label: "All Folder",
        folders: folders,
      },
      component: SelectFolder,
    },
  ];

  const onSubmit = async (data: Folder) => {
    const body = {
      folderId: data.id,
      seekers: seekers?.map((x) => ({ seekerId: x })),
    };
    await update(API_ADD_SEEKERS_TO_FOLDER, {
      method: "POST",
      body,
    });
    refetch();
    onClose();
  };

  return (
    <FormModal
      open={!!seekers}
      onClose={onClose}
      loading={isLoading}
      error={error?.message}
      onSubmit={onSubmit}
      fields={fields}
      title="Select Folder"
    />
  );
};

export default AddToFolderModal;
