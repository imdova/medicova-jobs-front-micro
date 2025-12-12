import React from "react";
import { FormField } from "./fields/FormField";
import { ErrorField, FieldConfig } from "@/types";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface FormGridItemProps {
  field: FieldConfig;
  fields: FieldConfig[];
  hiddenFields?: string[];
  control: any;
  removeField?: (fieldName: string) => void;
  onChange?: (fieldName: string, value: string) => void;
  onCheckboxChange?: (field: any) => (event: any) => void;
  getValues?: () => any;
  resetValues?: (fieldNames: string[]) => void;
  fieldController?: Partial<ControllerRenderProps<FieldValues, string>>;
  data?: any;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  errors?: ErrorField[];
}

export const FormGridItem: React.FC<FormGridItemProps> = ({
  field,
  fields,
  hiddenFields,
  control,
  onCheckboxChange,
  onChange,
  removeField,
  getValues,
  resetValues,
  data,
  errors,
  fieldController,
  setData,
}) => {
  const gridProps = field.gridProps ?? {};
  const xs = gridProps.xs ?? 12;
  const sm = gridProps.sm ?? xs;
  const md = gridProps.md ?? sm;
  const rowXs = gridProps.rowXs ?? 1;
  const rowSm = gridProps.rowSm ?? rowXs;
  const rowMd = gridProps.rowMd ?? rowSm;

  const classNames = [
    `col-span-${xs}`,
    sm !== xs ? `sm:col-span-${sm}` : "",
    md !== sm ? `md:col-span-${md}` : "",
    `row-span-${rowXs}`,
    rowSm !== rowXs ? `sm:row-span-${rowSm}` : "",
    rowMd !== rowSm ? `md:row-span-${rowMd}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const hidden = hiddenFields?.includes(String(field.name));
  if (hidden) return null;

  return (
    <div className={classNames}>
      <FormField
        field={field}
        control={control}
        onCheckboxChange={
          onCheckboxChange ? onCheckboxChange(field) : undefined
        }
        dependsOnField={fields.find((f) => f.name === field.dependsOn)}
        onChange={onChange}
        removeField={removeField}
        formValues={getValues ? getValues() : undefined}
        resetValues={resetValues}
        data={data}
        errors={errors}
        fieldController={fieldController}
        setData={setData}
      />
    </div>
  );
};
