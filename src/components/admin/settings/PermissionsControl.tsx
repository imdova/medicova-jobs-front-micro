"use client";

import { useSession } from "next-auth/react";
import { PermissionCheckboxList } from "./PermissionCheckboxList";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";

const PermissionsControl = () => {
  const { data: session, status, update } = useSession();
  const userPermissions: Permission_Keys[] = session?.user?.permissions || []; // Ensure permissions are available
  const handlePermissionsUpdate = async (updatedPermissions: string[]) => {
    await update({
      permissions: updatedPermissions,
    });
  };

  if (!session?.user) {
    return null; // or a spinner
  }

  return (
    <div className="mx-auto rounded-base border border-gray-200 bg-white p-4 shadow-soft">
      <h2 className="text-lg font-medium">
        User Permissions <span className="text-red-500">(Just For Test)</span>
      </h2>
      <PermissionCheckboxList
        initialSelectedPermissions={userPermissions}
        onPermissionsUpdate={handlePermissionsUpdate}
      />
    </div>
  );
};

export default PermissionsControl;
