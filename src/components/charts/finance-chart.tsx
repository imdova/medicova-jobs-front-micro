"use client";
import dynamic from "next/dynamic";
import ChartHeader from "./chart-header";
import { useChartData } from "@/hooks/useChartData";
import { createChartConfig } from "@/util/chart";
import { useState } from "react";
import { cn } from "@/util";
import { Filters } from "@/types/chart";
import { categoriesData, countries } from "@/constants/seekers-dummy";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../UI/card";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Category = "Revenue" | "countries" | "categories";
const categories: Category[] = ["Revenue", "countries", "categories"];

const FinanceCharts = () => {
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
  const [category, setCategory] = useState<Category>("Revenue");

  const seriesData = (() => {
    switch (category) {
      case "Revenue":
        return [
          {
            name: "Revenue",
            color: "#FF8743", // Green
            data: data.userDataPerTime.counts.map((count) => count * 10),
          },
          {
            name: "Subscriptions",
            color: "#0884FF", // Blue
            data: data.userDataPerTime.profileCompletions,
          },
        ];
      case "countries":
        return [
          {
            name: "Revenue",
            color: "#FF8743", // Green
            data: data.userDataPerCountry.counts.map((count) => count * 10),
          },
          {
            name: "Subscriptions",
            color: "#0884FF", // Blue
            data: data.userDataPerCountry.profileCompletions,
          },
        ];
      case "categories":
        return [
          {
            name: "Revenue",
            color: "#FF8743", // Green
            data: data.userDataPerCategory.counts.map((count) => count * 10),
          },
          {
            name: "Subscriptions",
            color: "#0884FF", // Blue
            data: data.userDataPerCategory.profileCompletions,
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
    category === "Revenue"
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="max-w-72 text-2xl font-bold">Plan Subscription Overview</CardTitle>
        <CardAction>
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
                          (acc: number, curr: number | null) =>
                            acc + (curr ?? 0),
                          0,
                        )}{" "}
                        {index === 0 && "$"} )
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardAction>
      </CardHeader>
      <CardHeader>
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
      </CardHeader>
      <CardContent className="h-[calc(100%-143px)] pl-0 w-full">
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
      </CardContent>
    </Card>
  );
};

export default FinanceCharts;
