import { useState } from "react";

type ToggleButtonProps = {
  initialValue?: boolean;
  onChange?: (value: boolean) => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
  label?: string;
};

export const ToggleButton = ({
  initialValue = false,
  onChange,
  size = "md",
  variant = "primary",
  disabled = false,
  className = "",
  label,
}: ToggleButtonProps) => {
  const [isOn, setIsOn] = useState(initialValue);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isOn;
    setIsOn(newValue);
    onChange?.(newValue);
  };

  const sizeClasses = {
    sm: "h-4 w-8",
    md: "h-5 w-10",
    lg: "h-6 w-12",
  };

  const variantClasses = {
    primary: isOn ? "bg-green-500" : "bg-gray-200",
    secondary: isOn ? "bg-purple-500" : "bg-gray-200",
    danger: isOn ? "bg-red-500" : "bg-gray-200",
  };

  const knobClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none ${
          sizeClasses[size]
        } ${variantClasses[variant]} ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        <span
          className={`absolute transform rounded-full bg-white shadow-sm transition-transform ${
            isOn ? "translate-x-full" : "translate-x-0"
          } ${knobClasses[size]}`}
          style={{
            left: size === "sm" ? "2px" : size === "md" ? "3px" : "4px",
          }}
        />
      </button>
      {label && (
        <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
};
