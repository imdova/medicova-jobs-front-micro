"use client";
import React, { useState, useMemo, Suspense } from "react";
import { Checkbox, IconButton, Button, TextField } from "@mui/material"; // replace with your custom components
import {
  CheckIcon,
  Columns,
  Download,
  Minus,
  Pencil,
  Settings,
  Trash2,
} from "lucide-react";
import CustomPagination from "@/components/UI/CustomPagination";
import CellOptions from "./CellOptions";
import Link from "next/link";
import { ColumnConfig, SortConfig } from "@/types";
import { getNestedValue } from "@/util/forms";
import { Path } from "react-hook-form";
import SortableHeader from "./SortableHeader";
import { cn, createUrl } from "@/util";
import DropMenu from "./drop-down";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSkeleton } from "../loading/loading";

export const LIMIT_OPTIONS: ActionOption<unknown>[] = Array.from(
  { length: 10 },
  (_, i) => {
    const value = (i + 1) * 5;
    return {
      label: value.toString(),
      action: () => {},
      value: value.toString(),
    };
  },
);

interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  total?: number;
  className?: string;
  cellClassName?: string;
  headerClassName?: string;
  columns: ColumnConfig<T>[]; // Column definitions
  selected?: (string | number)[];
  setSelected?: React.Dispatch<React.SetStateAction<(string | number)[]>>;
  onRowClick?: (item: T) => void; // Click handler for rows
  onClick?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  fixedNumberPerPage?: number;
  searchQuery?: string;
  tableHeaderClass?: string;
  options?: ActionOption<T>[]; // Action options for each row
  noDataMessage?: NoDataMessage;
  hideTableHeader?: boolean;
  isSelectable?: boolean;
  isRank?: boolean;
  columnManager?: boolean;
  loading?: boolean;
  expectedLength?: number;
  exportOptions?: ActionOption<T[]>[];
  defaultVisibleColumns?: string[];
  actionOptions?: ActionOption<T[]>[];
  isUpperLimit?: boolean;
  limit?: number;
  additionalMenus?: React.ReactNode;
}

