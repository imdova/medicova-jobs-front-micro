import { SquareDashedTopSolid } from "lucide-react";
import SectionCollapse from "../SectionCollapse";
import { Selector } from "../Selector";
import { getValue, stringToResponsiveValue } from "@/util/blog";
import {
  HEIGHT_OPTIONS,
  HEIGHT_UNITS,
  WIDTH_OPTIONS,
  WIDTH_UNITS,
} from "@/constants/blog";
import { StyleSlider } from "../styleSlider";
import { useBlogStore } from "@/lib/blog/blog-store";

const StyleImage: React.FC = () => {
  const { getActiveBlock, updateBlockStyle, currentBreakpoint } =
    useBlogStore();
  const block = getActiveBlock();
  const styles = block?.styles || {};
  if (block?.type !== "image") return null;
  return (
    <SectionCollapse
      title={"Image"}
      defaultValue={true}
      icon={<SquareDashedTopSolid size={16} className="text-primary" />}
    >
      <div className="space-y-2">
        <Selector
          label="Width"
          responsive
          value={styles?.image?.customWidth}
          placeholder="Select Width"
          onChange={(initialValue) => {
            const value = getValue(initialValue, currentBreakpoint);
            const width = styles?.image?.width;
            if (value === "custom") {
              updateBlockStyle(
                "image",
                "width",
                stringToResponsiveValue("50%", currentBreakpoint, width),
              );
            } else {
              updateBlockStyle(
                "image",
                "width",
                stringToResponsiveValue(value, currentBreakpoint, width),
              );
            }
            updateBlockStyle("image", "customWidth", initialValue);
          }}
          options={WIDTH_OPTIONS}
        />
        {getValue(styles?.image?.customWidth || "", currentBreakpoint) ===
          "custom" && (
          <StyleSlider
            label="Custom Width"
            units={WIDTH_UNITS}
            responsive={true}
            value={styles?.image?.width}
            onChange={(value) => updateBlockStyle("image", "width", value)}
          />
        )}
        <Selector
          label="Height"
          responsive
          value={styles?.image?.customHeight}
          placeholder="Select Height"
          onChange={(initialValue) => {
            const value = getValue(initialValue, currentBreakpoint);
            const height = styles?.image?.height;
            if (value === "custom") {
              updateBlockStyle(
                "image",
                "height",
                stringToResponsiveValue("100%", currentBreakpoint, height),
              );
            } else {
              updateBlockStyle(
                "image",
                "height",
                stringToResponsiveValue(value, currentBreakpoint, height),
              );
            }
            updateBlockStyle("image", "customHeight", initialValue);
          }}
          options={HEIGHT_OPTIONS}
        />
        {getValue(styles?.image?.customHeight || "", currentBreakpoint) ===
          "custom" && (
          <StyleSlider
            label="Custom Height"
            units={HEIGHT_UNITS}
            responsive={true}
            value={styles?.image?.height}
            onChange={(value) => updateBlockStyle("image", "height", value)}
          />
        )}
        <Selector
          label="Object Fit"
          value={styles?.image?.objectFit || "contain"}
          placeholder="Select Object Fit"
          onChange={(value) => updateBlockStyle("image", "objectFit", value)}
          options={[
            { value: "cover", label: "Cover" },
            { value: "contain", label: "Contain" },
            { value: "fill", label: "Fill" },
            { value: "none", label: "None" },
            { value: "scale-down", label: "Scale Down" },
          ]}
        />
      </div>
    </SectionCollapse>
  );
};

export default StyleImage;
