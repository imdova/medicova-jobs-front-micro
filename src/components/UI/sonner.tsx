"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

interface CustomToasterProps extends ToasterProps {
  theme?: ToasterProps["theme"];
}

const Toaster = ({ theme = "light", ...props }: CustomToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
