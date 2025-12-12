export type TimeUnit = "daily" | "weekly" | "monthly" | "yearly";
export interface ChartData {
  dates: string[];
  counts: number[];
  profileCompletions: number[];
  resumeUploads: number[];
}

export interface FilterResults {
  userDataPerTime: ChartData;
  userDataPerCountry: ChartData;
  userDataPerCategory: ChartData;
}

export interface Filters {
  type?: "seeker" | "employer";
  countries?: string[];
  categories?: string[];
  ageRange?: [number, number];
}
