import { Option } from "@/types";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { BreakPoints, ResponsiveStyle } from "@/types/blog";
import { useBlogStore } from "@/lib/blog/blog-store";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { getValue, stringToResponsiveValue } from "@/util/blog";
import DropDown from "../form/FormModal/fields/dropDown";

interface AlignmentSelectorProps {
  options: Option[];
  value?: ResponsiveStyle;
  onChange: (value: ResponsiveStyle) => void;
  label?: string;
  responsive?: boolean;
}
const BREAKPOINTS: Option[] = [
  { value: "md", label: <Monitor className="h-4 w-4" /> },
  {
    value: "sm",
    label: <Tablet className="h-4 w-4 rotate-90" />,
  },
  { value: "xs", label: <Smartphone className="h-4 w-4" /> },
];

const AlignmentSelector: React.FC<AlignmentSelectorProps> = ({
  options,
  value: initialValue = "",
  onChange,
  label,
  responsive,
}) => {
  const { currentBreakpoint, setBreakpoint } = useBlogStore();
  const value = getValue(initialValue, currentBreakpoint);

  const BreakpointIcon = BREAKPOINTS.find(
    (bp) => bp.value === currentBreakpoint,
  )?.label;

  const handleBreakpointChange = (option: Option) => {
    setBreakpoint(option.value as BreakPoints);
  };

  const handleChange = (value: string | null) => {
    if (responsive) {
      onChange(
        stringToResponsiveValue(value || "", currentBreakpoint, initialValue),
      );
    } else {
      onChange(value || "");
    }
  };
  return (
    <div className="flex items-center flex-wrap justify-between">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {responsive && (
          <DropDown
            options={BREAKPOINTS}
            onChange={handleBreakpointChange}
            showIcon={false}
          >
            {BreakpointIcon}
          </DropDown>
        )}
      </div>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(e, value) => handleChange(value)}
        aria-label="view mode"
        size="small"
      >
        {options.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            className={value === option.value ? "!bg-primary !text-white" : ""}
            aria-label="list view"
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
};

export default AlignmentSelector;
