import { cn } from "@/util";
import { TextareaAutosize } from "@mui/material";
import * as React from "react";

type AutoWidthTextareaProps = React.ComponentProps<"textarea"> & {
  minRows?: number;
  autoWidth?: boolean;
};

export const AutoWidthTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoWidthTextareaProps
>(
  (
    { className, style, minRows = 1, autoWidth = true, value = "", ...props },
    ref,
  ) => {
    const spanRef = React.useRef<HTMLSpanElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Expose internal ref via useImperativeHandle
    React.useImperativeHandle(
      ref,
      () => textareaRef.current as HTMLTextAreaElement,
      [],
    );

    // Update width based on span width
    React.useEffect(() => {
      if (spanRef.current && textareaRef.current) {
        const width = spanRef.current.offsetWidth;
        if (autoWidth) {
          textareaRef.current.style.width = `${width + 2}px`;
        } else {
          textareaRef.current.style.width = "100%";
        }
      }
    }, [value, autoWidth, style]);

    return (
      <div className="relative inline-block w-full max-w-full">
        {/* Hidden span to calculate width */}
        <span
          ref={spanRef}
          className={cn("invisible absolute whitespace-pre", className)}
          style={{
            fontSize: "1rem",
            fontFamily: "inherit",
            whiteSpace: "pre",
            ...style,
            minWidth: !value && !style?.minWidth ? "40px" : style?.minWidth,
          }}
        >
          {value || " "}
        </span>

        {/* Textarea with MUI autosize + custom width */}
        <TextareaAutosize
          ref={textareaRef}
          minRows={minRows}
          value={value}
          className={className}
          style={{
            resize: "none",
            // minWidth: "40px",
            overflow: "hidden",
            ...style,
          }}
          {...props}
        />
      </div>
    );
  },
);

AutoWidthTextarea.displayName = "AutoWidthTextarea";
