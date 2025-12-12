import { ErrorField, FieldConfig } from "@/types";
import React from "react";
import { FormGridItem } from "./FormGridItem";
import { cn } from "@/util";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface FormGridProps {
  fields: FieldConfig[];
  control?: any;
  onCheckboxChange?: (field: any) => (event: any) => void;
  resetValues?: (fieldNames: string[]) => void;
  removeField?: (fieldName: string) => void;
  onChange?: (fieldName: string, value: string) => void;
  hiddenFields?: string[];
  getValues?: () => any;
  fieldController?: Partial<ControllerRenderProps<FieldValues, string>>;
  data?: any;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  errors?: ErrorField[];
  className?: string;
}

/**
 * FormGrid Component
 *
 * Renders a 12-column responsive grid of form fields using configurations provided via `fields`.
 * Integrates deeply with React Hook Form (RHF) to manage field control, validation, and dynamic rendering logic.
 *
 * Useful for building structured and dynamic forms — including multi-step or conditionally displayed fields.
 *
 * @component
 *
 * @param {Object} props - Props passed to FormGrid
 *
 * @param {FieldConfig[]} props.fields
 *   An array of objects describing each field’s configuration.
 *   Each field must at least have a `name`, `type`, and `label`.
 *   Additional logic like `visibleWhen`, `options`, etc. can also be defined.
 *
 * @param {any} [props.control]
 *   React Hook Form's `control` object. Required for controlled components
 *   such as `Controller`, custom components, or conditional logic.
 *   Provided by `useForm()`.
 *
 * @param {(field: any) => (event: any) => void} [props.onCheckboxChange]
 *   Callback for checkbox input updates. Useful for toggling values in nested or dependent form sections.
 *   Example usage:
 *   ```tsx
 *   onCheckboxChange={(field) => (e) => {
 *     setValue(field.name, e.target.checked);
 *   }}
 *   ```
 *
 * @param {(fieldNames: string[]) => void} [props.resetValues]
 *   Function to reset an array of field values to their default or empty states.
 *   Typically used when conditional inputs are cleared.
 *   Example:
 *   ```tsx
 *   resetValues(["jobTitle", "location"]);
 *   ```
 *
 * @param {(fieldName: string) => void} [props.removeField]
 *   Removes a field from the form entirely.
 *   Use this when dynamically rendering/removing fields based on user input or conditions.
 *   Example:
 *   ```tsx
 *   removeField("companyName");
 *   ```
 *
 * @param {(fieldName: string, value: string) => void} [props.onChange]
 *   General handler called whenever any field's value changes.
 *   Useful for syncing external state or triggering field-dependent logic.
 *   - `fieldName`: the name of the field being changed
 *   - `value`: the new value to be applied
 *
 *   Example:
 *   ```tsx
 *   onChange={(fieldName, value) => {
 *     console.log(`${fieldName} changed to ${value}`);
 *   }}
 *   ```
 *
 * @param {string[]} [props.hiddenFields]
 *   Array of field names that should be hidden from the grid.
 *   Commonly used with conditional rendering logic.
 *   Example: `["companyName", "address"]`
 *
 * @param {() => any} [props.getValues]
 *   Function to retrieve the current state of form values.
 *   Provided by RHF’s `useForm()` — useful to fetch the current form snapshot.
 *   Example:
 *   ```tsx
 *   const values = getValues();
 *   console.log(values.jobTitle);
 *   ```
 *
 * @param {boolean} [props.dialog=false]
 *   Whether the form is being rendered inside a modal/dialog. Affects padding.
 *   - `true`: remove internal padding
 *   - `false`: apply padding to grid
 *
 * @param {Partial<ControllerRenderProps<FieldValues, string>>} [props.fieldController]
 *   Optional override for individual field controller behavior (e.g. `onBlur`, `ref`, etc.).
 *   Passed down to each `FormGridItem` if needed.
 *
 * @param {any} [props.data]
 *   Arbitrary additional data you want to pass down to each `FormGridItem`.
 *   Example: active tab index, dynamic lookup lists, user permissions, etc.
 *
 * @param {React.Dispatch<React.SetStateAction<any>>} [props.setData]
 *   State setter for the above `data`. Useful for updating dynamic field logic from inside each field.
 *   Example:
 *   ```tsx
 *   setData((prev) => ({ ...prev, selectedRegion: "Europe" }));
 *   ```
 *
 * @param {ErrorField[]} [props.errors]
 *   List of field-specific error objects for validation display.
 *   Typically generated via `formState.errors` in React Hook Form.
 *   Used internally by `FormGridItem` to show messages.
 *
 * @param {string} [props.className]
 *   Optional class name for additional styling of the grid container.
 *   Appended to default classes: `"mt-1 grid grid-cols-12 gap-4"`
 *
 * @returns {JSX.Element}
 *   A fully rendered form grid of fields with logic injected via props and configuration.
 */

export const FormGrid: React.FC<FormGridProps> = ({
  fields, // Array of field configurations to be rendered
  control, // RHF control object for managing form state
  hiddenFields, // Array of field names to hide
  onCheckboxChange, // Callback for checkbox input changes
  onChange, // Generic callback for input changes
  removeField, // Callback to remove field from UI/form
  getValues, // Function to retrieve current form values
  resetValues, // Function to reset specific fields
  data, // Optional additional data passed to FormGridItem
  errors, // Array of form field errors
  fieldController, // Optional RHF field controller overrides
  setData, // Function to update the extra data state
  className, // Optional custom class for styling
}) => {
  // col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7 col-span-8 col-span-9 col-span-10 col-span-11 col-span-12
  // sm:col-span-1 sm:col-span-2 sm:col-span-3 sm:col-span-4 sm:col-span-5 sm:col-span-6 sm:col-span-7 sm:col-span-8 sm:col-span-9 sm:col-span-10 sm:col-span-11 sm:col-span-12
  // md:col-span-1 md:col-span-2 sm:col-span-3 sm:col-span-4 sm:col-span-5 sm:col-span-6 sm:col-span-7 sm:col-span-8 sm:col-span-9 sm:col-span-10 sm:col-span-11 sm:col-span-12
  // row-span-1 row-span-2 row-span-3 row-span-4 row-span-5 row-span-6 row-span-7 row-span-8 row-span-9 row-span-10 row-span-11 row-span-12
  // sm:row-span-1 sm:row-span-2 sm:row-span-3 sm:row-span-4 sm:row-span-5 sm:row-span-6 sm:row-span-7 sm:row-span-8 sm:row-span-9 sm:row-span-10 sm:row-span-11 sm:row-span-12
  // md:row-span-1 md:row-span-2 md:row-span-3 md:row-span-4 md:row-span-5 md:row-span-6 md:row-span-7 md:row-span-8 md:row-span-9 md:row-span-10 md:row-span-11 md:row-span-12

  if (fields.length === 0) return null;
  return (
    <div className={cn("mt-1 grid grid-cols-12 gap-4 p-4", className)}>
      {fields.map((field) => (
        <FormGridItem
          key={String(field.name)}
          field={field}
          fields={fields}
          hiddenFields={hiddenFields}
          control={control}
          onCheckboxChange={onCheckboxChange}
          onChange={onChange}
          removeField={removeField}
          getValues={getValues}
          resetValues={resetValues}
          data={data}
          errors={errors}
          fieldController={fieldController}
          setData={setData}
        />
      ))}
    </div>
  );
};
