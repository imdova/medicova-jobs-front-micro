/* eslint-disable @next/next/no-img-element */
// components/page-builder/BlockRenderer.tsx
import { Box, Divider, TextareaAutosize } from "@mui/material";
import { BlockTextEditor } from "@/components/editor/editor";
import { Block, ResponsiveStyle, StyleConfig } from "@/types/blog";
import YouTubePlayer from "../UI/youtube-video-player";
import { Info, Plus } from "lucide-react";
import Resize from "../UI/Resize";
import React from "react";
import DropZone from "./dropzone";
import BlockComponent from "./BlockComponent";
import { useBlogStore } from "@/lib/blog/blog-store";
import {
  convertResponsiveToCssStyles,
  extractCssFromResponsive,
  extractValueFromTemplate,
  getValue,
  stringToResponsiveValue,
} from "@/util/blog";
import { FormGrid } from "../form/FormModal/FormGrid";
import { AutoWidthTextarea } from "../UI/AutoWidthTextarea";
import { cn } from "@/util";

interface BlockRendererProps {
  block: Block;
  path: string;
}

export function BlockRenderer({ block, path }: BlockRendererProps) {
  const {
    selectedBlockId,
    updateBlock,
    handleDrop,
    currentBreakpoint,
    selectForm,
  } = useBlogStore();
  const isSelected = selectedBlockId === block.id;

  const updateBlockStyles = (styles: Partial<Block["styles"]>) => {
    updateBlock(
      {
        styles: { ...block?.styles, ...styles },
      },
      block.id,
    );
  };

  const handleStyleChange = (
    category: keyof Block["styles"],
    property: string,
    value: ResponsiveStyle,
  ) => {
    const styles: Block["styles"] = {
      ...block?.styles,
      [category]: {
        ...block?.styles[category],
        [property]: value,
      },
    };
    updateBlockStyles(styles);
  };

  const styles = convertResponsiveToCssStyles(block.styles, currentBreakpoint);

  switch (block.type) {
    case "h1":
      return (
        <AutoWidthTextarea
          minRows={1}
          placeholder="Heading 1"
          style={{
            ...styles.typography,
            ...styles.border,
            ...styles.spacing,
            ...styles.background,
          }}
          value={block.content}
          autoWidth={styles.dimensions?.width === "fit-content"}
          onChange={(e) => updateBlock({ content: e.target.value }, block.id)}
          className="w-full max-w-full resize-none focus:outline-none"
        />
      );

    case "h2":
      return (
        <AutoWidthTextarea
          minRows={1}
          style={{
            ...styles.typography,
            ...styles.border,
            ...styles.spacing,
            ...styles.background,
          }}
          placeholder="Heading 2"
          value={block.content}
          autoWidth={styles.dimensions?.width === "fit-content"}
          onChange={(e) => updateBlock({ content: e.target.value }, block.id)}
          className="w-full max-w-full resize-none focus:outline-none"
        />
      );

    case "h3":
      return (
        <AutoWidthTextarea
          minRows={1}
          placeholder="Heading 3"
          style={{
            ...styles.typography,
            ...styles.border,
            ...styles.spacing,
            ...styles.background,
          }}
          value={block.content}
          autoWidth={styles.dimensions?.width === "fit-content"}
          onChange={(e) => updateBlock({ content: e.target.value }, block.id)}
          className="w-full max-w-full resize-none focus:outline-none"
        />
      );
    case "text":
      return (
        <AutoWidthTextarea
          minRows={1}
          placeholder="Text"
          style={{
            ...styles.typography,
            ...styles.border,
            ...styles.spacing,
            ...styles.background,
          }}
          value={block.content}
          autoWidth={styles.dimensions?.width === "fit-content"}
          onChange={(e) => updateBlock({ content: e.target.value }, block.id)}
          className="w-full max-w-full resize-none focus:outline-none"
        />
      );

    case "paragraph":
      return (
        <BlockTextEditor
          isSelected={isSelected}
          value={block.content || "<p> This Is My Paragraph </p>"}
          style={{
            ...styles.typography,
            ...styles.border,
            ...styles.spacing,
            ...styles.background,
          }}
          onChange={(content) => updateBlock({ content }, block.id)}
        />
      );
    case "divider":
      return (
        <Divider
          style={{
            ...styles.border,
            ...styles.spacing,
            ...styles.background,
          }}
        />
      );

    case "image":
      return (
        <Resize
          initialWidthPercent={Number(
            styles.dimensions?.width.replace("%", ""),
          )}
          onChange={(stringValue) => {
            const initialWidth = block.styles?.dimensions?.width;
            const value = stringToResponsiveValue(
              stringValue + "%",
              currentBreakpoint,
              initialWidth,
            );
            handleStyleChange("dimensions", "customWidth", "custom");
            handleStyleChange("dimensions", "width", value);
          }}
        >
          <Box
            component="img"
            src={
              block.imageUrl ??
              "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
            }
            alt="Content"
            sx={{
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              ...styles.border,
              ...styles.spacing,
              ...styles.background,
              ...styles.image,
            }}
          />
        </Resize>
      );

    case "button":
      if (block.buttonType === "modal") {
        return (
          <button
            className={cn(
              "block cursor-pointer",
              styles.dimensions?.width != "fit-content" && "w-full",
            )}
            style={{
              ...styles.typography,
              ...styles.border,
              ...styles.spacing,
              ...styles.background,
              ...styles.button,
            }}
          >
            {block.content}
          </button>
        );
      }
      return (
        <div
          className={cn(
            "block cursor-pointer",
            styles.dimensions?.width != "fit-content" && "w-full",
          )}
          style={{
            textAlign: "center",
            ...styles.typography,
            ...styles.border,
            ...styles.spacing,
            ...styles.background,
            ...styles.button,
          }}
        >
          {block.content}
        </div>
      );

    case "html":
      return (
        <div
          dangerouslySetInnerHTML={{ __html: block.content }}
          className="prose pointer-events-none max-w-none"
        />
      );
    case "container":
      const columnsValue = getValue(
        String(styles.container?.gridTemplateColumns),
        currentBreakpoint,
      );
      const rowsValue = getValue(
        String(styles.container?.gridTemplateRows),
        currentBreakpoint,
      );

      const numOfCols =
        extractValueFromTemplate(
          columnsValue,
          "repeat([[value]], minmax(0, 1fr))",
        ) || 1;
      const numOfRows =
        extractValueFromTemplate(
          rowsValue,
          "repeat([[value]], minmax(0, 1fr))",
        ) || 1;

      const placeholders =
        getValue(styles.container?.display || "", currentBreakpoint) === "flex"
          ? 1 - block.blocks?.length
          : numOfCols > 0
            ? numOfCols * numOfRows - block.blocks?.length
            : block.blocks?.length === 0
              ? block.expectedChildren
                ? block.expectedChildren - block.blocks?.length
                : 1
              : 0;
      const itemStyle = extractCssFromResponsive(
        block.childrenBaseStyles?.dimensions,
        currentBreakpoint,
      );
      return (
        <Box
          // component={block.isForm ? "form" : "div"}
          className="CONTAINER overflow-hidden"
          style={{
            height: "100%",
            ...styles.spacing,
            ...styles.border,
            ...styles.container,
            ...styles.background,
          }}
        >
          {block.blocks.map((block, index) => (
            <BlockComponent
              key={index}
              pathTop={`${path}-${index}`}
              pathBottom={`${path}-${index + 1}`}
              block={block}
              isHorizontal={
                Number(numOfCols) > 1 ||
                (getValue(
                  styles.container?.display || "",
                  currentBreakpoint,
                ) === "flex" &&
                  getValue(
                    styles.container?.flexDirection || "",
                    currentBreakpoint,
                  ) != "column")
              }
            />
          ))}
          {placeholders > 0 &&
            Array.from({ length: placeholders }).map((_, penholder_index) => (
              <DropZone
                key={penholder_index}
                data={{
                  path: `${path}-${block.blocks?.length}`,
                }}
                onDrop={handleDrop}
                styles={itemStyle}
                className="DROP_ZONE h-full min-h-24 w-full border-2 border-dashed"
              >
                <div className="flex h-full min-h-24 flex-col items-center justify-center p-6">
                  <div className="flex w-full items-center justify-center">
                    <Plus className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
              </DropZone>
            ))}
        </Box>
      );

    case "quote":
      return (
        <blockquote
          style={{
            ...styles.typography,
            ...styles.spacing,
            ...styles.background,
            ...styles.border,
          }}
        >
          <TextareaAutosize
            minRows={1}
            placeholder="Quote"
            value={block.content}
            onChange={(e) => updateBlock({ content: e.target.value }, block.id)}
            className="w-full resize-none bg-transparent focus:outline-none"
          />
        </blockquote>
      );

    case "code":
      return (
        <pre
          className="max-h-full overflow-auto"
          style={{
            ...styles.dimensions,
            ...styles.spacing,
            ...styles.background,
          }}
        >
          <TextareaAutosize
            minRows={1}
            placeholder="Insert your code here"
            value={block.content}
            style={{ ...block.styles.typography }}
            onChange={(e) => updateBlock({ content: e.target.value }, block.id)}
            className="w-full resize-none bg-transparent focus:outline-none"
          />
        </pre>
      );

    case "video":
      return (
        <div
          style={{
            ...styles.video,
            ...styles.spacing,
            ...styles.background,
            ...styles.border,
          }}
        >
          {block.videoUrl ? (
            <YouTubePlayer
              videoUrl={block.videoUrl}
              thumbnailUrl={block.videoThumbnail}
            />
          ) : (
            <div className="flex items-center justify-center bg-gray-500">
              <Info /> <span>This Video isn&apos;t Available </span>
            </div>
          )}
        </div>
      );
    case "form":
      return <FormBlock block={block} styles={styles} />;
    default:
      return null;
  }
}

const FormBlock = ({
  block,
  styles,
}: {
  block: Block;
  styles: StyleConfig;
}) => {
  const [data, setData] = React.useState(block);
  return (
    <Box
      sx={{
        ...styles.spacing,
        ...styles.background,
        ...styles.border,
      }}
    >
      {/* {(block.formData?.title || block.formData?.description) && (
        <ModalHeader
          title={block.formData?.title}
          description={block.formData?.description}
        />
      )} */}
      <FormGrid
        className="mt-0 p-0"
        fields={block.fields || []}
        data={data}
        setData={setData}
      />
      {/* <FormActions /> */}
    </Box>
  );
};
