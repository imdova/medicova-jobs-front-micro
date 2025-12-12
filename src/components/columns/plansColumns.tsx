import { Badge } from "@/components/UI/Badge";
import { Button } from "@/components/UI/button";
import { Checkbox } from "@/components/UI/checkbox";
import { Switch } from "@/components/UI/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { AdvancedColumnConfig, BadgeVariant } from "@/types";
import { PlansReport, SubscriptionPlan } from "@/types/finance";
import { formatMoney } from "@/util/general";
import { Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/util";

const badgeVariant: Record<string, BadgeVariant> = {
  Free: "neutral",
  Basic: "info",
  Pro: "success",
  Business: "premium",
};

export const generatePlansColumns = (): AdvancedColumnConfig<PlansReport>[] => [
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
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <Link
        href={`/admin/plans/${row.original.id}`}
        className="text-xs font-medium hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    header: "Total Subscriptions",
    accessorKey: "purchases",
  },
  {
    header: "Employers",
    accessorKey: "employers",
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: ({ row }) => (
      <div className="text-xs">${formatMoney(row.getValue("price"))}</div>
    ),
  },
  {
    header: "Revenue",
    accessorKey: "revenue",
    cell: ({ row }) => (
      <div className="text-xs">${formatMoney(row.getValue("revenue"))}</div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row, column, table }) => {
      const status: string = row.getValue("status");
      return (
        <div className="flex items-center gap-2">
          <Switch
            id="airplane-mode"
            checked={status === "active"}
            onCheckedChange={(value) =>
              table.options.meta?.updateData(
                row.index,
                column.id,
                value ? "active" : "inactive",
              )
            }
          />
          <Badge variant={status === "active" ? "success" : "error"}>
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "view",
    header: "View Plan",
    cell: ({ row }) => (
      <Button variant="outline" asChild>
        <Link href={`/admin/plans/${row.original.id}`}>
          <span className="sr-only">View plan</span>
          <Eye />
        </Link>
      </Button>
    ),
  },
];

export const generateManagePlansColumns =
  (): AdvancedColumnConfig<SubscriptionPlan>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      header: "Name",
      accessorKey: "name",
      size: 28,
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: ({ row }) => (
        <div className="text-xs">{formatDate(row.getValue("created_at"))}</div>
      ),
    },
    {
      header: "Badge",
      accessorKey: "badge",
      cell: ({ row }) =>
        row.original.badge && (
          <Badge variant={badgeVariant[row.original.name]}>
            {row.original.badge}
          </Badge>
        ),
    },
    {
      header: "Duration",
      accessorKey: "duration",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {row.getValue("duration")} Month
        </div>
      ),
    },
    {
      header: "Price",
      accessorKey: "discountedPrice",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          ${formatMoney(row.getValue("discountedPrice"))}
        </div>
      ),
    },
    {
      header: "Vat",
      accessorKey: "vat",
      cell: ({ row }) => (
        <div className="text-xs font-medium">{row.getValue("vat")}%</div>
      ),
    },
    {
      header: "Views",
      accessorKey: "views",
    },
    {
      header: "Unlocks",
      accessorKey: "unlocks",
    },
    {
      header: "Jobs",
      accessorKey: "jobs",
    },
    {
      header: "Invitations",
      accessorKey: "invitations",
    },
    {
      header: "Users",
      accessorKey: "users",
    },
    {
      header: "Ex Access",
      accessorKey: "extraAccess",
      cell: ({ row }) => (
        <div className="text-xs">{row.getValue("extraAccess")} Ex Month</div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row, column, table }) => {
        const status: string = row.getValue("status");
        return (
          <div className="flex items-center gap-2">
            <Switch
              id="airplane-mode"
              checked={status === "active"}
              onCheckedChange={(value) =>
                table.options.meta?.updateData(
                  row.index,
                  column.id,
                  value ? "active" : "inactive",
                )
              }
            />
            <Badge variant={status === "active" ? "success" : "error"}>
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/admin/plans/new?duplicate=${plan?.id}`}>
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/plans/edit/${plan?.id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
