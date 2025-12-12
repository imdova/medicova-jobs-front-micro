"use client";
import { API_GET_COMPANY_TYPES } from "@/api/admin";
import Flag from "@/components/UI/flagitem";
import SearchableSelect from "@/components/UI/SearchableSelect";
import useFetch from "@/hooks/useFetch";
import { useLocationData } from "@/hooks/useLocationData";
import { Industry } from "@/types";
import { createUrl } from "@/util";
import { LocationOn, MedicalServices, Search } from "@mui/icons-material";
import {
  Button,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const SearchInputForm: React.FC = () => {
  const { countries } = useLocationData();
  const { data: companyTypes } = useFetch<PaginatedResponse<Industry>>(
    API_GET_COMPANY_TYPES,
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const newPathname = pathname;

  const initialSearchText = searchParams.get("q") || "";
  const initialCompanyType = searchParams.get("ctp") || "";
  const initialCountry = searchParams.get("country") || "EG";

  const [query, setQuery] = useState(initialSearchText);
  const [companyType, setCompanyType] = useState(initialCompanyType);
  const [country, steCountry] = useState(initialCountry);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("q", query || " ");
    newParams.set("country", country);
    newParams.set("ctp", companyType);
    newParams.delete("page");
    router.push(createUrl(newPathname, newParams));
  }

  const onReset = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("q");
    newParams.delete("page");
    newParams.delete("country");
    newParams.delete("ctp");
    setQuery("");
    setCompanyType("");
    steCountry("");
    router.push(createUrl(newPathname, newParams));
  };
  return (
    <form
      className="flex flex-col gap-2 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:flex-row md:p-5"
      onSubmit={onSubmit}
    >
      {/* Text Input with Icon */}
      <TextField
        fullWidth
        placeholder="Company title or keyword"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      />

      <Select
        fullWidth
        value={companyType}
        onChange={(e) => setCompanyType(e.target.value)}
        variant="outlined"
        displayEmpty
        startAdornment={
          <InputAdornment position="start">
            <MedicalServices />
          </InputAdornment>
        }
        renderValue={(selected: string) => {
          if (!selected) {
            return <em className="text-gray-400">Select Company Type</em>;
          }
          const item = companyTypes?.data.find((x) => x.id == selected);
          return item && <span>{item.name}</span>;
        }}
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <MenuItem disabled value="Company type">
          Select Company Type
        </MenuItem>
        {companyTypes?.data.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </Select>
      <SearchableSelect
        options={countries.map((x) => ({
          icon: (
            <Flag
              code={x.isoCode.toLocaleLowerCase()}
              name={x.name}
              className="mr-2 inline"
            />
          ),
          label: x.name,
          value: x.isoCode,
        }))}
        fullWidth
        value={country}
        onChange={(e) => steCountry(e.target.value)}
        variant="outlined"
        displayEmpty
        startAdornment={
          <InputAdornment position="start">
            <LocationOn />
          </InputAdornment>
        }
        renderValue={(selected: string) => {
          if (!selected) {
            return <em className="text-gray-400">Select Country</em>;
          }
          const item = countries.find((x) => x.isoCode == selected);
          return (
            item && (
              <span>
                <Flag
                  code={item.isoCode.toLocaleLowerCase()}
                  name={item.name}
                  className="mr-2 inline"
                />
                {item.name}
              </span>
            )
          );
        }}
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      />

      {/* Search Button */}
      {(query || country || companyType) && (
        <Button variant="outlined" onClick={onReset}>
          {" "}
          reset
        </Button>
      )}
      <Button
        variant="contained"
        type="submit"
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          px: 4,
          width: { xs: "100%", md: "50%" },
        }}
      >
        Search
      </Button>
    </form>
  );
};

const SearchBar: React.FC = (props) => {
  return (
    <Suspense>
      <SearchInputForm {...props} />
    </Suspense>
  );
};
export default SearchBar;
