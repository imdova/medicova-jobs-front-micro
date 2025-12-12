"use server";
import { TAGS } from "@/api";
import {
  API_GET_CATEGORIES_BY_INDUSTRY,
  API_GET_COMPANY_SECTORS,
  API_GET_COMPANY_TYPES_BY_SECTOR,
  API_GET_EMPLOYMENT_TYPES,
  API_GET_INDUSTRIES,
} from "@/api/admin";
import {
  API_GET_COMPANIES,
  API_GET_COMPANY_BY_ID,
  API_GET_COMPANY_BY_USER_NAME,
  API_GET_JOBS,
  API_GET_UNLOCKED_SEEKERS,
  API_SEARCH_COMPANIES,
} from "@/api/employer";
import {
  API_GET_FOLDER_BY_ID,
  API_GET_SEEKERS,
  API_GET_FOLDER_SEEKERS,
  API_GET_FOLDERS,
  API_SEARCH_FOLDER_SEEKERS,
} from "@/api/seeker";
import {
  Company,
  EmploymentType,
  Industry,
  Job,
  JobCategory,
  Result,
  SearchCompanyFilter,
  Sector,
} from "@/types";
import { FolderSearchFilter } from "@/types/jobs";
import { CandidateType, UserProfile } from "@/types/seeker";
import { errorResult, toQueryString } from "@/util/general";
import { User } from "next-auth";

