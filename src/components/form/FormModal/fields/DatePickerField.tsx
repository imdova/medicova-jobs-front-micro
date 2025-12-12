import { FieldConfig } from "@/types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from "react-hook-form";

interface DatePickerFieldProps {
  field: FieldConfig;
  controllerField?: Partial<ControllerRenderProps<FieldValues, string>>;
  error?: FieldError | null;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  field,
  controllerField,
  error,
}) => {
  const placeholder =
    "Enter " +
    (field.textFieldProps?.label
      ? String(field.textFieldProps?.label).replace("*", "")
      : field.label
        ? field.label?.replace("*", "")
        : field.name);

  const value = controllerField?.value ? dayjs(controllerField.value) : null;

  const handleChange = (date: Dayjs | null) => {
    if (controllerField?.onChange) {
      const syntheticEvent = {
        target: { value: date ? date.toISOString() : "" },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      controllerField.onChange(syntheticEvent);
    }
  };

  return (
    <div
      className={`${field.textFieldProps?.label ? "mt-2" : ""} flex flex-col`}
    >
      {field.label && (
        <label htmlFor={String(field.name)} className="mb-1 font-semibold">
          {field.label?.replace("*", "")}
          {field.required ? <span className="text-red-500">*</span> : null}
        </label>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          {...field.dateFieldProps}
          value={value}
          onChange={handleChange}
          slotProps={{
            textField: {
              fullWidth: true,
              placeholder,
              error: !!error,
              helperText: error?.message || "",
              id: String(field.name),
              ...field.textFieldProps,
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DatePickerField;
