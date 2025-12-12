import { SquareDashedTopSolid } from "lucide-react";
import SectionCollapse from "../SectionCollapse";
import { ColorSelector } from "../ColorSelector";
import { getValue } from "@/util/blog";
import SpaceInput from "../spacesInput";
import { SPACING_UNITS } from "@/constants/blog";
import { Selector } from "../Selector";
import { StyleSectionProps } from "@/types/blog";
import { useBlogStore } from "@/lib/blog/blog-store";

const StyleBorder: React.FC = () => {
  const { getActiveBlock, updateBlockStyle, currentBreakpoint } =
    useBlogStore();
  const block = getActiveBlock();
  const styles = block?.styles || {};
  return (
    <SectionCollapse
      title={"Border"}
      defaultValue={true}
      icon={<SquareDashedTopSolid size={16} className="text-primary" />}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Border Color</p>
          <ColorSelector
            value={getValue(
              styles?.border?.borderColor || "rgb(229, 231, 235)",
              currentBreakpoint,
            )}
            onChange={(value) =>
              updateBlockStyle("border", "borderColor", value)
            }
          />
        </div>
        <SpaceInput
          label="Border"
          responsive={true}
          units={SPACING_UNITS}
          value={{
            top: styles?.border?.borderTopWidth || styles?.border?.borderWidth,
            right:
              styles?.border?.borderRightWidth || styles?.border?.borderWidth,
            bottom:
              styles?.border?.borderBottomWidth || styles?.border?.borderWidth,
            left:
              styles?.border?.borderLeftWidth || styles?.border?.borderWidth,
          }}
          onChange={{
            top: (value) => updateBlockStyle("border", "borderTopWidth", value),
            right: (value) =>
              updateBlockStyle("border", "borderRightWidth", value),
            bottom: (value) =>
              updateBlockStyle("border", "borderBottomWidth", value),
            left: (value) =>
              updateBlockStyle("border", "borderLeftWidth", value),
          }}
        />
        <SpaceInput
          label="Border Radius"
          responsive={true}
          units={SPACING_UNITS}
          value={{
            "top-l":
              styles?.border?.borderTopLeftRadius ||
              styles?.border?.borderRadius,
            "top-r":
              styles?.border?.borderTopRightRadius ||
              styles?.border?.borderRadius,
            "bottom-l":
              styles?.border?.borderBottomLeftRadius ||
              styles?.border?.borderRadius,
            "bottom-r":
              styles?.border?.borderBottomRightRadius ||
              styles?.border?.borderRadius,
          }}
          fields={["top-l", "top-r", "bottom-l", "bottom-r"]}
          onChange={{
            "top-l": (value) =>
              updateBlockStyle("border", "borderTopLeftRadius", value),
            "top-r": (value) =>
              updateBlockStyle("border", "borderTopRightRadius", value),
            "bottom-l": (value) =>
              updateBlockStyle("border", "borderBottomLeftRadius", value),
            "bottom-r": (value) =>
              updateBlockStyle("border", "borderBottomRightRadius", value),
          }}
        />

        <Selector
          label="Border Style"
          value={styles?.border?.borderStyle || "solid"}
          placeholder="Select Border Style"
          onChange={(value) => updateBlockStyle("border", "borderStyle", value)}
          options={[
            { value: "solid", label: "Solid" },
            { value: "dashed", label: "Dashed" },
            { value: "dotted", label: "Dotted" },
            { value: "double", label: "Double" },
            { value: "none", label: "None" },
          ]}
        />
      </div>
    </SectionCollapse>
  );
};

export default StyleBorder;
