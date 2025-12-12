import {
  API_GET_COMPANY_SECTORS,
  API_GET_COMPANY_TYPES,
  API_GET_COMPANY_TYPES_BY_SECTOR,
} from "@/api/admin";
import useFetch from "@/hooks/useFetch";
import { Sector } from "@/types";

interface UseSectorDataProps {
  sector?: string | "all" | null;
}

export const useSectorData = ({
  sector,
}: UseSectorDataProps | undefined = {}) => {
  const { data: sectorsData } = useFetch<PaginatedResponse<Sector>>(
    API_GET_COMPANY_SECTORS,
  );
  const { data: typesData } = useFetch<PaginatedResponse<Sector>>(
    sector
      ? sector === "all"
        ? API_GET_COMPANY_TYPES
        : API_GET_COMPANY_TYPES_BY_SECTOR + sector
      : null,
    {
      fetchOnce: false,
      fetchOnUrlChange: true,
    },
  );

  const sectors = sectorsData?.data || [];
  const types = typesData?.data || [];

  return {
    sectors,
    types,
  };
};
