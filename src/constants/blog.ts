import { Block, BlogType, Unit } from "@/types/blog";
import data from "./blog.json";
import { Option } from "@/types";

export const FONT_FAMILIES = [
  "Arial",
  "Roboto",
  "Montserrat",
  "Poppins",
  "Inter",
  "Open Sans",
];

export const TEXT_TRANSFORMS = [
  "none",
  "capitalize",
  "uppercase",
  "lowercase",
  "full-width",
];
export const TEXT_DECORATIONS = ["none", "underline", "line-through"];
export const TEXT_STYLES = [
  "normal",
  "italic",
  "oblique",
  "small-caps",
  "inherit",
];

export const FONT_WEIGHTS = ["300", "400", "500", "600", "700", "800"];
export const TEXT_ALIGNS = ["left", "center", "right"];
export const BACKGROUND_SIZES = ["auto", "cover", "contain"];
export const BACKGROUND_REPEATS = [
  "no-repeat",
  "repeat",
  "repeat-x",
  "repeat-y",
];
export const BORDER_STYLES = ["none", "solid", "dashed", "dotted"];
export const BOX_SHADOWS = ["none", "small", "medium", "large"];
export const SIZE_OPTIONS = [
  "auto",
  "100%",
  "75%",
  "50%",
  "25%",
  "fit-content",
];
export const PRESET_COLORS = [
  "#1a73e8",
  "#d93025",
  "#1e8e3e",
  "#f9ab00",
  "#5f6368",
  "#fff",
  "#f8f9fa",
  "#dadce0",
  "#000",
  "#202124",
];

export const BOX_SHADOWS_OPTIONS: Option[] = [
  { value: "none", label: "none" },
  { value: "0 1px 2px rgba(0,0,0,0.05)", label: "extra small" },
  { value: "0 2px 4px rgba(0,0,0,0.1)", label: "small" },
  { value: "0 4px 8px rgba(0,0,0,0.2)", label: "medium" },
  { value: "0 8px 16px rgba(0,0,0,0.3)", label: "large" },
  { value: "0 12px 24px rgba(0,0,0,0.4)", label: "extra large" },
  { value: "0 16px 32px rgba(0,0,0,0.6)", label: "huge" },
  { value: "3px 3px 6px rgba(0, 0, 0, 0.6)", label: "very huge" },
];
export const TEXT_SHADOWS_OPTIONS: Option[] = [
  { label: "None", value: "" },
  { label: "Soft Shadow", value: "2px 2px 4px rgba(0, 0, 0, 0.3)" },
  { label: "Strong Shadow", value: "3px 3px 6px rgba(0, 0, 0, 0.6)" },
  { label: "Glow (White)", value: "0 0 8px #ffffff" },
  { label: "Glow (Blue)", value: "0 0 8px #00f" },
  { label: "Deep Black", value: "4px 4px 10px rgba(0, 0, 0, 0.8)" },
  { label: "Neon Green", value: "0 0 5px #0f0, 0 0 10px #0f0" },
  { label: "Retro Red", value: "1px 1px 0 #f00, 2px 2px 0 #000" },
  { label: "3D Text", value: "1px 1px 0 #999, 2px 2px 0 #888, 3px 3px 0 #777" },
  { label: "Elegant Shadow", value: "1px 1px 2px rgba(0,0,0,0.2)" },
];

export const boxShadowValues = {
  none: "none",
  small: "0 2px 4px rgba(0,0,0,0.1)",
  medium: "0 4px 8px rgba(0,0,0,0.15)",
  large: "0 8px 16px rgba(0,0,0,0.2)",
};

export const BLOG_TEMPLATE: BlogType = {
  id: "123",
  name: "Dummy Blog",
  title: "Dummy Blog",
  description: "This is a dummy blog",
  slug: "dummy-blog",
  photo:
    "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/5SGnNwoLAbGGeKfrxIhFMX/9c898373ca6d5e5bf7882bba918810a4/GettyImages-1461608440.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000",
  keywords: "dummy, blog, test",
  authorId: "123",
  categoryId: "123",
  isActive: true,
  isDraft: false,
  isTemplate: false,
  views: 0,
  metaTitle: "Dummy Blog",
  metaDescription: "This is a dummy blog",
  content: {
    photo: "https://picsum.photos/200",
    metaData: {},
    blocks: data as Block[],
    forms: [],
  },
  created_at: "2022-01-01T00:00:00Z",
  updated_at: "2022-01-01T00:00:00Z",
  deleted_at: null,
  author: {
    id: "123",
    name: "Dummy Author",
    title: "Dummy Author",
    email: "dummy@author.com",
    photo: "https://picsum.photos/200",
    created_at: "2022-01-01T00:00:00Z",
    updated_at: "2022-01-01T00:00:00Z",
  },
  category: {
    id: "123",
    name: "Dummy Category",
    created_at: "2022-01-01T00:00:00Z",
    updated_at: "2022-01-01T00:00:00Z",
  },
};