export const getCompanyByUserName = async (
  userName: string,
): Promise<Result<Company>> => {
  try {
    const response = await fetch(API_GET_COMPANY_BY_USER_NAME + userName, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      next: { tags: [TAGS.company] },
    });
    if (!response.ok) return errorResult("fetching company data by user name");
    return {
      success: true,
      message: "Company fetched successfully",
      data: await response.json(),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getCompanies = async ({
  page = 1,
  limit = 10,
  query = "",
  counter = "",
  companyType = "",
}: {
  page: number;
  limit: number;
  query?: string;
  counter?: string;
  companyType?: string;
}): Promise<Result<PaginatedResponse<Company>>> => {
  try {
    const url = new URL(API_GET_COMPANIES);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (query) url.searchParams.append("query", query);
    if (counter) url.searchParams.append("counter", counter);
    if (companyType) url.searchParams.append("companyType", companyType);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      next: { tags: [TAGS.companies] },
    });
    if (!response.ok) return errorResult("fetching companies data");
    const data = await response.json();
    return {
      success: true,
      message: "Companies fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const searchCompanies = async (
  filters: SearchCompanyFilter = {},
): Promise<Result<PaginatedResponse<Company>>> => {
  try {
    const queryParams = toQueryString(filters);
    const response = await fetch(API_SEARCH_COMPANIES + queryParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      next: { tags: [TAGS.companies] },
    });
    if (!response.ok) return errorResult("fetching companies data");
    const data = await response.json();
    return {
      success: true,
      message: "Companies fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};

export const getCompany = async (id?: string) => {
  if (!id) return null;
  const response = await fetch(API_GET_COMPANY_BY_ID + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });
  if (response.ok) {
    const data: Company = await response.json();
    return data;
  }
  return null;
};

export const getSectorList = async (): Promise<Result<Sector[]>> => {
  try {
    const response = await fetch(API_GET_COMPANY_SECTORS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Sector list fetched successfully",
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};

export const getTypeList = async (
  sectorId: string,
): Promise<Result<Sector[]>> => {
  try {
    const response = await fetch(API_GET_COMPANY_TYPES_BY_SECTOR + sectorId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Type list fetched successfully",
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};

export const getIndustries = async (
  page: number = 1,
  limit: number = 10,
): Promise<Result<Industry[]>> => {
  try {
    const response = await fetch(
      `${API_GET_INDUSTRIES}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Industries list fetched successfully",
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getEmploymentTypes = async (
  page: number = 1,
  limit: number = 10,
): Promise<Result<EmploymentType[]>> => {
  try {
    const response = await fetch(
      `${API_GET_EMPLOYMENT_TYPES}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );
    if (response.ok) {
      const data: { total: number; data: EmploymentType[] } =
        await response.json();
      return {
        success: true,
        message: "Employment types list fetched successfully",
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getCategoryFromIndustryId = async (
  industryId: string,
): Promise<
  Result<{
    data: JobCategory[];
    total: number;
  }>
> => {
  try {
    const response = await fetch(API_GET_CATEGORIES_BY_INDUSTRY + industryId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    if (response.ok) {
      const data: { total: number; data: JobCategory[] } =
        await response.json();
      return {
        success: true,
        message: "Category list fetched successfully",
        data: data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getSpecialtyFromCategoryId = async (
  categoryId: string,
): Promise<
  Result<{
    data: JobCategory[];
    total: number;
  }>
> => {
  try {
    const response = await fetch(`${API_GET_JOBS}?categoryIds=${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    if (response.ok) {
      const data: { total: number; data: JobCategory[] } =
        await response.json();
      return {
        success: true,
        message: "Speciality list fetched successfully",
        data: data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getPaginatedSeekers = async (
  page: number = 1,
  limit: number = 10,
): Promise<Result<PaginatedResponse<User>>> => {
  try {
    const response = await fetch(
      `${API_GET_SEEKERS}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Seekers list fetched successfully",
        data: data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getPaginatedFolders = async (
  companyId: string,
): Promise<Result<PaginatedResponse<Folder>>> => {
  try {
    const response = await fetch(
      API_GET_FOLDERS + companyId + `&page=1&limit=20`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        next: { tags: [TAGS.folders] },
      },
    );
    if (!response.ok) return errorResult("fetching Folders data by user name");
    return {
      success: true,
      message: "Folders fetched successfully",
      data: await response.json(),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getFolderById = async (
  folderId: string,
): Promise<Result<Folder>> => {
  try {
    const response = await fetch(API_GET_FOLDER_BY_ID + folderId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      next: { tags: [TAGS.folders] },
    });
    if (!response.ok) return errorResult("fetching folder data by id");
    return {
      success: true,
      message: "Folder fetched successfully",
      data: await response.json(),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getPaginatedCandidatesByFolderId = async (
  filters: FolderSearchFilter = {},
): Promise<Result<PaginatedResponse<CandidateType>>> => {
  try {
    const queryParams = toQueryString(filters);
    console.log(
      "🚀 ~ API_SEARCH_FOLDER_SEEKERS + queryParams:",
      API_SEARCH_FOLDER_SEEKERS + queryParams,
    );
    const response = await fetch(API_SEARCH_FOLDER_SEEKERS + queryParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      next: { tags: [TAGS.folders] },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Seekers list fetched successfully",
        data: data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};

/**
 * Checks if the profile is locked for the current user.
 * @param viewer - The user who is viewing the profile (session user)
 * @param profileOwner - The profile's owner user object
 * @returns boolean - true if locked, false if unlocked
 */
export async function checkLockedStatus(
  viewer: User | null,
  profile: UserProfile,
): Promise<boolean> {
  // If viewing own profile → always unlocked
  const isMe = viewer?.id === profile.id;
  if (isMe) return false;

  // If no logged-in viewer → locked
  if (!viewer) return true;

  // If viewer is an employer and has unlocked the owner's info
  if (viewer?.companyId && profile.id) {
    const { data } = await checkIsUnlocked(profile.id, viewer.companyId);
    return !data?.isUnlocked; // true means locked
  }

  // Default: locked
  return true;
}

export const checkIsUnlocked = async (
  seekerId: string,
  companyId: string,
): Promise<Result<{ isUnlocked: boolean }>> => {
  try {
    const response = await fetch(
      `${API_GET_UNLOCKED_SEEKERS}?id=${companyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );
    if (!response.ok) return errorResult("error checking is unlocked");
    const data: PaginatedResponse<{ seekerId: string }> = await response.json();
    const isUnlocked = data.data.find(
      (item: any) => item.seekerId === seekerId,
    );
    return {
      success: true,
      message: "Seekers list fetched successfully",
      data: { isUnlocked: !!isUnlocked },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getUnlockedSeeker = async (
  companyId: string,
): Promise<Result<PaginatedResponse<{ seekerId: string }>>> => {
  try {
    const response = await fetch(
      `${API_GET_UNLOCKED_SEEKERS}?id=${companyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );
    if (!response.ok) return errorResult("error checking is unlocked");
    const data = await response.json();
    return {
      success: true,
      message: "Seekers list fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
