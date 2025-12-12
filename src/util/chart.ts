import { ApexOptions } from "apexcharts";
import { subDays, subWeeks, subMonths, subYears } from "@/util/date";
import { ChartData, FilterResults, Filters } from "@/types/chart";
import { User } from "@/constants/seekers-dummy";

interface ChartConfig {
  chartId?: string;
  colors?: string[];
  strokeWidth?: number;
  strokeCurve?: "smooth" | "straight" | "stepline";
  markerSize?: number;
  markerHoverSize?: number;
  fillType?: "gradient" | "solid" | "pattern" | "image";
  series?: {
    name: string;
    color?: string;
    data: (number | null)[];
  }[];
  barBorderRadius?: number;
  columnWidth?: string;
  shortenNames?: boolean;
}

const shortenName = (name: string, level: number = 5): string => {
  // Return original if single word or level is low
  if (level < 3) return name;

  const words = name.split(" ");
  if (words.length === 1) {
    // For single words, truncate based on level
    if (level > 7) {
      return name.slice(0, 3);
    }
    if (level > 5) {
      return name.slice(0, 5);
    }
    return name;
  }

  // For multiple words
  if (level > 7) {
    // Very aggressive shortening - just first letter of each word
    return words.map((word) => word[0]).join("");
  }
  if (level > 5) {
    // Moderate shortening - first 3 chars of first word + initials
    return (
      words[0].slice(0, 3) +
      words
        .slice(1)
        .map((word) => word[0])
        .join("")
    );
  }
  // Light shortening - first word + initials
  return (
    words[0] +
    words
      .slice(1)
      .map((word) => word[0])
      .join("")
  );
};

