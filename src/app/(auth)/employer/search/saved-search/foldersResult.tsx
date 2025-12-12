"use client";
import { TAGS } from "@/api";
import {
  API_CREATE_FOLDER,
  API_DELETE_FOLDER_BY_ID,
  API_UPDATE_FOLDER,
} from "@/api/seeker";
import FormModal from "@/components/form/FormModal/FormModal";
import DataTable from "@/components/UI/data-table";
import DeleteConfirmationDialog from "@/components/UI/DeleteConfirmationDialog";
import FolderMainCard from "@/components/UI/folder-main-card";
import useUpdateApi from "@/hooks/useUpdateApi";
import { FieldConfig, Folder } from "@/types";
import { formatDistanceToNow } from "@/util";
import { handleDuplicates } from "@/util/company/companyform";
import { Add, Search } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const fields: FieldConfig[] = [
  {
    name: "name",
    type: "text",
    label: "Folder Name",
    required: true,
    textFieldProps: {
      placeholder: "Enter Folder Name",
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <Image
              src="/images/folder.svg"
              width={20}
              height={20}
              alt="folder icon"
              className="object-contain"
            />
          </InputAdornment>
        ),
      },
    },
  },
];

const RECENT_FOLDERS = 10;

interface FolderResultsProps {
  folders: Folder[];
  total: number;
  companyId: string;
}

const FolderResults: React.FC<FolderResultsProps> = ({
  folders,
  total,
  companyId,
}) => {
  const [folder, setFolder] = useState<Partial<Folder> | null>(null);
  const { isLoading, error, update, reset } = useUpdateApi<Folder>(onSuccess);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(number | string)[]>([]);

  const onOpen = () => setFolder({ name: "", companyId: companyId });
  const onEdit = (folder: Folder) => setFolder(folder);
  const onClose = () => {
    setFolder(null);
    reset();
  };

  const handleSubmit = async (formData: Partial<Folder>) => {
    const name = formData.name
      ? handleDuplicates(
          folders.map((f) => f.name),
          formData.name,
        )
      : formData.name;
    if (formData.id) {
      await update(
        API_UPDATE_FOLDER,
        { body: { ...formData, name } },
        TAGS.folders,
      );
    } else {
      await update(
        API_CREATE_FOLDER,
        { method: "POST", body: { ...formData, name } },
        TAGS.folders,
      );
    }
  };
  function onSuccess() {
    onClose();
  }

  /// delete folder modal
  const [deleteFolder, setDeleteFolder] = useState<Partial<Folder> | null>(
    null,
  );
  const onDelete = (folder: Folder) => setDeleteFolder(folder);
  const onCloseDelete = () => setDeleteFolder(null);
  const handleDelete = async () => {
    onCloseDelete();
    await update(
      API_DELETE_FOLDER_BY_ID + deleteFolder?.id,
      { method: "DELETE" },
      TAGS.folders,
    );
  };

  return (
    <div className="md:mr-4">
      <FormModal
        open={!!folder}
        error={error?.message}
        loading={isLoading}
        onClose={onClose}
        onSubmit={handleSubmit}
        fields={fields}
        title={folder?.id ? "Edit Folder" : "Create New Folder"}
        description={
          folder?.id
            ? "Edit the name of your folder."
            : "Enter a name for your new folder."
        }
        initialValues={folder || {}}
      />
      <DeleteConfirmationDialog
        open={!!deleteFolder}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteFolder?.name}"? This action cannot be undone.`}
        onDelete={handleDelete}
        onClose={onCloseDelete}
      />
      <div className="mb-4 flex items-center justify-between rounded-[10px] border border-gray-200 bg-white p-4 px-6 shadow-soft">
        <h1 className="text-3xl font-bold">Folders</h1>
        <IconButton
          onClick={onOpen}
          className="rounded-md border border-solid border-[#D6DDEB] p-2"
        >
          <Add />
        </IconButton>
      </div>
      {folders.length > 0 ? (
        <div className="p-2">
          <h2 className="mb-4 text-2xl font-semibold">Recently Used</h2>
          <div className="grid grid-cols-2 flex-wrap gap-2 md:grid-cols-3 lg:grid-cols-5">
            {folders.slice(0, RECENT_FOLDERS).map((folder, index) => (
              <FolderMainCard
                key={index}
                folder={folder}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-2">
          <h2 className="mb-4 text-2xl font-semibold">Recently Used</h2>
          <div className="grid grid-cols-2 flex-wrap gap-2 md:grid-cols-3 lg:grid-cols-5">
            <button onClick={onOpen}>
              <div className="group relative flex h-[100px] items-center justify-center rounded-md bg-[#ECF0F3] duration-150 hover:bg-[#D6DDEB] md:min-w-40">
                <Image
                  src="/images/folder.svg"
                  width={40}
                  height={40}
                  alt="folder icon"
                  className="object-contain duration-300 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-md bg-gray-100/50 text-sm font-semibold text-black">
                  <Add className="mr-2 h-5 w-5 rounded-full bg-green-500 text-white" />
                  Create a folder
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
      {folders.length && folders.length > RECENT_FOLDERS ? (
        <div>
          <div className="mb-4 flex flex-col justify-between px-2 md:flex-row md:items-center">
            <h2 className="text-2xl font-semibold">All folders</h2>
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              variant="outlined"
              placeholder="Search folders"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="body-container px-2">
            <DataTable
              data={folders.slice(RECENT_FOLDERS) || []}
              total={total - RECENT_FOLDERS || 0}
              fixedNumberPerPage={5}
              searchQuery={query}
              selected={selected}
              setSelected={setSelected}
              columns={[
                {
                  key: "name",
                  header: "Name",
                  sortable: true,
                  render: (folder) => (
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/folder.svg"
                        width={20}
                        height={20}
                        alt="folder"
                      />
                      <Link
                        className="line-clamp-1 max-w-full hover:underline"
                        href={`/employer/search/saved-search/${folder.id}`}
                      >
                        <span>{folder.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({formatDistanceToNow(folder.created_at)})
                        </span>
                      </Link>
                    </div>
                  ),
                },
                {
                  key: "seekersCount",
                  header: "Candidates",
                  sortable: true,
                  render: (folder) =>
                    folder.seekersCount ? folder.seekersCount : 0,
                },
                {
                  key: "updated_at",
                  header: "Last Modified",
                  sortable: true,
                  render: (folder) =>
                    new Date(folder.updated_at).toLocaleDateString(),
                },
              ]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FolderResults;
