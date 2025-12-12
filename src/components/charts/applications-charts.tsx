"use client";
import dynamic from "next/dynamic";
import ChartHeader from "./chart-header";
import { useChartData } from "@/hooks/useChartData";
import { createChartConfig } from "@/util/chart";
import { useState } from "react";
import { cn } from "@/util";
import { downloadAsJSON } from "@/util/general";
import { Filters } from "@/types/chart";
import { categoriesData, countries } from "@/constants/seekers-dummy";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Category = "Applications" | "countries" | "categories";
const categories: Category[] = ["Applications", "countries", "categories"];

const ApplicationsCharts = () => {
  const [filter, setFilter] = useState<Filters>({
    type: "seeker",
    countries: countries.map((country) => country.name),
    categories: categoriesData,
  });
  const {
    timeUnit,
    currentPeriod,
    setCurrentPeriod,
    setTimeUnit,
    data,
    isLoading,
  } = useChartData({ filter });
  const [category, setCategory] = useState<Category>("Applications");

  const seriesData = (() => {
    switch (category) {
      case "Applications":
        return [
          {
            name: "New Applications",
            color: "#FF8743", // Green
            data: data.userDataPerTime.counts,
          },
        ];
      case "countries":
        return [
          {
            name: "New Applications",
            color: "#FF8743", // Green
            data: data.userDataPerCountry.counts,
          },
        ];
      case "categories":
        return [
          {
            name: "New Applications",
            color: "#FF8743", // Green
            data: data.userDataPerCategory.counts,
          },
        ];
      default:
        return [];
    }
  })();

  const [selectedSeries, setSelectedSeries] = useState<string[]>(
    seriesData.map((series) => series.name),
  );
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const filteredSeries = seriesData.filter((series) =>
    selectedSeries.includes(series.name),
  );
  const yaxis =
    category === "Applications"
      ? data.userDataPerTime.dates
      : category === "countries"
        ? data.userDataPerCountry.dates
        : category === "categories"
          ? data.userDataPerCategory.dates
          : [];

  const { chartOptions, series } = createChartConfig(yaxis, {
    series: filteredSeries,
    shortenNames: true,
  });

  const filterOptions = () => {
    switch (category) {
      case "countries":
        return countries.map((country) => ({
          label: country.name,
          value: country.name,
        }));
      case "categories":
        return categoriesData.map((category) => ({
          label: category,
          value: category,
        }));
      default:
        return [];
    }
  };
  return (
    <div className="flex flex-col h-full rounded-lg bg-white p-3 shadow-sm">
      {/* <button
        onClick={() => downloadAsJSON(data)}
        className="flex items-center gap-2"
      > 
        <span>Download Data</span>
      </button> */}
      <div className="flex items-center justify-between">
        <h1 className="mb-4 max-w-72 p-2 text-2xl font-bold">
          Applications Trends
        </h1>
        <div className="flex w-full justify-between gap-4 md:w-auto md:items-center">
          {seriesData.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap justify-end gap-3">
                {seriesData.map((series, index) => (
                  <button
                    onClick={() =>
                      setSelectedSeries(
                        selectedSeries.includes(series.name)
                          ? selectedSeries.length > 1
                            ? selectedSeries.filter((s) => s !== series.name)
                            : selectedSeries
                          : [...selectedSeries, series.name],
                      )
                    }
                    key={series.name}
                    className={cn(
                      "flex items-center opacity-50",
                      selectedSeries.includes(series.name) && "opacity-100",
                    )}
                  >
                    <div
                      className="mr-2 h-4 w-4 rounded-md"
                      style={{ backgroundColor: series.color }}
                    />
                    <span className="text-nowrap text-xs">{series.name}</span>
                    <span className="mx-2 text-xs font-semibold">
                      (
                      {series.data.reduce(
                        (acc: number, curr: number | null) => acc + (curr ?? 0),
                        0,
                      )}
                      {index !== 0 && (
                        <>
                          {" - "}
                          {Math.round(
                            (series.data.reduce(
                              (acc: number, curr: number | null) =>
                                acc + (curr ?? 0),
                              0,
                            ) /
                              (seriesData[0]?.data.reduce(
                                (acc: number, curr: number | null) =>
                                  acc + (curr ?? 0),
                                0,
                              ) ?? 1)) *
                              100,
                          )}
                          %
                        </>
                      )}
                      )
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ChartHeader
        category={category}
        setCategory={setCategory}
        categories={categories.map((category) => ({
          label: category,
          value: category,
        }))}
        timeUnit={timeUnit}
        currentPeriod={currentPeriod}
        setCurrentPeriod={setCurrentPeriod}
        setTimeUnit={setTimeUnit}
        setChartType={setChartType}
        chartType={chartType}
        filter={filter}
        setFilter={setFilter}
        filterOptions={filterOptions()}
      />
      <div className="flex-1">
        <div className="grid h-full grid-cols-1">
          <div className="-mb-3 -ml-4 h-full min-h-96 w-full">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-lg bg-gray-100"></div>
            ) : (
              <Chart
                options={chartOptions}
                series={series}
                type={chartType}
                width="100%"
                height="100%"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsCharts;
