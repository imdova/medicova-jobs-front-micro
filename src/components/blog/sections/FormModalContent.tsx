import {
  Block,
  DraggedBlock,
  DropZoneData,
  FormFieldConfig,
  FormItem,
} from "@/types/blog";
import { Copy, GripVertical, Plus, X } from "lucide-react";
import { Selector } from "../Selector";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  Button,
  Collapse,
  IconButton,
  Switch,
  TextareaAutosize,
} from "@mui/material";
import { FieldType, Option } from "@/types";
import { useDrag } from "react-dnd";
import DropZone from "../dropzone";
import { cn, generateId } from "@/util";
import DropDown from "@/components/form/FormModal/fields/dropDown";
import { useBlogStore } from "@/lib/blog/blog-store";

const FIELDS_TYPES: Option[] = [
  { value: "text", label: "Text" },
  { value: "textArea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "password", label: "Password" },
  { value: "date", label: "Date" },
  { value: "textEditor", label: "Text Editor" },
  { value: "select", label: "Select" },
  { value: "search-select", label: "Search Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
  { value: "multi-text", label: "Multi Text" },
  { value: "upload-area", label: "Upload Area" },
];

const ACCEPTS = ["field"];

const FormModalContentEditor: React.FC = () => {
  const { getActiveForm, updateForm } = useBlogStore();
  const form = getActiveForm();

  const [activeField, setActiveField] = useState<string | null>(null);
  const [error, setError] = useState<{ name?: string; message?: string }>({});
  const fieldChange = (field: FormFieldConfig) => {
    updateForm({
      ...form,
      fields: form?.fields?.map((f) => (f.id === field.id ? field : f)),
    });
  };
  const formDataChange = (formData: Partial<FormItem>) => {
    updateForm({
      ...form,
      ...formData,
    });
  };

  const handleDrop = (dropZone: DropZoneData, draggableBlock: DraggedBlock) => {
    const updatedFields =
      rearrangeList(
        form?.fields || [],
        Number(draggableBlock.path),
        Number(dropZone.path),
      ) || [];
    updateForm({
      ...form,
      fields: updatedFields,
    });
  };

  const handleDelete = (fieldId: string) => {
    updateForm({
      ...form,
      fields: form?.fields?.filter((f) => f.id !== fieldId),
    });
  };

  const handleDuplicate = (fieldId: string) => {
    const field = form?.fields?.find((f) => f.id === fieldId);
    if (!field) return;
    const id = generateId();
    updateForm({
      ...form,
      fields: [
        ...(form?.fields || []),
        {
          ...field,
          name: uniqueName(form?.fields?.map((f) => f.name) || [], field.name),
          id,
        },
      ],
    });
    setActiveField(id);
  };

  const [isShake, setIsShake] = useState<string | null>(null);

  function shake(name: string) {
    setIsShake(name);
    setTimeout(() => {
      setIsShake(null);
    }, 500);
  }

  if (!form) {
    return null;
  }
  return (
    <div>
      <h4 className="text-center text-xs mb-2 text-muted-foreground">Form Editor Editor</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Name<span className="text-red-500">*</span>
          </p>
          <input
            name="Name"
            type="text"
            value={form.name}
            onChange={(e) => formDataChange({ name: e.target.value })}
            placeholder="Name of form"
            className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Title <span className="text-xs text-gray-400">(Optional)</span>{" "}
          </p>
          <input
            name="Title"
            type="text"
            value={form.title}
            onChange={(e) => formDataChange({ title: e.target.value })}
            placeholder="Title of form"
            className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
          />
        </div>
        <label className="text-sm text-muted-foreground">
          {" "}
          Description{" "}
          <span className="text-xs text-gray-400">(Optional)</span>{" "}
        </label>

        <TextareaAutosize
          name="Description"
          value={form.description}
          onChange={(e) => formDataChange({ description: e.target.value })}
          placeholder="Description of form"
          minRows={2}
          className="min-h-[33px] w-full rounded-[4px] border p-2 text-sm focus:outline-none"
        />
        {/* <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Hide Label</p>
          <Switch
            checked={block?.formData?.hideLabel}
            onChange={handleHideLabelChange}
            sx={{
              "& .MuiSwitch-thumb": { width: 20, height: 20 }, // optional customization
            }}
          />
        </div> */}
      </div>

      <h4 className="mt-10 mb-2 text-center text-xs text-muted-foreground">Fields</h4>

      {form?.fields?.map((field, index) => (
        <React.Fragment key={field.id}>
          <DropZone
            data={{
              path: `${index}`,
            }}
            accepts={ACCEPTS}
            onDrop={handleDrop}
            className="min-h-2"
          />
          <FieldForm
            key={field.id}
            activeField={activeField}
            field={field}
            fields={form?.fields || []}
            setActiveField={setActiveField}
            onChange={fieldChange}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            path={String(index)}
            error={error}
            // setError={setError}
            shake={shake}
            isShake={isShake}
          />
        </React.Fragment>
      ))}
      <DropZone
        data={{
          path: `${form?.fields?.length}`,
        }}
        accepts={ACCEPTS}
        onDrop={handleDrop}
        className="min-h-2"
      />

      <h4 className="mb-2 mt-10 text-center text-xs text-muted-foreground">Buttons</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Submit Button Text</p>
          <input
            name="submitButtonText"
            type="text"
            value={form?.submitButtonText}
            onChange={(e) =>
              formDataChange({ submitButtonText: e.target.value })
            }
            placeholder="e.g. Submit, Save, Send"
            className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Cancel Button Text</p>
          <input
            name="cancelButtonText"
            type="text"
            value={form?.cancelButtonText}
            onChange={(e) =>
              formDataChange({ cancelButtonText: e.target.value })
            }
            placeholder="e.g. Cancel, Close, Reset"
            className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
          />
        </div>
      </div>

      <h4 className="mb-2 mt-10 text-center text-xs text-muted-foreground">
        Functions
      </h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">API Endpoint</p>
          <input
            name="apiEndpoint"
            type="text"
            value={form?.apiEndpoint}
            onChange={(e) => formDataChange({ apiEndpoint: e.target.value })}
            placeholder="API Endpoint"
            className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">HTTP Method</p>

          <DropDown
            options={[
              { value: "POST", label: "POST" },
              { value: "PUT", label: "PUT" },
              { value: "PATCH", label: "PATCH" },
              { value: "GET", label: "GET" },
            ]}
            onChange={(option) =>
              formDataChange({
                method: option.value as "POST" | "PUT" | "PATCH" | "GET",
              })
            }
            className="flex h-[33px] w-1/2 items-center justify-between gap-2 rounded-[4px] border px-2"
          >
            <span
              className={`line-clamp-1 w-full text-left text-xs ${form?.method ? "text-main" : "text-muted-foreground"}`}
            >
              {form?.method || "POST"}
            </span>
          </DropDown>
        </div>

        {/* <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">After Submit</p>
          <input
            name="afterSubmit"
            type="text"
            value={form?.afterSubmit}
            onChange={(e) => formDataChange({ afterSubmit: e.target.value })}
            placeholder="e.g. reset, close, none"
            className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
          />
        </div> */}

        {/* <label className="text-sm text-muted-foreground">After Submit Message</label>
        <TextareaAutosize
          name="afterSubmitMessage"
          value={form?.afterSubmitMessage}
          onChange={(e) =>
            formDataChange({ afterSubmitMessage: e.target.value })
          }
          placeholder="Shown after submit (regardless of success)"
          minRows={2}
          className="min-h-[33px] w-full rounded-[4px] border p-2 text-sm focus:outline-none"
        /> */}
      </div>
      <h4 className="mb-2 mt-10 text-center text-xs text-muted-foreground">
        Response Handling
      </h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">On Success Redirect</p>
          <input
            name="onSuccessRedirect"
            type="text"
            value={form?.onSuccessRedirect}
            onChange={(e) =>
              formDataChange({ onSuccessRedirect: e.target.value })
            }
            placeholder="URL to redirect"
            className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">On Success Message</p>
          <input
            name="onSuccessMessage"
            type="text"
            value={form?.onSuccessMessage}
            onChange={(e) =>
              formDataChange({ onSuccessMessage: e.target.value })
            }
            placeholder="Toast or message"
            className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">On Error Redirect</p>
          <input
            name="onErrorRedirect"
            type="text"
            value={form?.onErrorRedirect}
            onChange={(e) =>
              formDataChange({ onErrorRedirect: e.target.value })
            }
            placeholder="URL to redirect"
            className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
          />
        </div>

        <label className="text-sm text-muted-foreground">On Error Message</label>
        <TextareaAutosize
          name="onErrorMessage"
          value={form?.onErrorMessage}
          minRows={2}
          onChange={(e) => formDataChange({ onErrorMessage: e.target.value })}
          placeholder="Toast or message"
          className="min-h-[33px] w-full rounded-[4px] border p-2 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
};

const FieldForm = ({
  activeField,
  setActiveField,
  field,
  fields,
  onChange,
  onDelete,
  onDuplicate,
  path,
  error,
  shake,
  isShake,
}: {
  activeField: string | null;
  setActiveField: (field: string | null) => void;
  field: FormFieldConfig;
  fields: FormFieldConfig[];
  onChange: (field: FormFieldConfig) => void;
  onDelete: (fieldId: string) => void;
  onDuplicate: (fieldId: string) => void;
  path: string;
  error: { name?: string; message?: string };
  shake: (name: string) => void;
  isShake: string | null;
}) => {
  const [inputError, setInputError] = useState("");
  const [hideLabel, setHideLabel] = useState(!field?.label);
  const dragRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;
  const previewRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;

  const [{ isDragging }, drag, preview] = useDrag({
    type: "field",
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDuplicated = fields?.find((f) => f.name === e.target.value);
    if (isDuplicated) {
      setInputError("You cant duplicate field name");
      shake(isDuplicated.id);
    } else {
      setInputError("");
    }
    onChange({ ...field, name: e.target.value });
  };

  const handleHideLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hideLabel = e.target.checked;
    onChange({
      ...field,
      label: hideLabel ? "" : field.label || field.textFieldProps?.label || "",
      textFieldProps: {
        ...field.textFieldProps,
        label: hideLabel
          ? field.label || field.textFieldProps?.label || ""
          : "",
      },
    });
    setHideLabel(hideLabel);
  };

  return (
    <div
      ref={previewRef}
      style={{ opacity }}
      className={cn(
        "rounded-[4px] border border-gray-200",
        isShake === field.id ? "animate-shake border border-red-400" : "",
      )}
    >
      <div className={`${activeField === field.id ? "border-b" : ""} flex`}>
        <div
          ref={dragRef}
          tabIndex={-1}
          className="cursor-grabbing rounded-none border-r border-solid border-gray-200 p-3"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <Button
          className={
            "flex-1 justify-start rounded-none p-2 text-sm normal-case text-muted-foreground"
          }
          onClick={() =>
            setActiveField(activeField === field.id ? null : field.id)
          }
        >
          {field.name} <span className="text-xs">({field.type})</span>
        </Button>
        <IconButton
          onClick={() => onDuplicate(field.id || "")}
          className="rounded-none border-l border-solid border-gray-200 p-3"
        >
          <Copy className="h-4 w-4" />
        </IconButton>
        <IconButton
          onClick={() => onDelete(field.id || "")}
          className="rounded-none border-l border-solid border-gray-200 p-3"
        >
          <X className="h-4 w-4" />
        </IconButton>
      </div>
      <Collapse in={activeField === field.id}>
        <div className="space-y-2 p-2">
          <div>
            <div className="flex items-center justify-between">
              <p
                className={cn(
                  "text-sm text-muted-foreground",
                  error.name === "name" || inputError ? "text-red-400" : "",
                )}
              >
                Name
              </p>
              <input
                name="Name"
                type="text"
                placeholder="Name of field"
                value={field.name}
                onChange={handleNameChange}
                className={cn(
                  "h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none",
                  error.name === "name" || inputError
                    ? "border border-red-500"
                    : "border-gray-200",
                )}
              />
            </div>
            {error.name === "name" && (
              <p className="text-xs font-thin text-red-500">{error.message}</p>
            )}
            {inputError && (
              <p className="text-xs font-thin text-red-500">{inputError}</p>
            )}
          </div>
          <Selector
            label="Field Type"
            value={field.type}
            placeholder="Select Field Type"
            onChange={(value) =>
              onChange({ ...field, type: value as FieldType })
            }
            options={FIELDS_TYPES}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Hide Label</p>
            <Switch
              checked={hideLabel}
              onChange={handleHideLabelChange}
              sx={{
                "& .MuiSwitch-thumb": { width: 20, height: 20 }, // optional customization
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Label</p>
            <input
              name="Label"
              type="text"
              placeholder="Label of field"
              value={
                hideLabel
                  ? field.textFieldProps?.label || ""
                  : field.label || ""
              }
              onChange={(e) => {
                const label = e.target.value;
                if (hideLabel) {
                  onChange({
                    ...field,
                    label: "",
                    textFieldProps: { ...field.textFieldProps, label },
                  });
                } else {
                  onChange({ ...field, label });
                }
              }}
              className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Placeholder</p>
            <input
              name="Placeholder"
              type="text"
              placeholder="Placeholder of field"
              value={field.placeholder}
              onChange={(e) =>
                onChange({ ...field, placeholder: e.target.value })
              }
              className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Required</p>
            <Switch
              checked={field.required}
              onChange={(e) =>
                onChange({ ...field, required: e.target.checked })
              }
              sx={{
                "& .MuiSwitch-thumb": { width: 20, height: 20 }, // optional customization
              }}
            />
          </div>

          {field.type &&
            ["select", "radio", "search-select"].includes(field.type) && (
              <div className="mt-2">
                <p className="my-2 text-sm text-muted-foreground">Options</p>
                <OptionListForm
                  initialOptions={field.options}
                  onChange={(options) => onChange({ ...field, options })}
                />
              </div>
            )}
        </div>
      </Collapse>
    </div>
  );
};

export default FormModalContentEditor;

function rearrangeList<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const newList = [...list];
  if (
    fromIndex < 0 ||
    fromIndex > list.length ||
    toIndex < 0 ||
    toIndex > list.length
  ) {
    throw new Error("Invalid index");
  }
  const [item] = newList.splice(fromIndex, 1);
  newList.splice(toIndex, 0, item);
  return newList;
}

function uniqueName(arr: string[], str: string): string {
  const regex = /(.*?)(?: \((\d+)\))?$/;
  const match = str.match(regex);

  if (!match) return str; // fallback

  const baseName = match[1].trim(); // "new" from "new (1)"
  let counter = match[2] ? parseInt(match[2]) : 0;

  let result = str;

  while (arr.includes(result)) {
    counter++;
    result = `${baseName} (${counter})`;
  }

  return result;
}

interface OptionListFormProps<T extends object> {
  onChange?: (options: Option<T>[]) => void;
  initialOptions?: Option<T>[];
  className?: string;
}

export function OptionListForm<T extends object>({
  onChange,
  initialOptions,
  className = "",
}: OptionListFormProps<T>) {
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [isSame, setIsSame] = useState(true);
  const [options, setOptions] = useState<Option<T>[]>(initialOptions || []);
  const [isShake, setIsShake] = useState<string | null>(null);
  const [error, setError] = useState("");

  function shake(name: string) {
    setIsShake(name);
    setTimeout(() => {
      setIsShake(null);
    }, 500);
  }

  const handleAdd = () => {
    if (!value.trim() || !label.trim()) return;
    const isDuplicated = options?.find((o) => o.value === value);
    if (isDuplicated) {
      setError("You cant duplicate option value");
      return shake(String(isDuplicated?.value));
    } else {
      setError("");
    }

    const newOption = { value: value as keyof T, label };
    const updatedOptions = [...options, newOption];

    setOptions(updatedOptions);
    onChange?.(updatedOptions);

    // Reset inputs
    setIsSame(true);
    setValue("");
    setLabel("");
  };

  const handleRemove = (index: number) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
    onChange?.(updated);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() && label.trim()) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-2 md:flex-row">
        <input
          name="value"
          type="text"
          placeholder="Value (e.g., name)"
          value={value}
          // onChange={handleValueChange}
          onChange={(e) => {
            setError("");
            if (isSame) {
              setLabel(e.target.value);
            }
            setValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
        />
        <input
          name="label"
          type="text"
          placeholder="Label (e.g., name)"
          value={label}
          onChange={(e) => {
            if (isSame) {
              setIsSame(false);
            }
            setLabel(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
        />

        <IconButton
          onClick={handleAdd}
          className="rounded-[4px] border border-solid border-gray-200 p-2"
        >
          <Plus className="h-4 w-4" />
        </IconButton>
      </div>
      {error && <p className="text-xs font-thin text-red-500">{error}</p>}

      <div className="space-y-2">
        {options.map((opt, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between rounded border",
              isShake === String(opt.value)
                ? "animate-shake border border-red-400"
                : "",
            )}
          >
            <span className="px-2 text-xs">
              <strong className="text-xs">Value:</strong> {String(opt.value)} |
              {"   "}
              <strong className="text-xs">Label:</strong> {opt.label}
            </span>
            <div className="flex items-center">
              {/* <IconButton onClick={() => handleRemove(index)}>
                <Edit className="h-4 w-4" />
              </IconButton> */}
              <IconButton onClick={() => handleRemove(index)}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
