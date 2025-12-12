import { Checkbox } from "@/components/UI/checkbox";
import { AdvancedColumnConfig } from "@/types";
import { Feature } from "@/types/finance";
import { CellContext } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Input } from "@/components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";

export const generateManageFeaturesColumns =
  (): AdvancedColumnConfig<Feature>[] => [
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
      header: "Feature",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="max-w-52">
          <div className="text-sm font-medium">{row.getValue("name")}</div>
          <div className="line-clamp-2 text-wrap text-xs text-muted-foreground">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      header: "Unit",
      accessorKey: "unit",
      cell: ({ row }) => <div className="text-sm">{row.getValue("unit")}</div>,
    },
    {
      header: "Currency",
      accessorKey: "currency",
      cell: EditableSelectCell,
    },
    {
      header: "Pricing Tiers",
      accessorKey: "tiers",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 text-xs">
          {row.original.tiers.map((tier, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded bg-gray-100 px-2 py-1"
            >
              <div className="flex items-center">
                <Input
                  step="0.01"
                  variant="ghost1"
                  defaultValue={tier.min}
                  className="h-6 max-w-12 p-1 text-xs"
                />{" "}
                -
                <Input
                  step="0.01"
                  variant="ghost1"
                  defaultValue={tier.max}
                  className="h-6 max-w-12 p-1 text-xs"
                />
              </div>
              <div className="relative">
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex max-w-12 items-center justify-center ps-3 peer-disabled:opacity-50">
                  <span className="text-xs"> {row.original.currency}</span>
                </div>
                <Input
                  step="0.01"
                  variant="ghost1"
                  defaultValue={tier.unitPrice}
                  className="peer h-6 max-w-24 pe-1 ps-10 text-xs"
                  placeholder="00.00"
                />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    // {
    //   header: "Status",
    //   accessorKey: "isActive",
    //   cell: ({ row, column }) => {
    //     const active = row.getValue("isActive") as boolean;
    //     return (
    //       <div className="flex items-center gap-2">
    //         <Switch
    //           checked={active}
    //           onCheckedChange={(value) => updateData(row.index, column.id, value)}
    //         />
    //         <Badge variant={active ? "success" : "error"}>
    //           {active ? "Active" : "Inactive"}
    //         </Badge>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   size: 28,
    //   cell: () => {
    //     return (
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Button variant="outline" size="icon">
    //             <span className="sr-only">Edit</span>
    //             <Pen />
    //           </Button>
    //         </TooltipTrigger>
    //         <TooltipContent>Edit</TooltipContent>
    //       </Tooltip>
    //     );
    //   },
    // },
  ];

{
  /* <Select value={row.original.currency}>
  <SelectTrigger className="max-h-6 rounded-none border-0 p-1 shadow-none aria-expanded:bg-white aria-expanded:ring-0 [&_span]:text-xs [&_svg]:hidden">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="EGP">EGP</SelectItem>
    <SelectItem value="USD">USD</SelectItem>
    <SelectItem value="EUR">EUR</SelectItem>
    <SelectItem value="SAR">SAR</SelectItem>
    <SelectItem value="GBP">GBP</SelectItem>
  </SelectContent>
</Select>; */
}
const EditableTextCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<Feature, unknown>) => {
  const initialValue = getValue() as string;
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      variant="ghost1"
      aria-label="editable-text-input"
    />
  );
};

const EditableSelectCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<Feature, unknown>) => {
  const initialValue = getValue() as string;

  const handleValueChange = (newValue: string) => {
    table.options.meta?.updateData(index, id, newValue);
  };

  return (
    <Select value={initialValue} onValueChange={handleValueChange}>
      <SelectTrigger
        className="focus:ring-ring h-8 w-full border-0 bg-transparent p-1 focus:ring-1 [&_span]:text-sm"
        aria-label={`select-status-${id}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="EGP">EGP</SelectItem>
        <SelectItem value="USD">USD</SelectItem>
        <SelectItem value="EUR">EUR</SelectItem>
        <SelectItem value="SAR">SAR</SelectItem>
        <SelectItem value="GBP">GBP</SelectItem>
      </SelectContent>
    </Select>
  );
};
