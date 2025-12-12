"use client";

import React from "react";
import { TextField } from "@mui/material";
import { FieldConfig } from "@/types";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";

interface CodeEditorFieldProps {
  field: FieldConfig;
  controllerField?: Partial<ControllerRenderProps<FieldValues, string>>;
  error?: FieldError | null;
}

const CODE_EDITOR_STYLE = {
  placeholder: "Write your code here...",
  sx: {
    "& .MuiOutlinedInput-root": {
      fontFamily: "monospace",
      fontSize: "0.875rem",
      p: 1,
      borderRadius: "10px",
      height: "auto",
    },
  },
  multiline: true,
  minRows: 6,
  maxRows: 20,
};

export const CodeEditorField: React.FC<CodeEditorFieldProps> = ({
  field,
  controllerField,
  error,
}) => {
  const placeholder =
    field.placeholder ||
    field.textFieldProps?.placeholder ||
    `Enter ${field.label || field.name || "code"}`;

  const { className, ...labelProps } =
    field.textFieldProps?.InputLabelProps || {};

  return (
    <div className="mt-2">
      {field.label && (
        <div className="mb-1">
          <label
            htmlFor={String(field.name)}
            className={`font-semibold ${className}`}
            {...labelProps}
          >
            {field.label.replace("*", "")}
            {field.required ? <span className="text-red-500">*</span> : null}
          </label>
        </div>
      )}
      <TextField
        {...controllerField}
        {...CODE_EDITOR_STYLE}
        {...field.textFieldProps}
        placeholder={placeholder}
        fullWidth
        variant="outlined"
        error={!!error}
        helperText={error?.message}
        InputProps={{
          className: "bg-white",
          ...field.textFieldProps?.InputProps,
        }}
      />
    </div>
  );
};
