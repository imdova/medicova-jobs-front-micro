import { useState } from "react";
import { ChevronDown, Pipette } from "lucide-react";
import {
  FieldError,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { FieldConfig } from "@/types";
import { Menu } from "@mui/material";
import { getTextColorForBackground } from "@/util/branding";

interface Props {
  field: FieldConfig;
  controllerField?: Partial<ControllerRenderProps<FieldValues, string>>;
  error?: FieldError | null;
}

const presetColors = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#A52A2A",
];

export const ColorPickerField = ({
  field,
  controllerField,
  error,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { className, ...labelProps } =
    field.textFieldProps?.InputLabelProps || {};

  return (
    <div className={field.textFieldProps?.label ? "mt-2" : ""}>
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
      <div
        className={`flex h-[42px] flex-1 cursor-pointer items-center space-x-3`}
        onClick={handleClick}
        onBlur={controllerField?.onBlur}
      >
        <div
          className="flex h-[42px] w-[42px] items-center justify-center rounded-base border border-gray-300 text-white"
          style={{ backgroundColor: controllerField?.value }}
        >
          <Pipette
            size={18}
            style={{
              color: getTextColorForBackground(
                controllerField?.value ?? "#000000",
              ),
            }}
          />
        </div>
        <div
          className={`flex h-[42px] flex-1 cursor-pointer items-center space-x-3 rounded-base border ${
            error ? "border-red-500" : "border-gray-300"
          } p-2 transition-colors hover:border-gray-400`}
          onClick={handleClick}
          onBlur={controllerField?.onBlur}
        >
          <span className="flex-1 text-xs">{controllerField?.value}</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? "rotate-180" : ""} ${
              error ? "text-red-500" : "text-gray-400"
            }`}
          />
        </div>
      </div>

      <Menu
        id="color-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="mt-2"
        disableAutoFocusItem={true}
        disableScrollLock={true}
        slotProps={{
          paper: {
            sx: { maxHeight: 300, borderRadius: "10px" },
            className: "scroll-bar-minimal",
          },
        }}
      >
        <div className="p-2">
          <p className="mb-3 text-sm text-muted-foreground">Base Colors</p>
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                className="h-8 w-8 rounded-full border border-gray-300 transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                onClick={() => {
                  controllerField?.onChange?.(color);
                  handleClose();
                }}
                aria-label={`Select color ${color}`}
              >
                {color === controllerField?.value && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color === "#FFFFFF" ? "#000000" : "#FFFFFF"}
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 p-2">
          <input
            type="color"
            id={field.name}
            value={controllerField?.value}
            onChange={(e) => controllerField?.onChange?.(e.target.value)}
            className="h-10 w-10 cursor-pointer bg-transparent"
            aria-label="Custom color picker"
          />
          <input
            type="text"
            value={controllerField?.value}
            onChange={(e) => controllerField?.onChange?.(e.target.value)}
            className="h-[35px] flex-1 border border-gray-400 p-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Color hex code"
          />
        </div>
      </Menu>

      {error && (
        <p className="mt-1 text-xs text-red-500" aria-live="polite">
          {error.message}
        </p>
      )}
    </div>
  );
};
