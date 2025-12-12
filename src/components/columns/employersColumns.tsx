import Avatar from "@/components/UI/Avatar";
import { Checkbox } from "@/components/UI/checkbox";
import { AdvancedColumnConfig, Company } from "@/types";
import Link from "next/link";
import { getOptionLabel } from "@/util/general";
import { companySizeOptions } from "@/constants";

export const generateEmployersColumns = (): AdvancedColumnConfig<Company>[] => [
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
    header: "Company",
    accessorKey: "name",
    accessorFn: (item) => item.name || "z",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar src={item.avatar} />
          <div>
            <Link
              className="hover:text-primary transition"
              href={`/admin/employers/${item.username}`}
            >
              <h6 className="line-clamp-1 max-w-24 text-xs text-wrap break-all">
                {item.name}
              </h6>
            </Link>
            <Link
              href={`mailto:${item.email}`}
              className="line-clamp-1 max-w-24 text-xs text-wrap break-all underline hover:no-underline"
            >
              {item.email}
            </Link>
          </div>
        </div>
      );
    },
  },

  {
    header: "Username",
    accessorKey: "username",
    cell: ({ row }) => (
      <Link
        className="hover:text-primary line-clamp-1 text-sm transition hover:underline"
        href={`/co/${row.getValue("username")}`}
      >
        {row.getValue("username")}
      </Link>
    ),
  },
  {
    header: "title",
    accessorKey: "title",
  },
  {
    header: "Date",
    accessorKey: "created_at",
    meta: {
      filterVariant: "date-range",
    },
  },
  {
    id: "accountManager",
    header: "Account Manager",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Avatar src="https://randomuser.me/api/portraits/women/1.jpg" />
          <div>
            <Link
              className="hover:text-primary transition"
              href="/admin/account-managers/1"
            >
              <h6 className="line-clamp-1 text-sm">Alice Johnson</h6>
            </Link>
            <Link
              href="mailto:alice@example.com"
              className="line-clamp-1 text-xs break-all underline hover:no-underline"
            >
              alice@example.com
            </Link>
          </div>
        </div>
      );
    },
  },
  {
    header: "Competence",
    accessorKey: "completencePercent",
    cell: ({ row }) => `${row.getValue("completencePercent") ?? 0}%`,
    meta: {
      filterVariant: "range",
    },
  },
  {
    id: "country",
    header: "Country",
    accessorKey: "country.name",
    meta: {
      filterVariant: "select",
    },
  },
  {
    id: "state",
    header: "State",
    accessorKey: "state.name",
    meta: {
      filterVariant: "select",
    },
  },
  {
    id: "city",
    header: "City",
    accessorKey: "city",
    meta: {
      filterVariant: "select",
    },
  },
  {
    header: "Company Size",
    accessorKey: "size",
    cell: ({ row }) => getOptionLabel(companySizeOptions, row.getValue("size")),
    meta: {
      filterVariant: "select",
    },
  },
  {
    header: "Phone",
    accessorKey: "phone",
    cell: ({ row }) => (
      <a className="text-xs" href={`tel:${row.getValue("phone")}`}>
        {row.getValue("phone")}
      </a>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => (
      <a className="text-xs" href={`mailto:${row.getValue("email")}`}>
        {row.getValue("email")}
      </a>
    ),
  },
  {
    header: "Type",
    accessorKey: "companyTypeName",
    cell: ({ row }) => row.getValue("companyTypeName") || "-",
    meta: {
      filterVariant: "select",
    },
  },
  {
    header: "Sector",
    accessorKey: "companySectorName",
    cell: ({ row }) => row.getValue("companySectorName") || "-",
    meta: {
      filterVariant: "select",
    },
  },
];
