import { TAGS } from "@/api";
import { API_UPDATE_COMPANY } from "@/api/employer";
import { API_DELETE_FILE } from "@/api/general";
import LeaveConfirmationModal from "@/components/UI/LeaveConfirmationModal";
import useFileUploader from "@/hooks/useFileUploader";
import useIsLeaving from "@/hooks/useIsLeaving";
import useUpdateApi from "@/hooks/useUpdateApi";
import { Company } from "@/types";
import { companyBanners } from "@/util/company/companyform";
import { Alert, Button, CircularProgress } from "@mui/material";
import clsx from "clsx";
import { CloudUpload, Info, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

// Constants for file upload constraints
const MAX_FILE_SIZE = 1; // 1MB
const MAX_FILES = 3;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

// Interface for file with preview property
interface FileWithPreview extends File {
  preview: string;
  uploaded?: boolean;
}

// Props for the main CompanyImage component
interface CompanyImageProps {
  company?: Company;
  autoUpload?: boolean;
  onSuccess?: (banners: string[]) => Promise<void>;
  onSelectFiles?: (files: FileWithPreview[]) => void;
}

// Props for the ImageItem sub-component
interface ImageItemProps {
  file: FileWithPreview;
  index: number;
  handleRemoveFile: (file: FileWithPreview) => void;
  loadingStates: Record<string, boolean>;
  uploadResults: UploadResponse[];
}

// Sub-component to render individual image items
const ImageItem: React.FC<ImageItemProps> = ({
  file,
  index,
  handleRemoveFile,
  loadingStates,
  uploadResults,
}) => {
  // Check if the current file is being uploaded
  const isLoading = loadingStates[file.name];
  // Check for upload errors for the current file
  const error = uploadResults.find(
    (result) => "error" in result && result.fileName === file.name,
  );

  return (
    <div
      className={`${index === 0 ? "col-span-3" : "col-span-1"} relative aspect-square`}
    >
      <div className="relative h-full w-full">
        {/* Remove button for the image */}
        <button
          type="button"
          onClick={() => handleRemoveFile(file)}
          className="absolute -right-2 -top-2 z-[1] rounded-full bg-gray-300 p-1 hover:bg-red-300 hover:text-red-600"
        >
          <X className="h-3 w-3" />
        </button>
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          {/* Show loading indicator during upload */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50">
              <CircularProgress
                size={index === 0 ? 20 : 14}
                className="text-primary"
              />
            </div>
          )}
          {/* Show error indicator if upload failed */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50">
              <Info size={index === 0 ? 20 : 14} className="text-red-700" />
            </div>
          )}
          {/* Display the image */}
          <Image
            src={file.preview}
            alt={file.name}
            width={index === 0 ? 300 : 70}
            height={index === 0 ? 300 : 70}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

// Main component for handling company image uploads
const CompanyImage: React.FC<CompanyImageProps> = ({
  company,
  autoUpload,
  onSuccess,
  onSelectFiles,
}) => {
  // Custom hooks for file uploading and API updates
  const { uploadFiles, loadingStates, uploadResults } = useFileUploader();
  const { update } = useUpdateApi<Company>(handleSuccess);

  // State management
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>(
    companyBanners(company),
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Hook to prevent navigation when form is dirty
  const { isLeaving, setLeavingManually, handleUserDecision } = useIsLeaving({
    preventDefault: isDirty,
  });

  // Configure dropzone for file uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setError(null);
      // Validate file sizes
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > MAX_FILE_SIZE * 1024 * 1024,
      );
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed the ${MAX_FILE_SIZE}MB limit`);
        return;
      }

      // Validate number of files
      if (acceptedFiles.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} files allowed`);
        return;
      }
      if (acceptedFiles.length === 0) {
        setError(
          `Unsupported file type. Only ${ACCEPTED_IMAGE_TYPES.join(", ")} allowed.`,
        );
        return;
      }

      // Check total file count
      if (selectedFiles.length + acceptedFiles.length > 3) {
        setError("You can only upload up to 3 files.");
        return;
      }

      // Create preview URLs for new files
      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          uploaded: false,
        }),
      );
      const newSelectedFiles = [...selectedFiles, ...filesWithPreview];
      if (autoUpload) {
        handleUpload(newSelectedFiles);
      } else if (onSelectFiles) {
        onSelectFiles(newSelectedFiles);
      }
      setSelectedFiles(newSelectedFiles);
    },
    accept: ACCEPTED_IMAGE_TYPES.reduce(
      (acc, curr) => ({ ...acc, [curr]: [] }),
      {},
    ),
    multiple: true,
    maxFiles: MAX_FILES,
  });

  // Handle successful API update
  function handleSuccess(updatedCompany: Company) {
    setSelectedFiles(companyBanners(updatedCompany));
  }

  // Handle file removal
  const handleRemoveFile = (fileToRemove: FileWithPreview) => {
    const parts = fileToRemove.preview.split("/");
    const fileId = parts[parts.length - 1];
    const newFiles = selectedFiles.filter((file) => file !== fileToRemove);
    const banners = newFiles
      .filter((file) => file.uploaded)
      .map((file) => file.preview);
    setSelectedFiles(newFiles);

    if (onSuccess) {
      onSuccess(banners);
      fetch(API_DELETE_FILE + fileId, {
        method: "DELETE",
      });
    }
  };

  // Handle file upload process
  const handleUpload = async (selectedFiles: FileWithPreview[]) => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const filesToUpload = selectedFiles.filter((file) => !file.uploaded);
      const uploadedUrls = await uploadFiles(filesToUpload);

      if (uploadedUrls.length > 0) {
        const banners = [
          ...selectedFiles
            .filter((file) => file.uploaded)
            .map((file) => file.preview),
          ...uploadedUrls,
        ];
        if (onSuccess) await onSuccess(banners);
      }
    } catch (err) {
      setError("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Update dirty state based on file changes
  useEffect(() => {
    if (selectedFiles.find((file) => !file.uploaded)) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [selectedFiles]);

  // Render the component
  return (
    <div className="h-full">
      {/* Modal for confirming navigation away from unsaved changes */}
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
      <p className="mb-2 text-sm text-muted-foreground">
        Share Moments of your company
      </p>
      {/* Display error messages */}
      {error && (
        <Alert severity="error" className="my-1">
          <p className="text-xs">{error}</p>
        </Alert>
      )}
      {selectedFiles.length > 0 ? (
        <div className="mt-4">
          <div className="mt-4 grid grid-cols-3 gap-4">
            {/* Render existing images */}
            {selectedFiles.map((file, index) => (
              <ImageItem
                key={index}
                file={file}
                index={index}
                handleRemoveFile={handleRemoveFile}
                loadingStates={loadingStates}
                uploadResults={uploadResults}
              />
            ))}
            {/* Render dropzone for additional uploads if less than 3 files */}
            {selectedFiles.length < 3 && (
              <div
                {...getRootProps()}
                className={clsx(
                  "relative col-span-1 flex aspect-square cursor-pointer items-center justify-center rounded-base border border-dashed p-4 transition-colors",
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300",
                )}
              >
                <CloudUpload className="mx-auto h-8 w-8 text-gray-400" />
                <input {...getInputProps()} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Initial dropzone when no files are selected */}
          <div
            {...getRootProps()}
            className={clsx(
              "cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors",
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
            )}
          >
            <input {...getInputProps()} />
            <div className="py-8">
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-xs text-muted-foreground">
                Drag & drop your images here, or click to select
              </p>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {ACCEPTED_IMAGE_TYPES.join(", ")} (max {MAX_FILE_SIZE}MB, max 3
            images)
          </p>
        </div>
      )}
      {/* Uncomment to enable manual upload button */}
      {/* {isDirty && selectedFiles.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          startIcon={
            isUploading ? <CircularProgress size={20} /> : <CloudUpload />
          }
          onClick={() => handleUpload(selectedFiles)}
          disabled={isUploading}
          className="mt-4"
        >
          {isUploading ? "Uploading" : "Upload"}
        </Button>
      )} */}
    </div>
  );
};

export default CompanyImage;
