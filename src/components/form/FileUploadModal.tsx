"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Modal,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  styled,
} from "@mui/material";
import { CloudUpload, ImageNotSupported } from "@mui/icons-material";
import Image from "next/image";
import clsx from "clsx";
import { ACCEPTED_IMAGE_TYPES } from "@/constants";
import { PDF_ICON } from "../icons/icons";
import useImageValidation from "@/hooks/useImageValidation";

// Types for the modal
interface FileWithPreview extends File {
  preview?: string;
}
// TODO : better preview for pdf list
interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
  // Configuration
  multiple?: boolean;
  maxFiles?: number;
  maxFileSizeMB?: number;
  acceptedFileTypes?: string[];
  // Customization
  title?: string;
  description?: string;
  uploadButtonText?: string;
  cancelButtonText?: string;
  // Preview options
  showPreview?: boolean;
  previewType?: "image" | "list" | "grid" | "pdf";
  // Styling
  className?: string;
  modalStyle?: React.CSSProperties;
  dropzoneStyle?: React.CSSProperties;
  error?: string;
}

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Preview components
export const ImagePreview: React.FC<{ file: FileWithPreview }> = ({ file }) => {
  const { isValid } = useImageValidation(file.preview || "");

  return isValid ? (
    <div className="mx-auto flex h-[200px] w-full items-center justify-center">
      <Image
        src={file.preview || ""}
        alt={file.name}
        width={200}
        height={200}
        className="mx-auto h-full w-full rounded-lg object-contain"
      />
    </div>
  ) : (
    <div className="mx-auto flex h-[200px] w-[200px] items-center justify-center rounded-lg border object-cover shadow-soft">
      <ImageNotSupported className="h-24 w-24 text-gray-300" />
    </div>
  );
};

export const ListPreview: React.FC<{ files: FileWithPreview[] }> = ({
  files,
}) => (
  <ul className="mt-4 space-y-2">
    {files.map((file, index) => (
      <li key={index} className="flex items-center space-x-2">
        <div className="text-sm text-gray-600">{file.name}</div>
        <div className="text-xs text-gray-400">
          ({Math.round(file.size / 1024)}KB)
        </div>
      </li>
    ))}
  </ul>
);

export const GridPreview: React.FC<{ files: FileWithPreview[] }> = ({
  files,
}) => (
  <div className="mt-4 grid grid-cols-3 gap-4">
    {files.map((file, index) => (
      <div key={index} className="relative aspect-square">
        {file.type.startsWith("image/") ? (
          <Image
            src={file.preview || ""}
            alt={file.name}
            fill
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg bg-gray-100">
            <Typography className="text-sm text-gray-600">
              {file.name}
            </Typography>
          </div>
        )}
      </div>
    ))}
  </div>
);

export const PDFPreview: React.FC<{ file: FileWithPreview }> = ({ file }) => {
  return (
    <div className="mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-100 p-2">
      <PDF_ICON width={40} height={40} className="text-[#EF5350]" />
      <div className="break-all text-xs text-gray-600">{file.name}</div>
      <div className="text-xs text-gray-400">
        ({Math.round(file.size / 1024)}KB)
      </div>
    </div>
  );
};

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  open,
  onClose,
  onUpload,
  multiple = false,
  maxFiles = 1,
  maxFileSizeMB = 1,
  acceptedFileTypes = ACCEPTED_IMAGE_TYPES,
  title = "Upload Files",
  description,
  uploadButtonText = "Upload",
  cancelButtonText = "Cancel",
  showPreview = true,
  previewType = "image",
  className,
  modalStyle,
  dropzoneStyle,
  error: outError,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setError(null);

      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxFileSizeMB * 1024 * 1024,
      );
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed the ${maxFileSizeMB}MB limit`);
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

      if (selectedFiles.length + acceptedFiles.length > 3) {
        setError("You can only upload up to 3 files.");
        return;
      }

      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          uploaded: false,
        }),
      );

      setSelectedFiles((prev) => [...prev, ...filesWithPreview]);
    },
    accept: acceptedFileTypes.reduce(
      (acc, curr) => ({ ...acc, [curr]: [] }),
      {},
    ),
    multiple: multiple,
    maxFiles: maxFiles,
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setError(null);
    try {
      await onUpload(selectedFiles);
      onClose();
      setSelectedFiles([]);
    } catch (err) {
      setError("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [selectedFiles]);

  return (
    <StyledModal
      open={open}
      onClose={() => !isUploading && onClose()}
      aria-labelledby="upload-modal"
      className={className}
      style={modalStyle}
    >
      <Box className="mx-4 max-h-[80vh] w-full max-w-[600px] overflow-y-auto rounded-lg bg-white p-6">
        <Typography variant="h6" component="h2" className="mb-2">
          {title}
        </Typography>

        {description && (
          <Typography className="mb-4 text-gray-600">{description}</Typography>
        )}

        <div
          {...getRootProps()}
          className={clsx(
            "cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors",
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
          )}
          style={dropzoneStyle}
        >
          <input {...getInputProps()} />
          {showPreview && selectedFiles.length > 0 ? (
            <div className="mt-4">
              {previewType === "image" &&
                selectedFiles[0].type.startsWith("image/") && (
                  <ImagePreview file={selectedFiles[0]} />
                )}
              {previewType === "list" && <ListPreview files={selectedFiles} />}
              {previewType === "grid" && <GridPreview files={selectedFiles} />}
              {previewType === "pdf" && <PDFPreview file={selectedFiles[0]} />}
            </div>
          ) : (
            <div className="py-8">
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <Typography className="mt-2">
                Drag & drop {multiple ? "files" : "a file"} here, or click to
                select
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-1"
              >
                {acceptedFileTypes.join(", ")} (max {maxFileSizeMB}MB
                {multiple ? `, ${maxFiles} files` : ""})
              </Typography>
            </div>
          )}
        </div>

        {/* {showPreview && selectedFiles.length > 0 && (
          <div className="mt-4">
            {previewType === "image" &&
              selectedFiles[0].type.startsWith("image/") && (
                <ImagePreview file={selectedFiles[0]} />
              )}
            {previewType === "list" && <ListPreview files={selectedFiles} />}
            {previewType === "grid" && <GridPreview files={selectedFiles} />}
          </div>
        )} */}

        {error ||
          (outError && (
            <Alert severity="error" className="mt-3">
              {error || outError}
            </Alert>
          ))}

        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onClose} disabled={isUploading}>
            {cancelButtonText}
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <CircularProgress size={16} className="mr-2" />
                Uploading...
              </>
            ) : (
              uploadButtonText
            )}
          </Button>
        </div>
      </Box>
    </StyledModal>
  );
};
