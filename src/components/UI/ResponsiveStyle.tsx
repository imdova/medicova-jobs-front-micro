"use client";
import React, { useState, useEffect } from "react";

// Define breakpoints (you can customize these)
const breakpoints = {
  sm: 0,
  md: 768,
  lg: 1024,
};

// Hook to get current screen size label
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(
    getBreakpoint(window.innerWidth),
  );

  function getBreakpoint(width: number): keyof typeof breakpoints {
    if (width >= breakpoints.lg) return "lg";
    if (width >= breakpoints.md) return "md";
    return "sm";
  }

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};

// Component to apply responsive style
type ResponsiveStyleProps = {
  style: Partial<Record<keyof typeof breakpoints, string>>;
  children: React.ReactNode;
  styleKey: string; // e.g. "color", "backgroundColor"
};

const ResponsiveStyle = ({
  style,
  children,
  styleKey,
}: ResponsiveStyleProps) => {
  const breakpoint = useBreakpoint();

  // Pick the most appropriate style
  const getResponsiveValue = () => {
    if (style[breakpoint]) return style[breakpoint];
    if (breakpoint === "lg") return style.md || style.sm;
    if (breakpoint === "md") return style.sm;
    return style.sm;
  };

  const responsiveStyle = {
    [styleKey]: getResponsiveValue(),
  };

  return <div style={responsiveStyle}>{children}</div>;
};

export default ResponsiveStyle;
