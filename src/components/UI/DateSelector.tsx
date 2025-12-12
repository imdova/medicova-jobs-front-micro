"use client";

import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/UI/button";
import { Calendar } from "@/components/UI/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/UI/popover";
import { cn } from "@/util";

const DateSelector: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  onChange,
  value,
  placeholder,
}) => {
  const date = value as Date | string | undefined;
  const [open, setOpen] = useState(false);

  const handleChange = (value?: Date) => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: value?.toISOString() },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker"
          className={cn(
            "justify-between font-normal",
            date ? "" : "text-zinc-400",
          )}
        >
          {date
            ? new Date(date).toLocaleDateString()
            : placeholder || "Pick a date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date ? new Date(date) : undefined}
          onSelect={handleChange}
          className="min-w-3xs"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateSelector;
