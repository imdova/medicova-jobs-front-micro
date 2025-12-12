"use client";
import Filter from "@/components/Layout/filter/filter";
import { useJobFilters } from "@/hooks/useJobFilters";

const JobFilter: React.FC<{ data: JobsAggregations }> = ({ data }) => {
  const filters = useJobFilters(data);
  return <Filter sections={filters} />;
};

export default JobFilter;
