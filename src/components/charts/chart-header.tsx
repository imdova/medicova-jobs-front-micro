"use client";
import { Filters, TimeUnit } from "@/types/chart";
import DateSlider from "@/components/UI/DateSlider";
import DropMenu from "@/components/UI/drop-down";
import { BarChart2, LineChart } from "lucide-react";

interface ChartHeaderProps<T> {
  category?: T;
  categories?: ActionOption[];
  setCategory?: React.Dispatch<React.SetStateAction<T>>;
  timeUnit: TimeUnit;
  currentPeriod: Date;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Date>>;
  setTimeUnit: React.Dispatch<React.SetStateAction<TimeUnit>>;
  setChartType?: React.Dispatch<React.SetStateAction<"line" | "bar">>;
  chartType?: "line" | "bar";
  filter: Filters;
  setFilter: React.Dispatch<React.SetStateAction<Filters>>;
  filterOptions?: ActionOption[];
}

const options = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const ChartHeader = <T,>({
  category,
  categories,
  setCategory,
  timeUnit,
  currentPeriod,
  setCurrentPeriod,
  setTimeUnit,
  setChartType,
  chartType,
  filter,
  setFilter,
  filterOptions,
}: ChartHeaderProps<T>) => {
  return (
    <div className="flex w-full justify-center gap-2 px-3">
      <div className="flex h-[35px] w-full flex-1 items-center gap-2 p-1">
        <DateSlider
          timeUnit={timeUnit}
          currentPeriod={currentPeriod}
          setCurrentPeriod={setCurrentPeriod}
        />
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
        {setChartType && (
          <div className="flex h-[35px] items-center justify-center gap-1 rounded-base border border-gray-300 p-1">
            <button
              title="Line Chart"
              onClick={() => setChartType("line")}
              className={`rounded-md p-1 ${
                chartType === "line"
                  ? "bg-gray-100 text-primary"
                  : "hover:bg-gray-50"
              }`}
            >
              <LineChart size={16} />
            </button>
            <button
              title="Bar Chart"
              onClick={() => setChartType("bar")}
              className={`rounded-md p-1 ${
                chartType === "bar"
                  ? "bg-gray-100 text-primary"
                  : "hover:bg-gray-50"
              }`}
            >
              <BarChart2 size={16} />
            </button>
          </div>
        )}
        <div className="flex h-[35px] items-center justify-center gap-2 rounded-base border border-gray-300">
          <DropMenu
            className="border-none hover:border-none"
            label={timeUnit}
            onChange={(option) => {
              setTimeUnit(option.value as TimeUnit);
            }}
            options={options}
          />
        </div>
        {setCategory && (
          <div className="flex h-[35px] items-center justify-center gap-2 rounded-base border border-gray-300">
            <DropMenu
              className="text-nowrap border-none hover:border-none"
              label={"Chart Type"}
              value={category as string}
              onChange={(option) => {
                setCategory(option.value as T);
              }}
              options={categories || []}
            />
          </div>
        )}
        {category && filterOptions && filterOptions.length > 0 && (
          <div className="flex h-[35px] items-center justify-center gap-2 rounded-base border border-gray-300">
            <DropMenu
              className="text-nowrap border-none hover:border-none"
              label={category as string}
              value={filter[category as keyof Filters] as string[]}
              disabledClose={true}
              onChange={(option) => {
                const value = option.value ?? "";
                const currentFilters =
                  (filter[category as keyof Filters] as string[]) || [];
                const newFilters = currentFilters.includes(value)
                  ? currentFilters.length > 2
                    ? currentFilters.filter((f) => f !== value)
                    : currentFilters
                  : [...currentFilters, value];

                setFilter({
                  ...filter,
                  [category as keyof Filters]: newFilters,
                });
              }}
              options={filterOptions || []}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartHeader;
