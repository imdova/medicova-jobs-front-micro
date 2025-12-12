import { ErrorField, FieldConfig } from ".";

export type BreakPoints = "md" | "sm" | "xs";

export interface StyleState {
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  fontWeight?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundSize?: string;
  backgroundRepeat?: string;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  margin?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
  boxShadow?: string;
  opacity?: number;
  width?: string;
  height?: string;
  letterSpacing?: number;

  display?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  justifyContent?: string;
  alignItems?: string;
  gap?: number;
}

export type BlockType =
  | "h1"
  | "h2"
  | "h3"
  | "text"
  | "paragraph"
  | "image"
  | "button"
  | "html"
  | "divider"
  | "container"
  | "quote"
  | "code"
  | "form"
  | "video";

export type ToolBarTabs =
  | "blocks"
  | "styles"
  | "forms"
  | "settings"
  | "component-tree";

export type DropZoneData = {
  path: string;
};
export type DraggedBlock = Block & { path: string };

export type ResponsiveValue = Partial<Record<BreakPoints, string>>;
export type ResponsiveStyle = ResponsiveValue | string | undefined;
export type ResponsiveStyles = Record<string, ResponsiveStyle>;

export interface StyleConfig {
  container?: ResponsiveStyles | null;
  button?: ResponsiveStyles | null;
  image?: ResponsiveStyles | null;
  typography?: ResponsiveStyles | null;
  background?: ResponsiveStyles | null;
  video?: ResponsiveStyles | null;
  dimensions?: ResponsiveStyles | null;
  spacing?: ResponsiveStyles | null;
  border?: ResponsiveStyles | null;
}
export interface FormFieldConfig extends FieldConfig {
  id: string;
}
export interface Block {
  id: string;
  parentId?: string | null;
  type: BlockType;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  isForm?: boolean;
  linkUrl?: string;
  buttonType?: "submit" | "link" | "modal";
  formId?: string;
  fields?: FormFieldConfig[];
  formData?: {
    name?: string;
    title?: string;
    hideLabel?: boolean;
    description?: string;
    method?: "POST" | "PUT" | "PATCH" | "GET"; // Optional API method
    headers?: Record<string, string>; // Custom headers
    apiEndpoint?: string;
    afterSubmit?: "close" | "open popup" | "redirect" | "none";
    afterSubmitMessage?: string;
    onSuccessRedirect?: string;
    onSuccessMessage?: string;
    onErrorRedirect?: string;
    onErrorMessage?: string;
  };
  styles: StyleConfig;
  blocks: Block[];
  level: number;
  expectedChildren?: number;
  childrenBaseStyles?: StyleConfig;
  allowNesting?: boolean;
}

export interface FormItem {
  id: string;
  name: string;
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  method?: "POST" | "PUT" | "PATCH" | "GET"; // Optional API method
  apiEndpoint?: string;
  afterSubmit?: string;
  afterSubmitMessage?: string;
  onSuccessRedirect?: string;
  onSuccessMessage?: string;
  onErrorRedirect?: string;
  onErrorMessage?: string;

  submitButtonText?: string;
  cancelButtonText?: string;
}

export type BlogType = {
  id: string;
  name: string;
  title: string;
  description: string;
  slug: string;
  photo: string;
  // TODO: Keywords of the blog isn't working as expected
  keywords: string;
  authorId: string;
  categoryId: string;
  isActive: boolean;
  isDraft: boolean;
  isTemplate: boolean;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  content: {
    // TODO: Photo of the blog isn't working as expected
    photo?: string;
    metaData?: any;
    blocks: Block[];
    forms: FormItem[];
  };
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  _version?: number | null;
  author?: Author;
  category?: Category;
};

export type BlockButton = {
  id: string;
  type: BlockType;
  icon: React.ElementType;
  label: string;
  blockProps?: Partial<Block>;
};

export type BlockForm = {
  title?: string;
  type: BlockType[];
  description?: string;
  isModal?: boolean;
  fields: FieldConfig[];
};
export interface TabProps {
  selectedBlock?: Block | null;
  blocks?: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  setSelectedBlock: React.Dispatch<React.SetStateAction<Block | null>>;
  setSelectedTab: React.Dispatch<React.SetStateAction<ToolBarTabs>>;
  forms?: FormItem[];
  errors?: ErrorField[];
}

export interface Author {
  id: string;
  name: string;
  title: string;
  photo: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ToolBarProps {
  errors: ErrorField[];
  settings: BlogType;
  setSettings: (settings: BlogType) => void;
  selectedTab: ToolBarTabs;
  setSelectedTab: React.Dispatch<React.SetStateAction<ToolBarTabs>>;
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  forms: FormItem[];
  setForms: React.Dispatch<React.SetStateAction<FormItem[]>>;
  selectedBlock?: Block | null;
  setSelectedBlock: React.Dispatch<React.SetStateAction<Block | null>>;
  selectedForm?: string | null;
  setSelectedForm: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface Unit {
  value: string;
  resetValue: string;
  regex: string;
  min: number;
  max: number;
  step: number;
}

export interface StyleSectionProps {
  styles: StyleConfig;
  handleStyleChange: (
    category: keyof StyleConfig,
    property: string,
    value: ResponsiveStyle,
  ) => void;
  currentBreakpoint: BreakPoints;
  type: BlockType;
}
export interface AddBlockProps {
  type: Block["type"];
  data?: Partial<Block> | null;
  path?: string;
  disableOverride?: boolean;
}
