"use client";

import { toast as hotToast } from "sonner";

export type ToastVariant = "success" | "error" | "warning" | "info" | "default";
export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const variantStyles: Record<ToastVariant, object> = {
  success: {
    "--normal-bg": "color-mix(in oklab, var(--primary) 10%, white)",
    "--normal-text": "var(--primary)",
    "--normal-border": "var(--primary)",
  },
  error: {
    "--normal-bg": "color-mix(in oklab, var(--destructive) 5%, white)",
    "--normal-text": "var(--destructive)",
    "--normal-border": "color-mix(in oklab, var(--destructive) 25%, white)",
  },
  warning: {
    "--normal-bg": "color-mix(in oklab, var(--warning) 10%, white)",
    "--normal-text": "var(--warning)",
    "--normal-border": "var(--warning)",
  },
  info: {
    "--normal-bg": "color-mix(in oklab, var(--muted) 10%, white)",
    "--normal-text": "var(--muted-foreground)",
    "--normal-border": "var(--muted)",
  },
  default: {
    "--normal-bg": "var(--background)",
    "--normal-text": "var(--foreground)",
    "--normal-border": "var(--border)",
  },
};

// 🔥 Wrap Sonner’s toast with helpers
export const toast = {
  success: (
    title: string,
    opts?: {
      description?: string;
      position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    },
  ) =>
    hotToast.success(title, {
      ...opts,
      style: variantStyles.success,
      position: opts?.position || "bottom-right",
    }),

  error: (
    title: string,
    opts?: {
      description?: string;
      position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    },
  ) =>
    hotToast.error(title, {
      ...opts,
      style: variantStyles.error,
      position: opts?.position || "bottom-right",
    }),

  warning: (
    title: string,
    opts?: {
      description?: string;
      position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    },
  ) =>
    hotToast.warning?.(title, {
      ...opts,
      style: variantStyles.warning,
      position: opts?.position || "bottom-right",
    }) ??
    hotToast(title, {
      ...opts,
      style: variantStyles.warning,
      position: "bottom-right",
    }), // fallback if sonner has no .warning

  info: (
    title: string,
    opts?: {
      description?: string;
      position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    },
  ) =>
    hotToast.info?.(title, {
      ...opts,
      style: variantStyles.info,
      position: opts?.position || "bottom-right",
    }) ??
    hotToast(title, {
      ...opts,
      style: variantStyles.info,
      position: "bottom-right",
    }),

  default: (
    title: string,
    opts?: {
      description?: string;
      position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    },
  ) =>
    hotToast(title, {
      ...opts,
      style: variantStyles.default,
      position: opts?.position || "bottom-right",
    }),
};
