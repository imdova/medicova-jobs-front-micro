import * as React from "react";
import { cn } from "@/util";
import { BadgeVariant } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "xs" | "sm" | "md" | "lg";
}

export function Badge({
  variant = "neutral",
  size = "sm",
  className,
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
    complete: "bg-green-100 text-green-800 border-green-200",
    "missing-title": "bg-red-100 text-red-800 border-red-200",
    "missing-description": "bg-orange-100 text-orange-800 border-orange-200",
    "needs-review": "bg-yellow-100 text-yellow-800 border-yellow-200",
    premium: "bg-purple-100 text-purple-800 border-purple-200", // Added for premium
  };

  const sizeClasses = {
    xs: "px-1 py-0 text-[9px] h-[18px]",
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border font-medium",
        variantClasses[variant] || variantClasses.neutral,
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
