"use client";
import dynamic from "next/dynamic";
import ChartHeader from "./chart-header";
import { useChartData } from "@/hooks/useChartData";
import { createChartConfig, generateRandomArray } from "@/util/chart";
import { useState } from "react";
import { cn } from "@/util";
import { Filters } from "@/types/chart";
import { categoriesData, countries } from "@/constants/seekers-dummy";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SingleEmployersChart = () => {
  const [filter, setFilter] = useState<Filters>({
    type: "employer",
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

  const jobs =
    generateRandomArray(
      data.userDataPerTime.counts.length,
      1,
      timeUnit == "daily"
        ? 1
        : timeUnit == "weekly"
          ? 2
          : timeUnit == "monthly"
            ? 8
            : 20,
    ) || [];

  const seriesData = [
    {
      name: "Visits",
      color: "#2ba149", // Green
      data:
        generateRandomArray(data.userDataPerTime.counts.length, 5, 95) || [],
    },
    {
      name: "Jobs",
      color: "#FF8743", // Orange
      data: jobs,
    },
    {
      name: "Applicants",
      color: "#4A90E2", // Blue
      data: data.userDataPerTime.resumeUploads,
    },
  ];

  const [selectedSeries, setSelectedSeries] = useState<string[]>(
    seriesData.map((series) => series.name),
  );
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const filteredSeries = seriesData.filter((series) =>
    selectedSeries.includes(series.name),
  );
  const xAxis = data.userDataPerTime.dates;

  const { chartOptions, series } = createChartConfig(xAxis, {
    series: filteredSeries,
    shortenNames: true,
  });

  return (
    <div className="flex h-full flex-col rounded-lg bg-white p-3 shadow-sm">
      {/* <button
        onClick={() => downloadAsJSON(data)}
        className="flex items-center gap-2"
      > 
        <span>Download Data</span>
      </button> */}
      <div className="flex justify-between">
        <h1 className="mb-4 flex-1 p-2 text-2xl font-bold">
          Jobs & Applications Trends
        </h1>
        <div className="flex w-full flex-1 justify-between gap-4 md:w-auto md:items-center">
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
        timeUnit={timeUnit}
        currentPeriod={currentPeriod}
        setCurrentPeriod={setCurrentPeriod}
        setTimeUnit={setTimeUnit}
        setChartType={setChartType}
        chartType={chartType}
        filter={filter}
        setFilter={setFilter}
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

export default SingleEmployersChart;
