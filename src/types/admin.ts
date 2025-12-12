import { RegisterCategory } from "@/constants/enums/register-category.enum";

export interface AdminUser {
  created_at: string;
  updated_at: string;
  id: string;

  firstName: string;
  lastName: string;
  title: string;
  lastSeen?: string;
  phone: string;

  // type updated separately 
  type: RegisterCategory;
  avatar: string;
  departmentId?: string;

  // updated separately 
  email: string;

  // status updated separately 
  active: boolean;

  // roles list updated separately 
  rolesIds?: string[];

  // assigns
  adminIds?: string[];
  companyIds?: string[];
}
