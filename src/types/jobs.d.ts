import { Gender } from "@/constants/enums/gender.enum";

export interface SearchBreakdown {
  industry: Record<string, number>;
  speciality: Record<string, number>;
  category: Record<string, number>;
  careerLevel: Record<string, number>;
  employmentType: Record<string, number>;
  workPlace: Record<string, number>;
  gender: Record<string, number>;
  education: Record<string, number>;
  country: Record<string, number>;
  state: Record<string, number>;
  ageRange: Record<string, number>;
  salaryRange: Record<string, number>;
}

export interface JobSearchFilter {
  q?: string;
  industryId?: string[];
  specialityId?: string[];
  categoryId?: string[];
  careerLevelId?: string[];
  employmentTypeId?: string[];
  workPlace?: JobWorkPlace[];
  gender?: Gender[];
  educationLevel?: EducationLevel[];
  countryCode?: string[];
  stateCode?: string[];
  salaryFrom?: number | null;
  salaryTo?: number | null;
  ageFrom?: number | null;
  ageTo?: number | null;
  page?: number | null;
  limit?: number | null;
  // minExpYears?: number;
  // maxExpYears?: number;
}
export interface SeekerSearchFilter {
  q?: string;
  countryCode?: string[];
  stateCode?: string[];
  nationality?: string[];
  educationLevel?: EducationLevel[];
  experienceFrom?: number;
  experienceTo?: number;
  gender?: Gender[];
  ageFrom?: number;
  ageTo?: number;
  specialityIds?: string[];
  categoryIds?: string[];
  careerLevelIds?: string[];
  page?: number;
  limit?: number;
  // TODO: add those
  status?: "active" | "inactive";
}
export interface FolderSearchFilter {
  folderId?: string; // ID of the folder
  order?: "ASC" | "DESC"; // Sort order
  q?: string; // Search keyword
  countryCode?: string[]; // List of country codes
  stateCode?: string[]; // List of state codes
  nationality?: string[]; // List of nationalities
  educationLevel?: EducationLevel[]; // Education levels
  experienceFrom?: number; // Minimum experience (years)
  experienceTo?: number; // Maximum experience (years)
  gender?: Gender[]; // Gender filter
  ageFrom?: number; // Minimum age
  ageTo?: number; // Maximum age
  specialityIds?: string[]; // Speciality IDs
  categoryIds?: string[]; // Category IDs
  careerLevelIds?: string[]; // Career level IDs
  status?: string; // Seeker status filter
  page?: number; // Page number
  limit?: number; // Number of items per page
}
