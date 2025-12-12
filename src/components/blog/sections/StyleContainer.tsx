import { Divider } from "@mui/material";
import { Selector } from "../Selector";
import { StyleSlider } from "../styleSlider";
import AlignmentSelector from "../alignmentSelector";
import {
  AlignHorizontalDistributeCenter,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Redo2,
  SquareDashedTopSolid,
  StretchVertical,
} from "lucide-react";
import { HEIGHT_UNITS, SPACING_UNITS, WIDTH_UNITS } from "@/constants/blog";
import { getValue, stringToResponsiveValue } from "@/util/blog";
import SectionCollapse from "../SectionCollapse";
import { useBlogStore } from "@/lib/blog/blog-store";

const StyleContainer: React.FC = () => {
  const { getActiveBlock, updateBlockStyle, currentBreakpoint } =
    useBlogStore();
  const block = getActiveBlock();
  const styles = block?.styles || {};

  if (block?.type !== "container") return null;
  return (
    <SectionCollapse
      title={"Container"}
      defaultValue={true}
      icon={<SquareDashedTopSolid size={16} className="text-primary" />}
    >
      <div className="space-y-2">
        <Selector
          label="Container Layout"
          responsive
          value={styles?.container?.display}
          placeholder="Select Container Layout"
          onChange={(value) => {
            updateBlockStyle("container", "display", value);
          }}
          options={[
            { value: "flex", label: "Flexbox" },
            { value: "grid", label: "Grid" },
          ]}
        />
        {getValue(styles?.container?.display || "", currentBreakpoint) ===
          "grid" && (
          <>
            <StyleSlider
              label="Columns"
              units={[
                {
                  value: "fr",
                  max: 100,
                  min: 1,
                  resetValue: "1fr",
                  step: 1,
                  regex: "repeat([[value]], minmax(0, 1fr))",
                },
              ]}
              value={styles?.container?.gridTemplateColumns}
              onChange={(value) =>
                updateBlockStyle("container", "gridTemplateColumns", value)
              }
              responsive={true}
            />
            <StyleSlider
              label="Rows"
              units={[
                {
                  value: "fr",
                  max: 100,
                  min: 1,
                  resetValue: "1fr",
                  step: 1,
                  regex: "repeat([[value]], minmax(0, 1fr))",
                },
              ]}
              value={styles?.container?.gridTemplateRows}
              onChange={(value) =>
                updateBlockStyle("container", "gridTemplateRows", value)
              }
              responsive={true}
            />
          </>
        )}
        <Divider className="mt-4" />
        <Selector
          label="Content Width"
          responsive
          value={styles?.container?.contentWidth}
          placeholder="Select Container Layout"
          onChange={(initialValue) => {
            const value = getValue(initialValue, currentBreakpoint);
            const maxWidth = styles?.container?.maxWidth;
            const width = styles?.container?.width;
            const marginLeft = styles?.dimensions?.marginLeft;
            const marginRight = styles?.dimensions?.marginRight;
            if (value === "boxed") {
              updateBlockStyle(
                "container",
                "maxWidth",
                stringToResponsiveValue("1100px", currentBreakpoint, maxWidth),
              );
              updateBlockStyle(
                "dimensions",
                "marginLeft",
                stringToResponsiveValue("auto", currentBreakpoint, marginLeft),
              );
              updateBlockStyle(
                "dimensions",
                "marginRight",
                stringToResponsiveValue("auto", currentBreakpoint, marginRight),
              );
            } else {
              updateBlockStyle(
                "container",
                "maxWidth",
                stringToResponsiveValue("none", currentBreakpoint, maxWidth),
              );
              updateBlockStyle(
                "container",
                "width",
                stringToResponsiveValue("100%", currentBreakpoint, width),
              );
              updateBlockStyle(
                "dimensions",
                "marginLeft",
                stringToResponsiveValue("", currentBreakpoint, marginLeft),
              );
              updateBlockStyle(
                "dimensions",
                "marginRight",
                stringToResponsiveValue("", currentBreakpoint, marginRight),
              );
            }
            updateBlockStyle("container", "contentWidth", initialValue);
          }}
          options={[
            { value: "boxed", label: "Boxed" },
            { value: "full-width", label: "Full Width" },
          ]}
        />
        {getValue(styles?.container?.contentWidth || "", currentBreakpoint) ===
        "boxed" ? (
          <StyleSlider
            label="Max Width"
            units={WIDTH_UNITS}
            responsive={true}
            value={styles?.container?.maxWidth}
            onChange={(value) =>
              updateBlockStyle("container", "maxWidth", value)
            }
          />
        ) : (
          <StyleSlider
            label="Width"
            units={WIDTH_UNITS}
            responsive={true}
            value={styles?.container?.width}
            onChange={(value) => updateBlockStyle("container", "width", value)}
          />
        )}
        <StyleSlider
          label="Min Height"
          units={HEIGHT_UNITS}
          responsive={true}
          value={styles?.container?.minHeight || ""}
          onChange={(value) =>
            updateBlockStyle("container", "minHeight", value)
          }
        />
        <Divider className="mt-4" />
        <h4>Items</h4>
        <AlignmentSelector
          options={[
            { value: "row", label: <ArrowRight className="h-4 w-4" /> },
            { value: "column", label: <ArrowDown className="h-4 w-4" /> },
            {
              value: "row-reverse",
              label: <ArrowLeft className="h-4 w-4" />,
            },
            {
              value: "column-reverse",
              label: <ArrowUp className="h-4 w-4" />,
            },
          ]}
          responsive={true}
          value={styles?.container?.flexDirection}
          onChange={(value) =>
            updateBlockStyle("container", "flexDirection", value)
          }
          label="Direction"
        />
        <AlignmentSelector
          options={[
            {
              value: "flex-start",
              label: <AlignHorizontalJustifyStart className="h-4 w-4" />,
            },
            {
              value: "center",
              label: <AlignHorizontalJustifyCenter className="h-4 w-4" />,
            },
            {
              value: "flex-end",
              label: <AlignHorizontalJustifyEnd className="h-4 w-4" />,
            },
            {
              value: "space-between",
              label: <AlignHorizontalSpaceBetween className="h-4 w-4" />,
            },
            {
              value: "space-around",
              label: <AlignHorizontalSpaceAround className="h-4 w-4" />,
            },
            {
              value: "space-evenly",
              label: <AlignHorizontalDistributeCenter className="h-4 w-4" />,
            },
          ]}
          responsive={true}
          value={styles?.container?.justifyContent}
          onChange={(value) =>
            updateBlockStyle("container", "justifyContent", value)
          }
          label="Justify Content"
        />
        <AlignmentSelector
          options={[
            {
              value: "flex-start",
              label: <AlignVerticalJustifyStart className="h-4 w-4" />,
            },
            {
              value: "center",
              label: <AlignVerticalJustifyCenter className="h-4 w-4" />,
            },
            {
              value: "flex-end",
              label: <AlignVerticalJustifyEnd className="h-4 w-4" />,
            },
            {
              value: "stretch",
              label: <StretchVertical className="h-4 w-4" />,
            },
          ]}
          responsive={true}
          value={styles?.container?.alignItems}
          onChange={(value) =>
            updateBlockStyle("container", "alignItems", value)
          }
          label="Align Items"
        />

        <StyleSlider
          label="Gutter"
          units={SPACING_UNITS}
          value={styles?.container?.gap}
          onChange={(value) => updateBlockStyle("container", "gap", value)}
          responsive={true}
        />
        <AlignmentSelector
          options={[
            { value: "nowrap", label: <ArrowRight className="h-4 w-4" /> },
            {
              value: "wrap",
              label: <Redo2 className="h-4 w-4 rotate-180" />,
            },
          ]}
          responsive={true}
          value={styles?.container?.flexWrap}
          onChange={(value) => updateBlockStyle("container", "flexWrap", value)}
          label="Flex Wrap"
        />
      </div>
    </SectionCollapse>
  );
};

export default StyleContainer;
