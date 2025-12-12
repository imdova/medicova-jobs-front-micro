import { useEffect, useState } from "react";
import { Link2, Link2Off } from "lucide-react";
import { BreakPoints, ResponsiveStyle, Unit } from "@/types/blog";
import DropDown from "../form/FormModal/fields/dropDown";
import { Option } from "@/types";
import {
  getUnit,
  getValue,
  parseValueUnit,
  stringToResponsiveValue,
} from "@/util/blog";
import { useBlogStore } from "@/lib/blog/blog-store";
import { Monitor, Smartphone, Tablet } from "lucide-react";

const BREAKPOINTS: Option[] = [
  { value: "md", label: <Monitor className="h-4 w-4" /> },
  {
    value: "sm",
    label: <Tablet className="h-4 w-4 rotate-90" />,
  },
  { value: "xs", label: <Smartphone className="h-4 w-4" /> },
];

interface SpaceInputProps {
  onChange: {
    [key: string]: (value: ResponsiveStyle) => void;
  };
  value: {
    [key: string]: ResponsiveStyle | undefined;
  };
  fields?: string[];
  units?: Unit[];
  label?: string;
  responsive?: boolean;
}
const SpaceInput: React.FC<SpaceInputProps> = ({
  value: initialValue = {
    top: "",
    right: "",
    bottom: "",
    left: "",
  },
  onChange,
  units,
  label,
  fields = ["top", "right", "bottom", "left"],
  responsive,
}) => {
  const [linked, setLinked] = useState(true);

  const { currentBreakpoint, setBreakpoint } = useBlogStore();
  const value = createValueObject(fields, initialValue, currentBreakpoint);

  const { unit: parsedUnit } = parseValueUnit(value[fields[0]] || "");
  const [unit, setUnit] = useState<Unit | null>(getUnit(units, parsedUnit));
  const unitValue = unit?.value || "";

  const BreakpointIcon = BREAKPOINTS.find(
    (bp) => bp.value === currentBreakpoint,
  )?.label;

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value + unitValue;
    const name = e.target.name as keyof typeof onChange;
    handleChange(value, name);
  };

  const applyToAll = (value: string) => {
    fields.forEach((side) => {
      if (responsive) {
        onChange[side](
          stringToResponsiveValue(value, currentBreakpoint, initialValue[side]),
        );
      } else {
        onChange[side](value);
      }
    });
  };

  const handleChange = (value: string, name: keyof typeof onChange) => {
    if (linked) {
      applyToAll(value);
    } else {
      onChange[name](
        stringToResponsiveValue(value, currentBreakpoint, initialValue[name]),
      );
    }
  };

  const handleUnitChange = (option: Option) => {
    const unit = getUnit(units, option.value);
    if (!unit) return;
    setUnit(unit);
    applyToAll(unit.resetValue + unit.value);
  };

  const handleBreakpointChange = (option: Option) => {
    setBreakpoint(option.value as BreakPoints);
  };
  useEffect(() => {
    const { unit: pbUnit } = parseValueUnit(
      getValue(initialValue[fields[0]] || "", currentBreakpoint),
    );
    setUnit(getUnit(units, pbUnit));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBreakpoint, initialValue]);

  return (
    <div className="space-y-2">
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
      <div>
        <div className="grid grid-cols-9 grid-rows-1">
          {fields.map((field, index) => (
            <input
              key={field}
              type="number"
              name={field}
              min={unit?.min}
              max={unit?.max}
              step={unit?.step}
              value={parseValueUnit(value[field] || "").value}
              onChange={changeHandler}
              className={`col-span-2 h-[30px] border border-r-0 border-gray-300 text-center text-xs focus:border-primary focus:outline-none ${index === 0 ? "rounded-l-md" : ""} `}
            />
          ))}
          <button
            onClick={() => {
              setLinked(!linked);
              if (!linked) {
                applyToAll(value[fields[0]]);
              }
            }}
            className={`col-span-1 h-[30px] rounded-r-md border p-2 ${linked ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
          >
            {linked ? (
              <Link2 className={`h-4 w-4`} />
            ) : (
              <Link2Off className={`h-4 w-4`} />
            )}
          </button>
        </div>
        <div className="grid grid-cols-9 grid-rows-1">
          {fields.map((field) => (
            <p key={field} className="col-span-2 text-xs text-muted-foreground">
              {field}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpaceInput;

function createValueObject(
  fields: string[],
  initialValue: Record<string, any>,
  currentBreakpoint: BreakPoints,
): Record<string, string> {
  return fields.reduce(
    (acc, field) => {
      acc[field] = getValue(initialValue[field] || "", currentBreakpoint);
      return acc;
    },
    {} as Record<string, string>,
  );
}
