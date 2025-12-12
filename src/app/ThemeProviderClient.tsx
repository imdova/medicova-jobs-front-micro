"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBrandingData } from "@/store/slices/brandingSlice";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode, useEffect } from "react";

export default function ThemeProviderClient({
  children,
}: {
  children: ReactNode;
}) {
  const branding = useAppSelector((state) => state.branding.data);
  const dispatch = useAppDispatch();

  const theme = createTheme({
    palette: {
      primary: {
        main: branding.colorsData.primary,
      },
      secondary: {
        main: branding.colorsData.primary,
      },
    },
    typography: {
      // Apply the font globally to all typography variants
      fontFamily: "var(--font-poppins), sans-serif",
      fontSize: 12,
      // add for h3
      // h3: {
      //   fontWeight: "bold",
      //   fontSize: "1.5rem",
      // },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            height: "42px",
            fontSize: 12,
            borderRadius: "10px",
            "& .MuiOutlinedInput-input": {
              padding: "9px 14px", // Reduce input padding
              height: "24px", // Adjust input element height
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--input)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--secondary)", // Focused border color
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: "red", // Error border color
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "14px", // Custom font size
            top: "-5px", // Adjust label position when not focused
            "&.Mui-focused": {
              color: "black", // Set the label color when focused
            },
          },
          shrink: {
            top: "0px", // Adjust position when label shrinks
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem", // gap-2
            whiteSpace: "nowrap",
            borderRadius: "8px", // rounded-md (8px)
            fontSize: "0.875rem", // text-sm
            fontWeight: 500, // font-medium
            lineHeight: 1.5,
            height: "36px",
            transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
            padding: "0.5rem 1rem", // px-4 py-2
            pointerEvents: "auto",
            boxShadow: "none",
            "&:focus-visible": {
              outline: "none",
              boxShadow:
                "0 0 0 2px var(--secondary), 0 0 0 4px var(--secondary-foreground)", // mimic focus ring
            },
            "&.Mui-disabled": {
              opacity: 0.5,
              pointerEvents: "none",
            },
            "& svg": {
              pointerEvents: "none",
              width: "1rem",
              height: "1rem",
              flexShrink: 0,
            },
          },

          containedPrimary: {
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          },

          outlined: {
            backgroundColor: "transparent",
            color: "var(--muted-foreground)", // fallback
            border: "1px solid var(--input)", // border-input
            "&:hover": {
              backgroundColor:
                "color-mix(in oklch, var(--primary) 10%, transparent)",
              color: "var(--foreground)",
              borderColor: "var(--input)",
            },
          },

          text: {
            backgroundColor: "transparent",
            color: "var(--muted-foreground)",
            "&:hover": {
              backgroundColor:
                "color-mix(in oklch, var(--primary) 10%, transparent)",
              color: "var(--foreground)",
            },
          },

          sizeSmall: {
            height: "32px", // h-9
            padding: "0 11px", // px-3
            borderRadius: "8px", // rounded-md
          },

          sizeLarge: {
            height: "40px", // h-11
            padding: "0 2rem", // px-8
            borderRadius: "10px", // rounded-md
          },
        },
      },
    },
  });

  useEffect(() => {
    dispatch(fetchBrandingData());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <div suppressHydrationWarning>
        <CssBaseline />
      </div>
      {children}
    </ThemeProvider>
  );
}
