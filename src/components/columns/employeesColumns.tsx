import Avatar from "@/components/UI/Avatar";
import { Checkbox } from "@/components/UI/checkbox";
import { AdvancedColumnConfig, Company, Department, Option } from "@/types";
import Link from "next/link";
import { AdminUser } from "@/types/admin";
import { Badge } from "@/components/UI/Badge";
import { RegisterCategory } from "@/constants/enums/register-category.enum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { Button } from "@/components/UI/button";
import { MoreHorizontal } from "lucide-react";
import { Switch } from "../UI/switch";
import { User } from "next-auth";
import AvatarGroupDropdown from "../UI/AvatarGroupDropdown";

const getColor = (category: string) => {
  switch (category) {
    case "Super Admin":
      return "premium";
    case "Admin":
      return "complete";
    case "Account Manager":
      return "info";
    default:
      return "neutral";
  }
};

const categoriesOptions: Option[] = [
  {
    label: "Super Admin",
    value: RegisterCategory.SUPER_ADMIN,
  },
  {
    label: "Admin",
    value: RegisterCategory.GENERAL_ADMIN,
  },
  {
    label: "Account Manager",
    value: RegisterCategory.ACCOUNT_MANAGER,
  },
  {
    label: "Employee",
    value: RegisterCategory.ADMIN_EMPLOYEE,
  },
];

export type ActionsType =
  | "edit"
  | "delete"
  | "assign-admins"
  | "assign-companies";

export const generateEmployeesColumns = (
  companies: Company[],
  admins: AdminUser[],
  departments: Department[],
  action?: (row: AdminUser, action: ActionsType) => void,
  actor?: User,
): AdvancedColumnConfig<AdminUser>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    size: 28,
    enableSorting: false,
  },

  {
    header: "Admin",
    accessorKey: "firstName",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar src={row.original.avatar} />
        <div>
          <Link
            href={`/admin/employees/${row.original.id}`}
            className="line-clamp-1 text-xs hover:underline"
          >{`${row.original.firstName} ${row.original.lastName}`}</Link>
          <a
            href={`tel:${row.original.phone}`}
            className="text-xs hover:underline"
          >
            {row.original.phone}
          </a>
        </div>
      </div>
    ),
  },
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Companies",
    accessorKey: "companyIds",
    cell: ({ row }) => {
      const user = row.original;
      const selectedCompanies =
        companies?.filter((company) => user.companyIds?.includes(company.id)) ||
        [];
      return (
        <AvatarGroupDropdown
          avatars={selectedCompanies.map((x) => ({
            src: x.avatar,
            fallback: x.name.charAt(0),
            name: x.name,
          }))}
        />
      );
    },
  },
  {
    header: "Admins",
    accessorKey: "adminIds",
    cell: ({ row }) => {
      const user = row.original;
      const selectedUsers =
        admins?.filter((admin) => user.adminIds?.includes(admin.id)) || [];
      return (
        <AvatarGroupDropdown
          avatars={selectedUsers.map((x) => ({
            src: x.avatar,
            fallback: x.firstName.charAt(0),
            name: x.firstName,
          }))}
        />
      );
    },
  },
  {
    header: "Type",
    accessorKey: "type",
    accessorFn: (row) =>
      categoriesOptions.find((x) => x.value === row.type)?.label,
    cell: ({ row }) => (
      <span className="text-sm text-nowrap">
        <Badge variant={getColor(row.getValue("type"))}>
          {row.getValue("type")}
        </Badge>
      </span>
    ),
    filterFn: "equals",
    meta: {
      filterVariant: "select",
    },
  },
  {
    header: "Department",
    accessorKey: "departmentId",
    accessorFn: (row) =>
      row.departmentId
        ? departments?.find((x) => x.id === row.departmentId)?.name
        : "-",
    meta: {
      filterVariant: "select",
    },
  },
  {
    header: "Roles",
    accessorKey: "rolesIds",
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue("rolesIds") || "0"}</div>
    ),
  },
  {
    header: "Status",
    accessorKey: "active",
    cell: ({ row, column, table }) => {
      const active: boolean = row.getValue("active");
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={active}
            onCheckedChange={(value) =>
              table.options.meta?.updateData(row.index, column.id, value)
            }
          />
          <Badge variant={active ? "success" : "error"}>
            {active ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(actor?.category === RegisterCategory.SUPER_ADMIN ||
              actor?.category === RegisterCategory.GENERAL_ADMIN) &&
              (user.type === RegisterCategory.GENERAL_ADMIN ||
                user.type === RegisterCategory.ACCOUNT_MANAGER) && (
                <>
                  <DropdownMenuLabel>Assign</DropdownMenuLabel>
                  {user.type === RegisterCategory.GENERAL_ADMIN && (
                    <DropdownMenuItem
                      onClick={() => action?.(user, "assign-admins")}
                    >
                      Assign Admins
                    </DropdownMenuItem>
                  )}
                  {(user.type === RegisterCategory.GENERAL_ADMIN ||
                    user.type === RegisterCategory.ACCOUNT_MANAGER) && (
                    <DropdownMenuItem
                      onClick={() => action?.(user, "assign-companies")}
                    >
                      Assign Companies
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                </>
              )}
            {actor?.category === RegisterCategory.SUPER_ADMIN && (
              <>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => action?.(user, "edit")}>
                  Edit
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => action(user, "delete")}>
                  Delete
                </DropdownMenuItem> */}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
