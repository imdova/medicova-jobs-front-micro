import { Role } from "./next-auth";

export interface HeaderData {
  title: string | null;
  subtitle: string | null;
  address: string | null;
  type: string | null;
  employees: string | null;
  website: string | null;
}

export type CompanyType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  _version: number;
  name: string;
  title: string | null;
  username: string;
  isPrivate: boolean | null;
  about: string | null;
  isProfitable: boolean | null;
  status: "active" | "inactive";
  country: {
    code: string;
    name: string;
  };
  state: {
    code: string;
    name: string;
  };
  city: string | null;
  size: "micro" | "small" | "medium" | "large"; // adjust if needed
  phone: string;
  email: string;
  yearFounded: number;
  banner1: string;
  banner2: string;
  banner3: string;
  avatar: string;
  cover: string | null;
  socialLinks: string | null;
  completencePercent: number;
  visible: boolean | null;
  profileUrl: string | null;
  companyTypeId: string;
  companySectorId: string;
  jobCount: number;
  companySectorName: string;
  companyTypeName: string;
};


export interface CompanyUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
}