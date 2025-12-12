"use client";

import { useState } from "react";
import {
  Select,
  MenuItem,
  TextField,
  Slider,
  Tooltip,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { Info } from "lucide-react";

interface TypographySettingsProps {
  isPreviewMode: boolean;
}

interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  letterSpacing: number;
  lineHeight: number;
}

export function TypographySettings({ isPreviewMode }: TypographySettingsProps) {
  const [typography, setTypography] = useState<Record<string, TypographyStyle>>({
    h1: {
      fontFamily: "Inter",
      fontSize: 48,
      fontWeight: "700",
      letterSpacing: -0.02,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "Inter",
      fontSize: 36,
      fontWeight: "700",
      letterSpacing: -0.01,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: "Inter",
      fontSize: 30,
      fontWeight: "600",
      letterSpacing: 0,
      lineHeight: 1.4,
    },
    body: {
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: "400",
      letterSpacing: 0,
      lineHeight: 1.5,
    },
    small: {
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: "400",
      letterSpacing: 0,
      lineHeight: 1.5,
    },
    caption: {
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: "400",
      letterSpacing: 0,
      lineHeight: 1.5,
    },
  });

  const fontFamilies = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Montserrat",
    "Poppins",
    "Lato",
  ];

  const fontWeights = [
    { label: "Light (300)", value: "300" },
    { label: "Regular (400)", value: "400" },
    { label: "Medium (500)", value: "500" },
    { label: "Semi Bold (600)", value: "600" },
    { label: "Bold (700)", value: "700" },
  ];

  const TypographyControl = ({
    label,
    type,
    tooltip,
  }: {
    label: string;
    type: keyof typeof typography;
    tooltip: string;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Typography variant="subtitle1">{label}</Typography>
          <Tooltip title={tooltip}>
            <Info className="w-4 h-4 text-gray-500" />
          </Tooltip>
        </div>
        <div
          className="text-sm"
          style={{
            fontFamily: typography[type].fontFamily,
            fontSize: `${typography[type].fontSize}px`,
            fontWeight: typography[type].fontWeight,
            letterSpacing: `${typography[type].letterSpacing}em`,
            lineHeight: typography[type].lineHeight,
          }}
        >
          Preview Text
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Typography variant="body2">Font Family</Typography>
          <Select
            value={typography[type].fontFamily}
            onChange={(e) =>
              setTypography((prev) => ({
                ...prev,
                [type]: { ...prev[type], fontFamily: e.target.value },
              }))
            }
            fullWidth
            size="small"
          >
            {fontFamilies.map((font) => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Typography variant="body2">Font Weight</Typography>
          <Select
            value={typography[type].fontWeight}
            onChange={(e) =>
              setTypography((prev) => ({
                ...prev,
                [type]: { ...prev[type], fontWeight: e.target.value },
              }))
            }
            fullWidth
            size="small"
          >
            {fontWeights.map((weight) => (
              <MenuItem key={weight.value} value={weight.value}>
                {weight.label}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Typography variant="body2">Font Size (px)</Typography>
          <TextField
            type="number"
            value={typography[type].fontSize}
            onChange={(e) =>
              setTypography((prev) => ({
                ...prev,
                [type]: { ...prev[type], fontSize: Number(e.target.value) },
              }))
            }
            fullWidth
            size="small"
          />
        </div>

        <div className="space-y-2">
          <Typography variant="body2">Letter Spacing (em)</Typography>
          <TextField
            type="number"
            inputProps={{ step: "0.01" }}
            value={typography[type].letterSpacing}
            onChange={(e) =>
              setTypography((prev) => ({
                ...prev,
                [type]: { ...prev[type], letterSpacing: Number(e.target.value) },
              }))
            }
            fullWidth
            size="small"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Typography variant="body2">Line Height</Typography>
          <Box className="px-2">
            <Slider
              value={typography[type].lineHeight}
              min={1}
              max={2}
              step={0.1}
              onChange={(_, value) =>
                setTypography((prev) => ({
                  ...prev,
                  [type]: { ...prev[type], lineHeight: value as number },
                }))
              }
              valueLabelDisplay="auto"
            />
          </Box>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Paper className="p-6">
        <Typography variant="h5" className="mb-6">
          Typography Settings
        </Typography>
        <div className="space-y-8">
          <TypographyControl
            label="Heading 1"
            type="h1"
            tooltip="Main heading style for page titles"
          />
          <TypographyControl
            label="Heading 2"
            type="h2"
            tooltip="Secondary heading style for section titles"
          />
          <TypographyControl
            label="Heading 3"
            type="h3"
            tooltip="Tertiary heading style for subsection titles"
          />
          <TypographyControl
            label="Body Text"
            type="body"
            tooltip="Main text style for content"
          />
          <TypographyControl
            label="Small Text"
            type="small"
            tooltip="Style for secondary or supplementary text"
          />
          <TypographyControl
            label="Caption"
            type="caption"
            tooltip="Style for captions and very small text"
          />
        </div>
      </Paper>
    </div>
  );
} 