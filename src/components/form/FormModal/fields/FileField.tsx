import Avatar from "@/components/UI/Avatar";
import { FieldConfig } from "@/types";
import { PhotoCamera } from "@mui/icons-material";
import React, { useState } from "react";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";
import { FileUploadModal } from "@/components/form/FileUploadModal";
import uploadFiles from "@/lib/files/imageUploader";
import { cn } from "@/util";

interface FileFieldProps {
  field: FieldConfig;
  controllerField?: Partial<ControllerRenderProps<FieldValues, string>>;
  error?: FieldError | null;
}

const DEFAULT_ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const DEFAULT_ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const FileField: React.FC<FileFieldProps> = ({
  field,
  controllerField,
  error,
}) => {
  const {
    type,
    acceptedFileTypes,
    maxFiles,
    maxSize,
    size,
    shape,
    className,
    imageClass,
  } = field.fileProps || {
    type: "profile",
    acceptedFileTypes: DEFAULT_ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: 5,
    size: 50,
    className: "",
    imageClass: "",
    shape: "circle",
  };
  const { onChange, value, disabled, name } = controllerField || {};

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  // Calculate size based on type and props

  const handleUpload: (files: File[]) => Promise<void> = async (files) => {
    if (type === "images" || type === "files") {
      const photos = await uploadFiles(files);
      onChange?.(photos);
    } else {
      const [photo] = await uploadFiles(files);
      onChange?.(photo);
    }
  };

  const getAcceptedFileTypes = () => {
    if (acceptedFileTypes) return acceptedFileTypes;
    if (type === "files") return DEFAULT_ACCEPTED_FILE_TYPES;
    return DEFAULT_ACCEPTED_IMAGE_TYPES;
  };

  const renderPreview = () => {
    if (type === "profile" || type === "image") {
      return (
        <Avatar
          src={value}
          size={"full"}
          alt={`Field ${name} Image`}
          shape={shape}
          className={cn(
            "col-start-1 row-start-1 aspect-square object-cover",
            error && "border border-red-500",
            className,
          )}
          imageClass={imageClass}
        />
      );
    }

    if (type === "images" || type === "files") {
      // For multiple files, show a preview list or grid
      return (
        <div className="flex flex-wrap gap-2">
          {Array.isArray(value) &&
            value.map((file, index) => (
              <div key={index} className="relative">
                {file instanceof File ? (
                  <div className="rounded border p-2">{file.name}</div>
                ) : (
                  <Avatar
                    src={file}
                    size={size}
                    alt={`File ${index + 1}`}
                    shape={shape}
                    className={cn(
                      "object-cover",
                      error && "border border-red-500",
                      className,
                    )}
                    imageClass={imageClass}
                  />
                )}
              </div>
            ))}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden",
          shape === "circle" ? "rounded-full" : "rounded-lg",
          className,
        )}
      >
        <button
          type="button"
          onClick={onOpen}
          disabled={disabled}
          className="absolute inset-0 z-[1] flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
          aria-label="Update file"
        >
          <PhotoCamera className="h-7 w-7 text-white" />
        </button>
        {renderPreview()}
      </div>
      {/* Upload Modal */}
      <FileUploadModal
        open={isOpen}
        onClose={onClose}
        onUpload={handleUpload}
        maxFileSizeMB={maxSize}
        acceptedFileTypes={getAcceptedFileTypes()}
        previewType={type === "files" ? "list" : "image"}
        maxFiles={type === "images" || type === "files" ? maxFiles : 1}
        description={
          type === "files"
            ? "Upload your files. Supported formats: PDF, DOC, DOCX"
            : "Choose an image. Supported formats: JPG, PNG"
        }
      />
    </>
  );
};
