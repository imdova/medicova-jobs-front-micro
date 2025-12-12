import { useState } from "react";
import { Ban, Globe } from "lucide-react";
import { Menu, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { DebouncedPicker } from "./debouncePicker";
import { useAppSelector } from "@/store/hooks";

interface ColorSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  value,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElPreset, setAnchorElPreset] = useState<null | HTMLElement>(
    null,
  );
  const {
    data: { colorsData },
  } = useAppSelector((state) => state.branding);

  return (
    <>
      <ToggleButtonGroup aria-label="view mode" size="small">
        <ToggleButton
          value={"color"}
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            setAnchorEl(e.currentTarget)
          }
        >
          <div
            className="h-5 w-5 rounded-sm border border-gray-300 text-white"
            style={{ backgroundColor: value }}
          />
        </ToggleButton>
        <ToggleButton
          value={"preset"}
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            setAnchorElPreset(e.currentTarget)
          }
        >
          <Globe size={16} />
        </ToggleButton>
      </ToggleButtonGroup>

      <Menu
        id="color-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className="p-0"
        disableAutoFocusItem={true}
        disableScrollLock={true}
        slotProps={{
          paper: {
            sx: {
              "& .MuiList-padding": {
                padding: 0,
              },
              maxHeight: 300,
              padding: 0,
              maxWidth: 200,
              borderRadius: "10px",
            },
            className: "scroll-bar-minimal",
          },
        }}
      >
        <div className="flex flex-col items-center">
          <DebouncedPicker color={value || "#000000"} onChange={onChange} />
          <div className="p-4">
            <label className="mb-1 block text-sm text-gray-700">Hex:</label>
            <input
              className="w-full rounded border p-1 text-sm"
              value={value}
              onChange={(e) => {
                const newHex = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/i.test(newHex)) {
                  onChange(newHex);
                }
              }}
            />
          </div>
        </div>
      </Menu>
      <Menu
        id="color-menu-preset"
        anchorEl={anchorElPreset}
        open={Boolean(anchorElPreset)}
        onClose={() => setAnchorElPreset(null)}
        className="p-0"
        disableAutoFocusItem={true}
        disableScrollLock={true}
        slotProps={{
          paper: {
            sx: {
              "& .MuiList-padding": {
                padding: 0,
              },
              maxHeight: 300,
              padding: 0,
              maxWidth: 200,
              borderRadius: "10px",
            },
            className: "scroll-bar-minimal",
          },
        }}
      >
        <p className="mb-2 border-b p-2 text-sm text-muted-foreground">
          Preset Colors
        </p>
        <div className="flex flex-wrap gap-1 p-2">
          <Tooltip title="none">
            <button
              onClick={() => onChange("transparent")}
              className="h-8 w-8 rounded-sm flex justify-center items-center border border-gray-300 text-white duration-200 hover:scale-110 hover:shadow-md"
              style={{ backgroundColor: value }}
            >
              <Ban className="h-4 w-4 text-red-500" />
            </button>
          </Tooltip>
          {Object.entries(colorsData).map(([key, value]) => (
            <Tooltip key={key} title={key}>
              <button
                onClick={() => onChange(value)}
                className="h-8 w-8 rounded-sm border border-gray-300 text-white duration-200 hover:scale-110 hover:shadow-md"
                style={{ backgroundColor: value }}
              />
            </Tooltip>
          ))}
        </div>
      </Menu>
    </>
  );
};
