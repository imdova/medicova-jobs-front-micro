import React, { useEffect } from "react";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";
import { ErrorField, FieldConfig } from "@/types";
import { CheckboxField } from "./CheckboxField";
import { ComponentField } from "./ComponentField";
import { TextFieldComponent } from "./TextFieldComponent";
import { PhoneNumberField } from "./phoneNumberField";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { FileField } from "./FileField";
import DatePickerField from "./DatePickerField";
import { RadioFieldComponent } from "./RadioField";
import { TextEditorField } from "./TextEditorField";
import { getNestedValue } from "@/util/forms";
import { updateData } from "@/util/general";
import OTPInput from "@/components/UI/OTP";
import SelectField from "./SelectField";
import SearchableSelectField from "./SearchableSelectField";
import MultiTextInput from "../../MultiTextInput";
import { UploadAreaField } from "./upload-area-field";
import { ColorPickerField } from "./colorPickerField";
import { CodeEditorField } from "./CodeEditorField";
import { SliderField } from "./sliderField";

interface FormFieldProps {
  field: FieldConfig;
  control?: any;
  fieldController?: Partial<ControllerRenderProps<FieldValues, string>>;
  dependsOnField?: FieldConfig;
  onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formValues?: Record<string, any>;
  resetValues?: (fieldNames: string[]) => void;
  removeField?: (fieldName: string) => void;
  data?: any;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  onChange?: (fieldName: string, value: string) => void;
  errors?: ErrorField[];
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  control,
  onCheckboxChange,
  formValues: initialFormValue,
  resetValues,
  dependsOnField,
  fieldController,
  removeField,
  data,
  setData,
  onChange,
  errors,
}) => {
  const formValues = initialFormValue || data;
  const renderField = ({
    field: controllerField,
    fieldState,
  }: {
    field: Partial<ControllerRenderProps<FieldValues, string>>;
    fieldState?: ControllerFieldState;
  }): React.ReactElement => {
    const dataError =
      errors && errors.length > 0
        ? (errors.find((x) => x.field === field.name) as unknown as FieldError)
        : null;
    const error = fieldState?.error || dataError || null;
    const handleChange = (e: any) => {
      if (field.onChange) {
        field.onChange(e);
      }
      if (controllerField.onChange) {
        controllerField.onChange(e);
      }
      if (onChange) {
        let value;
        if (e?.target?.type === "checkbox") {
          value = e.target.checked;
        } else if (e?.target) {
          value = e.target.value;
        } else {
          value = e; // fallback for other types (custom components, etc.)
        }
        onChange(field.name as string, value);
      }
      if (setData) {
        let value;
        if (e?.target?.type === "checkbox") {
          value = e.target.checked;
        } else if (e?.target) {
          value = e.target.value;
        } else {
          value = e; // fallback for other types (custom components, etc.)
        }
        setData(updateData(data, field.name as string, value));
      }
    };
    const newControllerField = { ...controllerField, onChange: handleChange };
    switch (field.type) {
      case "checkbox":
        return (
          <CheckboxField
            field={field}
            controllerField={newControllerField}
            resetValues={resetValues}
            onCheckboxChange={onCheckboxChange}
          />
        );
      case "select":
        return (
          <SelectField
            field={field}
            controllerField={newControllerField}
            error={error}
            formValues={formValues}
            resetValues={resetValues}
            dependsOnField={dependsOnField}
          />
        );
      case "search-select":
        return (
          <SearchableSelectField
            field={field}
            controllerField={newControllerField}
            error={error}
            resetValues={resetValues}
            formValues={formValues}
            dependsOnField={dependsOnField}
          />
        );
      case "component":
        if (field.component) {
          return (
            <ComponentField
              field={field}
              controllerField={newControllerField}
              error={error}
            />
          );
        }
        break;
      case "file":
        return (
          <FileField
            field={field}
            controllerField={newControllerField}
            error={error}
          />
        );
      case "textEditor":
        return (
          <TextEditorField
            field={field}
            controllerField={newControllerField}
            error={error}
          />
        );
      case "phone":
        return (
          <PhoneNumberField
            field={field}
            controllerField={newControllerField}
            error={error}
          />
        );
      case "date":
        return (
          <DatePickerField
            field={field}
            controllerField={newControllerField}
            error={error}
          />
        );
      case "radio":
        return (
          <RadioFieldComponent
            field={field}
            controllerField={newControllerField}
            error={error}
          />
        );
      case "otp":
        return (
          <OTPInput
            field={field}
            length={6}
            onChange={controllerField.onChange}
            error={error}
          />
        );
      case "multi-text":
        return (
          <MultiTextInput field={field} error={error} {...newControllerField} />
        );
      case "upload-area":
        return (
          <UploadAreaField
            field={field}
            controllerField={newControllerField}
            error={error}
          />
        );
      case "color":
        return (
          <ColorPickerField
            field={field}
            controllerField={newControllerField}
            error={error}
          />
        );
      case "code":
        return (
          <CodeEditorField
            field={field}
            controllerField={newControllerField}
            error={error}
          />
        );
      case "slider":
        return (
          <SliderField
            field={field}
            controllerField={newControllerField}
            error={error}
          />
        );
      default:
        return (
          <TextFieldComponent
            field={field}
            controllerField={newControllerField}
            error={error}
          />
        );
    }
    // Fallback case to ensure we always return an element
    return (
      <TextFieldComponent
        field={field}
        controllerField={newControllerField}
        error={error}
      />
    );
  };
  useEffect(() => {
    if (
      !control &&
      !fieldController &&
      !(data && Boolean(setData || onChange))
    ) {
      console.error(
        `❌ Field "${field?.name}" not rendered. Reason: ` +
          (!data
            ? "data is missing"
            : !setData && !onChange
              ? "setData or onChange are missing"
              : !fieldController
                ? "fieldController is missing"
                : !control
                  ? "control is missing"
                  : "unknown"),
      );
    }
  }, [control, fieldController, data, setData, onChange, field]);

  return (
    <div className="flex items-end gap-2">
      {control ? (
        <div className="max-w-full flex-1">
          <Controller
            name={String(field.name)}
            control={control}
            rules={{
              required: field.required
                ? `${field.label?.replace("*", "") || String(field.name)} is required`
                : false,
              ...field.rules,
            }}
            render={renderField}
          />
        </div>
      ) : fieldController ? (
        <div className="max-w-full flex-1">
          {renderField({ field: fieldController })}
        </div>
      ) : (
        data &&
        Boolean(setData || onChange) && (
          <div className="max-w-full flex-1">
            {renderField({
              field: {
                value: getNestedValue(data, field.name as string),
                name: field.name as string,
              },
            })}
          </div>
        )
      )}
      {removeField && (
        <IconButton
          onClick={() => {
            resetValues?.([field.name]);
            removeField(field.name);
          }}
          className="h-[42px] w-[42px] rounded-base border border-solid border-gray-300 p-2 hover:bg-red-100 hover:text-red-500"
        >
          <Delete />
        </IconButton>
      )}
    </div>
  );
};
