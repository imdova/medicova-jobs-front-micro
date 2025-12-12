import { Selector } from "../Selector";
import { StyleSlider } from "../styleSlider";
import AlignmentSelector from "../alignmentSelector";
import { getValue } from "@/util/blog";
import { ColorSelector } from "../ColorSelector";
import { BlockType, StyleSectionProps } from "@/types/blog";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Type,
} from "lucide-react";
import {
  SIZE_UNITS,
  FONT_FAMILIES,
  FONT_WEIGHTS,
  TEXT_DECORATIONS,
  TEXT_SHADOWS_OPTIONS,
  TEXT_STYLES,
  TEXT_TRANSFORMS,
} from "@/constants/blog";
import SectionCollapse from "../SectionCollapse";
import { useBlogStore } from "@/lib/blog/blog-store";

const StyleTypography: React.FC = () => {
  const { getActiveBlock, updateBlockStyle, currentBreakpoint } =
    useBlogStore();
  const block = getActiveBlock();
  const styles = block?.styles || {};

  const allowList: BlockType[] = [
    "text",
    "button",
    "code",
    "quote",
    "h1",
    "h2",
    "h3",
    "paragraph",
  ];
  if (block?.type && !allowList.includes(block?.type)) return null;

  return (
    <SectionCollapse
      title={"Typography"}
      defaultValue={true}
      icon={<Type size={16} className="text-primary" />}
    >
      <div className="space-y-2">
        <AlignmentSelector
          options={[
            { value: "left", label: <AlignLeft className="h-4 w-4" /> },
            { value: "center", label: <AlignCenter className="h-4 w-4" /> },
            { value: "right", label: <AlignRight className="h-4 w-4" /> },
            {
              value: "justify",
              label: <AlignJustify className="h-4 w-4" />,
            },
          ]}
          responsive={true}
          value={styles?.typography?.textAlign}
          onChange={(value) =>
            updateBlockStyle("typography", "textAlign", value)
          }
          label="Alignment"
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Color</p>
          <ColorSelector
            value={getValue(styles?.typography?.color || "", currentBreakpoint)}
            onChange={(value) => {
              updateBlockStyle("typography", "color", value);
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Stroke</p>
          <ColorSelector
            value={getValue(
              styles?.typography?.stroke || "",
              currentBreakpoint,
            )}
            onChange={(value) => {
              updateBlockStyle("typography", "stroke", value);
              updateBlockStyle("typography", "WebkitTextStrokeColor", value);
            }}
          />
        </div>
        <StyleSlider
          label="Stroke Width"
          defaultUnit="px"
          responsive={true}
          value={styles?.typography?.strokeWidth}
          onChange={(value) => {
            updateBlockStyle("typography", "strokeWidth", value);
            updateBlockStyle("typography", "WebkitTextStrokeWidth", value);
          }}
        />
        <Selector
          label="Font Family"
          value={styles?.typography?.fontFamily}
          placeholder="e.g. Arial"
          onChange={(value) =>
            updateBlockStyle("typography", "fontFamily", value)
          }
          options={FONT_FAMILIES.map((x) => ({ value: x, label: x }))}
        />
        <StyleSlider
          label="Font Size"
          units={SIZE_UNITS}
          responsive={true}
          value={styles?.typography?.fontSize}
          onChange={(value) =>
            updateBlockStyle("typography", "fontSize", value)
          }
        />
        <StyleSlider
          label="Line Height"
          units={SIZE_UNITS}
          responsive={true}
          value={styles?.typography?.lineHeight}
          onChange={(value) =>
            updateBlockStyle("typography", "lineHeight", value)
          }
        />
        <Selector
          label="Font Style"
          value={styles?.typography?.fontStyle}
          placeholder="e.g. normal"
          onChange={(value) =>
            updateBlockStyle("typography", "fontStyle", value)
          }
          options={TEXT_STYLES.map((x) => ({
            value: x,
            label: x,
          }))}
        />
        <Selector
          label="Text Decoration"
          value={styles?.typography?.textDecoration}
          placeholder="e.g. none"
          onChange={(value) =>
            updateBlockStyle("typography", "textDecoration", value)
          }
          options={TEXT_DECORATIONS.map((x) => ({
            value: x,
            label: x,
          }))}
        />
        <Selector
          label="Text Transform"
          value={styles?.typography?.textTransform}
          placeholder="e.g. none"
          onChange={(value) =>
            updateBlockStyle("typography", "textTransform", value)
          }
          options={TEXT_TRANSFORMS.map((x) => ({
            value: x,
            label: x,
          }))}
        />
        <Selector
          label="Font Weight"
          value={styles?.typography?.fontWeight}
          placeholder="e.g. 400"
          onChange={(value) =>
            updateBlockStyle("typography", "fontWeight", value)
          }
          options={FONT_WEIGHTS.map((x) => ({ value: x, label: x }))}
        />
        <StyleSlider
          label="Letter Spacing"
          defaultUnit="px"
          responsive={true}
          value={styles?.typography?.letterSpacing}
          onChange={(value) =>
            updateBlockStyle("typography", "letterSpacing", value)
          }
        />
        <StyleSlider
          label="Word Spacing"
          defaultUnit="px"
          responsive={true}
          value={styles?.typography?.wordSpacing}
          onChange={(value) =>
            updateBlockStyle("typography", "wordSpacing", value)
          }
        />
        <Selector
          label="Text Shadow"
          value={styles?.typography?.textShadow}
          placeholder="e.g. 0 0 10px rgba(0, 0, 0, 0.2)"
          onChange={(value) =>
            updateBlockStyle("typography", "textShadow", value)
          }
          options={TEXT_SHADOWS_OPTIONS}
        />
      </div>
    </SectionCollapse>
  );
};

export default StyleTypography;
