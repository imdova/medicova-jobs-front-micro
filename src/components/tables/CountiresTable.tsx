"use client";

import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { useState } from "react";

// Define types for better type safety
type CountryData = {
  country: string;
  countryCode: string;
  [key: string]: any; // Allow any additional data columns
};

type ColumnConfig = {
  key: string;
  header: string;
  render?: (value: any, row: CountryData) => React.ReactNode;
  className?: string;
};

type CountriesTableProps = {
  data: CountryData[];
  columns: ColumnConfig[];
  defaultSort?: {
    key: string;
    direction: "asc" | "desc";
  };
  showFlags?: boolean;
  className?: string;
  rowClassName?: string;
  headerClassName?: string;
  onRowClick?: (row: CountryData) => void;
};

// Default flag component
const DefaultFlag = ({ countryCode }: { countryCode: string }) => (
  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold uppercase">
    {countryCode}
  </div>
);

// Predefined flag components (could be moved to a separate file)
const FLAG_COMPONENTS: Record<string, React.FC<{ countryCode?: string }>> = {
  eg: () => (
    <svg viewBox="0 0 36 24" className="mr-2 h-6 w-6">
      <rect width="36" height="24" fill="#CE1126" />
      <rect width="36" height="8" y="8" fill="#fff" />
      <rect width="36" height="8" y="16" fill="#000" />
      <path d="M15,12a3,3 0 1,1 6,0a3,3 0 1,1 -6,0" fill="#C09300" />
    </svg>
  ),
  qa: () => (
    <svg viewBox="0 0 36 24" className="mr-2 h-6 w-6">
      <rect width="36" height="24" fill="#8D1B3D" />
      <path d="M0,0 L12,0 L12,24 L0,24 Z" fill="#fff" />
      <path d="M0,0 L8,0 L8,24 L0,24 Z" fill="#8D1B3D" />
      <path d="M2,4 L10,4 L10,20 L2,20 Z" fill="#fff" />
    </svg>
  ),
  om: () => (
    <svg viewBox="0 0 36 24" className="mr-2 h-6 w-6">
      <rect width="36" height="24" fill="#008751" />
      <rect width="12" height="24" fill="#fff" />
      <rect width="4" height="24" fill="#C8102E" />
      <path d="M6,12 L10,8 L10,16 Z" fill="#008751" />
    </svg>
  ),
  kw: () => (
    <svg viewBox="0 0 36 24" className="mr-2 h-6 w-6">
      <rect width="36" height="8" fill="#007A3D" />
      <rect width="36" height="8" y="8" fill="#fff" />
      <rect width="36" height="8" y="16" fill="#CE1126" />
      <path d="M0,0 L12,0 L12,24 L0,24 Z" fill="#000" />
    </svg>
  ),
  sa: () => (
    <svg viewBox="0 0 36 24" className="mr-2 h-6 w-6">
      <rect width="36" height="24" fill="#046A38" />
      <path d="M0,12 L36,12" stroke="#fff" strokeWidth="4" />
      <path
        d="M12,6 L14,10 L18,10 L15,13 L17,17 L12,14 L7,17 L9,13 L6,10 L10,10 Z"
        fill="#fff"
      />
      <path d="M12,12 L14,12 L14,14 L12,14 Z" fill="#fff" />
    </svg>
  ),
};

const getCountryFlag = (countryCode: string, showFlags: boolean) => {
  if (!showFlags) return null;
  const FlagComponent =
    FLAG_COMPONENTS[countryCode.toLowerCase()] || DefaultFlag;
  return <FlagComponent countryCode={countryCode} />;
};

const DynamicCountriesTable = ({
  data = [],
  columns = [],
  defaultSort = { key: "country", direction: "asc" },
  showFlags = true,
  className = "",
  rowClassName = "",
  headerClassName = "",
  onRowClick,
}: CountriesTableProps) => {
  const [sortConfig, setSortConfig] = useState(defaultSort);

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Default columns if none provided
  const displayedColumns =
    columns.length > 0
      ? columns
      : [
          { key: "country", header: "Location" },
          { key: "views", header: "Views" },
          { key: "applicants", header: "Applicants" },
        ];

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[280px] divide-y divide-gray-200">
        <thead className={`bg-gray-50 ${headerClassName}`}>
          <tr>
            {displayedColumns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${column.className}`}
                onClick={() => requestSort(column.key)}
              >
                <div className="flex items-center text-xs">
                  {column.header}
                  {sortConfig?.key === column.key && (
                    <span className="ml-1 text-xs">
                      {sortConfig.direction === "asc" ? (
                        <ArrowUpNarrowWide size={12} />
                      ) : (
                        <ArrowDownWideNarrow size={12} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedData.map((item, index) => (
            <tr
              key={index}
              className={`transition-colors hover:bg-gray-50 ${rowClassName} ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {displayedColumns.map((column) => (
                <td
                  key={`${index}-${column.key}`}
                  className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 ${column.className}`}
                >
                  {column.render ? (
                    column.render(item[column.key], item)
                  ) : column.key === "country" ? (
                    <div className="flex items-center">
                      {getCountryFlag(item.countryCode, showFlags)}
                      <span className="text-sm font-medium text-gray-900">
                        {item[column.key]}
                      </span>
                    </div>
                  ) : (
                    item[column.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicCountriesTable;
