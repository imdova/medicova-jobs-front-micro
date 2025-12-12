import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import { FieldConfig } from "@/types";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";

interface RadioFieldProps {
  field: FieldConfig;
  controllerField?: Partial<ControllerRenderProps<FieldValues, string>>;
  error?: FieldError | null;
}

export const RadioFieldComponent: React.FC<RadioFieldProps> = ({
  field,
  controllerField,
  error,
}) => {
  const options = field.options || [];
  const isMultiple = field.multiple === true; // Read multiple from field config

  const { className, ...labelProps } =
    field.textFieldProps?.InputLabelProps || {};

  // Handle selection for multiple mode
  const handleSelectionChange = (optionValue: any) => {
    if (!controllerField?.onChange) return;

    if (isMultiple) {
      // If in multiple mode, handle array of values
      const currentValues = Array.isArray(controllerField.value)
        ? controllerField.value
        : controllerField.value
          ? [controllerField.value]
          : [];

      // Toggle selection: add if not present, remove if present
      if (currentValues.includes(optionValue)) {
        controllerField.onChange(
          currentValues.filter((value) => value !== optionValue),
        );
      } else {
        controllerField.onChange([...currentValues, optionValue]);
      }
    } else {
      // Single selection mode (original behavior)
      controllerField.onChange(optionValue);
    }
  };

  // Check if an option is selected
  const isSelected = (optionValue: string) => {
    if (controllerField?.value === undefined || controllerField?.value === null)
      return false;

    if (isMultiple) {
      // For multiple mode, check if value is in the array
      const values = Array.isArray(controllerField.value)
        ? controllerField.value
        : [controllerField.value];
      return values.includes(optionValue);
    }

    // For single mode, compare directly
    // Handle boolean comparison properly
    if (String(optionValue) === "true" || String(optionValue) === "false") {
      return String(optionValue) === String(controllerField.value);
    }
    return optionValue === controllerField.value;
  };

  return (
    <FormControl component="fieldset" error={Boolean(error)} fullWidth>
      <div className="mb-1">
        <label
          htmlFor={String(field.name)}
          className={`font-semibold ${className}`}
          {...labelProps}
        >
          {field.label}
        </label>
      </div>

      <RadioGroup
        {...controllerField}
        value={controllerField?.value || ""}
        onChange={(e) => handleSelectionChange(e.target.value)}
        sx={{
          display: "flex",
          flexWrap: { xs: "wrap" },
          px: 1,
          gap: 1,
          flexDirection: "row",
        }}
      >
        {options?.map((option) => (
          <FormControlLabel
            key={option?.value}
            value={option?.value}
            name={controllerField?.name}
            control={<Radio style={{ display: "none" }} />}
            label={
              option.icon ? (
                <div className="flex-center gap-2">
                  {option.icon}
                  {option.label}
                </div>
              ) : (
                option?.label
              )
            }
            className={`h-[42px] cursor-pointer rounded-base border border-input-border px-3 font-normal focus:outline-offset-2 focus:outline-secondary ${
              isSelected(option?.value)
                ? "border-primary bg-primary/10 text-primary"
                : "text-neutral-500 hover:border-black hover:text-muted-foreground"
            }`}
          />
        ))}
      </RadioGroup>

      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};
