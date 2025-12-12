"use server";
import { TAGS } from "@/api";
import {
  API_GET_JOB_BY_ID,
  API_SEARCH_JOBS,
  API_GET_JOBS_BY_COMPANY_ID,
  API_FILTER_SEARCH_JOBS,
  API_GET_JOBS,
} from "@/api/employer";
import { JobData, Result } from "@/types";
import { JobSearchFilter } from "@/types/jobs";
import { toQueryString } from "@/util/general";

export const getJobsByCompanyId = async (
  companyId: string,
  page: number = 1,
  limit: number = 10,
): Promise<Result<PaginatedResponse<JobData>>> => {
  try {
    const response = await fetch(
      `${API_GET_JOBS_BY_COMPANY_ID}${companyId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        next: { tags: [TAGS.jobs] },
      },
    );
    if (response.ok) {
      const data: PaginatedResponse<JobData> = await response.json();
      return {
        success: true,
        message: "Jobs list fetched successfully",
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
export const getJobById = async (jobId: string): Promise<Result<JobData>> => {
  try {
    const response = await fetch(API_GET_JOB_BY_ID + jobId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      next: { tags: [TAGS.jobs] },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Job fetched successfully",
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

export const searchJobs = async (
  filters: JobSearchFilter = {},
): Promise<Result<PaginatedResponse<JobData>>> => {
  try {
    const queryParams = toQueryString(filters);
    const response = await fetch(API_SEARCH_JOBS + queryParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      next: { tags: [TAGS.jobs] },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Jobs list fetched successfully",
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
export const getAllJobs = async (
  filters: JobSearchFilter = {},
): Promise<Result<PaginatedResponse<JobData>>> => {
  try {
    const queryParams = toQueryString(filters);
    const response = await fetch(API_GET_JOBS + queryParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      next: { tags: [TAGS.jobs] },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Jobs list fetched successfully",
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
export const getJobFilters = async (): Promise<Result<JobsAggregations>> => {
  try {
    const response = await fetch(API_FILTER_SEARCH_JOBS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      next: { tags: [TAGS.jobs] },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Jobs list fetched successfully",
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
