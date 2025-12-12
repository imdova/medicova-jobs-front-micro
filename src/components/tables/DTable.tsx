import { Check } from "lucide-react";
import React, { useState, useMemo } from "react";

type ColumnDefinition<T> = {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode | void;
  width?: string;
  align?: string;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
};

type SortDirection = "asc" | "desc" | null;

type DynamicTableProps<T> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  pagination?: boolean;
  itemsPerPage?: number;
  className?: string;
  minWidth?: number;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  emptyMessage?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  rowIdKey?: keyof T;
  defaultSort?: {
    key: string;
    direction: SortDirection;
  };
};

const DynamicTable = <T extends object>({
  data,
  columns,
  pagination = false,
  itemsPerPage = 10,
  className = "",
  headerClassName = "bg-gray-100 text-gray-700",
  rowClassName = "hover:bg-gray-50",
  cellClassName = "py-3 px-2",
  emptyMessage = "No data available",
  selectable = false,
  onSelectionChange,
  rowIdKey = "id" as keyof T,
  defaultSort,
  minWidth = 900,
}: DynamicTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<T[keyof T]>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  } | null>(defaultSort || null);

  // Sort data based on sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const column = columns.find((col) => col.key === sortConfig.key);

      // Use custom sort function if provided
      if (column?.sortFn) {
        return sortConfig.direction === "asc"
          ? column.sortFn(a, b)
          : column.sortFn(b, a);
      }

      // Default sorting for primitive values
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig, columns]);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: SortDirection = "asc";

    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig(direction ? { key, direction } : null);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = pagination
    ? sortedData.slice(startIndex, endIndex)
    : sortedData;

  // Handle row selection
  const toggleRowSelection = (rowId: T[keyof T]) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowId)) {
      newSelectedRows.delete(rowId);
    } else {
      newSelectedRows.add(rowId);
    }
    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      const selectedItems = sortedData.filter((item) =>
        newSelectedRows.has(item[rowIdKey]),
      );
      onSelectionChange(selectedItems);
    }
  };

  // Handle select all/none
  const toggleSelectAll = () => {
    if (selectedRows.size === displayedData.length) {
      // Deselect all
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    } else {
      // Select all on current page
      const newSelectedRows = new Set<T[keyof T]>();
      displayedData.forEach((item) => newSelectedRows.add(item[rowIdKey]));
      setSelectedRows(newSelectedRows);

      if (onSelectionChange) {
        const selectedItems = sortedData.filter((item) =>
          newSelectedRows.has(item[rowIdKey]),
        );
        onSelectionChange(selectedItems);
      }
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Check if all rows on current page are selected
  const allSelectedOnPage =
    displayedData.length > 0 &&
    displayedData.every((item) => selectedRows.has(item[rowIdKey]));

  // Get sort direction for a column
  const getSortDirection = (key: string): SortDirection => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction;
  };

  // Render sort indicator
  const renderSortIndicator = (key: string) => {
    const direction = getSortDirection(key);
    if (!direction) return null;

    return <span className="ml-1">{direction === "asc" ? "↓" : "↑"}</span>;
  };

  return (
    <div className={`flex flex-col overflow-hidden rounded-md ${className}`}>
      <div className="grid grid-cols-1 overflow-x-auto">
        <table
          style={{ minWidth: minWidth }}
          className={`divide-y divide-gray-200`}
        >
          <thead className={`${headerClassName}`}>
            <tr>
              {selectable && (
                <th scope="col" className={`${cellClassName} w-10 text-center`}>
                  <label
                    htmlFor="all"
                    className="relative inline-flex h-5 w-5 cursor-pointer items-center justify-center"
                  >
                    <input
                      id="all"
                      type="checkbox"
                      checked={allSelectedOnPage && displayedData.length > 0}
                      onChange={toggleSelectAll}
                      className="absolute h-full w-full opacity-0"
                    />
                    <div
                      className={`h-5 w-5 rounded border transition-all duration-150 ease-in-out ${
                        allSelectedOnPage && displayedData.length > 0
                          ? "border-white bg-green-500 hover:bg-green-600"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      } focus:ring-2 focus:ring-green-200`}
                    >
                      {/* Checkmark */}
                      <svg
                        className={`absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white transition-all duration-200 ease-out ${
                          allSelectedOnPage && displayedData.length > 0
                            ? "scale-100 opacity-100"
                            : "scale-50 opacity-0"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </label>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`${cellClassName} text-${column.align || "left"} ${
                    column.width ? column.width : ""
                  } select-none font-medium ${
                    column.sortable ? "cursor-pointer hover:bg-gray-200" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div
                    className={`flex items-center ${
                      column.align === "center"
                        ? "justify-center"
                        : column.align === "right"
                          ? "justify-end"
                          : "justify-start"
                    }`}
                  >
                    {column.header}
                    {column.sortable && renderSortIndicator(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedData.length > 0 ? (
              displayedData.map((item, rowIndex) => (
                <tr key={rowIndex} className={rowClassName}>
                  {selectable && (
                    <td className={`${cellClassName} text-center`}>
                      <label
                        htmlFor={`row-${rowIndex}`}
                        className="relative inline-flex h-5 w-5 cursor-pointer items-center justify-center"
                      >
                        <input
                          id={`row-${rowIndex}`}
                          type="checkbox"
                          checked={selectedRows.has(item[rowIdKey])}
                          onChange={() => toggleRowSelection(item[rowIdKey])}
                          className="absolute h-full w-full opacity-0"
                        />
                        <div
                          className={`h-5 w-5 rounded border transition-all duration-150 ease-in-out ${
                            selectedRows.has(item[rowIdKey])
                              ? "border-white bg-green-500 hover:bg-green-600"
                              : "border-gray-300 bg-white hover:border-gray-400"
                          } focus:ring-2 focus:ring-green-200`}
                        >
                          {/* Checkmark */}
                          <svg
                            className={`absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white transition-all duration-200 ease-out ${
                              selectedRows.has(item[rowIdKey])
                                ? "scale-100 opacity-100"
                                : "scale-50 opacity-0"
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                      </label>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className={`${cellClassName} text-${
                        column.align || "left"
                      }`}
                    >
                      {column.render
                        ? column.render(item, rowIndex) ||
                          String(item[column.key as keyof T])
                        : String(item[column.key as keyof T])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className={`${cellClassName} text-center text-sm text-gray-600`}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && sortedData.length > itemsPerPage && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, sortedData.length)}
                </span>{" "}
                of <span className="font-medium">{sortedData.length}</span>{" "}
                results
                {selectable && selectedRows.size > 0 && (
                  <span className="ml-2 font-medium text-indigo-600">
                    ({selectedRows.size} selected)
                  </span>
                )}
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                        currentPage === page
                          ? "z-10 border-green-500 bg-green-50 text-green-600"
                          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
