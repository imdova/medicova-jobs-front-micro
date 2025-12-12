import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import NextAuth from "next-auth";
import { Company } from ".";
import { UserProfile } from "./seeker";
import { RegisterCategory } from "@/constants/enums/register-category.enum";
export type RoleState =
  | "seeker"
  | "admin"
  | "employer"
  | "unEmployee"
  | "unverified";

export type Permission = {
  id: string;
  name: string;
  key: string;
  description: string;
  forUserType: RoleState;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  forUserType?: RoleState;
  companyId?: string | null;
  permissions: Permission[];
  users?: number;
  created_at: string;
};

interface EmployeeProfile {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  _version: number;
  firstName: string;
  type: RegisterCategory;
  lastName: string;
  email: string;
  avatar: string | null;
  companyId: string;
  hasCompany: boolean;
}
interface AdminProfile {
  id: string;
  created_at: string;
  updated_at: string;
  firstName: string;
  type: RegisterCategory;
  lastName: string;
  email: string | null;
  avatar: string | null;
}

interface UserResponse {
  profile: UserProfile | EmployeeProfile | AdminProfile;
  permissions: Permission_Keys[];
  accessToken: string;
  type: "seeker" | "employer" | "admin";
}

declare module "next-auth" {
  interface User {
    id: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    userName: string | null;
    type: RoleState;
    category: RegisterCategory | null;
    image: string | null;
    // phone: string | null;
    companyId?: string | null;
    hasCompany?: boolean;
    accessToken: string;
    permissions: Permission_Keys[];
  }

  interface Session {
    user: User;
    redirectUrl: string | null;
  }
}
