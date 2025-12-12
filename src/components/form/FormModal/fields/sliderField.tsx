import React from "react";
import { FormControl, FormHelperText, Slider, TextField } from "@mui/material";
import { FieldConfig } from "@/types";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";

interface TextFieldProps {
  field: FieldConfig;
  controllerField?: Partial<ControllerRenderProps<FieldValues, string>>;
  error?: FieldError | null;
}

export const SliderField: React.FC<TextFieldProps> = ({
  field,
  controllerField,
  error,
}) => {
//   const placeholder =
//     "Enter " +
//     (field.textFieldProps?.label
//       ? String(field.textFieldProps?.label).replace("*", "")
//       : field.label
//         ? field.label?.replace("*", "")
//         : field.name);

  const { className, ...labelProps } =
    field.textFieldProps?.InputLabelProps || {};
  return (
    <div className={field.textFieldProps?.label ? "mt-2" : ""}>
      <FormControl fullWidth error={!!error}>
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
        <Slider {...controllerField} {...field.textFieldProps} />
        {error?.message && <FormHelperText>{error?.message}</FormHelperText>}
      </FormControl>
    </div>
  );
};