function Table<T extends { id: string | number }>({
  data,
  loading,
  expectedLength,
  noDataMessage,
  columns,
  selected = [],
  setSelected,
  onClick,
  onEdit,
  onDelete,
  isSelectable = false,
  isRank = false,
  cellClassName = "p-3 text-sm",
  headerClassName = "text-sm",
  tableHeaderClass,
  fixedNumberPerPage,
  searchQuery,
  total,
  options,
  className,
  hideTableHeader,
  exportOptions,
  actionOptions,
  columnManager = false,
  defaultVisibleColumns = [],
  isUpperLimit = false,
  limit: initialLimit,
  additionalMenus,
}: DataTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const allColumns = columns.map((col) => col.header as string);
  const initialVisibleColumns =
    defaultVisibleColumns.length > 0 ? defaultVisibleColumns : allColumns;
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    initialVisibleColumns,
  );

  const handleSort = (key: Path<T>) => {
    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const filteredData = useMemo(() => {
    const searchFields = columns
      .map((column) => column.key)
      .filter((x) => Boolean(x)) as Path<T>[];
    if (!searchQuery || !searchFields?.length) return data;
    return data.filter((item) =>
      searchFields.some((field) =>
        String(getNestedValue(item, field)) // Ensure no undefined errors
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    );
  }, [data, searchQuery, columns]);
  // Sort data based on sort config
  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valueA = getNestedValue(a, sortConfig.key) ?? ""; // Ensure no undefined/null issues
      const valueB = getNestedValue(b, sortConfig.key) ?? "";
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortConfig.direction === "asc"
          ? valueA - valueB
          : valueB - valueA;
      }
      return sortConfig.direction === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [filteredData, sortConfig]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!setSelected) return;
    if (event.target.checked) {
      setSelected(sortedData.map((row) => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: string | number) => {
    if (!setSelected) return;

    const selectedIndex = selected.indexOf(id);
    if (selectedIndex === -1) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
    }
  };
  const handleItemsPerPageChange = (newLimit: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("limit", newLimit.toString());
    newParams.set("page", "1");
    router.push(createUrl(pathName, newParams), { scroll: false });
  };

  const isSelected = (id: string | number) => selected.indexOf(id) !== -1;

  const isExport = exportOptions && exportOptions.length > 0;
  const isActions =
    selected.length > 0 && actionOptions && actionOptions.length > 0;
  const isColumnManager = columnManager;
  const isOptions = options && options.length > 0;
  const filteredColumns = columns.filter((col) =>
    visibleColumns.includes(col.header as string),
  );
  const isAllSelected = selected.length === data.length;
  const itemsToExport =
    selected.length > 0
      ? sortedData.filter((item) => selected.includes(item.id))
      : sortedData;

  const exportLabel = `Export ${isAllSelected ? "All" : ""} (${itemsToExport.length})`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      const event = { target } as React.ChangeEvent<HTMLInputElement>;
      const newLimit = parseInt(event.target.value);
      handleItemsPerPageChange(newLimit);
    }
  };

  return (
    <>
      {(isExport || isColumnManager || isActions) && (
        <div className={"mb-4 mt-2 flex items-center justify-between"}>
          <div
            className={cn(
              "flex w-full flex-wrap items-center gap-2 p-3 md:flex-nowrap",
              tableHeaderClass
                ? tableHeaderClass
                : "rounded-base border border-gray-200 bg-white shadow-soft",
            )}
          >
            <div className="flex flex-1 items-center gap-2">
              {isExport && (
                <DropMenu
                  options={exportOptions}
                  label={exportLabel}
                  disabled={itemsToExport.length === 0}
                  icon={<Download className="h-4 w-4" />}
                />
              )}
              {isUpperLimit && (
                <DropMenu
                  label={`Limit (${initialLimit})`}
                  options={LIMIT_OPTIONS}
                  onChange={(option) => {
                    const newLimit = parseInt(option.value || "10");
                    handleItemsPerPageChange(newLimit);
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={"flex min-w-24 items-center gap-4 px-2"}
                  >
                    <TextField
                      type="number"
                      size="small"
                      placeholder="Enter limit"
                      inputProps={{
                        min: 5,
                        autoComplete: "off",
                        autoCorrect: "off",
                        autoCapitalize: "off",
                        spellCheck: "false",
                        "data-lpignore": "true", // Prevents LastPass from adding autofill
                        form: "off", // Additional security against form autofill
                      }}
                      onKeyDown={handleKeyDown}
                      onClick={(e) => e.stopPropagation()}
                      className="w-36"
                    />
                  </div>
                </DropMenu>
              )}
              {additionalMenus}
              {isActions && (
                <DropMenu<T>
                  label="Actions"
                  icon={<Settings className="h-4 w-4" />}
                  data={itemsToExport}
                  options={actionOptions}
                />
              )}
            </div>

            {isColumnManager && (
              <ColumnManger
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                columns={allColumns}
              />
            )}
          </div>
        </div>
      )}
      <div className="grid w-full grid-cols-1">
        <div
          className={cn(
            "scroll-bar-minimal col-span-full overflow-x-auto rounded-base border border-gray-200 bg-white shadow-soft",
            className,
          )}
        >
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
            {hideTableHeader ? null : (
              <thead className={`bg-gray-50`}>
                <tr>
                  {isSelectable ? (
                    <th className="px-4">
                      <div className="h-[16px] w-[16px]">
                        <Checkbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < sortedData.length
                          }
                          checked={selected.length === sortedData.length}
                          onChange={handleSelectAll}
                          icon={
                            <div className="h-[16px] w-[16px] rounded-md rounded-tr-none border-2 border-[#D6DDEB]" />
                          }
                          indeterminateIcon={
                            <div className="flex h-[16px] w-[16px] items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                              <Minus className="m-auto h-[14px] w-[14px] text-primary-foreground" />
                            </div>
                          }
                          checkedIcon={
                            <div className="flex h-[16px] w-[16px] items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                              <CheckIcon className="m-auto h-[14px] w-[14px] text-primary-foreground" />
                            </div>
                          }
                          sx={{ padding: 0 }}
                        />
                      </div>
                    </th>
                  ) : null}
                  {isRank ? (
                    <th className={`p-2 font-semibold ${cellClassName}`}>
                      Rank
                    </th>
                  ) : null}
                  {filteredColumns.map((col, index) => (
                    <th
                      key={index}
                      className={cn("relative font-semibold", cellClassName)}
                      style={{ width: col.width }}
                    >
                      {col.sortable && col.key ? (
                        <SortableHeader
                          active={sortConfig?.key === col.key}
                          direction={
                            sortConfig?.key === col.key
                              ? sortConfig.direction
                              : "asc"
                          }
                          onClick={() => col.key && handleSort(col.key)}
                          className={headerClassName}
                        >
                          <span
                            className={cn(
                              "line-clamp-1 text-nowrap",
                              cellClassName,
                              "p-0",
                            )}
                          >
                            {col.header}
                          </span>
                        </SortableHeader>
                      ) : (
                        <span
                          className={cn(
                            "line-clamp-1 text-nowrap",
                            cellClassName,
                            "p-0",
                          )}
                        >
                          {col.header}
                        </span>
                      )}
                    </th>
                  ))}
                  {onEdit || onDelete || isOptions ? (
                    <th className={`p-2 font-semibold ${cellClassName}`}>
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>
            )}
            <tbody>
              {loading ? (
                <RowSkeleton
                  filteredColumns={filteredColumns}
                  cellClassName={cellClassName}
                  isSelectable={isSelectable}
                  isOptions={isOptions}
                  onDelete={Boolean(onDelete)}
                  onEdit={Boolean(onEdit)}
                  length={expectedLength}
                />
              ) : (
                sortedData.map((item, indexRow) => {
                  const id = item.id;
                  const isItemSelected = isSelected(id);
                  return (
                    <tr
                      key={id}
                      aria-selected={isItemSelected}
                      className="border-b border-gray-200 hover:bg-gray-50 aria-selected:bg-gray-100"
                      onClick={onClick ? () => onClick(item) : undefined}
                    >
                      {isSelectable && (
                        <td className="px-4">
                          <div className="h-[16px] w-[16px]">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={() => handleSelect(id)}
                              icon={
                                <div className="h-[16px] w-[16px] rounded-md rounded-tr-none border-2 border-[#D6DDEB]" />
                              }
                              checkedIcon={
                                <div className="flex h-[16px] w-[16px] items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
                                  <CheckIcon className="m-auto h-[14px] w-[14px] text-primary-foreground" />
                                </div>
                              }
                              sx={{ padding: 0 }}
                            />
                          </div>
                        </td>
                      )}
                      {isRank && (
                        <td className={cellClassName}>
                          {(indexRow + 1).toString().padStart(2, "0")}
                        </td>
                      )}
                      {filteredColumns.map((col, index) => {
                        const value = col.key && getNestedValue(item, col.key);
                        const render = col.render
                          ? col.render(item, indexRow)
                          : value;
                        return (
                          <td key={index} className={cellClassName}>
                            {render || "-"}
                          </td>
                        );
                      })}
                      {(onEdit || onDelete) && (
                        <td className={cellClassName}>
                          <div className="flex space-x-2">
                            {onEdit && (
                              <IconButton
                                size="small"
                                disabled={selected.length > 0}
                                className="hover:bg-green-200 hover:text-green-600"
                                onClick={() => onEdit(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </IconButton>
                            )}
                            {onDelete && (
                              <IconButton
                                size="small"
                                disabled={selected.length > 0}
                                className="hover:bg-red-200 hover:text-red-600"
                                onClick={() => onDelete(item)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </IconButton>
                            )}
                          </div>
                        </td>
                      )}
                      {isOptions && (
                        <th className={cellClassName}>
                          <CellOptions options={options} item={item} />
                        </th>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {data.length === 0 && !loading && (
            <NoDataMessageCard data={noDataMessage} />
          )}
        </div>
        {total ? (
          <CustomPagination
            fixedNumberPerPage={fixedNumberPerPage}
            totalItems={total}
            disableLimit={isUpperLimit}
          />
        ) : null}
      </div>
    </>
  );
}

const ColumnManger = ({
  visibleColumns,
  setVisibleColumns,
  columns,
}: {
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  columns: string[];
}) => {
  const toggleColumn = (column: string) => {
    if (visibleColumns.includes(column)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== column));
    } else {
      setVisibleColumns([...visibleColumns, column]);
    }
  };

  const options: ActionOption[] = columns.map((col) => ({
    label: col,
    icon: (
      <Checkbox
        checked={visibleColumns.includes(col)}
        onChange={() => toggleColumn(col)}
        icon={
          <div className="h-[16px] w-[16px] rounded-md rounded-tr-none border-2 border-[#D6DDEB]" />
        }
        indeterminateIcon={
          <div className="flex h-[16px] w-[16px] items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
            <Minus className="m-auto h-[14px] w-[14px] text-primary-foreground" />
          </div>
        }
        checkedIcon={
          <div className="flex h-[16px] w-[16px] items-center justify-center rounded-md rounded-tr-none border-2 border-primary bg-primary">
            <CheckIcon className="m-auto h-[14px] w-[14px] text-primary-foreground" />
          </div>
        }
        sx={{ padding: 0 }}
      />
    ),
    action: () => toggleColumn(col),
  }));
  return (
    <DropMenu
      options={options}
      label="Column Manager"
      icon={<Columns className="h-4 w-4" />}
      disabledClose={true}
    />
  );
};

function DataTable<T extends { id: string | number }>(
  props: DataTableProps<T>,
) {
  return (
    <Suspense>
      <Table {...props} />
    </Suspense>
  );
}

const NoDataMessageCard: React.FC<{ data?: NoDataMessage }> = ({ data }) => {
  if (!data) return;
  return (
    <div className="flex min-h-64 w-full flex-col items-center justify-center gap-2 p-5">
      <h3 className="text-center text-xl font-semibold text-muted-foreground">
        {data.title}
      </h3>
      <p className="text-center text-sm text-muted-foreground">{data.description}</p>
      {data.action &&
        (data.action.href ? (
          <Button
            LinkComponent={Link}
            href={data.action.href}
            variant="contained"
          >
            {data.action.label}
          </Button>
        ) : data.action.onClick ? (
          <Button onClick={data.action.onClick} variant="contained">
            {data.action.label}
          </Button>
        ) : null)}
    </div>
  );
};

interface Props<T> {
  isSelectable?: boolean;
  filteredColumns: ColumnConfig<T>[];
  cellClassName?: string;
  length?: number;
  onEdit?: boolean;
  onDelete?: boolean;
  isOptions?: boolean;
}

const RowSkeleton = <T extends { id: string | number }>({
  isSelectable,
  filteredColumns,
  cellClassName,
  onEdit,
  onDelete,
  isOptions,
  length = 5,
}: Props<T>) => {
  return Array.from({ length: length }).map((_, rowIndex) => (
    <tr
      key={rowIndex}
      className="border-b border-gray-200 hover:bg-gray-50 aria-selected:bg-gray-100"
    >
      {isSelectable && (
        <td className="px-4">
          <div className="h-[16px] w-[16px] animate-pulse bg-gray-200"></div>
        </td>
      )}
      {filteredColumns.map((col, index) => (
        <td key={index} className={cn(cellClassName, "animate-pulse")}>
          <div className="flex min-h-5 w-full animate-pulse space-x-2 bg-gray-200 text-transparent">
            Loading...
          </div>
        </td>
      ))}
      {(onEdit || onDelete) && (
        <td className={cellClassName}>
          <div className="flex h-5 animate-pulse space-x-2 bg-gray-200"></div>
        </td>
      )}
      {isOptions && (
        <th
          className={cn(
            cellClassName,
            "animate-pulse bg-gray-200 text-transparent",
          )}
        >
          <IconSkeleton />
        </th>
      )}
    </tr>
  ));
};

export default DataTable;
