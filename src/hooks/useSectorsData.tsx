import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSectors, fetchSectorTypes } from "@/store/slices/sectorsSlice";
import { useEffect, useState, useCallback } from "react";

interface UseSectorsDataProps {
  sectorId?: string | "all" | null;
}

export const useSectorsData = ({
  sectorId = "all",
}: UseSectorsDataProps | undefined = {}) => {
  const dispatch = useAppDispatch();
  const { sectors, types } = useAppSelector((state) => state.sector);
  const [cachedSector, setCachedSector] = useState<string | string[] | null>(
    null,
  );

  // Refresh function to re-fetch sectors and sector types
  const refresh = useCallback(() => {
    dispatch(fetchSectors());
    if (sectorId && sectorId !== "all") {
      dispatch(fetchSectorTypes(sectorId));
    }
  }, [dispatch, sectorId]);

  // Fetch all sectors on initial load if not already loaded
  useEffect(() => {
    if (sectors.data.data.length === 0 && !sectors.loading) {
      dispatch(fetchSectors());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Fetch sector types when sectorId changes
  useEffect(() => {
    if (JSON.stringify(sectorId) === JSON.stringify(cachedSector)) return;
    if (sectorId) {
      setCachedSector(sectorId);
      dispatch(fetchSectorTypes(sectorId));
    }
  }, [dispatch, sectorId, cachedSector]);

  return {
    sectors,
    types,
    refresh,
  };
};
