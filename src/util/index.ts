import { EducationLevel } from "@/constants/enums/education-level.enum";
import { educationOptions } from "@/constants/job";
import { JobData } from "@/types";
import { ReadonlyURLSearchParams } from "next/navigation";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { addToast } from "@/store/slices/toastSlice";
import { AppDispatch } from "@/store/store";
import { Toast } from "@/types";
import { ExperienceData } from "@/types/seeker";

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const formatDate = (
  date: Date | string,
  options?: { year?: boolean; month?: boolean; day?: boolean },
): string => {
  const months = [
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
  const d = new Date(date);

  const year = options?.year !== false ? d.getFullYear() : "";
  const month = options?.month !== false ? months[d.getMonth()] : "";
  const day = options?.day !== false ? d.getDate() : "";

  const formattedDate = [month, day, year].filter(Boolean).join(", ");
  return formattedDate.trim();
};
export const getDuration = ({
  startDate,
  endDate,
}: Partial<ExperienceData>): string => {
  if (!startDate) return "";
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const durationInMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth();
  const years = Math.floor(durationInMonths / 12);
  const months = durationInMonths % 12;
  if (years === 0) {
    return months > 0 ? `(${months} month)` : "";
  }
  return `(${years} y ${months} m)`;
};
export function formatName(
  {
    firstName,
    lastName,
  }: {
    firstName?: string | null;
    lastName?: string | null;
  },
  isAvailable?: boolean,
): string {
  const capitalize = (name: string | null | undefined) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "";

  if (isAvailable) {
    return `${capitalize(firstName)} ${capitalize(lastName)}`;
  }
  const lastNameInitial = lastName?.charAt(0).toUpperCase();
  return `${capitalize(firstName)} .${lastNameInitial}`;
}
export function formatFullName(fullName: string): string {
  const nameParts = fullName.trim().split(" ");
  if (nameParts.length < 2) {
    return fullName;
  }
  const firstName = nameParts[0];
  const lastNameInitial = nameParts[nameParts.length - 1]
    .charAt(0)
    .toUpperCase();
  return `${firstName} .${lastNameInitial}`;
}

export function getLastEdit(date: Date): string {
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
  // Check if it's today
  if (diffDays === 0) {
    return "today";
  }

  // Check if it's within the last 15 days
  if (diffDays <= 15) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  return formatDate(date);
}
export function formatDistanceToNow(date: Date | string | null): string {
  if (!date) return "";
  const currentDate = new Date();
  const lastDate = new Date(date);
  const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffDays = Math.floor(diffMinutes / (60 * 24));

  // Check if it's today
  if (diffDays === 0) {
    if (diffMinutes === 0) {
      return "now";
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours === 0) {
      return `${diffMinutes} min`;
    }

    return `${diffHours} h`;
  }

  // Check if it's within the last 15 days
  if (diffDays <= 15) {
    return `${diffDays} d`;
  }

  return formatDate(lastDate);
}

export function getLastSegment(url?: string) {
  if (!url) return null; // Handle empty or undefined URLs
  const segments = url.split("/").filter((segment) => segment); // Split and remove empty segments
  if (segments.find((s) => s === "me")) return "me";
  return segments.length > 0 ? segments[segments.length - 1] : null; // Return the last segment
}

export const isCurrentPage = (pathname?: string, pattern?: string): boolean => {
  if (!pathname || !pattern) return false;
  const escapedPattern = pattern.replace(/[.+?^${}()|\\]/g, "\\$&");
  const regexPattern = escapedPattern
    .replace(/\/\*$/, "(\\/.*)?")
    .replace(/\/\\\*$/, "(\\/.*)?")
    .replace(/\[([^\]]+)\]/g, "[^\\/]+");
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(pathname);
};

export const matchRoute = (
  routeConfigs: RouteConfig[],
  pathname: string,
): RouteConfig | undefined => {
  return routeConfigs.find((route) => isCurrentPage(pathname, route.pattern));
};

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export function divideName(fullName?: string) {
  // Split the full name into parts based on spaces
  if (!fullName) return {};
  const nameParts = fullName.trim().split(" ");
  // The first name is everything before the last part
  const firstName = nameParts.slice(0, nameParts.length - 1).join(" ");
  // The last name is the last part of the name
  const lastName = nameParts[nameParts.length - 1];
  return { firstName, lastName };
}

export const hasDataChanged = <T>(originalData: T, currentData: T): boolean => {
  return JSON.stringify(originalData) !== JSON.stringify(currentData);
};

export const disableEnterKey = (event: React.KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
  }
};

export const formatEducationAndSpecialty = (job: JobData): string | null => {
  const education = educationOptions.find(
    (option) => option.id === job.educationLevel,
  );

  if (!education) {
    return null;
  }
  switch (education.id) {
    case EducationLevel.HIGH_SCHOOL:
      return `High School Diploma in ${job.jobSpeciality}`;
    case EducationLevel.TECH_INSTITUE:
      return `Technical Institute Diploma in ${job.jobSpeciality}`;
    case EducationLevel.BACHELORS:
      return `Bachelor's Degree in ${job.jobSpeciality}`;
    case EducationLevel.DIPLOMA:
      return `Diploma in ${job.jobSpeciality}`;
    case EducationLevel.MASTERS:
      return `Master's Degree in ${job.jobSpeciality}`;
    case EducationLevel.DOCTORATE:
      return `Doctorate in ${job.jobSpeciality}`;
    case EducationLevel.FELLOWSHIP:
      return `Fellowship in ${job.jobSpeciality}`;
    default:
      return null;
  }
};

export function convertEmptyStringsToNull<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === "string" && data.trim() === "") {
    return null as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => convertEmptyStringsToNull(item)) as T;
  }

  if (typeof data === "object") {
    const convertedEntries = Object.entries(data).map(([key, value]) => [
      key,
      convertEmptyStringsToNull(value),
    ]);

    const convertedObject = Object.fromEntries(convertedEntries);

    // Check if all values are null
    if (Object.values(convertedObject).every((value) => value === null)) {
      return null as T;
    }

    return convertedObject as T;
  }

  return data;
}

export const showToast = (
  dispatch: AppDispatch,
  message: string,
  options?: Partial<Omit<Toast, "id" | "message">>,
) => {
  dispatch(
    addToast({
      id: generateId(),
      message,
      ...options,
    }),
  );
};
