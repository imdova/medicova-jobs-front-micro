"use client";

import { useId, useMemo, useState } from "react";

import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Columns3Icon,
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  RefreshCcwIcon,
  SearchIcon,
} from "lucide-react";

import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
  OnChangeFn,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/UI/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/Table";

import { cn } from "@/util";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

import Papa from "papaparse";
import * as XLSX from "xlsx";
import DateSelector from "./DateSelector";
import { Separator } from "./separator";
import { useControllableState } from "@/hooks/useControllableState";
import { FilterFn } from "@tanstack/react-table";

type UpdateData = (
  rowIndex: number,
  columnId: string,
  value: string | number | boolean,
) => void;

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select" | "date-range";
  }
  interface TableMeta<TData extends RowData> {
    updateData: UpdateData;
  }
}


const equalsFilter: FilterFn<any> = (row, columnId, filterValue) => {
  return row.getValue(columnId) === filterValue;
};

interface AdvancedDataTableProps<T> {
  name?: string;
  columns: ColumnDef<T>[];
  data: T[];
  setData?: (data: T[]) => void;
  updateData?: UpdateData;
  filters?: { key: keyof T; className?: string }[];
  hidePagination?: boolean;
  hideSearch?: boolean;
  hideExport?: boolean;
  hideColumnManager?: boolean;
  defaultSorting?: ColumnSort;
  filterClassName?: string;
  tableClassName?: string;
  paginationClassName?: string;
  initialPagination?: PaginationState;
  cellClassName?: string;
  headerClassName?: string;
  defaultColumnVisibility?: VisibilityState;
  selection?: RowSelectionState;
  setSelection?: OnChangeFn<RowSelectionState>;
}

