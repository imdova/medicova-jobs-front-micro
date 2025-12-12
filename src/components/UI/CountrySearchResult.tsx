"use client";
import React, { useEffect } from "react";
import Flag from "./flagitem";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCountries } from "@/store/slices/locationSlice";
import useGeoInfo from "@/hooks/useGeoInfo";
import { getClosestCountries } from "@/util/location";
import { createUrl } from "@/util";
import { useLocationData } from "@/hooks/useLocationData";
import useFetch from "@/hooks/useFetch";
import { API_GET_CATEGORIES, API_GET_INDUSTRIES } from "@/api/admin";
import { Industry } from "@/types";
import Link from "next/link";

const initialCountries = [
  { code: "SA", count: 0, name: "Saudi Arabia" },
  { code: "EG", count: 0, name: "Egypt" },
  { code: "AE", count: 0, name: "United Arab Emirates" },
  { code: "QA", count: 0, name: "Qatar" },
  { code: "LB", count: 0, name: "Lebanon" },
];

const CountrySearchResult: React.FC = () => {
  const { data: geoDat } = useGeoInfo();
  const initialCountry = geoDat.country_code2;
  const { data: industriesData } =
    useFetch<PaginatedResponse<Industry>>(API_GET_INDUSTRIES);
  const industries = industriesData?.data || [];
  const { data: categoriesData } =
    useFetch<PaginatedResponse<Industry>>(API_GET_CATEGORIES);
  const categories = categoriesData?.data || [];
  const { countries } = useLocationData();

  const combinations: { name: string; code: string; url: string }[] = [];

  for (let i = 0; i < industries.length; i++) {
    const category = industries[i];
    for (let index = 0; index < initialCountries.length; index++) {
      const country = initialCountries[index];
      combinations.push({
        code: country.code,
        name: `${category.name} Jobs in ${country.name}`,
        url: `/a/${category.name}-Jobs-in-${country.name.replaceAll(" ", "-")}?ind=${category.id}&country=${country.code}`,
      });
    }
  }

  const userLocation = countries.find((x) => x.isoCode === initialCountry);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const countryParam = searchParams.get("country");
  const countryCode = countryParam || initialCountry;
  const country = countries.find((x) => x.isoCode === countryCode);
  const displayCountry = country?.name || countryCode;

  const closestCountries = getClosestCountries(
    Number(userLocation?.latitude),
    Number(userLocation?.longitude),
    countries.filter((x) => x.isoCode !== countryParam),
    20,
  );

  function countryChange(countryCode: string) {
    const newParams = new URLSearchParams(searchParams.toString());
    if (countryCode) {
      newParams.set("country", countryCode);
    } else {
      newParams.delete("country");
    }
    router.push(createUrl(pathname, newParams));
  }

  // href={`/a/${job.jobCategory}-Jobs-in-${job?.country?.name?.replaceAll(" ", "-") || "Egypt"}?ctg=${job.jobCategoryId}&country=${job.country?.code}`}

  return (
    <div className="container mx-auto space-y-4 p-2 py-12 lg:max-w-[900px]">
      {/* SEO Heading */}

      <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
        <h2 className="mb-4 text-center text-xl font-semibold text-main">
          New Job Opportunities
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {combinations.map((item, index) => (
            <Link
              href={item.url}
              key={index}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Flag code={item.code.toLocaleLowerCase()} name={item.code} />{" "}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
        <h2 className="mb-4 text-center text-xl font-semibold text-main">
          Job Opportunities by countries
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {countries.slice(0, 20).map((item, index) => (
            <Link
              href={`/a/Jobs-in-${item.name.replaceAll(" ", "-")}?country=${item.isoCode}`}
              key={index}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Flag code={item.isoCode.toLocaleLowerCase()} name={item.name} />{" "}
              Jobs in {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountrySearchResult;

export const CountryHeading: React.FC = () => {
  const { countries } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (countries.data.length === 0) {
      dispatch(fetchCountries());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  const searchParams = useSearchParams();
  const countryCode = searchParams.get("country");

  const country = countries.data.find((x) => x.isoCode === countryCode);
  return (
    <>
      {country && (
        <span className="text-[45px] font-black text-primary-foreground md:text-[60px]">
          {" "}
          in
          <span
            className={`${country ? `text-transparent` : "text-primary-foreground"} bg-contain bg-clip-text bg-center text-[45px] font-black md:text-[60px]`}
            style={{
              backgroundImage: `url('https://flagcdn.com/${country.isoCode.toLowerCase()}.svg')`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            {" " + country.name}
          </span>
        </span>
      )}
    </>
  );
};
