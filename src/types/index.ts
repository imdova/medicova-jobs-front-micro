import { JobWorkPlace } from "@/constants/enums/work-place.enum";
import { RoleState } from "./next-auth";
import { Gender } from "@/constants/enums/gender.enum";
import { EducationLevel } from "@/constants/enums/education-level.enum";
import { StartDateType } from "@/constants/enums/start-type.enum";
import { SalaryCurrency } from "@/constants/enums/currency.enum";
import { CompanyStatus } from "@/constants/enums/company-status.enum";
import { CompanySize } from "@/constants/enums/company-size.enum";
import { AlertColor, SxProps } from "@mui/material";
import { Path } from "react-hook-form";
import { User } from "next-auth";
import { VerifyType } from "@/constants/enums/verify-types.enums";
import { NotificationEnum } from "@/constants/enums/notifications.enum";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import { LocationItem, SocialMediaLinks } from "./seeker";
import { RegisterCategory } from "@/constants/enums/register-category.enum";
import { useFormStateReturn } from "@/hooks/useFormState";
import { ColumnDef } from "@tanstack/react-table";
import { SubscriptionPlan } from "./finance";

export type Verify = {
  newMail: string;
  type: VerifyType;
  url: string;
};

export declare enum PrefetchKind {
  AUTO = "auto",
  FULL = "full",
  TEMPORARY = "temporary",
}
export interface AppRouterInstance {
  back(): void;
  forward(): void;
  refresh(): void;
  push(href: string, options?: { scroll?: boolean }): void;
  replace(href: string, options?: { scroll?: boolean }): void;
  prefetch(href: string, options?: { kind: PrefetchKind }): void;
}

export type BadgeVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "neutral"
  | "complete"
  | "missing-title"
  | "missing-description"
  | "premium"
  | "needs-review";

export type Country = {
  name: string;
  isoCode: string;
  flag: string;
  phonecode: string;
  currency: string;
  latitude: string;
  longitude: string;
};
export type CountryMin = {
  name: string;
  code: string;
};

export type NotificationType = {
  message: string;
  severity: AlertColor;
};
export type State = {
  name: string;
  isoCode: string;
  countryCode: string;
  latitude: string;
  longitude: string;
};
export type City = {
  name: string;
  isoCode: string;
  countryCode: string;
  latitude: string;
  longitude: string;
};

export interface Result<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface registerData {
  firstName: string;
  lastName: string;
  email: string;
  rolesIds: string[];
  type: RoleState;
  category?: RegisterCategory;
  password?: string;
  metaData?: {
    companyId?: string;
    title?: string;
    departmentId?: string;
  };
}

export interface BaseHeaderProps {
  user?: User;
  pathname: string;
}

export interface Notification {
  id: string;
  seekerId?: string;
  type: NotificationEnum; // You can add other types if known
  title: string;
  message: string;
  isRead: boolean;
  metaData: {
    company?: {
      id?: string;
      name?: string;
      title?: string;
      username?: string;
      image?: string | null;
    };
    job?: {
      id?: string;
      title?: string;
      applicationCount?: number;
    };
    application?: {
      id?: string;
      firstName?: string;
      lastName?: string;
      userName?: string;
      title?: string;
      image?: string;
    };
    percentage?: number;
  };
  //TODO : Must add those
  created_at: string; // ISO timestamp for when the notification was created
}

export interface Experience {
  id: string;
  name: string;
  country: CountryMin;
  startDate: string;
  endDate: string;
}

