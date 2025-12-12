import { Badge } from "@/components/UI/Badge";
import { Button } from "@/components/UI/button";
import { Checkbox } from "@/components/UI/checkbox";
import { AdvancedColumnConfig, BadgeVariant } from "@/types";
import { InvoiceType } from "@/types/finance";
import { formatMoney } from "@/util/general";
import { Download, Eye } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/util";
import Avatar from "@/components/UI/Avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/tooltip";

const statusVariant: Record<InvoiceType["status"], BadgeVariant> = {
  paid: "success",
  overdue: "error",
  canceled: "missing-description",
  pending: "info",
};

export const generateInvoicesColumns =
  (): AdvancedColumnConfig<InvoiceType>[] => [
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
      enableHiding: false,
    },
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => (
        <div className="text-xs">{formatDate(row.getValue("created_at"))}</div>
      ),
      meta: {
        filterVariant: "date-range",
      },
    },
    {
      header: "Due Date",
      accessorKey: "due_date",
      cell: ({ row }) => (
        <div className="text-xs">{formatDate(row.getValue("due_date"))}</div>
      ),
      meta: {
        filterVariant: "date-range",
      },
    },
    {
      header: "Created By",
      accessorKey: "created_by",
      accessorFn: (row) => row.created_by.name,
      cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar
            src={row.original.created_by.image}
            alt={row.original.created_by.name}
            size={30}
          />
          <div className="ml-2">
            <div className="text-xs font-medium">
              {row.original.created_by.name}
            </div>
            <div className="text-xs text-neutral-500">
              {row.original.created_by.role}
            </div>
          </div>
        </div>
      ),
      meta: {
        filterVariant: "select",
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => (
        <Badge
          variant={row.getValue("type") === "subscription" ? "success" : "info"}
        >
          {row.getValue("type")}
        </Badge>
      ),
      meta: {
        filterVariant: "select",
      },
    },
    {
      header: "Payment Method",
      accessorFn: (row) => row.payment_method || "-",
      accessorKey: "payment_method",
      meta: {
        filterVariant: "select",
      },
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: ({ row }) => (
        <div className="text-xs">
          {row.original.currency} {formatMoney(row.getValue("total"))}
        </div>
      ),
      meta: {
        filterVariant: "range",
      },
    },

    {
      header: "Payment Type",
      accessorKey: "payment_type",
      cell: ({ row }) => (
        <Badge
          variant={
            row.getValue("payment_type") === "one-time" ? "success" : "info"
          }
        >
          {row.getValue("payment_type")}
        </Badge>
      ),
      meta: {
        filterVariant: "select",
      },
    },
    {
      header: "Company",
      accessorKey: "employer",
      accessorFn: (row) => row.employer.name,
      cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar
            src={row.original.employer.image}
            alt={row.original.employer.name}
            size={30}
          />
          <div className="ml-2">
            <Link
              href={`/admin/employees/${row.original.employer.username}`}
              className="text-xs font-medium hover:underline"
            >
              {row.original.employer.name}
            </Link>
          </div>
        </div>
      ),
      meta: {
        filterVariant: "select",
      },
    },
    {
      header: "Items",
      accessorKey: "items",
      accessorFn: (row) => row.items.length + " items",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status: InvoiceType["status"] = row.getValue("status");
        return <Badge variant={statusVariant[status]}>{status}</Badge>;
      },
      meta: {
        filterVariant: "select",
      },
    },
    // TODO update the status
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex w-fit items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <Eye />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <Download />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
        </div>
      ),
      enableHiding: false,
    },
  ];
