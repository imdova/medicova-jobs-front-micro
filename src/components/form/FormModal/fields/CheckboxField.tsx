import React from "react";
import { Switch, FormControlLabel } from "@mui/material";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FieldConfig } from "@/types";

interface CheckboxFieldProps {
  field: any;
  controllerField: Partial<ControllerRenderProps<FieldValues, string>>;
  onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetValues?: (fieldNames: string[]) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  controllerField,
  onCheckboxChange,
  resetValues,
}) => (
  <FormControlLabel
    control={
      <Switch
        {...controllerField}
        checked={!!controllerField.value}
        onChange={(e) => {
          controllerField.onChange?.(e);
          onCheckboxChange?.(e);
          if (field.resetFields && resetValues) {
            resetValues(field.resetFields);
          }
        }}
        sx={{
          "& .MuiSwitch-thumb": { width: 20, height: 20 }, // optional customization
        }}
      />
    }
    label={field.label || ""}
  />
);
