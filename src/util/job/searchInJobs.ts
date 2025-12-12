import { Country, Industry, JobData, JobsTabs } from "@/types";
import { SearchBreakdown } from "@/types/jobs";
import { enumToOptions, getOptionLabel } from "../general";
import { EducationLevel } from "@/constants/enums/education-level.enum";
import { Gender } from "@/constants/enums/gender.enum";

export function searchJobsByQuery(
  jobs: JobData[],
  query: string = "",
): JobData[] {
  return jobs.filter((job) => {
    // Query match: Title, Description, Keywords
    return query
      ? job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.description?.toLowerCase().includes(query.toLowerCase())
      : true;
  });
}

const sectionsProps: Partial<
  Record<keyof SearchBreakdown, Omit<FilterType, "items">>
> = {
  industry: {
    name: "Industry",
    sectionKey: "ind",
    multiple: true,
    resetSections: ["ctg"],
  },
  speciality: { name: "Main Specialty", multiple: true, sectionKey: "sp" },
  category: {
    name: "Categories",
    multiple: true,
    sectionKey: "ctg",
    maxItems: 5,
  },
  careerLevel: { name: "Job Level", multiple: true, sectionKey: "clv" },
  employmentType: {
    name: "Employment Type",
    multiple: true,
    sectionKey: "emp",
  },
  workPlace: { name: "Work Place", multiple: true, sectionKey: "wrk" },
  gender: { name: "Gender", multiple: true, sectionKey: "gen" },
  education: { name: "Education Level", multiple: true, sectionKey: "edu" },
  country: {
    name: "Country",
    multiple: true,
    searchable: true,
    sectionKey: "country",
    maxItems: 5,
  },
  state: {
    name: "State",
    multiple: true,
    searchable: true,
    sectionKey: "state",
    maxItems: 5,
  },
  ageRange: { name: "Age Range", sectionKey: "age" },
  salaryRange: { name: "Salary Range", sectionKey: "sal" },
};

export function breakdownToFilters(
  breakdown: SearchBreakdown,
  {
    industries,
    categories,
    specialities,
    countries,
  }: {
    industries?: Industry[] | null;
    categories?: Industry[] | null;
    specialities?: Industry[] | null;
    countries?: Country[] | null;
  },
): FilterType[] {
  const filters: FilterType[] = [];

  for (const key in breakdown) {
    const section = key as keyof SearchBreakdown;
    const sectionData = breakdown[section];
    if (!sectionData || Object.keys(sectionData).length === 0) continue;

    const sectionProps =
      sectionsProps[section] || ({} as Omit<FilterType, "items">);

    const items: FilterItem[] = Object.entries(sectionData).map(
      ([value, count]) => {
        let label: React.ReactNode = value;

        // Use proper label mappings
        if (section === "category")
          label = categories?.find((x) => x.id === value)?.name || value;
        if (section === "speciality")
          label = specialities?.find((x) => x.id === value)?.name || value;
        if (section === "industry")
          label = industries?.find((x) => x.id === value)?.name || value;
        if (section === "gender")
          label = getOptionLabel(enumToOptions(Gender), value) || value;
        if (section === "education")
          label = getOptionLabel(enumToOptions(EducationLevel), value) || value;
        if (section === "country")
          label = countries?.find((x) => x.isoCode === value)?.name || value;

        return {
          label,
          value,
          count,
        };
      },
    );
    filters.push({
      ...sectionProps,
      items,
    });
  }

  return filters;
}

export const filteredJobs = (jobs: JobData[], activeTab: JobsTabs) => {
  switch (activeTab) {
    case "all": // All
      return jobs;
    case "active": // Active
      return jobs.filter((job) => job.active && !job.draft);
    case "closed": // Closed
      return jobs.filter((job) => !job.active && !job.draft);
    case "expired": // Expired (based on validity date)
      return jobs.filter(
        (job) => job.validTo && new Date(job.validTo) < new Date(),
      );
    case "draft": // Draft
      return jobs.filter((job) => job.draft);
    default:
      return [];
  }
};
