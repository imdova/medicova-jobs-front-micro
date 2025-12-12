"use client";
import { GroupOutlined, LocationOnOutlined, Search } from "@mui/icons-material";
import { Button, FormControl, MenuItem, Select } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Flag from "./flagitem";
import { createUrl } from "@/util";
import SearchableSelect from "./SearchableSelect";
import useFetch from "@/hooks/useFetch";
import { Industry } from "@/types";
import { API_GET_CATEGORIES } from "@/api/admin";
import { useLocationData } from "@/hooks/useLocationData";
import { API_FILTER_SEARCH_JOBS } from "@/api/employer";

let timer: NodeJS.Timeout;
function debounce<T extends (...args: string[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

type SearchFormFields = "Search" | "Category" | "Country";

const initialSearchFields: SearchFormFields[] = [
  "Category",
  "Country",
  "Search",
];

const SearchForm: React.FC<{
  onClick?: () => void;
  pathname?: string;
  fields?: SearchFormFields[];
  button?: string;
}> = ({
  onClick,
  pathname: initialPathname,
  fields = initialSearchFields,
  button = "Search my job",
}) => {
  const { data } = useFetch<JobsAggregations>(API_FILTER_SEARCH_JOBS);
  const { countries } = useLocationData();
  const { data: categories } =
    useFetch<PaginatedResponse<Industry>>(API_GET_CATEGORIES);

  const filters: FilterType[] = [];

  if (data?.country?.length) {
    filters.push({
      name: "Country",
      multiple: true,
      searchable: true,
      sectionKey: "country",
      items: data.country.map((item) => ({
        label:
          countries?.find((x) => x.isoCode === item.code)?.name || item.code, // You can map code to real country names if needed
        count: item.count,
        value: item.code,
      })),
    });
  }

  if (data?.category?.length) {
    filters.push({
      name: "Category",
      multiple: true,
      sectionKey: "ctg",
      items: data.category.map((item) => ({
        label:
          categories?.data.find((x) => x.id === item.id)?.name ||
          item.id.slice(0, 5), // same, ideally you map the id to real category name
        count: item.count,
        value: item.id,
      })),
    });
  }

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = pathname.split("/").pop();
  const newPathname = initialPathname || pathname;

  const initialSearchText = searchParams.get("q") || "";
  const country = searchParams.get("country") || "";
  const category = searchParams.get("ctg") || "";
  const [query, setQuery] = useState(initialSearchText);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams.toString());

    if (query) {
      newParams.set("q", query);
      newParams.delete("page");
    } else {
      newParams.delete("q");
    }
    onClick?.();
    router.push(createUrl(newPathname, newParams));
  }
  function countryChange(countryCode: string) {
    const newParams = new URLSearchParams(searchParams.toString());
    if (countryCode) {
      newParams.set("country", countryCode);
    } else {
      newParams.delete("country");
    }
    router.push(createUrl(newPathname, newParams));
  }
  function categoryChange(newCategory: string) {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      newParams.set("ctg", newCategory);
    } else {
      newParams.delete("ctg");
    }
    router.push(createUrl(newPathname, newParams));
  }

  const onReset = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("page");
    newParams.delete("q");
    newParams.delete("country");
    newParams.delete("ctg");
    setQuery("");
    router.push(createUrl(newPathname, newParams));
  };

  const updateSearchParams = debounce((value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("q", value);
    newParams.delete("page");
    router.push(createUrl(pathname, newParams));
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (currentPage === "shop") {
      updateSearchParams(value);
    }
  };

  const isSearch = fields.includes("Search");
  const isCategory = fields.includes("Category");
  const isCountry = fields.includes("Country");
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 rounded-[20px] bg-white p-[10px] md:h-[70px] md:flex-row"
    >
      {isSearch && (
        <div className="flex flex-1 items-center gap-2 px-2">
          <Search className="h-8 w-8 text-secondary" />
          <input
            type="text"
            placeholder="Job title or keyword"
            value={query}
            onChange={handleChange}
            className="h-[50px] w-full border-b border-gray-300 bg-transparent focus:border-secondary focus:outline-none md:h-full"
          />
        </div>
      )}
      {(isCategory || isCountry) && (
        <div className="flex flex-1 md:gap-2">
          {isCountry && (
            <div className="flex flex-1 items-center gap-2 pl-2">
              <LocationOnOutlined className="h-8 w-8 text-secondary" />
              <FormControl
                variant="standard"
                className="h-full w-full justify-center border-b border-solid border-gray-300"
              >
                <SearchableSelect
                  options={
                    filters
                      ?.find((x) => x.name === "Country")
                      ?.items.map((item) => ({
                        icon: (
                          <Flag
                            code={item.value.toLocaleLowerCase()}
                            name={item.label?.toString() || ""}
                            className="mr-2 inline"
                          />
                        ),
                        label: `${item.label} (${item.count})`,
                        value: item.value,
                      })) || []
                  }
                  displayEmpty
                  value={country || ""}
                  onChange={(e) => countryChange(e.target.value)}
                  className="border-none bg-transparent text-main focus:outline-none"
                  disableUnderline
                  renderValue={(selected: string) => {
                    if (!selected) {
                      return <em className="text-gray-400">Select Country</em>;
                    }
                    const item = countries.find((x) => x.isoCode == selected);
                    return item ? (
                      <span>
                        <Flag
                          code={item.isoCode.toLocaleLowerCase()}
                          name={item.name}
                          className="mr-2 inline"
                        />
                        {item.name}
                      </span>
                    ) : (
                      selected
                    );
                  }}
                />
              </FormControl>
            </div>
          )}
          {isCategory && (
            <div className="flex flex-1 items-center gap-2 pr-2">
              <GroupOutlined className="h-8 w-8 text-secondary" />
              <FormControl
                variant="standard"
                className="h-full w-full justify-center border-b border-solid border-gray-300"
              >
                <Select
                  displayEmpty
                  className="border-none bg-transparent text-main focus:outline-none"
                  disableUnderline
                  value={category || ""}
                  onChange={(e) => categoryChange(e.target.value)}
                  renderValue={(selected) => {
                    const item = categories?.data.find(
                      (category) => category.id === selected,
                    );
                    if (!selected) {
                      return <em className="text-gray-400">Select Category</em>;
                    }
                    return (
                      <span>
                        {item
                          ? item.name
                          : selected.toString()?.slice(0, 5)}{" "}
                      </span>
                    );
                  }}
                  // defaultValue="Select-Category"
                >
                  {filters
                    ?.find((x) => x.name === "Category")
                    ?.items.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          )}
        </div>
      )}
      {(query || country || category) && (
        <Button variant="outlined" onClick={onReset}>
          {" "}
          reset
        </Button>
      )}
      <button className="h-[50px] text-nowrap rounded-[10px] bg-primary px-4 py-4 font-semibold text-white transition-all duration-300 hover:scale-102 hover:bg-primary/90 hover:shadow-2xl focus:ring-2 focus:ring-white md:h-full">
        {button}
      </button>
    </form>
  );
};

export default SearchForm;
