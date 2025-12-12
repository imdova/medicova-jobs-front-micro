import { NotificationEnum } from "@/constants/enums/notifications.enum";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import { RoleState } from "./next-auth";

export type PermissionsNotifications = {
  type: NotificationEnum;
  permissions: Permission_Keys[];
};

export interface RoleFormData {
  id?: string;
  name: string;
  description: string;
  permissionsIds: string[]; 
  forUserType: RoleState;
  companyId?: string;
}
