"use client";
import { FieldConfig } from "@/types";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { useFormContext } from "react-hook-form";
import { BrandingData } from "@/types/branding";

const assetFields: FieldConfig<BrandingData>[] = [
  {
    name: "assetsData.primaryLogo",
    label: "Primary Logo",
    type: "upload-area",
    required: true,
    fileProps: {
      previewType: "image",
      maxFiles: 1,
      maxSize: 1,
      urlField: true,
      autoUpload: true,
    },
    textFieldProps: {
      placeholder: "Suggested image dimensions: 350 × 100 pixels",
    },
  },
  {
    name: "assetsData.secondaryLogo",
    label: "Secondary Logo",
    type: "upload-area",
    required: true,
    fileProps: {
      previewType: "image",
      maxFiles: 1,
      maxSize: 1,
      urlField: true,
      autoUpload: true,
    },
    textFieldProps: {
      placeholder: "Suggested image dimensions: 350 × 100 pixels",
    },
  },
  {
    name: "assetsData.footerIcon",
    label: "Footer Icon",
    type: "upload-area",
    required: true,
    fileProps: {
      previewType: "image",
      maxFiles: 1,
      maxSize: 1,
      urlField: true,
      autoUpload: true,
    },
    textFieldProps: {
      placeholder: "Suggested image dimensions: 150 × 150 pixels",
    },
  },
  {
    name: "assetsData.invoiceIcon",
    label: "Invoice Icon",
    type: "upload-area",
    required: true,
    fileProps: {
      previewType: "image",
      maxFiles: 1,
      maxSize: 1,
      urlField: true,
      autoUpload: true,
    },
    textFieldProps: {
      placeholder: "Suggested image dimensions: 150 × 150 pixels",
    },
  },

  {
    name: "assetsData.favicon",
    label: "Favicon",
    type: "upload-area",
    required: true,
    fileProps: {
      previewType: "image",
      maxFiles: 1,
      maxSize: 1,
      urlField: true,
      autoUpload: true,
    },
    textFieldProps: {
      placeholder: "Suggested favicon dimensions: 512 × 512 pixels.",
    },
  },
  {
    name: "assetsData.appIcon",
    label: "App Icon",
    type: "upload-area",
    required: true,
    fileProps: {
      previewType: "image",
      maxFiles: 1,
      maxSize: 1,
      urlField: true,
      autoUpload: true,
    },
    textFieldProps: {
      placeholder: "Suggested app icon dimensions: 32 × 32 pixels.",
    },
  },
];

const BrandAssets: React.FC = () => {
  const { control } = useFormContext<BrandingData>();
  return (
    <div className="space-y-6">
      <div className="rounded-base border border-gray-200 bg-white p-6 shadow-soft">
        <h2 className="mb-4 text-2xl font-semibold">Brand Assets</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {assetFields.map((field) => (
            <div key={field.name} className="space-y-4">
              <FormField field={field} control={control} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandAssets;
