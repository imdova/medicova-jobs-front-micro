type PaginatedResponse<T> = {
  data: T[];
  total: number;
  count?: number;
  page?: number;
  limit?: number;
};

// Types
type HeaderType =
  | "none"
  | "minimal"
  | "full"
  | "centered"
  | "transparent"
  | "dark";
type SideBarType = "minimal" | "full" | "admin-full" | "admin-minimal" | "none";
type LinksType = "default" | "userType";

interface RouteConfig {
  pattern: string;
  headerType: HeaderType;
  sideBarType: SideBarType;
  linksType?: LinksType;
}

interface TextEditorProps {
  defaultValue?: string;
  value: string;
  onChange: (e: string) => void;
}

interface LocationType {
  country?: { code?: string; name?: string } | null;
  state?: { code?: string; name?: string } | null;
  city?: string | null;
}

interface ActionOption<T = object> {
  value?: string;
  label: ((item?: T) => React.ReactNode) | React.ReactNode;
  action?: (item?: T) => void;
  icon?: React.ReactNode;
  hidden?: (item?: T) => boolean;
}

interface NoDataMessage {
  title: React.ReactNode;
  description: React.ReactNode;
  action?: {
    label: React.ReactNode;
    href?: string;
    onClick?: () => void;
  };
}

interface StatusCardType {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  trend?: {
    value?: string;
    description?: string;
    trendDirection?: "up" | "down";
  };
}

interface Message {
  recipientId: string;
  message: string;
}
