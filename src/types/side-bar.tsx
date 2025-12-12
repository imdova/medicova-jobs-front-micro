export interface LinkType {
  title?: string;
  url?: string;
  icon?: React.ElementType;
  links?: LinkType[];
  kind?: "divider" | "title" | "collapse";
}
