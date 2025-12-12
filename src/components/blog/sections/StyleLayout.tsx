import { Divider } from "@mui/material";
import { Selector } from "../Selector";
import { StyleSlider } from "../styleSlider";
import AlignmentSelector from "../alignmentSelector";
import {
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartVertical,
  Ban,
  FoldHorizontal,
  MoreVertical,
  Square,
  StretchVertical,
  UnfoldHorizontal,
} from "lucide-react";
import {
  HEIGHT_UNITS,
  SPACING_UNITS,
  WIDTH_OPTIONS,
  WIDTH_UNITS,
} from "@/constants/blog";
import { StyleSectionProps } from "@/types/blog";
import { getValue, stringToResponsiveValue } from "@/util/blog";
import SectionCollapse from "../SectionCollapse";
import SpaceInput from "../spacesInput";
import { useBlogStore } from "@/lib/blog/blog-store";

/**
 * A component for editing layout styles.
 *
 * @param {Object} styles The current styles of the element.
 * @param {Function} updateBlockStyle A function to call when the user changes a style.
 * @param {string} currentBreakpoint The current breakpoint.
 * @param {string} type The type of element being edited.
 * @returns {ReactElement} A React element representing the layout style editor.
 */
const StyleLayout: React.FC = () => {
  const { getActiveBlock, updateBlockStyle, currentBreakpoint } =
    useBlogStore();
  const block = getActiveBlock();
  const styles = block?.styles || {};
  return (
    <SectionCollapse
      title={"Layout"}
      defaultValue={true}
      icon={<Square size={16} className="text-primary" />}
    >
      <div className="space-y-2">
        <SpaceInput
          label="Padding"
          responsive={true}
          units={SPACING_UNITS}
          value={{
            top: styles?.spacing?.paddingTop || styles?.spacing?.padding,
            right: styles?.spacing?.paddingRight || styles?.spacing?.padding,
            bottom: styles?.spacing?.paddingBottom || styles?.spacing?.padding,
            left: styles?.spacing?.paddingLeft || styles?.spacing?.padding,
          }}
          onChange={{
            top: (value) => updateBlockStyle("spacing", "paddingTop", value),
            right: (value) =>
              updateBlockStyle("spacing", "paddingRight", value),
            bottom: (value) =>
              updateBlockStyle("spacing", "paddingBottom", value),
            left: (value) => updateBlockStyle("spacing", "paddingLeft", value),
          }}
        />
        <SpaceInput
          label="Margin"
          responsive={true}
          units={SPACING_UNITS}
          value={{
            top: styles?.dimensions?.marginTop || styles?.dimensions?.margin,
            right:
              styles?.dimensions?.marginRight || styles?.dimensions?.margin,
            bottom:
              styles?.dimensions?.marginBottom || styles?.dimensions?.margin,
            left: styles?.dimensions?.marginLeft || styles?.dimensions?.margin,
          }}
          onChange={{
            top: (value) => updateBlockStyle("dimensions", "marginTop", value),
            right: (value) =>
              updateBlockStyle("dimensions", "marginRight", value),
            bottom: (value) =>
              updateBlockStyle("dimensions", "marginBottom", value),
            left: (value) =>
              updateBlockStyle("dimensions", "marginLeft", value),
          }}
        />
        <Selector
          label="Width"
          responsive
          value={styles?.dimensions?.customWidth || styles?.dimensions?.width}
          placeholder="Select Width"
          onChange={(initialValue) => {
            const value = getValue(initialValue, currentBreakpoint);
            const width = styles?.dimensions?.width;
            if (value === "custom") {
              updateBlockStyle(
                "dimensions",
                "width",
                stringToResponsiveValue("50%", currentBreakpoint, width),
              );
            } else {
              updateBlockStyle(
                "dimensions",
                "width",
                stringToResponsiveValue(value, currentBreakpoint, width),
              );
            }
            updateBlockStyle("dimensions", "customWidth", initialValue);
          }}
          options={WIDTH_OPTIONS}
        />
        {getValue(styles?.dimensions?.customWidth || "", currentBreakpoint) ===
          "custom" && (
          <StyleSlider
            label="Custom Width"
            units={WIDTH_UNITS}
            responsive={true}
            value={styles?.dimensions?.width}
            onChange={(value) => updateBlockStyle("dimensions", "width", value)}
          />
        )}
        <Selector
          label="Height"
          responsive
          value={styles?.dimensions?.customHeight || styles?.dimensions?.height}
          placeholder="Select Height"
          onChange={(initialValue) => {
            const value = getValue(initialValue, currentBreakpoint);
            const height = styles?.dimensions?.height;
            if (value === "custom") {
              updateBlockStyle(
                "dimensions",
                "height",
                stringToResponsiveValue("50vh", currentBreakpoint, height),
              );
            } else {
              updateBlockStyle(
                "dimensions",
                "height",
                stringToResponsiveValue(value, currentBreakpoint, height),
              );
            }
            updateBlockStyle("dimensions", "customHeight", initialValue);
          }}
          options={WIDTH_OPTIONS}
        />
        {getValue(styles?.dimensions?.customHeight || "", currentBreakpoint) ===
          "custom" && (
          <StyleSlider
            label="Custom Height"
            units={WIDTH_UNITS}
            responsive={true}
            value={styles?.dimensions?.height}
            onChange={(value) =>
              updateBlockStyle("dimensions", "height", value)
            }
          />
        )}
        <Selector
          label="Max Width"
          responsive
          value={styles?.dimensions?.customMaxWidth}
          placeholder="Select Width"
          onChange={(initialValue) => {
            const value = getValue(initialValue, currentBreakpoint);
            const maxWidth = styles?.dimensions?.maxWidth;
            if (value === "custom") {
              updateBlockStyle(
                "dimensions",
                "maxWidth",
                stringToResponsiveValue("50%", currentBreakpoint, maxWidth),
              );
            } else {
              updateBlockStyle(
                "dimensions",
                "maxWidth",
                stringToResponsiveValue(value, currentBreakpoint, maxWidth),
              );
            }
            updateBlockStyle("dimensions", "customMaxWidth", initialValue);
          }}
          options={WIDTH_OPTIONS}
        />
        {getValue(
          styles?.dimensions?.customMaxWidth || "",
          currentBreakpoint,
        ) === "custom" && (
          <StyleSlider
            label="Custom Max Width"
            units={WIDTH_UNITS}
            responsive={true}
            value={styles?.dimensions?.maxWidth}
            onChange={(value) =>
              updateBlockStyle("dimensions", "maxWidth", value)
            }
          />
        )}
        <AlignmentSelector
          options={[
            {
              value: "right",
              label: <AlignEndVertical className="h-4 w-4" />,
            },
            {
              value: "left",
              label: <AlignStartVertical className="h-4 w-4" />,
            },
            {
              value: "center",
              label: <AlignCenterVertical className="h-4 w-4" />,
            },
            {
              value: "stretch",
              label: <StretchVertical className="h-4 w-4" />,
            },
          ]}
          responsive={true}
          value={styles?.dimensions?.alignSelf}
          onChange={(value) =>
            updateBlockStyle("dimensions", "alignSelf", value)
          }
          label="Alignment"
        />
        <AlignmentSelector
          options={[
            { value: "none", label: <Ban className="h-4 w-4" /> },
            {
              value: "grow",
              label: <UnfoldHorizontal className="h-4 w-4" />,
            },
            {
              value: "shrink",
              label: <FoldHorizontal className="h-4 w-4" />,
            },
            {
              value: "custom",
              label: <MoreVertical className="h-4 w-4" />,
            },
          ]}
          label="Size"
          responsive={true}
          value={styles?.dimensions?.size || "none"}
          onChange={(initialValue) => {
            const value = getValue(initialValue, currentBreakpoint);
            const shrinkValue = styles?.dimensions?.flexShrink;
            const growValue = styles?.dimensions?.flexGrow;

            if (value === "grow") {
              updateBlockStyle(
                "dimensions",
                "flexGrow",
                stringToResponsiveValue("1", currentBreakpoint, growValue),
              );
              updateBlockStyle(
                "dimensions",
                "flexShrink",
                stringToResponsiveValue("0", currentBreakpoint, shrinkValue),
              );
            } else if (value === "shrink") {
              updateBlockStyle(
                "dimensions",
                "flexGrow",
                stringToResponsiveValue("0", currentBreakpoint, growValue),
              );
              updateBlockStyle(
                "dimensions",
                "flexShrink",
                stringToResponsiveValue("1", currentBreakpoint, shrinkValue),
              );
            } else if (value === "custom") {
              updateBlockStyle(
                "dimensions",
                "flexGrow",
                stringToResponsiveValue("1", currentBreakpoint, growValue),
              );
              updateBlockStyle(
                "dimensions",
                "flexShrink",
                stringToResponsiveValue("1", currentBreakpoint, shrinkValue),
              );
            } else {
              updateBlockStyle(
                "dimensions",
                "flexGrow",
                stringToResponsiveValue("0", currentBreakpoint, growValue),
              );
              updateBlockStyle(
                "dimensions",
                "flexShrink",
                stringToResponsiveValue("0", currentBreakpoint, shrinkValue),
              );
            }
            updateBlockStyle("dimensions", "size", initialValue);
          }}
        />
        {getValue(styles?.dimensions?.size || "", currentBreakpoint) ===
          "custom" && (
          <>
            <StyleSlider
              label="Flex Grow"
              responsive={true}
              units={[
                {
                  value: "",
                  resetValue: "1",
                  min: 0,
                  max: 10,
                  step: 1,
                  regex: "",
                },
              ]}
              value={styles?.dimensions?.flexGrow}
              onChange={(value) =>
                updateBlockStyle("dimensions", "flexGrow", value)
              }
            />
            <StyleSlider
              label="Flex Shrink"
              responsive={true}
              units={[
                {
                  value: "",
                  resetValue: "1",
                  min: 0,
                  max: 10,
                  step: 1,
                  regex: "",
                },
              ]}
              value={styles?.dimensions?.flexShrink}
              onChange={(value) =>
                updateBlockStyle("dimensions", "flexShrink", value)
              }
            />
          </>
        )}
      </div>
    </SectionCollapse>
  );
};

export default StyleLayout;