export interface Education {
  name: string;
  country: CountryMin;
  specialty: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface ContactInfo {
  whatsapp: string;
  phoneNumber: string;
  email: string;
}

export interface Doctor {
  id: string;
  image: string;
  name: string;
  location: string;
  specialty: string;
  yearsOfExperience: number;
  consultant: boolean;
  field: string;
  contactInfo: ContactInfo;
  experience: Experience[];
  education: Education[];
  available: boolean;
}

type CountryInData = {
  name: string;
  code: string;
};

export interface Company {
  id: string;
  name: string;
  username: string;
  title?: string | null;
  about?: string;
  completencePercent?: number;
  isPrivate?: boolean;
  isProfitable?: boolean;
  status?: CompanyStatus | null;
  country?: CountryInData | null;
  state?: CountryInData | null;
  city?: string;
  size?: CompanySize | null;
  phone?: string;
  cover?: string;
  email?: string;
  yearFounded?: number | string;
  avatar?: string | null;
  socialLinks?: SocialMediaLinks | null;
  visible?: boolean;
  profileUrl?: string;
  companyTypeId?: string | null;
  companySectorId?: string | null;
  banner1?: string | null;
  banner2?: string | null;
  banner3?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  _version?: number;
  token?: string | null;
  phoneOtp?: string | null;
  unverifiedPhone?: string | null;
  companySectorName?: string | null;
  companyTypeName?: string | null;

  plan?: SubscriptionPlan; // no
  openJobs?: number | null; // no
  revenue?: number | null; // no
}
// TODO: add open jobs

export interface SearchCompanyFilter {
  page?: number;
  limit?: number;
  q?: string;
  countryCode?: string;
  companyTypeId?: string;
  //TODO: add status to companies filter
}

export interface SearchSeekerFilter {
  page?: number;
  limit?: number;
  q?: string;
  countryCode?: string;
}

export interface MiniCompany {
  name: string;
  industry: string;
  website: string;
  contact: string;
}

export type Sector = {
  id: string;
  name: string;
};

export interface Department {
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  education: string;
  specialty: string;
  features: string[];
  timeStamps: Date;
  description: string;
  requirements: string[];
  additionalDetails: string;
  skills: string[];
  relatedSearch: string[];
  company: MiniCompany;
}

export type SpecialtyItem = {
  id: string;
  name: string;
};
export type CareerLevels = {
  id: string;
  name: string;
};
export interface JobCategory {
  id: string;
  name: string;
  // specialities: SpecialtyItem[];
  // careerLevels: CareerLevels[];
}
export interface EmploymentType {
  id: string;
  name: string;
}

export interface Industry {
  id: string;
  name: string;
}
export type JobsTabs = "all" | "active" | "closed" | "expired" | "draft";

export interface SavedJobType {
  id: string;
  jobId: string;
}

export interface JobData {
  id: string;
  companyId: string | null;
  company?: Pick<
    Company,
    | "id"
    | "name"
    | "username"
    | "about"
    | "banner1"
    | "banner2"
    | "banner3"
    | "avatar"
  >;
  title: string;
  jobIndustryId: string | null;
  jobSpecialityId: string | null;
  jobCategoryId: string | null;
  jobCareerLevelId: string | null;
  jobEmploymentTypeId: string | null;
  jobWorkPlace: JobWorkPlace | null | "";
  gender: Gender | null;
  minAge: number | null;
  maxAge: number | null;
  educationLevel: EducationLevel | null | "";
  country: CountryInData | null;
  state: CountryInData | null;
  city: string | null;
  maxExpYears: number | null;
  minExpYears: number | null;
  hideSalary: boolean | null;
  salaryRangeStart: number | null;
  salaryRangeEnd: number | null;
  salaryCurrency: SalaryCurrency | null | "";
  availableVacancies: number | null;
  description: string | null;
  requirements: string | null;
  salaryDetails: string | null;
  keywords: string[] | null;
  skills: string[] | null;
  questions: string[] | null;
  showCompany: boolean | null;
  recieveEmails: boolean | null;
  jobEmail: string | null;
  draft: boolean | null;
  active: boolean | null;
  closed: boolean | null;
  validTo: string | null; // ISO date string

  applicationCount?: number | null; // Not in NewJobData

  startDateType: StartDateType | null | "";