export const SIZE_UNITS: Unit[] = [
  { value: "px", resetValue: "16", min: 1, max: 74, step: 1, regex: "[[value]]px" },
  { value: "rem", resetValue: "1", min: 1, max: 30, step: 0.1, regex: "[[value]]rem" },
  { value: "em", resetValue: "1", min: 1, max: 30, step: 0.1, regex: "[[value]]em" },
];
export const WIDTH_UNITS: Unit[] = [
  { value: "px", resetValue: "400", min: 20, max: 1100, step: 1, regex: "[[value]]px" },
  { value: "rem", resetValue: "10", min: 1, max: 70, step: 1, regex: "[[value]]rem" },
  { value: "em", resetValue: "10", min: 1, max: 70, step: 1, regex: "[[value]]em" },
  { value: "%", resetValue: "50", min: 1, max: 100, step: 1, regex: "[[value]]%" },
  { value: "vw", resetValue: "100", min: 1, max: 100, step: 1, regex: "[[value]]vw" },
];
export const HEIGHT_UNITS: Unit[] = [
  { value: "px", resetValue: "400", min: 20, max: 1100, step: 1, regex: "[[value]]px" },
  { value: "rem", resetValue: "10", min: 1, max: 70, step: 1, regex: "[[value]]rem" },
  { value: "em", resetValue: "10", min: 1, max: 70, step: 1, regex: "[[value]]em" },
  { value: "%", resetValue: "50", min: 1, max: 100, step: 1, regex: "[[value]]%" },
  { value: "vh", resetValue: "100", min: 1, max: 100, step: 1, regex: "[[value]]vh" },
];
export const SPACING_UNITS: Unit[] = [
  { value: "px", resetValue: "5", min: 0, max: 74, step: 1, regex: "[[value]]px" },
  { value: "rem", resetValue: ".25", min: 0, max: 30, step: 0.1, regex: "[[value]]rem" },
  { value: "em", resetValue: ".25", min: 0, max: 30, step: 0.1, regex: "[[value]]em" },
  { value: "%", resetValue: ".25", min: 0, max: 100, step: 1, regex: "[[value]]%" },
];
export const WIDTH_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "100%", label: "Full (100%)" },
  { value: "fit-content", label: "Fit Content" },
  { value: "max-content", label: "Max Content" },
  { value: "min-content", label: "Min Content" },
  { value: "stretch", label: "Stretch" }, // for flex/grid
  { value: "inherit", label: "Inherit" },
  { value: "initial", label: "Initial" },
  { value: "custom", label: "Custom" },
];

export const HEIGHT_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "100%", label: "Full (100%)" },
  { value: "fit-content", label: "Fit Content" },
  { value: "max-content", label: "Max Content" },
  { value: "min-content", label: "Min Content" },
  { value: "stretch", label: "Stretch" }, // for flex/grid
  { value: "inherit", label: "Inherit" },
  { value: "initial", label: "Initial" },

  { value: "custom", label: "Custom" },
];

export const FLEX_BOX_OPTIONS: string[] = [
  "col 1,1",
  "row 1",
  "row 1/2|1/2",
  "row 1/3|2/3",
  "row 2/3|1/3",
  "row 1/4|1/4|1/4|1/4",
  "row 1/4|1/2|1/4",
  "row.wrap 1/2|1/2|1/2|1/2",
  "row.wrap 1/2|1/2|1",
  "row.wrap 1/3|1/3|1/3|1/3|1/3|1/3",
  "row.wrap 1/3|1/3|1/3|1/3|2/3",
  "row.wrap 2/3|1/3|1/3|2/3",
];
