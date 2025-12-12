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

const StyleVideo: React.FC = () => {
  const { getActiveBlock, updateBlockStyle, currentBreakpoint } =
    useBlogStore();
  const block = getActiveBlock();
  const styles = block?.styles || {};
  if (block?.type !== "video") return null;
  return (
    <SectionCollapse
      title={"Video"}
      defaultValue={true}
      icon={<SquareDashedTopSolid size={16} className="text-primary" />}
    >
      <div className="space-y-2">
        <Selector
          label="Width"
          responsive
          value={styles?.video?.customWidth}
          placeholder="Select Width"
          onChange={(initialValue) => {
            const value = getValue(initialValue, currentBreakpoint);
            const width = styles?.video?.width;
            if (value === "custom") {
              updateBlockStyle(
                "video",
                "width",
                stringToResponsiveValue("50%", currentBreakpoint, width),
              );
            } else {
              updateBlockStyle(
                "video",
                "width",
                stringToResponsiveValue(value, currentBreakpoint, width),
              );
            }
            updateBlockStyle("video", "customWidth", initialValue);
          }}
          options={WIDTH_OPTIONS}
        />
        {getValue(styles?.video?.customWidth || "", currentBreakpoint) ===
          "custom" && (
          <StyleSlider
            label="Custom Width"
            units={WIDTH_UNITS}
            responsive={true}
            value={styles?.video?.width}
            onChange={(value) => updateBlockStyle("video", "width", value)}
          />
        )}
        <Selector
          label="Height"
          responsive
          value={styles?.video?.customHeight}
          placeholder="Select Height"
          onChange={(initialValue) => {
            const value = getValue(initialValue, currentBreakpoint);
            const height = styles?.video?.height;
            if (value === "custom") {
              updateBlockStyle(
                "video",
                "height",
                stringToResponsiveValue("100%", currentBreakpoint, height),
              );
            } else {
              updateBlockStyle(
                "video",
                "height",
                stringToResponsiveValue(value, currentBreakpoint, height),
              );
            }
            updateBlockStyle("video", "customHeight", initialValue);
          }}
          options={HEIGHT_OPTIONS}
        />
        {getValue(styles?.video?.customHeight || "", currentBreakpoint) ===
          "custom" && (
          <StyleSlider
            label="Custom Height"
            units={HEIGHT_UNITS}
            responsive={true}
            value={styles?.video?.height}
            onChange={(value) => updateBlockStyle("video", "height", value)}
          />
        )}

        <Selector
          label="Aspect Ratio"
          value={styles?.video?.aspectRatio || "16 / 9"}
          placeholder="Select Aspect Ratio"
          onChange={(value) => updateBlockStyle("video", "aspectRatio", value)}
          options={[
            { value: "16 / 9", label: "16:9 (Widescreen)" },
            { value: "4 / 3", label: "4:3 (Standard)" },
            { value: "1 / 1", label: "1:1 (Square)" },
            { value: "21 / 9", label: "21:9 (Widescreen)" },
          ]}
        />
        <StyleSlider
          label="Max Width"
          units={WIDTH_UNITS}
          responsive={true}
          value={styles?.video?.maxWidth}
          onChange={(value) => updateBlockStyle("video", "maxWidth", value)}
        />
        <StyleSlider
          label="Min Height"
          units={HEIGHT_UNITS}
          responsive={true}
          value={styles?.video?.minHeight || ""}
          onChange={(value) => updateBlockStyle("video", "minHeight", value)}
        />
      </div>
    </SectionCollapse>
  );
};

export default StyleVideo;
