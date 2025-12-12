import { useEffect, useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useBlogStore } from "@/lib/blog/blog-store";
import { BreakPoints, ResponsiveStyle, Unit } from "@/types/blog";
import { Option } from "@/types";
import DropDown from "@/components/form/FormModal/fields/dropDown";
import {
  extractFromPossibleTemplates,
  getUnit,
  getValue,
  replaceValue,
  stringToResponsiveValue,
} from "@/util/blog";

const BREAKPOINTS: Option[] = [
  { value: "md", label: <Monitor className="h-4 w-4" /> },
  {
    value: "sm",
    label: <Tablet className="h-4 w-4 rotate-90" />,
  },
  { value: "xs", label: <Smartphone className="h-4 w-4" /> },
];

interface SelectorProps {
  value?: ResponsiveStyle;
  label?: string;
  onChange: (value: ResponsiveStyle) => void;
  units?: Unit[];
  defaultUnit?: string;
  responsive?: boolean;
}

export const StyleSlider: React.FC<SelectorProps> = ({
  value: initialValue = "",
  onChange,
  units,
  label,
  defaultUnit,
  responsive,
}) => {
  const { currentBreakpoint, setBreakpoint } = useBlogStore();
  const bpValue = getValue(initialValue, currentBreakpoint);

  const { value, template } = extractFromPossibleTemplates(
    bpValue,
    units?.map((unit) => unit.regex) || [],
  );
  const [unit, setUnit] = useState<Unit | null>(
    units?.find((unit) => unit.regex === template) || units?.[0] || null,
  );

  const unitValue = unit?.value || defaultUnit || "";
  const BreakpointIcon = BREAKPOINTS.find(
    (bp) => bp.value === currentBreakpoint,
  )?.label;

  const handleChange = (value: string) => {
    if (responsive) {
      onChange(stringToResponsiveValue(value, currentBreakpoint, initialValue));
    } else {
      onChange(value);
    }
  };

  const handleUnitChange = (option: Option) => {
    const unit = getUnit(units, option.value);
    if (!unit) return;
    setUnit(unit);
    handleChange(replaceValue(unit.regex, unit.resetValue));
  };

  const handleBreakpointChange = (option: Option) => {
    setBreakpoint(option.value as BreakPoints);
  };
  useEffect(() => {
    const bpValue = getValue(initialValue, currentBreakpoint);
    const { template } = extractFromPossibleTemplates(
      bpValue,
      units?.map((unit) => unit.regex) || [],
    );
    const unit =
      units?.find((unit) => unit.regex === template) || units?.[0] || null;
    setUnit(unit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBreakpoint, initialValue]);

  return (
    <div className="grid-cols-2 space-y-2">
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
        {units && units.length > 1 && (
          <DropDown
            options={units.map((unit) => ({
              value: unit.value,
              label: unit.value,
            }))}
            onChange={handleUnitChange}
          >
            <span className="text-xs text-muted-foreground">{unitValue}</span>
          </DropDown>
        )}
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={unit?.min || 0}
          max={unit?.max || 100}
          step={unit?.step || 1}
          value={value}
          onChange={(e) =>
            handleChange(replaceValue(unit?.regex || "", e.target.value))
          }
          className="w-full cursor-ew-resize appearance-none rounded-full bg-gray-200 text-xs disabled:cursor-not-allowed"
        />
        <input
          type="number"
          min={unit?.min || 0}
          max={unit?.max || 100}
          step={unit?.step || 1}
          value={value}
          onChange={(e) =>
            e.target.value !== ""
              ? handleChange(replaceValue(unit?.regex || "", e.target.value))
              : handleChange("")
          }
          className="h-[30px] w-14 rounded-md border border-gray-300 text-center text-xs focus:border-primary focus:outline-none"
        />
      </div>
    </div>
  );
};