const AdvancedDataTable = <T extends RowData>({
  name = "Table",
  columns,
  data,
  setData,
  updateData,
  filters,
  hidePagination = true,
  hideSearch = true,
  hideExport = true,
  hideColumnManager = true,
  defaultSorting,
  filterClassName,
  tableClassName,
  paginationClassName,
  initialPagination = {
    pageIndex: 0,
    pageSize: 5,
  },
  cellClassName,
  headerClassName,
  defaultColumnVisibility = {
    hidden: false,
  },
  selection,
  setSelection,
}: AdvancedDataTableProps<T>) => {
  const id = useId();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState(
    defaultColumnVisibility,
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);
  const [sorting, setSorting] = useState<SortingState>(
    defaultSorting ? [defaultSorting] : [],
  );

  const [rowSelection, setRowSelection] = useControllableState({
    value: selection,
    onChange: setSelection,
    defaultValue: selection || {},
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    enableSortingRemoval: false,
    globalFilterFn: "includesString",
    onRowSelectionChange: setRowSelection,
    filterFns: {
      equals: equalsFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
      sorting,
      pagination,
      rowSelection,
    },
    meta: {
      updateData: (
        rowIndex: number,
        columnId: string,
        value: string | number | boolean,
      ) => {
        if (updateData) {
          updateData(rowIndex, columnId, value);
        }
        if (!setData) return;
        setData(
          data.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...data[rowIndex]!,
                [columnId]: value,
              };
            }

            return row;
          }),
        );
      },
    },
  });

  const exportToCSV = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : table.getFilteredRowModel().rows.map((row) => row.original);

    const csv = Papa.unparse(dataToExport, {
      header: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${name}-export-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : table.getFilteredRowModel().rows.map((row) => row.original);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const cols = [
      { wch: 10 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
    ];

    worksheet["!cols"] = cols;

    XLSX.writeFile(
      workbook,
      `${name}-export-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const exportToJSON = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : table.getFilteredRowModel().rows.map((row) => row.original);

    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${name}-export-${new Date().toISOString().split("T")[0]}.json`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hideFilters =
    hideSearch &&
    (!filters || filters.length === 0) &&
    hideExport &&
    hideColumnManager;

  return (
    <div className="space-y-4 md:w-full">
      {!hideFilters && (
        <div
          className={cn(
            "flex flex-wrap justify-between gap-3 px-2",
            filterClassName,
          )}
        >
          {!hideSearch && (
            <div className="min-w-44 flex-1 lg:max-w-56">
              <div className="space-y-2">
                <Label htmlFor={`${id}-input`}>Search All</Label>
                <div className="relative">
                  <Input
                    placeholder="Search all columns..."
                    className="peer ps-9"
                    value={globalFilter ?? ""}
                    onChange={(event) =>
                      setGlobalFilter(String(event.target.value))
                    }
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <SearchIcon size={16} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            {!hideColumnManager && (
              <div className="flex max-w-44 items-center space-x-2">
                <div className="w-full space-y-2">
                  <Label htmlFor={`${id}-columns-input`}>Columns</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full max-w-3xs justify-between"
                      >
                        <span className="flex items-center gap-2 text-sm">
                          <Columns3Icon />
                          Columns
                        </span>{" "}
                        <ChevronDownIcon className="ml-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="relative">
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                          placeholder="Search"
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        <SearchIcon className="absolute inset-y-0 left-2 my-auto h-4 w-4" />
                      </div>
                      <DropdownMenuSeparator />
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          if (
                            searchQuery &&
                            !column.id
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          ) {
                            return null;
                          }

                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                              onSelect={(e) => e.preventDefault()}
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          table.resetColumnVisibility();
                          setSearchQuery("");
                        }}
                      >
                        <RefreshCcwIcon /> Reset
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            {!hideExport && (
              <div className="flex max-w-44 flex-col-reverse items-center space-x-2">
                <div className="text-muted-foreground line-clamp-2 text-center text-xs">
                  <span className="mr-2 text-xs">
                    {table.getSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected
                  </span>
                </div>
                <div className="w-full space-y-2">
                  <Label htmlFor={`${id}-export-input`}>Export</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={table.getSelectedRowModel().rows.length === 0}
                        variant="outline"
                        className="w-full"
                      >
                        <DownloadIcon />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={exportToCSV}>
                        <FileTextIcon />
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportToExcel}>
                        <FileSpreadsheetIcon />
                        Export as Excel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={exportToJSON}>
                        <FileTextIcon />
                        Export as JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {filters && filters?.length > 0 && (
        <>
          <Separator className="!my-2" />
          <div className={cn("flex flex-wrap gap-3 px-2", filterClassName)}>
            {filters.map((filter) => {
              const column = table.getColumn(filter.key.toString());
              if (!column) return null;
              return (
                <div
                  key={filter.key.toString()}
                  className={cn("flex-1", filter.className)}
                >
                  <Filter column={column} />
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="grid w-full grid-cols-1">
        <div
          className={cn(
            "scroll-bar-minimal col-span-full overflow-x-auto",
            tableClassName,
          )}
        >
          <Table>
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.getSize()}px` }}
                        className={cn("h-11", headerClassName)}
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <div
                            className={cn(
                              header.column.getCanSort() &&
                                "flex h-full cursor-pointer items-center justify-between gap-2 select-none",
                              headerClassName,
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              if (
                                header.column.getCanSort() &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                            tabIndex={
                              header.column.getCanSort() ? 0 : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: (
                                <ChevronUpIcon
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ),
                              desc: (
                                <ChevronDownIcon
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={cellClassName}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {!hidePagination && (
        <div
          className={cn(
            "flex items-end justify-between gap-8",
            paginationClassName,
          )}
        >
          <div className="flex items-center gap-3">
            <Label htmlFor={id} className="max-sm:sr-only">
              Rows per page
            </Label>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger id={id} className="w-fit whitespace-nowrap">
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                {[5, 10, 25, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
              <p
                className="text-muted-foreground text-sm whitespace-nowrap"
                aria-live="polite"
              >
                <span className="text-foreground">
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}
                  -
                  {Math.min(
                    Math.max(
                      table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize +
                        table.getState().pagination.pageSize,
                      0,
                    ),
                    table.getRowCount(),
                  )}
                </span>{" "}
                of{" "}
                <span className="text-foreground">
                  {table.getRowCount().toString()}
                </span>
              </p>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to first page"
                  >
                    <ChevronFirstIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>

                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeftIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>

                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to next page"
                  >
                    <ChevronRightIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>

                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to last page"
                  >
                    <ChevronLastIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

function Filter<T>({ column }: { column: Column<T, unknown> }) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnHeader =
    typeof column.columnDef.header === "string" ? column?.columnDef.header : "";

  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === "range") return [];

    const values = Array.from(column.getFacetedUniqueValues().keys());

    const flattenedValues = values.reduce((acc: string[], curr) => {
      if (Array.isArray(curr)) {
        return [...acc, ...curr];
      }

      return [...acc, curr];
    }, []);

    return Array.from(new Set(flattenedValues)).sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFacetedUniqueValues(), filterVariant]);

  if (filterVariant === "range") {
    return (
      <div className="space-y-2">
        <Label>{columnHeader}</Label>
        <div className="flex">
          <Input
            id={`${id}-range-1`}
            className="flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[0] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1],
              ])
            }
            placeholder="Min"
            type="number"
            aria-label={`${columnHeader} min`}
          />
          <Input
            id={`${id}-range-2`}
            className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined,
              ])
            }
            placeholder="Max"
            type="number"
            aria-label={`${columnHeader} max`}
          />
        </div>
      </div>
    );
  }

  if (filterVariant === "select") {
    const selectValue = columnFilterValue?.toString() ?? "all";
    return (
      <div className="space-y-2">
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          value={selectValue}
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger
            id={`${id}-select`}
            className={cn(
              "w-full text-wrap break-all [&_span]:line-clamp-1",
              selectValue === "all" ? "text-zinc-400" : "",
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={String(value)} value={String(value)}>
                {String(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  if (filterVariant === "date-range") {
    return (
      <div className="space-y-2">
        <Label>{columnHeader}</Label>
        <div className="flex gap-2">
          <DateSelector
            value={
              (columnFilterValue as [Date | undefined, Date | undefined])?.[0]
                ? (
                    columnFilterValue as [Date | undefined, Date | undefined]
                  )[0]?.toISOString()
                : undefined
            }
            onChange={(e) =>
              column.setFilterValue(
                (old: [Date | undefined, Date | undefined]) => [
                  e.target.value ? new Date(e.target.value) : undefined,
                  old?.[1],
                ],
              )
            }
            placeholder="Start date"
          />
          <DateSelector
            value={
              (columnFilterValue as [Date | undefined, Date | undefined])?.[1]
                ? (
                    columnFilterValue as [Date | undefined, Date | undefined]
                  )[1]?.toISOString()
                : undefined
            }
            onChange={(e) =>
              column.setFilterValue(
                (old: [Date | undefined, Date | undefined]) => [
                  old?.[0],
                  e.target.value ? new Date(e.target.value) : undefined,
                ],
              )
            }
            placeholder="End date"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className="relative">
        <Input
          id={`${id}-input`}
          className="peer ps-9"
          value={(columnFilterValue ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search ${columnHeader.toLowerCase()}`}
          type="text"
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
}

export default AdvancedDataTable;
