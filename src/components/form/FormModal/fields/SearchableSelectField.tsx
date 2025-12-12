import React from "react";
import { FormControl, FormHelperText, Tooltip } from "@mui/material";
import { FieldConfig } from "@/types";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";
import { cn } from "@/util";
import {
  FieldLabel,
  getDependsOnField,
  getDependsOnTooltipText,
  getFilteredOptions,
  getPlaceholder,
  MultiSelectTags,
} from "./helper";
import SearchableSelect from "@/components/UI/SearchableSelect";

interface SelectFieldProps {
  field: FieldConfig;
  controllerField?: Partial<ControllerRenderProps<FieldValues, string>>;
  error?: FieldError | null;
  resetValues?: (fieldNames: FieldConfig["name"][]) => void;
  formValues?: Record<string, any>;
  dependsOnField?: FieldConfig;
}

// Helper functions
const getCurrentValues = (value: any): string[] => {
  return Array.isArray(value) ? value : value ? [value] : [];
};

const SelectDropdown: React.FC<{
  field: FieldConfig;
  controllerField?: Partial<ControllerRenderProps<FieldValues, string>>;
  options: any[];
  isMultiple: boolean;
  dependsOn: any;
  className: string;
  placeholder: string;
  onSelectionChange: (value: any) => void;
  onResetFields?: () => void;
}> = ({
  field,
  controllerField,
  options,
  isMultiple,
  dependsOn,
  className,
  placeholder,
  onSelectionChange,
  onResetFields,
}) => {
  const handleChange = (e: any) => {
    const value = e && e.target ? e.target.value : e;
    field.onChange?.(value);
    onSelectionChange(value);
    if (field.resetFields) {
      onResetFields?.();
    }
  };

  const renderValue = (value: any) => {
    const selected = options.find((opt) => opt.value == value)?.label;
    return selected ? (
      selected
    ) : (
      <span className="text-neutral-400">
        {field.placeholder ||
          field.textFieldProps?.placeholder ||
          placeholder ||
          "Select"}
      </span>
    );
  };

  return (
    <SearchableSelect
      className={cn("w-full bg-white", className)}
      sx={field.textFieldProps?.sx}
      {...controllerField}
      labelId={String(field.name) + "Label"}
      id={String(field.name)}
      options={options}
      disabled={!!dependsOn}
      displayEmpty
      value={isMultiple ? "" : controllerField?.value}
      MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
      onChange={handleChange}
      renderValue={renderValue}
    />
  );
};

// Main component
const SearchableSelectField: React.FC<SelectFieldProps> = ({
  field,
  controllerField,
  error,
  resetValues,
  formValues,
  dependsOnField,
}) => {
  const isMultiple = field.multiple === true;
  const currentValues = getCurrentValues(controllerField?.value);
  const options = getFilteredOptions(field, isMultiple, currentValues);
  const dependsOn = getDependsOnField(field, formValues, dependsOnField);
  const placeholder = getPlaceholder(field);
  const className = field.textFieldProps?.className || "";

  const handleSelectionChange = (optionValue: any) => {
    if (!controllerField?.onChange) return;

    if (isMultiple) {
      if (!currentValues.includes(optionValue)) {
        controllerField.onChange([...currentValues, optionValue]);
      }
    } else {
      controllerField.onChange(optionValue);
    }
  };

  const removeItem = (item: string) => {
    if (!controllerField?.onChange) return;
    controllerField.onChange(currentValues.filter((value) => value !== item));
  };

  const handleResetFields = () => {
    if (field.resetFields) {
      resetValues?.(field.resetFields);
    }
  };
  const dependsOnTooltipText = dependsOn
    ? getDependsOnTooltipText(dependsOn)
    : undefined;

  return (
    <FormControl
      fullWidth
      error={!!error}
      className={`${field.textFieldProps?.label ? "mt-2" : ""}`}
    >
      <FieldLabel field={field} />

      {isMultiple && (
        <MultiSelectTags
          field={field}
          selectedValues={controllerField?.value}
          onRemoveItem={removeItem}
        />
      )}

      <Tooltip title={dependsOnTooltipText} placement="bottom" arrow>
        <div>
          <SelectDropdown
            field={field}
            controllerField={controllerField}
            options={options}
            isMultiple={isMultiple}
            dependsOn={dependsOn}
            className={className}
            placeholder={placeholder}
            onSelectionChange={handleSelectionChange}
            onResetFields={handleResetFields}
          />
        </div>
      </Tooltip>

      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default SearchableSelectField;
