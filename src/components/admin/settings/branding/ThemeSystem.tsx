"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

interface ThemeSystemProps {
  isPreviewMode: boolean;
}

export function ThemeSystem({ isPreviewMode }: ThemeSystemProps) {
  const [themeSettings, setThemeSettings] = useState({
    enableDarkMode: true,
    enableUserThemeToggle: true,
    defaultTheme: "light",
    customCSS: "",
  });

  const themes = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <Typography variant="h5" className="mb-6 font-semibold">
          Theme System
        </Typography>

        <div className="space-y-6">
          {/* Theme Presets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Typography>Theme Presets</Typography>
                <Tooltip title="Choose between light, dark, or system-based theme">
                  <Info className="h-4 w-4 text-gray-500" />
                </Tooltip>
              </div>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={themeSettings.defaultTheme}
                  label="Theme"
                  onChange={(e) =>
                    setThemeSettings((prev) => ({
                      ...prev,
                      defaultTheme: e.target.value,
                    }))
                  }
                >
                  {themes.map((theme) => (
                    <MenuItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Typography>Enable Dark Mode</Typography>
              <Tooltip title="Enable dark mode support across the application">
                <Info className="h-4 w-4 text-gray-500" />
              </Tooltip>
            </div>
            <FormControlLabel
              control={
                <Switch
                  checked={themeSettings.enableDarkMode}
                  onChange={(e) =>
                    setThemeSettings((prev) => ({
                      ...prev,
                      enableDarkMode: e.target.checked,
                    }))
                  }
                />
              }
              label=""
            />
          </div>

          {/* User Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Typography>Enable User Theme Toggle</Typography>
              <Tooltip title="Allow users to switch between light and dark themes">
                <Info className="h-4 w-4 text-gray-500" />
              </Tooltip>
            </div>
            <FormControlLabel
              control={
                <Switch
                  checked={themeSettings.enableUserThemeToggle}
                  onChange={(e) =>
                    setThemeSettings((prev) => ({
                      ...prev,
                      enableUserThemeToggle: e.target.checked,
                    }))
                  }
                />
              }
              label=""
            />
          </div>

          {/* Custom CSS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Typography>Custom CSS</Typography>
              <Tooltip title="Add custom CSS overrides for advanced theme customization">
                <Info className="h-4 w-4 text-gray-500" />
              </Tooltip>
            </div>
            <TextField
              value={themeSettings.customCSS}
              onChange={(e) =>
                setThemeSettings((prev) => ({
                  ...prev,
                  customCSS: e.target.value,
                }))
              }
              className="w-full font-mono"
            />
          </div>

          {/* Preview Section */}
          {isPreviewMode && (
            <div className="mt-6 rounded-lg border p-4">
              <Typography variant="h6" className="mb-4 font-medium">
                Theme Preview
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border bg-white p-4">
                  <Typography variant="subtitle1" className="mb-2 font-medium">
                    Light Theme
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Preview of light theme styling
                  </Typography>
                </div>
                <div className="rounded-lg border bg-gray-800 p-4">
                  <Typography
                    variant="subtitle1"
                    className="mb-2 font-medium text-white"
                  >
                    Dark Theme
                  </Typography>
                  <Typography variant="body2" className="text-gray-400">
                    Preview of dark theme styling
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
