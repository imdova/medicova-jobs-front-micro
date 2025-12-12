import React, { memo, useMemo } from "react";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Info } from "@mui/icons-material";
import YouTubePlayer from "@/components/UI/youtube-video-player";
import { convertResponsiveToCssStyles } from "@/util/blog";
import { Block, BreakPoints, FormItem } from "@/types/blog";
import FormBlock from "./BlockForm";
import { BlockModalButton } from "../sections/BlockModalButton";

interface BlockRendererProps {
  block: Block;
  breakpoint?: BreakPoints;
  forms?: FormItem[];
}

const BlockItem: React.FC<BlockRendererProps> = ({
  block,
  breakpoint,
  forms,
}) => {
  const sx = useMemo(() => {
    if (breakpoint && block.styles) {
      return convertResponsiveToCssStyles(block.styles, breakpoint);
    }
    return block.styles ?? {};
  }, [block.styles, breakpoint]);

  const textStyles = useMemo(
    () => ({
      maxWidth: "100%",
      ...sx.typography,
      ...sx.border,
      ...sx.spacing,
      ...sx.background,
      ...sx.dimensions,
    }),
    [sx],
  );

  const renderChildren = useMemo(
    () =>
      block.blocks?.map((child) => (
        <BlockItem
          key={child.id}
          block={child}
          breakpoint={breakpoint}
          forms={forms}
        />
      )) ?? null,
    [block.blocks, breakpoint, forms],
  );

  switch (block.type) {
    case "h1":
      return (
        <Typography variant="h1" sx={textStyles}>
          {block.content}
        </Typography>
      );

    case "h2":
      return (
        <Typography variant="h2" sx={textStyles}>
          {block.content}
        </Typography>
      );

    case "h3":
      return (
        <Typography variant="h3" sx={textStyles}>
          {block.content}
        </Typography>
      );

    case "text":
      return <Typography sx={textStyles}>{block.content}</Typography>;

    case "paragraph":
      return (
        <Box
          component="div"
          sx={{
            maxWidth: "100%",
            ...sx.dimensions,
            "& *": {
              ...sx.spacing,
              ...sx.background,
              ...sx.border,
              ...sx.typography,
            },
            "& .ProseMirror": { border: "none", p: 0, minHeight: "unset" },
            "& .ProseMirror:focus": { border: "none" },
            "& a, a *": {
              color: "blue !important",
              textDecoration: "underline !important",
              cursor: "pointer !important",
              "&:hover": {
                textDecoration: "none !important",
              },
            },
          }}
          className="prose prose-sm focus:border-none focus:outline-none"
          dangerouslySetInnerHTML={{
            __html:
              block.content?.replace(
                /<p>(?:\s|&nbsp;)*<\/p>/gi,
                "<p><br></p>",
              ) ?? "",
          }}
        />
      );
    case "html":
      return (
        <Box
          component="div"
          sx={{
            maxWidth: "100%",
            ...sx.dimensions,
            ...sx.spacing,
            "& .ProseMirror": { border: "none", p: 0, minHeight: "unset" },
            "& .ProseMirror:focus": { border: "none" },
          }}
          className="prose prose-sm overflow-hidden focus:border-none focus:outline-none"
          dangerouslySetInnerHTML={{
            __html:
              block.content?.replace(
                /<p>(?:\s|&nbsp;)*<\/p>/gi,
                "<p><br></p>",
              ) ?? "",
          }}
        />
      );

    case "divider":
      return (
        <Divider
          sx={{
            maxWidth: "100%",
            ...sx.border,
            ...sx.spacing,
            ...sx.background,
          }}
        />
      );

    case "image": {
      return (
        <Box
          sx={{
            maxWidth: "100%",
            position: "relative",
            ...sx.dimensions,
            ...sx.spacing,
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
              ...sx.image,
              ...sx.border,
              ...sx.background,
            }}
          />
        </Box>
      );
    }

    case "button":
      if (block.buttonType === "link")
        return (
          <Link
            className="block"
            href={block.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textAlign: "center",
              ...textStyles,
              ...sx.button,
            }}
          >
            {block.content}
          </Link>
        );
      if (block.buttonType === "submit")
        return (
          <Box
            component="button"
            form={block.formId}
            type="submit"
            sx={{ height: "auto", ...textStyles, ...sx.button }}
          >
            {block.content}
          </Box>
        );
      if (block.buttonType === "modal")
        return (
          <BlockModalButton
            block={block}
            forms={forms}
            sx={{ height: "auto", ...textStyles, ...sx.button }}
          />
        );
      return (
        <Box
          component="button"
          sx={{ height: "auto", ...textStyles, ...sx.button }}
        >
          {block.content}
        </Box>
      );
    case "container":
      return (
        <Box
          // component={block.isForm ? "form" : "div"}
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            ...sx.spacing,
            ...sx.border,
            ...sx.container,
            ...sx.background,
            ...sx.dimensions,
          }}
        >
          {renderChildren}
        </Box>
      );
    case "quote":
      return (
        <Box component="blockquote" sx={textStyles}>
          <Typography>{block.content}</Typography>
        </Box>
      );

    case "code":
      return (
        <Box
          component="pre"
          className="max-h-full overflow-auto"
          sx={{
            maxWidth: "100%",
            ...sx.dimensions,
            ...sx.spacing,
            ...sx.background,
          }}
        >
          <Typography component="code" color="white" sx={sx.typography}>
            {block.content}
          </Typography>
        </Box>
      );

    case "video":
      return (
        <Box
          sx={{
            maxWidth: "100%",
            ...sx.dimensions,
            ...sx.video,
          }}
        >
          {block.videoUrl ? (
            <YouTubePlayer
              videoUrl={block.videoUrl}
              thumbnailUrl={block.videoThumbnail}
            />
          ) : (
            <div className="flex items-center justify-center bg-gray-500">
              <Info /> <span>This Video isn&apos;t Available</span>
            </div>
          )}
        </Box>
      );
    case "form":
      return <FormBlock block={block} sx={sx} forms={forms} />;

    default:
      return null;
  }
};

export default memo(BlockItem);
