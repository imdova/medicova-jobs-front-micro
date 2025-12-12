import { useDrag } from "react-dnd";
import { useRef } from "react";
import { FieldConfig, FieldType } from "@/types";
import {
  DeleteOutline,
  DragIndicator,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { Collapse } from "@mui/material";
import React, { useState } from "react";
import FormModal from "@/components/form/FormModal/FormModal";
import { BasicWrapper } from "../form/FormModal/formWraper";

const fields: FieldConfig[] = [
  {
    name: "name",
    label: "Field Name",
    type: "text",
    required: true,
    rules: {
      pattern: {
        value: /^[a-zA-Z0-9_]+$/,
        message:
          "Field Name must contain only letters, numbers, and underscores",
      },
    },
  },
  {
    name: "label",
    label: "Field Label",
    type: "text",
  },
  {
    name: "type",
    label: "Field Type",
    type: "select",
    options: [
      { label: "Text", value: "text" },
      { label: "Text Area", value: "textArea" },
      { label: "Number", value: "number" },
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone" },
      { label: "Password", value: "password" },
      { label: "Date", value: "date" },
      { label: "Text Editor", value: "textEditor" },
      { label: "Select", value: "select" },
      { label: "Search Select", value: "search-select" },
      { label: "Checkbox", value: "checkbox" },
      { label: "Component", value: "component" },
      { label: "Radio", value: "radio" },
      { label: "File", value: "file" },
      { label: "OTP", value: "otp" },
    ],
    required: true,
  },
  {
    name: "required",
    label: "Required Field",
    type: "checkbox",
  },
];

const FieldEditor = ({
  field,
  updateField,
  onDelete,
  path,
}: {
  field: FieldConfig;
  updateField: (field: FieldConfig, data: Partial<FieldConfig>) => void;
  onDelete: () => void;
  path: string;
}) => {
  const dragRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;
  const previewRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;

  const [{ isDragging }, drag, preview] = useDrag({
    type: field.type as FieldType,
    item: {
      type: field.type,
      id: field.id,
      path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  drag(dragRef);
  preview(previewRef);

  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <SectionCollapse
      key={field.id}
      onDelete={onDelete}
      title={
        <div
          ref={previewRef}
          style={{ opacity }}
          className="flex flex-row items-center gap-2"
        >
          <div className="flex flex-row items-center gap-2">
            <div ref={dragRef} className="rounded-base p-1" tabIndex={-1}>
              <DragIndicator className="h-4 w-4 cursor-move" />
            </div>
            {field.label || field.name}
          </div>
          <span className="text-sm text-gray-500">({field.type})</span>
        </div>
      }
    >
      <FormModal
        open={true}
        onSubmit={handleSubmit}
        enableResetButton={true}
        fields={fields}
        dialog={BasicWrapper}
        initialValues={field}
      />
    </SectionCollapse>
  );
};

export default FieldEditor;

const SectionCollapse = ({
  title,
  icon,
  children,
  defaultValue = false,
  onDelete,
}: {
  title: React.ReactNode;
  defaultValue?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultValue);
  const toggle = () => setIsExpanded((pv) => !pv);

  return (
    <div
      className={`group -my-1 min-h-[40px] rounded-base border border-gray-300 bg-gray-100 transition-all duration-300 ease-in-out`}
    >
      <div className="flex min-h-[40px] w-full flex-row items-center justify-between gap-2">
        <div
          onClick={toggle}
          className="flex w-full cursor-pointer flex-row items-center justify-between gap-4 px-2 text-left normal-case"
        >
          <div className="flex flex-row items-center gap-2">
            {icon && icon}
            <span>{title}</span>
          </div>
          <KeyboardArrowDown
            className={`${isExpanded ? "rotate-180" : ""} transition-transform duration-300`}
          />
        </div>
        <div>
          <button
            onClick={onDelete}
            className={
              "h-12 w-0 overflow-hidden rounded-base border-0 text-red-600 transition-all duration-300 ease-in-out hover:border hover:border-red-200 hover:bg-red-200 hover:text-red-600 hover:shadow-xl group-hover:w-12"
            }
          >
            <DeleteOutline className="h-4 w-4" />
          </button>
        </div>
      </div>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </div>
  );
};
