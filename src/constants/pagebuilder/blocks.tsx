import { BlockButton } from "@/types/blog";
import {
  AlignLeft,
  Code,
  Columns,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Quote,
  Square,
  TextCursorInput,
  Type,
  Video,
} from "lucide-react";

export const basicBlocks: BlockButton[] = [
  {
    id: "text",
    type: "text",
    icon: Type,
    label: "Text",
    blockProps: {
      content: "Write Your Text Here ",
      styles: {
        typography: {
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "18px",
        },
        dimensions: {
          width: "100%",
        },
      },
    },
  },
  {
    id: "image",
    type: "image",
    icon: ImageIcon,
    label: "Image",
    blockProps: {
      styles: {
        dimensions: {
          width: "100%",
        },
      },
    },
  },
  {
    id: "button",
    type: "button",
    icon: Square,
    label: "Button",
    blockProps: {
      content: "Submit",
      styles: {
        typography: {
          fontSize: "16px",
          lineHeight: "18px",
          fontWeight: "700",
          color: "#ffffff",
        },
        background: {
          backgroundColor: "#2ba149",
        },
        dimensions: {
          width: "fit-content",
        },
        spacing: {
          paddingRight: "24px",
          paddingLeft: "24px",
          paddingTop: "12px",
          paddingBottom: "12px",
        },
        border: {
          borderRadius: "4px",
        },
      },
    },
  },
  {
    id: "divider",
    type: "divider",
    icon: AlignLeft,
    label: "Divider",
    blockProps: {
      styles: {},
    },
  },
];
export const layoutBlocks: BlockButton[] = [
  {
    id: "container",
    type: "container",
    icon: Square,
    label: "Container",
    blockProps: {
      allowNesting: true,
      expectedChildren: 1,
      childrenBaseStyles: {
        dimensions: {
          width: "100%",
        },
      },
      styles: {
        dimensions: {
          width: "100%",
        },
      },
    },
  },
  {
    id: "flexBox",
    type: "container",
    icon: Columns,
    label: "FlexBox",
    blockProps: {
      allowNesting: true,
      expectedChildren: 2,
      childrenBaseStyles: {
        dimensions: {
          customWidth: { md: "custom", sm: "100%" },
          width: { md: "50%", sm: "100%" },
        },
      },
      styles: {
        dimensions: {
          width: "100%",
        },
        container: {
          display: "flex",
          flexWrap: "wrap",
          items: "2",
        },
      },
    },
  },
  {
    id: "form",
    type: "form",
    icon: TextCursorInput,
    label: "Form",
    blockProps: {
      content: "",
      fields: [
        {
          id: "name",
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          id: "email",
          name: "email",
          label: "Email",
          type: "email",
          required: true,
        },
      ],
      styles: {
        dimensions: {
          customWidth: "100%",
          width: "100%",
          customMaxWidth: "custom",
          maxWidth: "450px",
        },
      },
      blocks: [],
      level: 1,
    },
  },
];

export const contentBlocks: BlockButton[] = [
  {
    id: "h1",
    type: "h1",
    icon: Heading1,
    label: "Heading 1",
    blockProps: {
      content: "Heading 1",
      styles: {
        typography: {
          fontSize: "32px",
          fontWeight: "700",
          lineHeight: "34px",
        },
      },
    },
  },
  {
    id: "h2",
    type: "h2",
    icon: Heading2,
    label: "Heading 2",
    blockProps: {
      content: "Heading 2",
      styles: {
        typography: {
          fontSize: "24px",
          fontWeight: "700",
          lineHeight: "26px",
        },
      },
    },
  },
  {
    id: "h3",
    type: "h3",
    icon: Heading3,
    label: "Heading 3",
    blockProps: {
      content: "Heading 3",
      styles: {
        typography: {
          fontSize: "20px",
          fontWeight: "700",
          lineHeight: "24px",
        },
      },
    },
  },
  {
    id: "paragraph",
    type: "paragraph",
    icon: Type,
    label: "Paragraph",
    blockProps: {
      content: "Write Your Text Here ",
      styles: {
        typography: {
          fontSize: "16px",
          lineHeight: "18px",
        },
      },
    },
  },
  {
    id: "quote",
    type: "quote",
    icon: Quote,
    label: "Quote",
    blockProps: {
      content: "Write Your Text Here ",
      styles: {
        border: {
          borderLeft: "4px solid #d1d5db",
        },
        background: {
          backgroundColor: "#f9fafb",
        },
        spacing: {
          padding: "16px",
        },
        typography: {
          fontStyle: "italic",
          color: "#4b5563",
        },
      },
    },
  },
  {
    id: "code",
    type: "code",
    icon: Code,
    label: "Code",
    blockProps: {
      content: "Write Your Text Here ",
      styles: {
        typography: {
          fontSize: "14px",
          color: "#ffffff",
        },
        border: {
          borderRadius: "4px",
        },
        background: {
          backgroundColor: "#1f2937",
        },
        spacing: {
          padding: "16px",
        },
      },
    },
  },
  {
    id: "html",
    type: "html",
    icon: Code,
    label: "HTML",
    blockProps: {
      content: "Write Your Text Here ",
      styles: {},
    },
  },
  {
    id: "video",
    type: "video",
    icon: Video,
    label: "Video",
    blockProps: {
      videoUrl:
        "https://www.youtube.com/watch?v=SSlmmUH2Ado&ab_channel=IMETSMedicalSchool",
      videoThumbnail: "",
      styles: {
        video: {
          aspectRatio: "16 / 9",
          overflow: "hidden",
        },
        dimensions: {
          height: "auto",
          width: "100%",
        },
      },
    },
  },
];
