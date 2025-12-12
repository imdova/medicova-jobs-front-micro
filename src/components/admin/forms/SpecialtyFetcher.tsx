"use client";

import { useState, useEffect } from "react";
import { SpecialtyItem } from "@/types"; // Adjust import path as needed
import { API_GET_SPECIALITIES_BY_CATEGORY } from "@/api/admin";

interface SpecialtyFetcherProps {
  categoryId: string;
  children: (props: {
    data: SpecialtyItem[] | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
  }) => React.ReactNode;
}

const SpecialtyFetcher = ({ categoryId, children }: SpecialtyFetcherProps) => {
  const [data, setData] = useState<SpecialtyItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_GET_SPECIALITIES_BY_CATEGORY}${categoryId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PaginatedResponse<SpecialtyItem> = await response.json();
      setData(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and retry when categoryId changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, retryCount]);

  const refresh = () => {
    setRetryCount((prev) => prev + 1);
  };

  return (
    <>
      {children({
        data,
        loading,
        error,
        refresh,
      })}
    </>
  );
};
export default SpecialtyFetcher;