export function createChartConfig(
  xAxis: string[],
  config: ChartConfig = {},
): { chartOptions: ApexOptions; series: ApexOptions["series"] } {
  const defaultConfig: ChartConfig = {
    chartId: "generic-chart",
    colors: ["#2ba149", "#FF8743"],
    strokeWidth: 3,
    strokeCurve: "smooth",
    markerSize: 0,
    markerHoverSize: 5,
    fillType: "solid",
    shortenNames: false,
    series: [
      {
        name: "New Users",
        color: "#2ba149",
        data: [],
      },
    ],
    barBorderRadius: 4,
    columnWidth: "45%",
  };

  const mergedConfig = { ...defaultConfig, ...config };
  const shorterNames = xAxis.map((name) => ({
    name: name,
    shortName: mergedConfig.shortenNames
      ? shortenName(name, xAxis.length)
      : name,
  }));

  const chartOptions: ApexOptions = {
    chart: {
      id: mergedConfig.chartId,
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
    },
    stroke: {
      width: mergedConfig.strokeWidth,
      curve: mergedConfig.strokeCurve,
    },
    markers: {
      size: mergedConfig.markerSize,
      hover: { size: mergedConfig.markerHoverSize },
    },
    fill: {
      type: mergedConfig.fillType,
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: shorterNames.map((name) => name.shortName),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      tickAmount: 4,
    },
    grid: {
      show: true,
      strokeDashArray: 5,
      position: "back",
      borderColor: "#e0e0e0",
    },
    colors: mergedConfig.colors,
    legend: {
      show: false,
    },
    tooltip: {
      x: {
        formatter: (_, { dataPointIndex }) => {
          return shorterNames[dataPointIndex]?.name || "";
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: mergedConfig.barBorderRadius,
        columnWidth: mergedConfig.columnWidth,
      },
    },
  };

  const series = mergedConfig.series;

  return { chartOptions, series };
}

interface FilterParams {
  data: User[];
  timeUnit: "daily" | "weekly" | "monthly" | "yearly";
  currentPeriod: Date;
  filter: Filters;
}

export const applyFilters = ({
  data,
  timeUnit,
  filter,
  currentPeriod,
}: FilterParams): FilterResults => {
  let filtered = [...data];

  if (filter.type) {
    filtered = filtered.filter((user) => user.type === filter.type);
  }
  if (filter.countries) {
    filtered = filtered.filter((user) =>
      filter.countries?.includes(user.country),
    );
  }
  if (filter.categories) {
    filtered = filtered.filter((user) =>
      filter.categories?.includes(user.category),
    );
  }
  // if (filter.ageRange) {
  //   filtered = filtered.filter((user) => {
  //     const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();
  //     return age >= filter.ageRange[0] && age <= filter.ageRange[1];
  //   });
  // }

  type KeyFunction = (date: Date) => string;

  const getTimeRangeAndLabels = (): {
    start: Date;
    end: Date;
    labels: string[];
    getKey: KeyFunction;
  } => {
    const start = new Date(currentPeriod);
    let end: Date;
    let labels: string[];
    let getKey: KeyFunction;

    switch (timeUnit) {
      case "daily":
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        labels = Array.from({ length: 24 }, (_, i) => `${i}`);
        getKey = (date) => `${date.getHours()}`;
        break;

      case "weekly":
        const day = start.getDay();
        start.setDate(start.getDate() - day);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        getKey = (date) => labels[date.getDay()];
        break;

      case "monthly":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end = new Date(
          start.getFullYear(),
          start.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        const daysInMonth = end.getDate();
        labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
        getKey = (date) => `${date.getDate()}`;
        break;

      case "yearly":
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start.getFullYear(), 11, 31, 23, 59, 59, 999);
        labels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        getKey = (date) => labels[date.getMonth()];
        break;

      default:
        throw new Error("Invalid time unit");
    }

    return { start, end, labels, getKey };
  };

  const calculatePeriodData = (
    users: User[],
    getKey: KeyFunction,
    labels: string[],
  ): ChartData => {
    const registrationCounts = new Array(labels.length).fill(0);
    const profileCompletionCounts = new Array(labels.length).fill(0);
    const resumeUploadCounts = new Array(labels.length).fill(0);

    users.forEach((user) => {
      const index = labels.indexOf(getKey(new Date(user.registrationDate)));
      if (index >= 0) {
        registrationCounts[index]++;
        if (user.isCompleted) profileCompletionCounts[index]++;
        if (user.hasResume) resumeUploadCounts[index]++;
      }
    });

    return {
      dates: labels,
      counts: registrationCounts,
      profileCompletions: profileCompletionCounts,
      resumeUploads: resumeUploadCounts,
    };
  };

  const { start, end, labels, getKey } = getTimeRangeAndLabels();

  // Filter users within the time range
  const usersInTimeRange = filtered.filter((u) => {
    const date = new Date(u.registrationDate);
    return date >= start && date <= end;
  });

  const userDataPerTime = calculatePeriodData(usersInTimeRange, getKey, labels);

  const aggregateByField = (
    users: User[],
    field: keyof User,
    topN = 10,
  ): ChartData => {
    const counts: Record<string, number> = {};
    const profileCompletionCounts: Record<string, number> = {};
    const resumeUploadCounts: Record<string, number> = {};

    users.forEach((user) => {
      const key = user[field] as string;
      counts[key] = (counts[key] || 0) + 1;
      if (user.isCompleted)
        profileCompletionCounts[key] = (profileCompletionCounts[key] || 0) + 1;
      if (user.hasResume)
        resumeUploadCounts[key] = (resumeUploadCounts[key] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN);

    const sortedKeys = sorted.map(([key]) => key);

    return {
      dates: sortedKeys,
      counts: sortedKeys.map((key) => counts[key]),
      profileCompletions: sortedKeys.map(
        (key) => profileCompletionCounts[key] || 0,
      ),
      resumeUploads: sortedKeys.map((key) => resumeUploadCounts[key] || 0),
    };
  };

  // Use usersInTimeRange instead of filtered for country and category
  const userDataPerCountry = aggregateByField(usersInTimeRange, "country");
  const userDataPerCategory = aggregateByField(usersInTimeRange, "category");

  return {
    userDataPerTime,
    userDataPerCountry,
    userDataPerCategory,
  };
};

export function generateRandomArray(
  length: number,
  maxItemValue: number,
  maxSum: number
): number[] | null {
  // Input validation
  if (
    length <= 0 ||
    maxItemValue < 0 ||
    maxSum < 0 ||
    length * maxItemValue < 0 // Ensure non-negative constraints
  ) {
    return null;
  }

  const result: number[] = [];
  let currentSum = 0;

  for (let i = 0; i < length; i++) {
    // Calculate remaining sum and items
    const remainingItems = length - i - 1;
    const remainingSum = maxSum - currentSum;

    // Calculate max possible value for current item
    // Allow 0 as minimum for remaining items
    const maxPossible = Math.min(maxItemValue, remainingSum);

    if (maxPossible < 0) {
      return null; // Cannot satisfy constraints
    }

    // Generate random number between 0 and maxPossible
    const randomNum = Math.floor(Math.random() * (maxPossible + 1));
    result.push(randomNum);
    currentSum += randomNum;
  }

  return result;
}
