"use server";
import { TAGS } from "@/api";
import {
  API_CREATE_JOB_APPLICATION,
  API_GET_JOB_APPLICATION_STATUS_COUNT_FOR_SEEKER,
} from "@/api/employer";
import {
  API_FILTER_SEARCH_SEEKERS,
  API_GET_SEEKERS,
  API_SEARCH_SEEKERS,
  FOLDER_FILTER,
} from "@/api/seeker";
import { ApplicationStatus } from "@/constants/enums/application-status.enum";
import { Doctor, Result } from "@/types";
import { JobSearchFilter, SeekerSearchFilter } from "@/types/jobs";
import { ApplicationsFilter, ApplicationsType, CandidateType, JobApplicationData, UserProfile } from "@/types/seeker";
import { errorResult, toQueryString } from "@/util/general";

export const applyForJob = async (
  applicationData: Partial<JobApplicationData>,
): Promise<Result> => {
  try {
    const response = await fetch("API_CREATE_JOB_APPLICATION", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(applicationData),
    });

    if (response.ok) {
      const data = await response.json();
      data.jobId = data.job.id;
      data.seekerId = data.seeker.id;
      return {
        success: true,
        message: "Job application created successfully",
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

export const getApplications = async ({
  page = 1,
  limit = 10,
  jobId,
  seekerId,
  companyId,
  startDate,
  status,
}: ApplicationsFilter = {}): Promise<
  Result<PaginatedResponse<ApplicationsType>>
> => {
  try {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (jobId) queryParams.append("jobId", jobId);
    if (seekerId) queryParams.append("seekerId", seekerId);
    if (companyId) queryParams.append("companyId", companyId);
    if (startDate) queryParams.append("from", startDate);
    if (status) queryParams.append("status", status);
    const response = await fetch(
      `${API_CREATE_JOB_APPLICATION}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
        next: { tags: [TAGS.applicants] },
      },
    );
    if (!response.ok) return errorResult("fetching Applicants data ");
    const data = await response.json();
    return {
      success: true,
      message: "Job applications fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getApplicationStatusCount = async (
  seekerId: string,
): Promise<Result<Record<ApplicationStatus, number>>> => {
  try {
    const response = await fetch(
      `${API_GET_JOB_APPLICATION_STATUS_COUNT_FOR_SEEKER + seekerId}/status-count`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
      },
    );
    if (!response.ok) return errorResult("fetching application status count");
    const data = await response.json();
    return {
      success: true,
      message: "Application status count fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getSeekers = async ({
  page = 1,
  limit = 10,
}: ApplicationsFilter = {}): Promise<
  Result<{ data: CandidateType[]; total: number }>
> => {
  try {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    const response = await fetch(
      `${API_GET_SEEKERS}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
      },
    );
    if (response.ok) {
      const data = await response.json();

      return {
        success: true,
        message: "Seekers fetched successfully",
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
export const searchSeekers = async (
  filters: SeekerSearchFilter = {},
): Promise<Result<PaginatedResponse<UserProfile>>> => {
  try {
    const queryParams = toQueryString(filters);
    const response = await fetch(API_SEARCH_SEEKERS + queryParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Seekers fetched successfully",
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

export const getSeekersFilter = async (): Promise<Result<Aggregations>> => {
  try {
    const response = await fetch(API_FILTER_SEARCH_SEEKERS, {
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
        message: "Seekers fetched successfully",
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

export const getFolderFilter = async (
  id: string,
): Promise<Result<FolderAggregations>> => {
  try {
    const response = await fetch(FOLDER_FILTER + id, {
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
        message: "Seekers fetched successfully",
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
