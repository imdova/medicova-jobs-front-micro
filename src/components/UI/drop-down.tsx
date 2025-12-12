import { cn } from "@/util";
import { Menu, MenuItem } from "@mui/material";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

const DropMenu = <T,>({
  options,
  label,
  data,
  icon,
  value,
  disabledClose,
  className,
  onChange,
  children,
  disabled = false,
}: {
  options: ActionOption<T[]>[];
  label?: React.ReactNode;
  data?: T[];
  icon?: React.ReactNode;
  value?: string | string[];
  disabledClose?: boolean;
  className?: string;
  onChange?: (option: ActionOption<T[]>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        variant="outline"
        disabled={disabled}
        className={cn("flex gap-2", className)}
        onClick={handleClick}
      >
        {icon ?? (
          <ChevronDown
            size={16}
            className={cn("duration-300", open ? "rotate-180" : "")}
          />
        )}
        {label}
      </Button>
      <Menu
        id="save-menu"
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
        {children}
        {options.length > 0 ? (
          options.map((option, index) => {
            const isHidden = option.hidden?.(data);
            if (isHidden) return null;
            return (
              <MenuItem
                key={index}
                onClick={() => {
                  if (!disabledClose) {
                    handleClose();
                  }
                  if (onChange) {
                    onChange(option);
                  }
                  if (
                    typeof option === "object" &&
                    "action" in option &&
                    option.action
                  ) {
                    option.action(data);
                  }
                }}
                className={cn(
                  "flex min-w-40 items-center gap-4 hover:bg-gray-200",
                  value?.includes(option?.value ?? "") &&
                    "bg-primary/10 text-primary",
                )}
              >
                {typeof option === "object" && "icon" in option
                  ? option.icon
                  : null}
                {typeof option === "object" && "label" in option
                  ? typeof option.label === "function"
                    ? option.label(data)
                    : option.label
                  : option}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem
            disabled
            className="flex items-center gap-4 opacity-50 hover:bg-gray-200"
          >
            No options available
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
export default DropMenu;
