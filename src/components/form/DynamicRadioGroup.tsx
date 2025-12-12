"use client";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React, { forwardRef, useState } from "react";

// Define the type for individual option
type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type DynamicRadioGroupProps = {
  options: RadioOption[];
  defaultValue?: string;
  row?: boolean;
  onChange?: (value: string) => void;
  value?: string;
};

const DynamicRadioGroup = forwardRef<HTMLDivElement, DynamicRadioGroupProps>(
  ({ options, defaultValue, row = false, onChange, value }, ref) => {
    const [selected, setSelected] = useState(
      defaultValue || options[0]?.value || "",
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const val = event.target.value;
      setSelected(val);
      onChange?.(val);
    };

    return (
      <RadioGroup
        row={row}
        value={value ?? selected}
        onChange={handleChange}
        className="gap-4"
        ref={ref} // forward ref here
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            control={<Radio />}
            label={<span className="font-semibold">{option.label}</span>}
            className="mr-4"
          />
        ))}
      </RadioGroup>
    );
  },
);

DynamicRadioGroup.displayName = "DynamicRadioGroup";
export default DynamicRadioGroup;
