"use client";
import { API_GET_SPECIALITIES } from "@/api/admin";
import Filter from "@/components/Layout/filter/filter";
import { educationOptions } from "@/constants/job";
import useFetch from "@/hooks/useFetch";
import { useLocationData } from "@/hooks/useLocationData";
import { Industry } from "@/types";
type Result = PaginatedResponse<Industry>;

const FolderFilter: React.FC<{ data: FolderAggregations }> = ({ data }) => {
  console.log("🚀 ~ data:", data)
  const { countries } = useLocationData();
  const { data: specialities } = useFetch<Result>(API_GET_SPECIALITIES);

  const filters: FilterType[] = [];

  if (data.countryCodes?.length) {
    filters.push({
      name: "Residency (Location)",
      multiple: true,
      searchable: true,
      sectionKey: "country",
      items: data.countryCodes.map((item) => ({
        label:
          countries?.find((x) => x.isoCode === item.value)?.name || item.value, // You can map code to real country names if needed
        count: item.count,
        value: item.value,
      })),
    });
  }
  if (data.specialityIds?.length) {
    filters.push({
      name: "Speciality",
      multiple: true,
      sectionKey: "sp",
      items: data.specialityIds.map((item) => ({
        label:
          specialities?.data.find((x) => x.id === item.value)?.name ||
          item.value.slice(0, 5),
        count: item.count,
        value: item.value,
      })),
    });
  }

  if (data.educationLevels?.length) {
    filters.push({
      name: "Education Level",
      multiple: true,
      sectionKey: "edu",
      items: data.educationLevels.map((item) => ({
        label:
          educationOptions.find((x) => x.id === item.value)?.label || item.value,
        count: item.count,
        value: item.value,
      })),
    });
  }

  // if (data.experienceYears?.length) {
  //   filters.push({
  //     name: "Years Of Experience",
  //     sectionKey: "exp",
  //     items: data.experienceYears.map((item) => ({
  //       label: `${item.from}-${item.to}`,
  //       count: item.count,
  //       value: `${item.from}-${item.to}`,
  //     })),
  //   });
  // }

  return <Filter sections={filters} />;
};

export default FolderFilter;
