import ItemTag from "@/components/UI/ItemTag";
import { FieldConfig } from "@/types";
import { getNestedValue } from "@/util/forms";
import { InputLabel } from "@mui/material";
import React from "react";

export const getFilteredOptions = (
  field: FieldConfig,
  isMultiple: boolean,
  currentValues: string[],
) => {
  return isMultiple
    ? field.options?.filter((x) => !currentValues.includes(String(x.value))) ||
        []
    : field.options || [];
};

export const getDependsOnField = (
  field: FieldConfig,
  formValues: Record<string, any> | undefined,
  dependsOnField: FieldConfig | undefined,
) => {
  return field.dependsOn &&
    formValues &&
    !getNestedValue(formValues, field.dependsOn)
    ? { name: field.dependsOn, ...dependsOnField }
    : null;
};

export const getPlaceholder = (field: FieldConfig): string => {
  if (field.textFieldProps?.label) {
    return String(field.textFieldProps.label).replace("*", "");
  }
  if (field.label) {
    return "Select " + field.label.replace("*", "");
  }
  return "Select " + field.name;
};

export const getDependsOnTooltipText = (dependsOn: any): string => {
  const label = dependsOn.textFieldProps?.label
    ? String(dependsOn.textFieldProps.label).replace("*", "")
    : dependsOn.label?.replace("*", "") || dependsOn.name;
  return `Please select ${label} first`;
};

// Sub-components
export const FieldLabel: React.FC<{ field: FieldConfig }> = ({ field }) => {
  if (field.textFieldProps?.label) {
    return (
      <InputLabel className="bg-white px-1" id={String(field.name) + "Label"}>
        {field.textFieldProps.label}
      </InputLabel>
    );
  }

  if (field.label) {
    return (
      <label className="mb-1 font-semibold">
        {field.label.replace("*", "")}
        {field.required ? <span className="text-red-500">* </span> : null}
      </label>
    );
  }

  return null;
};

export const MultiSelectTags: React.FC<{
  field: FieldConfig;
  selectedValues: string[];
  onRemoveItem: (item: string) => void;
}> = ({ field, selectedValues, onRemoveItem }) => {
  if (!selectedValues?.length) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {selectedValues.map((item: string, index: number) => {
        const option = field.options?.find((x) => x.value === item);
        return (
          <ItemTag
            key={index}
            item={item}
            label={option?.label || item}
            onRemove={onRemoveItem}
          />
        );
      })}
    </div>
  );
};
