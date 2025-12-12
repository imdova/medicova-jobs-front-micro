"use client";
import React, { useState, useRef } from "react";
import { TextField } from "@mui/material";
import { FieldError } from "react-hook-form";
import { FieldConfig } from "@/types";
import { cn } from "@/util";

const OTPInput = ({
  field,
  length = 6,
  onChange,
  error,
}: {
  field?: FieldConfig;
  length?: number;
  onChange?: (otp: string) => void;
  error?: FieldError | null;
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (onChange) onChange(newOtp.join(""));

    // Move to the next input field if the current one is filled
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, length);
      setOtp(newOtp);
      if (onChange) onChange(newOtp.join(""));
      newOtp.forEach((char, i) => {
        if (inputsRef.current[i]) {
          inputsRef.current[i].value = char;
        }
      });
    }
    e.preventDefault();
  };

  return (
    <div
      className={cn("flex flex-col gap-2", field?.textFieldProps?.className)}
    >
      <div className="flex justify-center gap-1">
        {otp.map((_, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputsRef.current[index] = el!)}
            value={otp[index]}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            error={!!error}
            onPaste={handlePaste}
            inputProps={{
              maxLength: 1,
              className:
                "text-center font-bold aspect-square flex-1 p-3 md:p-5 md:text-2xl",
              style: {
                MozAppearance: "textfield", // Firefox
              },
              inputMode: "numeric", // Mobile keyboards
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "60px",
                width: "60px",
                "& .MuiOutlinedInput-input": {
                  padding: "9px 14px",
                  height: "24px",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--secondary)",
                },
                "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderColor: "red",
                },
                borderRadius: "10px",
              },
            }}
            type="text" // Change to text to remove arrows
            autoFocus={index === 0}
            variant="outlined"
          />
        ))}
      </div>
      {error && (
        <p className="text-center text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default OTPInput;