  jobIndustry?: string | null;
  jobSpeciality?: string | null;
  jobCategory?: string | null;
  jobCareerLevel?: string | null;
  jobEmploymentType?: string | null;

  created_at: string; // ISO date string
  updated_at: string; // ISO date string

  // TODO: ADD this
  approved?: boolean;
}

export type CareerPreference = {
  id?: string;
  seekerId: string | null;
  jobEmploymentTypesIds: string[];
  industriesIds: string[];
  categoriesIds: string[] | null;
  availableForImmediateHiring: boolean;
  relocation: boolean;
  jobWorkPlace: JobWorkPlace[] | null;
  country: LocationItem[] | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  _version: number;
};

export type JobStringData = Omit<
  JobData,
  "country" | "keywords" | "skills" | "questions"
> & {
  country: string;
  keywords: string;
  skills: string;
  questions: string;
};

export interface FilterOption {
  label: string;
  count: number;
  value: string;
}

export interface FilterSectionType {
  key: string;
  title: string;
  options: FilterOption[];
}

export interface Folder {
  id: string;
  name: string;
  companyId: string;
  seekersCount: number;
  _version: number;
  created_at: string;
  updated_at: string;
}

export interface SortFolders {
  key: keyof Folder;
  direction: "asc" | "desc";
}

export interface Specialty {
  id: number | string;
  image: string;
  title: string;
  jobsNumber: number;
  link: string;
}

export interface CompanyItem {
  id: string | number;
  image: string;
  title: string;
  description: string;
  tag: string;
}

export interface NotificationItem {
  icon: React.ElementType;
  title: string;
  description: string;
  tags: { status: "normal" | "warning" | "error" | "success"; text: string }[];
  timeStamp: Date;
  isRead: boolean;
  readTime: Date | null;
  category: string;
  image: string;
}

export interface HeaderLink {
  title: string;
  url: string;
}
export type CommonLinksType = "home";

export type RoleBasedLinks = {
  [key in RoleState | "default"]: NavItem[];
};

export type CommonLinks = {
  [key in CommonLinksType]: NavItem[];
};

export type NavItem = {
  id: number;
  icon?: React.ElementType;
  label?: string;
  path?: string;
  pattern?: string;
  notifications?: number;
  section?: string; // Optional section header
  permissions: Permission_Keys[];
  target?: string;
  type?:
    | "divider"
    | "text"
    | "collapse"
    | "supLink"
    | "profile"
    | "notification"
    | "chat"
    | "savedJobs";
  links?: NavItem[];
};
export interface ActiveLinkResult {
  activeIndex: number;
  parentId: number | null;
}

export type ModalActionType = "STAY" | "LEAVE" | "CUSTOM";

export interface ModalButton {
  label: string;
  actionType: ModalActionType;
  variant?: "primary" | "secondary";
}

export interface ModalState {
  isOpen: boolean;
  message: string;
  buttons: ModalButton[];
  navigationUrl?: string;
}

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "phone"
  | "password"
  | "date"
  | "textEditor"
  | "select"
  | "search-select"
  | "checkbox"
  | "component"
  | "radio"
  | "file"
  | "textArea"
  | "otp"
  | "multi-text"
  | "color"
  | "code"
  | "slider"
  | "upload-area";

export interface Option<T = Record<string, any>> {
  value: keyof T;
  label: React.ReactNode;
  pattern?: string;
  icon?: React.ReactNode;
}
export type FileFieldType = "profile" | "image" | "images" | "files";

// Updated FieldConfig to support multiple hidden fields
export interface FieldConfig<T = any> {
  id?: string;
  name: Path<T>;
  label?: string;
  type?: FieldType;

  required?: boolean;
  placeholder?: string;
  dependsOn?: string;
  rules?: Record<string, any>;
  multiple?: boolean;
  returnOption?: boolean;

  resetFields?: string[];
  hideFieldNames?: string[];
  unHideFieldNames?: string[];

