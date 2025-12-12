"use client";
import React, { Suspense, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createUrl } from "@/util";

interface TimeRange {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

interface TimeRangePickerProps {
  onChange?: (range: TimeRange) => void;
  initialRange?: TimeRange;
  labelStart?: string;
  labelEnd?: string;
}

const RangePicker: React.FC<TimeRangePickerProps> = ({
  onChange: initialOnChange,
  initialRange = { startDate: null, endDate: dayjs() },
  labelStart = "from",
  labelEnd = "to",
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const startDate = initialRange.startDate || (searchParams.get("startDate") ? dayjs(searchParams.get("startDate")) : null);
  const endDate = initialRange.endDate || (searchParams.get("endDate") ? dayjs(searchParams.get("endDate")) : null);

  const [range, setRange] = useState<TimeRange>({
    startDate: startDate,
    endDate: endDate || dayjs(),
  });

  const onChange = initialOnChange || updateSearchParams;

  function updateSearchParams(range: TimeRange) {
    const newParams = new URLSearchParams(searchParams.toString());
    if (range.startDate) {
      newParams.set("startDate", range.startDate.format("YYYY-MM-DD"));
    }
    if (range.endDate) {
      newParams.set("endDate", range.endDate.format("YYYY-MM-DD"));
    }
    newParams.delete("page");
    router.push(createUrl(pathname, newParams));
  }

  const handleStartDateChange = (newValue: Dayjs | null) => {
    const newRange = {
      ...range,
      startDate: newValue,
      endDate:
        newValue && range.endDate && range.endDate.isBefore(newValue)
          ? null
          : range.endDate,
    };
    setRange(newRange);
    onChange?.(newRange);
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    const newRange = { ...range, endDate: newValue };
    setRange(newRange);
    onChange?.(newRange);
  };

  // Custom format function for MM/DD if same year as today, and "Today" for current date
  const formatDate = (date: Dayjs | null, isEndDate: boolean = false) => {
    if (!date) return "";
    const currentYear = dayjs().year();
    const isToday = date.isSame(dayjs(), "day");

    if (isToday && isEndDate) {
      return "Today";
    }
    return date.year() === currentYear
      ? date.format("MM/DD")
      : date.format("MM/DD/YYYY");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex w-full gap-2">
        <DatePicker
          label={labelStart}
          value={range.startDate}
          onChange={handleStartDateChange}
          maxDate={range.endDate || dayjs()}
          format="MM/DD/YYYY"
          slotProps={{
            textField: {
              size: "medium",
              variant: "outlined",
              InputProps: {
                value: formatDate(range.startDate),
              },
              sx: {
                width: 84,
                "& .MuiInputLabel-root": {
                  fontSize: "0.75rem",
                  top: 2,
                },
                "& .MuiButtonBase-root": {
                  p: 0,
                },
                "& .MuiInputBase-root": {
                  p: 0,
                },
                "& .MuiInputBase-input": {
                  pr: "0 !important",
                  fontSize: "0.85rem",
                  pl: "12px !important",
                },
                "& .MuiInputAdornment-root": {
                  minWidth: "24px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                  p: 0,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.87)",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              },
            },
          }}
        />
        <DatePicker
          label={labelEnd}
          value={range.endDate}
          onChange={handleEndDateChange}
          minDate={range.startDate || undefined}
          maxDate={dayjs()}
          format="MM/DD/YYYY"
          slotProps={{
            textField: {
              size: "medium",
              variant: "outlined",
              InputProps: {
                value: formatDate(range.endDate, true), // Pass true for end date
              },
              sx: {
                width: 84,
                "& .MuiInputLabel-root": {
                  fontSize: "0.75rem",
                  top: 2,
                },
                "& .MuiButtonBase-root": {
                  p: 0,
                },
                "& .MuiInputBase-root": {
                  p: 0,
                },
                "& .MuiInputBase-input": {
                  pr: "0 !important",
                  fontSize: "0.85rem",
                  pl: "12px !important",
                },
                "& .MuiInputAdornment-root": {
                  minWidth: "24px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                  p: 0,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.87)",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

const TimeRangePicker: React.FC<TimeRangePickerProps> = (props) => {
  return (
    <Suspense>
      <RangePicker {...props} />
    </Suspense>
  );
};
export default TimeRangePicker;
