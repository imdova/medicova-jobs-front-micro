import React, { useState } from "react";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";
import { FieldConfig } from "@/types";
import { useDropzone } from "react-dropzone";
import { cn } from "@/util";
import { CloudUpload, Link2, X } from "lucide-react";
import {
  GridPreview,
  ImagePreview,
  ListPreview,
  PDFPreview,
} from "../../FileUploadModal";
import { CircularProgress, TextField } from "@mui/material";
import { isImageUrl } from "@/util/general";
import useFileUploader from "@/hooks/useFileUploader";

interface Props {
  field: FieldConfig;
  controllerField?: Partial<ControllerRenderProps<FieldValues, string>>;
  error?: FieldError | null;
}

interface FileWithPreview extends File {
  preview: string;
  uploaded?: boolean;
}

function createFileWithPreviewFromUrl(
  url?: string | FileWithPreview[] | null,
): FileWithPreview[] {
  if (!url) return [];

  // Handle array of URLs
  if (Array.isArray(url)) {
    return url;
  }

  const fakeFile = {
    name: url.split("/").pop() || "image.jpg",
    lastModified: Date.now(),
    size: 0,
    type: "image/jpeg", // or guess from url
    preview: url,
    uploaded: true,
  } as FileWithPreview;

  return [fakeFile];
}

const DEFAULT_ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const UploadAreaField: React.FC<Props> = ({
  field,
  controllerField,
  error: outError,
}) => {
  const { value: initialValue, onChange } = controllerField || {};
  const value = createFileWithPreviewFromUrl(initialValue);
  const { uploadFiles, loadingStates, uploadResults } = useFileUploader(
    field.fileProps?.maxSize || 1,
  );

  const [urlInput, setUrlInput] = useState<string>(value[0]?.preview || "");
  const [isOpen, setIsOpen] = useState(false);

  const [inError, setError] = useState<string | null>(null);

  const isUploadFailed = uploadResults.some((result) => result.error);
  const error =
    inError || (isUploadFailed && uploadResults[0]?.error) || outError?.message;

  const {
    acceptedFileTypes = DEFAULT_ACCEPTED_IMAGE_TYPES,
    maxFiles = 1,
    maxSize = 1,
    previewType = "image",
    multiple,
    autoUpload,
  } = field.fileProps || {
    acceptedFileTypes: DEFAULT_ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: 1,
    previewType: "image",
    multiple: false,
    autoUpload: false,
  };

  function handleAddFiles(
    oldData: FileWithPreview[],
    newData: FileWithPreview[],
    maxFiles: number,
  ): FileWithPreview[] {
    if (maxFiles === 1) {
      // Replace the old file with the first new file
      return newData.slice(0, 1);
    }

    const totalFiles = oldData.length + newData.length;

    if (totalFiles <= maxFiles) {
      return [...oldData, ...newData];
    } else {
      const remainingSlots = maxFiles - oldData.length;
      if (remainingSlots > 0) {
        return [...oldData, ...newData.slice(0, remainingSlots)];
      } else {
        // No room, return oldData or optionally replace oldest?
        return oldData;
      }
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const isValidImage = isImageUrl(url);
    if (!isValidImage) {
      setError("Please enter a valid image URL");
    } else {
      setError(null);
    }

    setUrlInput(url);
    onChange?.(url);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setError(null);

      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxSize * 1024 * 1024,
      );
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed the ${maxSize}MB limit`);
        return;
      }
      // Check number of files
      if (acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      if (acceptedFiles.length === 0) {
        setError(
          `Unsupported file type. Only ${acceptedFileTypes.join(", ")} allowed.`,
        );
        return;
      }

      if (value.length + acceptedFiles.length > 3) {
        setError("You can only upload up to 3 files.");
        return;
      }

      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          uploaded: false,
        }),
      );
      const newValue = handleAddFiles(value, filesWithPreview, maxFiles);
      upload(newValue);
      setError(null);
      setIsOpen(false);
      setUrlInput("");
    },
    accept: acceptedFileTypes.reduce(
      (acc, curr) => ({ ...acc, [curr]: [] }),
      {},
    ),
    multiple: multiple,
    maxFiles: maxFiles,
  });

  const upload = async (files: FileWithPreview[]) => {
    if (autoUpload) {
      const uploadedUrls = await uploadFiles(files);
      if (maxFiles === 1) {
        onChange?.(uploadedUrls[0] || "");
        setUrlInput(uploadedUrls[0] || "");
      } else {
        onChange?.(uploadedUrls);
      }
    } else {
      onChange?.(files);
    }
  };

  const { className, ...labelProps } =
    field.textFieldProps?.InputLabelProps || {};

  const placeholder = field.textFieldProps?.placeholder;
  return (
    <div className="max-h-[80vh] w-full overflow-y-auto rounded-lg bg-white">
      {field.label && (
        <div className="mb-1">
          <label
            htmlFor={String(field.name)}
            className={`font-semibold ${className}`}
            {...labelProps}
          >
            {field.label?.replace("*", "")}
            {field.required ? <span className="text-red-500">*</span> : null}
          </label>
        </div>
      )}
      <div className="group relative overflow-hidden">
        {field.fileProps?.urlField && (
          <div
            className={cn(
              "absolute left-0 top-0 z-20 hidden w-full gap-3 p-2 group-hover:flex",
            )}
          >
            <TextField
              type="text"
              value={urlInput || ""}
              fullWidth
              onChange={handleUrlChange}
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              className={cn(
                "flex-1 rounded-md border border-gray-300 bg-white transition-transform focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500",
                isOpen ? "translate-y-0" : "-translate-y-[60px]",
              )}
            />
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className={cn(
                  "rounded-base border border-gray-300 bg-white p-3 hover:border-primary hover:bg-primary/10",
                )}
              >
                {isOpen ? <X size={18} /> : <Link2 size={18} />}
              </button>
            </div>
          </div>
        )}
        {loadingStates.loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-200/50">
            <CircularProgress size={20} className="text-primary" />
          </div>
        )}
        <div
          {...getRootProps()}
          className={cn(
            "relative min-h-[232px] cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-4 text-center transition-colors duration-300 hover:border-primary hover:bg-primary/10",
            isDragActive && "border-primary bg-primary/10",
            error && "border-red-500 bg-red-50",
          )}
        >
          <input {...getInputProps()} />
          {value.length > 0 ? (
            <div>
              {previewType === "image" &&
                value[0]?.type?.startsWith("image/") && (
                  <ImagePreview file={value[0]} />
                )}
              {previewType === "list" && <ListPreview files={value} />}
              {previewType === "grid" && <GridPreview files={value} />}
              {previewType === "pdf" && <PDFPreview file={value[0]} />}
            </div>
          ) : (
            <div className="py-8">
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">
                Drag & drop {multiple ? "files" : "a file"} here, or click to
                select
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {acceptedFileTypes.join(", ")} (max {maxSize}MB
                {multiple ? `, ${maxFiles} files` : ""})
              </p>
            </div>
          )}
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      ) : (
        placeholder && (
          <p className="mt-3 text-sm text-muted-foreground">
            {field.placeholder || placeholder}
          </p>
        )
      )}
    </div>
  );
};