  onChange?: (value: any) => void;

  // Layout & UI
  gridProps?: GridProps;

  // Field-specific props
  fileProps?: Partial<FileProps>;
  textFieldProps?: Record<string, any>;
  dateFieldProps?: Record<string, any>;
  selectProps?: Record<string, any>;

  // Custom Component
  component?: React.ComponentType<any>;
  componentProps?: Record<string, any>;

  // Selectable Options (for dropdowns etc.)
  options?: Option[];
}

export interface FileProps {
  type?: FileFieldType;
  maxFiles?: number;
  multiple?: boolean;
  previewType?: "image" | "list" | "grid" | "pdf";
  maxSize?: number; // in KB/MB
  acceptedFileTypes?: string[];
  size?: number | "full"; // for layout
  className?: string;
  imageClass?: string;
  shape?: "circle" | "square";
  urlField?: boolean;
  autoUpload?: boolean;
}

export interface GridProps {
  xs?: number;
  sm?: number;
  md?: number;
  rowXs?: number;
  rowSm?: number;
  rowMd?: number;
}

export interface DynamicModalProps {
  open: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  onClose?: () => void;
  onChange?: (fieldName: string, value: string) => void;
  onSubmit?: (data: any) => Promise<{ error?: boolean } | void> | void;
  onDelete?: (data: any) => void;
  onClick?: () => void;
  fields?: FieldConfig[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  initialValues?: Record<string, any>;
  children?: React.ReactNode;
  loading?: boolean;
  deleteLoading?: boolean;
  error?: string;
  dialog?: React.ComponentType<any>;
  removeField?: (fieldName: string) => void;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all" | undefined;
  ///
  submitButtonText?: React.ReactNode;
  deleteButtonText?: string;
  cancelButtonText?: string;
  enableResetButton?: boolean;
  resetAfterSubmit?: "default" | "new";
  sx?: SxProps;
  anchor?: "bottom" | "left" | "right" | "top";
  contentClassName?: string;
}

export interface FormContentProps {
  fields: FieldConfig[];
  onSubmit?: (data: any) => any;
  formMethods: useFormStateReturn;
  hiddenFields: string[];
  onDelete?: (data: any) => void;
  resetValues: (fieldNames: (string | number)[]) => void;
  onCheckboxChange: (field: any) => (event: any) => void;
  children?: React.ReactNode;
  loading?: boolean;
  error?: string;
  deleteLoading?: boolean;
  onCancel: () => void;
  submitButtonText?: React.ReactNode;
  deleteButtonText?: string;
  cancelButtonText?: string;
  onChange?: (fieldName: string, value: string) => void;
  removeField?: (fieldName: string) => void;
  dialog?: boolean;
  enableResetButton?: boolean;
  onReset?: () => void;
  resetAfterSubmit?: string;
  contentClassName?: string;
  onClick?: () => void;
}

export interface ColumnConfig<T> {
  key?: Path<T>; // Field to display
  header?: string; // Column header text
  sortable?: boolean; // Enable sorting
  render?: (item: T, index: number) => React.ReactNode | void; // Add index as optional param
  width?: string | number; // Optional column width
}

export type AdvancedColumnConfig<T> = ColumnDef<T> & {
  accessorKey?: Path<T>;
};

export interface SortConfig<T> {
  key: Path<T>;
  direction: "asc" | "desc";
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number; // ms
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  // you can add more props like icon, title, etc.
}

export type ValidationRule = {
  field: string; // e.g., "photo" or "content.status"
  label?: string; // e.g., "Photo"
  message?: string;
  tab?: string | number;
  regex?: RegExp; // Optional if using a custom validator
  validate?: (value: any) => boolean; // Custom function to validate
};

export type ErrorField = {
  field: string; // e.g., "photo" or "content.status"
  label?: string; // e.g., "Photo"
  message?: string;
  tab?: string | number;
};
