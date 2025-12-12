"use client";

import { Suspense, useCallback, useEffect } from "react";
import {
  Select,
  MenuItem,
  Pagination as MUIPagination,
  SelectChangeEvent,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createUrl } from "@/util";

interface PaginationProps {
  fixedNumberPerPage?: number;
  initialNumberPerPage?: number;
  totalItems: number;
  disableLimit?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  fixedNumberPerPage,
  initialNumberPerPage = 10,
  totalItems,
  disableLimit = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  // Get current values from search params
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage =
    fixedNumberPerPage ||
    Number(searchParams.get("limit")) ||
    initialNumberPerPage;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Create URL search params utility function
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  // Handle items per page change
  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newLimit = event.target.value as number;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("limit", newLimit.toString());
    newParams.set("page", "1");
    router.push(createUrl(pathName, newParams), { scroll: false });
  };

  // Handle page change
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", value.toString());
    router.push(createUrl(pathName, newParams), { scroll: false });
  };

  // Validate current page on total items change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      router.push(`?${createQueryString("page", totalPages.toString())}`, {
        scroll: false,
      });
    }
  }, [totalItems, currentPage, totalPages, router, createQueryString]);

  if (totalPages < 2 && itemsPerPage === initialNumberPerPage) return null;
  const noLimit = disableLimit || fixedNumberPerPage;
  return (
    <div
      className={`${noLimit ? "justify-center" : "justify-between"} mt-2 flex items-center gap-2 rounded-[10px] border border-gray-200 bg-white p-2 shadow-soft`}
    >
      {/* Select Input for Items Per Page */}
      {noLimit ? null : (
        <div className="flex items-center gap-2 px-2 md:pl-12">
          <span>View:</span>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            size="small"
            variant="outlined"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </div>
      )}

      {/* Pagination Component */}
      <MUIPagination
        count={totalPages}
        page={currentPage}
        color="primary"
        onChange={handlePageChange}
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: "4px",
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            color: "white",
          },
        }}
      />
    </div>
  );
};

const CustomPagination: React.FC<PaginationProps> = (props) => {
  return (
    <Suspense>
      <Pagination {...props} />
    </Suspense>
  );
};
export default CustomPagination;
