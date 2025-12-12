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
import { formatMoney } from "@/util/general";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Addon } from "@/types/finance";
import { formatDate } from "@/util";

const badgeVariant: Record<string, BadgeVariant> = {
  Free: "neutral",
  Basic: "info",
  Pro: "success",
  Business: "premium",
};
export const generateManageAddonsColumns =
  (): AdvancedColumnConfig<Addon>[] => [
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
      cell: ({ row }) => (
        <div className="max-w-44 text-sm font-medium">
          {row.getValue("name")}
          <br />
          <span className="text-muted-foreground line-clamp-1 text-xs text-wrap">
            {row.original.description}
          </span>
        </div>
      ),
    },
    {
      header: "Badge",
      accessorKey: "badge",
      cell: ({ row }) =>
        row.original.badge && (
          <Badge variant="info">{row.original.badge}</Badge>
        ),
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          ${formatMoney(row.getValue("price"))}
        </div>
      ),
    },
    {
      header: "Discount",
      accessorKey: "discountPercent",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {row.getValue("discountPercent")}% Off
        </div>
      ),
    },
    {
      header: "VAT",
      accessorKey: "vatPercent",
      cell: ({ row }) => (
        <div className="text-xs font-medium">{row.getValue("vatPercent")}%</div>
      ),
    },
    {
      header: "Total Price",
      accessorKey: "totalPrice",
      cell: ({ row }) => (
        <div className="text-xs font-bold">
          ${formatMoney(row.getValue("totalPrice"))}
        </div>
      ),
    },
    {
      header: "Jobs",
      accessorKey: "features.jobs",
      cell: ({ row }) =>
        row.original.features?.jobs ? (
          <div className="text-xs">{row.original.features.jobs}</div>
        ) : (
          "-"
        ),
    },
    {
      header: "Unlocks",
      accessorKey: "features.unlocks",
      cell: ({ row }) =>
        row.original.features?.unlocks ? (
          <div className="text-xs">{row.original.features.unlocks}</div>
        ) : (
          "-"
        ),
    },
    {
      header: "Invites",
      accessorKey: "features.invites",
      cell: ({ row }) =>
        row.original.features?.invites ? (
          <div className="text-xs">{row.original.features.invites}</div>
        ) : (
          "-"
        ),
    },
    {
      header: "Views",
      accessorKey: "features.views",
      cell: ({ row }) =>
        row.original.features?.views ? (
          <div className="text-xs">{row.original.features.views}</div>
        ) : (
          "-"
        ),
    },
    {
      header: "Highlighted",
      accessorKey: "isHighlighted",
      cell: ({ row }) =>
        row.getValue("isHighlighted") ? (
          <Badge variant="success">Yes</Badge>
        ) : (
          <Badge variant="missing-description">No</Badge>
        ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <div className="text-xs">{formatDate(row.getValue("createdAt"))}</div>
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
        const addon = row.original;
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
                <Link href={`/admin/addons/${addon?.id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/addons/edit/${addon?.id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
