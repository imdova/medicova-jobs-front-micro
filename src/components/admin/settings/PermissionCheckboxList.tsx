"use client";
import DataTable from "@/components/UI/data-table";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import {
  CRUD_Categorized_Permissions,
  CrudPermission,
} from "@/constants/permissions";
import { usePermissions } from "@/hooks/usePermissions";

import { ColumnConfig } from "@/types";
import { Permission } from "@/types/next-auth";
import { Checkbox, FormControlLabel } from "@mui/material";
import { CheckIcon, Minus } from "lucide-react";
import { useState } from "react";

type PermissionCheckboxListProps = {
  initialSelectedPermissions?: Permission_Keys[];
  onPermissionsUpdate?: (selectedPermissions: string[]) => void;
};

export function mapKeysToIds(
  permissions: Permission[],
  keys: Permission_Keys[],
): string[] {
  const keyToIdMap = new Map(permissions.map((perm) => [perm.key, perm.id]));

  return keys
    .map((key) => keyToIdMap.get(key))
    .filter((id): id is string => Boolean(id)); // filter out undefined
}

export const PermissionCheckboxList = ({
  initialSelectedPermissions = [],
  onPermissionsUpdate,
}: PermissionCheckboxListProps) => {
  const { permissions } = usePermissions();

  const [selectedPermissions, setSelectedPermissions] = useState<
    Permission_Keys[]
  >(initialSelectedPermissions);

  const handlePermissionChange = (permission: Permission_Keys) => {
    let newPermissions: Permission_Keys[] = [];
    if (selectedPermissions.includes(permission)) {
      newPermissions = selectedPermissions.filter((p) => p !== permission);
    } else {
      newPermissions = [...selectedPermissions, permission];
    }
    setSelectedPermissions(newPermissions);
    const permissionsIds = mapKeysToIds(permissions, newPermissions);
    onPermissionsUpdate?.(permissionsIds);
  };

  const handleMultiplePermissionsAdd = (
    permissionsToAdd: Permission_Keys[],
  ) => {
    const newPermissions = [...selectedPermissions];

    permissionsToAdd.forEach((perm) => {
      if (!newPermissions.includes(perm)) {
        newPermissions.push(perm);
      }
    });

    setSelectedPermissions(newPermissions);
    const permissionsIds = mapKeysToIds(permissions, newPermissions);
    onPermissionsUpdate?.(permissionsIds);
  };

  const handleMultiplePermissionsRemove = (
    permissionsToRemove: Permission_Keys[],
  ) => {
    const newPermissions = selectedPermissions.filter(
      (perm) => !permissionsToRemove.includes(perm),
    );

    setSelectedPermissions(newPermissions);
    const permissionsIds = mapKeysToIds(permissions, newPermissions);
    onPermissionsUpdate?.(permissionsIds);
  };

  const handleMultiplePermissionsChange = (permissions: Permission_Keys[]) => {
    const isAllSelected = permissions.every((perm) =>
      selectedPermissions.includes(perm),
    );
    if (isAllSelected) {
      handleMultiplePermissionsRemove(permissions);
    } else {
      handleMultiplePermissionsAdd(permissions);
    }
  };

  return (
    <>
      <DataTable
        data={CRUD_Categorized_Permissions}
        cellClassName="py-4 pl-6"
        columns={
          [
            {
              key: "name",
              header: "Permissions",
              render: (item: CrudPermission) => {
                const itemPermissions = [
                  item.create,
                  item.delete,
                  item.edit,
                  item.read,
                ].filter((x) => Boolean(x)) as Permission_Keys[];
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={itemPermissions.every((perm) =>
                          selectedPermissions.includes(perm),
                        )}
                        onChange={() =>
                          handleMultiplePermissionsChange(itemPermissions)
                        }
                        indeterminate={
                          itemPermissions.some((perm) =>
                            selectedPermissions.includes(perm),
                          ) &&
                          !itemPermissions.every((perm) =>
                            selectedPermissions.includes(perm),
                          )
                        }
                        indeterminateIcon={
                          <div className="flex h-[16px] w-[16px] items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                            <Minus className="m-auto h-[14px] w-[14px] text-primary-foreground" />
                          </div>
                        }
                        icon={
                          <div className="h-5 w-5 rounded-md rounded-tr-none border-2 border-[#D6DDEB]" />
                        }
                        checkedIcon={
                          <div className="flex h-5 w-5 items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                            <CheckIcon className="m-auto h-4 w-4 text-primary-foreground" />
                          </div>
                        }
                        sx={{ padding: 0, px: 1 }}
                      />
                    }
                    label={<p className="w-full font-semibold">{item.name}</p>}
                    className="rounded-md text-[#515B6F] transition-colors hover:bg-gray-50"
                  />
                );
              },
            },
            {
              key: "create",
              header: "Create",
              width: "120px",
              render: (item: CrudPermission) => {
                if (!item.create) return null;
                return (
                  <Checkbox
                    checked={selectedPermissions.includes(item.create)}
                    onChange={() =>
                      item.create && handlePermissionChange(item.create)
                    }
                    icon={
                      <div className="h-5 w-5 rounded-md rounded-tr-none border-2 border-[#D6DDEB]" />
                    }
                    checkedIcon={
                      <div className="flex h-5 w-5 items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                        <CheckIcon className="m-auto h-4 w-4 text-primary-foreground" />
                      </div>
                    }
                    sx={{ padding: 0, px: 1 }}
                  />
                );
              },
            },
            {
              key: "edit",
              width: "120px",
              header: "Edit",
              render: (item: CrudPermission) => {
                if (!item.edit) return null;
                return (
                  <Checkbox
                    checked={selectedPermissions.includes(item.edit)}
                    onChange={() =>
                      item.edit && handlePermissionChange(item.edit)
                    }
                    icon={
                      <div className="h-5 w-5 rounded-md rounded-tr-none border-2 border-[#D6DDEB]" />
                    }
                    checkedIcon={
                      <div className="flex h-5 w-5 items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                        <CheckIcon className="m-auto h-4 w-4 text-primary-foreground" />
                      </div>
                    }
                    sx={{ padding: 0, px: 1 }}
                  />
                );
              },
            },
            {
              key: "delete",
              width: "120px",
              header: "Delete",
              render: (item: CrudPermission) => {
                if (!item.delete) return null;
                return (
                  <Checkbox
                    checked={selectedPermissions.includes(item.delete)}
                    onChange={() =>
                      item.delete && handlePermissionChange(item.delete)
                    }
                    icon={
                      <div className="h-5 w-5 rounded-md rounded-tr-none border-2 border-[#D6DDEB]" />
                    }
                    checkedIcon={
                      <div className="flex h-5 w-5 items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                        <CheckIcon className="m-auto h-4 w-4 text-primary-foreground" />
                      </div>
                    }
                    sx={{ padding: 0, px: 1 }}
                  />
                );
              },
            },
            {
              key: "read",
              header: "Read",
              width: "120px",
              render: (item: CrudPermission) => {
                if (!item.read) return null;
                return (
                  <Checkbox
                    checked={selectedPermissions.includes(item.read)}
                    onChange={() =>
                      item.read && handlePermissionChange(item.read)
                    }
                    icon={
                      <div className="h-5 w-5 rounded-md rounded-tr-none border-2 border-[#D6DDEB]" />
                    }
                    checkedIcon={
                      <div className="flex h-5 w-5 items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                        <CheckIcon className="m-auto h-4 w-4 text-primary-foreground" />
                      </div>
                    }
                    sx={{ padding: 0, px: 1 }}
                  />
                );
              },
            },
          ] as ColumnConfig<CrudPermission>[]
        }
      />
      {/* <div className="space-y-4 text-left">
        {NonCRUD_Categorized_Permissions.map((item) => (
          <div key={item.name}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.permissions.every((perm) =>
                    selectedPermissions.includes(perm),
                  )}
                  onChange={() =>
                    handleMultiplePermissionsChange(item.permissions)
                  }
                  indeterminate={
                    item.permissions.some((perm) =>
                      selectedPermissions.includes(perm),
                    ) &&
                    !item.permissions.every((perm) =>
                      selectedPermissions.includes(perm),
                    )
                  }
                  indeterminateIcon={
                    <div className="flex h-[16px] w-[16px] items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                      <Minus className="m-auto h-[14px] w-[14px] text-primary-foreground" />
                    </div>
                  }
                  icon={
                    <div className="h-5 w-5 rounded-md rounded-tr-none border-2 border-[#D6DDEB]" />
                  }
                  checkedIcon={
                    <div className="flex h-5 w-5 items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                      <CheckIcon className="m-auto h-4 w-4 text-primary-foreground" />
                    </div>
                  }
                  sx={{ padding: 0, px: 1 }}
                />
              }
              label={
                <h4 className="my-2 text-xl font-semibold">{item.name}</h4>
              }
              className="rounded-md text-[#515B6F] transition-colors hover:bg-gray-50"
            />

            <div className="ml-3 flex flex-col">
              {item.permissions.map((permission) => (
                <FormControlLabel
                  key={permission}
                  control={
                    <Checkbox
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      icon={
                        <div className="h-5 w-5 rounded-md rounded-tr-none border-2 border-[#D6DDEB]" />
                      }
                      checkedIcon={
                        <div className="flex h-5 w-5 items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                          <CheckIcon className="m-auto h-4 w-4 text-primary-foreground" />
                        </div>
                      }
                      sx={{ padding: 0, px: 1 }}
                    />
                  }
                  // label={`All (${getTotalCount(items)})`}
                  label={
                    <span className="text-sm">
                      {permission.replace(/_/g, " ")}
                    </span>
                  }
                  className="rounded-md text-[#515B6F] transition-colors hover:bg-gray-50"
                />
              ))}
            </div>
          </div>
        ))}
      </div> */}
    </>
  );
};
