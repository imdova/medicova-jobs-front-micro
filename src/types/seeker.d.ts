import { ApplicationStatus } from "@/constants/enums/application-status.enum";
import { MaritalStatus } from "@/constants/enums/marital-status.enum";
import { CareerPreference } from ".";

export interface ApplicationsFilter {
  page?: number;
  limit?: number;
  jobId?: string | null;
  seekerId?: string | null;
  companyId?: string | null;
  startDate?: string | null;
  status?: ApplicationStatus;
}
export type ProfileTabs =
  | "personal-info"
  | "professional"
  | "career-preference";

export type LocationItem = {
  name: string;
  code: string;
};
export type NotificationSettings = {
  reciveApplications: boolean;
  reciveJobs: boolean;
  reciveRecommendations: boolean;
};
export interface SocialMediaLinks {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
  pinterest?: string;
  reddit?: string;
  discord?: string;
  telegram?: string;
  whatsapp?: string;
}

export type UserProfile = {
  id: string;
  userName: string;
  phone: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string;
  birthDate: string | null;
  active: boolean;
  about: string | null;
  title: string | null;
  languages: LanguageProficiency[] | null;
  resume: string | null;
  socialLinks: SocialMediaLinks | null;
  whatsapp: string | null;
  nationality: string | null;
  maritalStatus: MaritalStatus | null;
  hasDrivingLicence: boolean | null;
  country: LocationItem | null;
  state: LocationItem | null;
  city: string | null;
  isPublic: boolean;
  categoryId: string | null;
  category: string | null;
  specialityId: string | null;
  speciality: string | null;
  careerLevelId: string | null;
  careerLevel: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  //TODO: total_years_experience: number | null;
  _version: number;

  gender: Gender | null;
  phoneOtp: string | null;
  unverifiedPhone: string | null;
  lastEducation: string | null;
  lastExperience: string | null;


  // from the slice
  completeness: number | null;
  careerPreference: CareerPreference | null,

};

enum LanguageName {
  Arabic = "Arabic",
  English = "English",
  French = "French",
  German = "German",
}

enum LanguageProficiencyLevel {
  Native = "Native",
  Fluent = "Fluent",
  Intermediate = "Intermediate",
  Beginner = "Beginner",
}

export type LanguageProficiency = {
  name: LanguageName;
  proficiency: LanguageProficiencyLevel;
};

export type JobApplicationData = {
  id: string;
  created_at: string;
  seekerId: string;
  status: string;
  answers: Record<string, string> | null;
  job: {
    id: string;
  };
};

export type TapType = "all" | "locked" | "unlocked" | "shortListed";

// Represents the data structure for job applicants. This type is used to store and display
// information about individuals who have applied for a specific job posting.export
export interface ApplicationsType {
  location: any;
  id: string;
  seekerId: string;
  status: ApplicationStatus;
  answers: Record<string, string> | null;
  job: {
    id: string;
    title: string;
    jobSpeciality?: string | null; // add this please
    jobCategory?: string | null; // add this please
    jobCareerLevel?: string | null; // add this please
    jobEmploymentType?: string | null; // add this please
    company: {
      id: string;
      name: string; // add this please
      username: string; // add this please
      avatar: string; // add this please
    };
  };
  applicant: {
    [x: string]: any;
    id: string;
    avatar: string;
    userName: string;
    firstName: string;
    lastName: string;
    title: string | null;
    whatsApp: string | null;
    phone?: string | null;
    email?: string | null;
    country: LocationItem | null;
    state: LocationItem | null;
    city: string | null;
    category: string | null;
    specialty: string | null;
    careerLevel: string | null;
    isLocked: boolean;
    yearsOfExperience: {
      totalYears: string;
    };
    lastEducation: EducationData | null;
    lastExperience: ExperienceData | null;
    folders: {
      folderId: string;
      folderName: string;
      isFavorite: boolean;
    }[];
  };
  created_at: string;
  updated_at: string;
  _version: number;
}

// Represents the data structure for potential candidates who can be invited to apply for a job.
// This type is used to store and display information about individuals who match the job criteria
// but have not yet applied.
export type CandidateType = {
  id: string; // id for the candidate (job seeker).
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  _version: number;
  userName: string;
  about: string | null;
  title: string | null;
  languages: string[] | null;
  resume: string | null;
  socialLinks: Record<string, string> | null;
  whatsapp: string | null;
  nationality: string | null;
  maritalStatus: MaritalStatus | null;
  hasDrivingLicence: boolean | null;
  country: LocationItem | null;
  state: LocationItem | null;
  city: string | null;
  isPublic: boolean | null;
  categoryId: string | null;
  category: string | null;
  specialityId: string | null;
  speciality: string | null;
  careerLevelId: string | null;
  careerLevel: string | null;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string | null;
  avatar: string | null;
  type: string;
  active: boolean;
  isLocked: boolean;
  isFavorite: boolean;
};

export type ExperienceData = {
  id: string;
  name: string;
  title: string;
  country: LocationItem;
  state: LocationItem;
  city: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
};

export type EducationData = {
  id: string;
  inistitute: string;
  degree: string;
  program: string;
  country: LocationItem;
  startYear: number;
  endYear: number;
  grade: string;
};
export type CertificationData = {
  id: string;
  title: string;
  provider: string;
  issueDate: string;
  description: string;
};

export type ActivityData = {
  id: string;
  title: string;
  provider: string;
  date: string;
};

export type SkillData = {
  id: string;
  name: string;
};
