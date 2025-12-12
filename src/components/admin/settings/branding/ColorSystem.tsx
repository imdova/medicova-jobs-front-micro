"use client";
import { FieldConfig } from "@/types";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { useFormContext } from "react-hook-form";
import { BrandingData } from "@/types/branding";

const fields: FieldConfig<BrandingData>[] = [
  {
    name: "colorsData.primary",
    label: "Primary",
    type: "color",
  },
  {
    name: "colorsData.primary-100",
    label: "Primary 100",
    type: "color",
  },
  {
    name: "colorsData.primary-900",
    label: "Primary 900",
    type: "color",
  },
  {
    name: "colorsData.primary-foreground",
    label: "Primary Foreground",
    type: "color",
  },
  {
    name: "colorsData.background",
    label: "Background",
    type: "color",
  },
  {
    name: "colorsData.light-primary",
    label: "Light Primary",
    type: "color",
  },
  {
    name: "colorsData.light-primary-transparent",
    label: "Light Primary Transparent",
    type: "color",
  },
  {
    name: "colorsData.primary-transparent",
    label: "Primary Transparent",
    type: "color",
  },
  {
    name: "colorsData.text-main",
    label: "Text Main",
    type: "color",
  },
  {
    name: "colorsData.text-muted-foreground",
    label: "Text Secondary",
    type: "color",
  },
  {
    name: "colorsData.warning",
    label: "Warning",
    type: "color",
  },
  {
    name: "colorsData.warning-100",
    label: "Warning 100",
    type: "color",
  },
  {
    name: "colorsData.error",
    label: "Error",
    type: "color",
  },
];

const ColorSystem: React.FC = () => {
  const { control } = useFormContext<BrandingData>();
  return (
    <div className="space-y-6">
      <div className="rounded-base border border-gray-200 bg-white p-6 shadow-soft">
        <h2 className="mb-4 text-2xl font-semibold">Color System</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {fields.map((field) => (
            <div key={field.name} className="space-y-4">
              <FormField field={field} control={control} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorSystem;
