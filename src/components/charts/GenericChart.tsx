"use client";
import dynamic from "next/dynamic";
import ChartHeader from "./chart-header";
import { useChartData } from "@/hooks/useChartData";
import { createChartConfig } from "@/util/chart";
import { useState } from "react";
import { cn } from "@/util";
import { Filters } from "@/types/chart";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CardData {
  title: string;
  value: string;
  color: string;
  icon?: React.ReactNode;
}

interface Props {
  title: string;
}

const categories = ["users", "countries", "categories"];

const categoriesData = categories.map((category) => ({
  label: category,
  value: category,
}));

const GenericChart: React.FC<Props> = ({ title }) => {
  const {
    timeUnit,
    currentPeriod,
    setCurrentPeriod,
    setTimeUnit,
    data,
    isLoading,
  } = useChartData({
    filter: {},
  });
  const [category, setCategory] = useState<string>("users");
  const [filter, setFilter] = useState<Filters>({});

  const seriesData = (() => {
    switch (category) {
      case "users":
        return [
          {
            name: "New Users",
            color: "#2ba149", // Green
            data: data.userDataPerTime.counts,
          },
          {
            name: "Completed Profiles",
            color: "#FF8743", // Orange
            data: data.userDataPerTime.profileCompletions,
          },
          {
            name: "Uploaded Resumes",
            color: "#4A90E2", // Blue
            data: data.userDataPerTime.resumeUploads,
          },
        ];
      case "countries":
        return [
          {
            name: "New Users",
            color: "#2ba149", // Green
            data: data.userDataPerCountry.counts,
          },
          {
            name: "Completed Profiles",
            color: "#FF8743", // Orange
            data: data.userDataPerCountry.profileCompletions,
          },
          {
            name: "Uploaded Resumes",
            color: "#4A90E2", // Blue
            data: data.userDataPerCountry.resumeUploads,
          },
        ];
      case "categories":
        return [
          {
            name: "New Users",
            color: "#2ba149", // Green
            data: data.userDataPerCategory.counts,
          },
          {
            name: "Completed Profiles",
            color: "#FF8743", // Orange
            data: data.userDataPerCategory.profileCompletions,
          },
          {
            name: "Uploaded Resumes",
            color: "#4A90E2", // Blue
            data: data.userDataPerTime.resumeUploads,
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
    category === "users"
      ? data.userDataPerTime.dates
      : category === "countries"
        ? data.userDataPerCountry.dates
        : category === "categories"
          ? data.userDataPerCategory.dates
          : [];

  const { chartOptions, series } = createChartConfig(yaxis, {
    series: filteredSeries,
  });

  return (
    <div className="rounded-lg bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="mb-4 max-w-72 p-2 text-2xl font-bold">{title}</h1>
        <div className="flex w-full justify-between gap-4 md:w-auto md:items-center">
          {seriesData.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap justify-end gap-3">
                {seriesData.map((series) => (
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
        category={category}
        setCategory={setCategory}
        categories={categoriesData}
        timeUnit={timeUnit}
        currentPeriod={currentPeriod}
        setCurrentPeriod={setCurrentPeriod}
        setTimeUnit={setTimeUnit}
        setChartType={setChartType}
        chartType={chartType}
        filter={filter}
        setFilter={setFilter}
        filterOptions={[]}
      />
      <div className="-mb-3 -ml-4 h-[450px] w-full">
        {isLoading ? (
          <div className="h-[450px] w-full animate-pulse rounded-lg bg-gray-100"></div>
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
  );
};

export default GenericChart;
