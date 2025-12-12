"use client";
import { FieldConfig } from "@/types";
import { useFormContext } from "react-hook-form";
import { FormGrid } from "@/components/form/FormModal/FormGrid";
import { BrandingData } from "@/types/branding";

const assetFields: FieldConfig<BrandingData>[] = [
  {
    name: "generalData.siteName",
    label: "Site Name",
    type: "text",
    gridProps: {
      xs: 12,
      sm: 6,
      md: 6,
    },
    required: true,
  },
  {
    name: "generalData.siteTitle",
    label: "Site Title",
    type: "text",
    gridProps: {
      xs: 12,
      sm: 6,
      md: 6,
    },
    required: true,
  },
  {
    name: "generalData.siteDescription",
    label: "Site Description",
    type: "textArea",
    gridProps: {
      xs: 12,
    },
    required: true,
    textFieldProps: {
      placeholder: "Enter a brief description of your website.",
    },
  },
  {
    name: "generalData.siteKeywords",
    label: "Site Keywords",
    type: "multi-text",
    gridProps: {
      xs: 12,
    },
    required: true,
    textFieldProps: {
      placeholder:
        "Enter keywords related to your website, separated by commas.",
    },
  },
];

const Generals: React.FC = () => {
  const { control } = useFormContext<BrandingData>();
  return (
    <div className="space-y-6">
      <div className="rounded-base border border-gray-200 bg-white p-6 shadow-soft">
        <h2 className="mb-4 text-2xl font-semibold">Generals</h2>
        <FormGrid fields={assetFields} control={control} />
      </div>
    </div>
  );
};

export default Generals;
