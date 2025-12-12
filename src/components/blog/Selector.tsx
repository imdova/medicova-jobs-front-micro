import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Option } from "@/types";
import { BreakPoints, ResponsiveStyle } from "@/types/blog";
import DropDown from "../form/FormModal/fields/dropDown";
import { useBlogStore } from "@/lib/blog/blog-store";
import { getValue, stringToResponsiveValue } from "@/util/blog";

interface SelectorProps {
  value?: ResponsiveStyle;
  onChange: (value: ResponsiveStyle) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
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

export const Selector: React.FC<SelectorProps> = ({
  value: initialValue = "",
  placeholder,
  onChange,
  label,
  options,
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

  const handleChange = (value: string) => {
    if (responsive) {
      onChange(stringToResponsiveValue(value, currentBreakpoint, initialValue));
    } else {
      onChange(value);
    }
  };
  const selectedLabel = options.find((option) => option.value === value)?.label;
  return (
    <div className="flex items-center justify-between">
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
      <DropDown
        options={options}
        onChange={(option: Option) => handleChange(option.value)}
        className="flex h-[33px] w-1/2 items-center justify-between gap-2 rounded-[4px] border px-2"
      >
        <span
          className={`line-clamp-1 w-full text-left text-xs ${value ? "text-main" : "text-muted-foreground"}`}
        >
          {selectedLabel || value || placeholder}
        </span>
      </DropDown>
    </div>
  );
};
