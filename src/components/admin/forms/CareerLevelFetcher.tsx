"use client";

import { useState, useEffect } from "react";
import { API_GET_CAREER_LEVELS_BY_CATEGORY } from "@/api/admin";
import { CareerLevels } from "@/types";

interface CareerLevelFetcherProps {
  categoryId: string;
  children: (props: {
    data: CareerLevels[] | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
  }) => React.ReactNode;
}

const CareerLevelFetcher = ({
  categoryId,
  children,
}: CareerLevelFetcherProps) => {
  const [data, setData] = useState<CareerLevels[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_GET_CAREER_LEVELS_BY_CATEGORY}?ids=${categoryId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PaginatedResponse<CareerLevels> = await response.json();
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

      {/* Optional: Add error boundary or retry UI */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          <p>Error loading career levels: {error}</p>
          <button
            onClick={refresh}
            className="mt-2 rounded-md bg-red-100 px-4 py-2 hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}
    </>
  );
};

export default CareerLevelFetcher;
