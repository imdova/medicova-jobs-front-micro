import { SxProps, Theme } from '@mui/material';

export const getPlanCardStyles = (planName: string, index: number, highlight: boolean): SxProps<Theme> => {
  const baseStyles: SxProps<Theme> = {
    p: 1,
    position: "relative",
    borderRadius: "16px",
    backgroundColor: "white",
    height: "fit-content",
  };

  const borderStyles: Record<number, string> = {
    0: "1px solid #e0e0e0",
    1: "1px solid #e0e0e0",
    2: "2px solid #2BA149",
    3: "1px solid transparent",
  };

  const backgroundColors: Record<number, string> = {
    0: "white",
    1: "#D9D9D933",
    2: "#d4ecd1",
    3: "white",
  };

  const boxShadows: Record<number, string> = {
    2: "0 4px 12px rgba(0, 0, 0, 0.1)",
    3: "0 4px 12px rgba(76, 175, 80, 0.5)",
  };

  const gradientStyles: SxProps<Theme> = index === 3 ? {
    backgroundImage: "linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(90deg, #FFFFFF 0%, #2BA149 80%, #82C341 90%, #7BC48D 100%)",
    backgroundOrigin: "border-box",
    backgroundClip: "content-box, border-box",
  } : {};

  return {
    ...baseStyles,
    border: borderStyles[index] || "1px solid #e0e0e0",
    backgroundColor: backgroundColors[index] || "white",
    boxShadow: boxShadows[index] || "",
    ...gradientStyles,
  };
};

export const getBadgeStyles = (planName: string) => {
  const colorMap = {
    Pro: "var(--primary)",
    Gold: "#2BA149",
    Platinum: "#2EAE7D",
  };

  return {
    position: "absolute",
    top: 0,
    right: 0,
    background: colorMap[planName as keyof typeof colorMap] || "#1976d2",
    color: "white",
    px: 1.5,
    py: 0.5,
    fontSize: "0.7rem",
    fontWeight: 600,
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "16px",
    borderTopRightRadius: "0",
    display: "inline-block",
  };
};

export const getButtonStyles = (index: number) => {
  const styles = {
    0: { backgroundColor: "#000", color: "white", border: "none" },
    1: { backgroundColor: "var(--primary)", color: "white", border: "none" },
    2: { backgroundColor: "var(--primary)", color: "white", border: "none" },
    3: { backgroundColor: "white", color: "var(--primary)", border: "2px solid var(--primary)" },
  };

  return {
    ...styles[index as keyof typeof styles],
    borderRadius: 3,
    "&:hover": {
      backgroundColor: styles[index as keyof typeof styles]?.backgroundColor,
      boxShadow: "none",
    },
  };
}; 