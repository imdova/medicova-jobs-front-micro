"use server";

import {
  API_GET_SEEKER_ACTIVITIES,
  API_GET_SEEKER_BY_USERNAME,
  API_GET_SEEKER_COURSES,
  API_GET_SEEKER_EDUCATION,
  API_GET_SEEKER_EXPERIENCE,
  API_GET_SEEKER_SKILLS,
} from "@/api/seeker";
import { API_GET_USERS } from "@/api/users";
import { Result } from "@/types";
import {
  ActivityData,
  CertificationData,
  EducationData,
  ExperienceData,
  SkillData,
  UserProfile,
} from "@/types/seeker";
import { errorResult } from "@/util/general";

export const getUser = async (
  username: string,
): Promise<Result<UserProfile>> => {
  try {
    const response = await fetch(API_GET_SEEKER_BY_USERNAME + username, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      // next: { tags: [TAGS.profile] },
    });
    if (!response.ok) return errorResult("fetching company data by user name");
    const data: UserProfile = await response.json();
    return {
      success: true,
      message: "User fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getUsersWithIds = async (
  ids: string[],
): Promise<Result<UserProfile[]>> => {
  try {
    const response = await fetch(`${API_GET_USERS}?ids=${ids.join(",")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      // next: { tags: [TAGS.profile] },
    });

    if (response.ok) {
      const data: UserProfile[] = await response.json();
      return {
        success: true,
        message: "Users fetched successfully",
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

export const getExperience = async (
  id: string,
): Promise<Result<ExperienceData[]>> => {
  try {
    const response = await fetch(API_GET_SEEKER_EXPERIENCE + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      // next: { tags: [TAGS.experience] },
    });
    if (!response.ok) return errorResult("error fetching experience");
    const data: ExperienceData[] = await response.json();
    return {
      success: true,
      message: "Experience fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getEducations = async (
  id: string,
): Promise<Result<EducationData[]>> => {
  try {
    const response = await fetch(API_GET_SEEKER_EDUCATION + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      // next: { tags: [TAGS.education] },
    });
    if (!response.ok) return errorResult("error fetching education");
    const data: EducationData[] = await response.json();
    return {
      success: true,
      message: "Education fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getCourses = async (
  id: string,
): Promise<Result<CertificationData[]>> => {
  try {
    const response = await fetch(API_GET_SEEKER_COURSES + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      // next: { tags: [TAGS.courses] },
    });
    if (!response.ok) return errorResult("error fetching courses");
    const data = await response.json();
    return {
      success: true,
      message: "Courses fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getSkills = async (id: string): Promise<Result<SkillData[]>> => {
  try {
    const response = await fetch(API_GET_SEEKER_SKILLS + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      // next: { tags: [TAGS.skills] },
    });
    if (!response.ok) return errorResult("error fetching skills");
    const data = await response.json();
    return {
      success: true,
      message: "Skills fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
export const getActivity = async (
  id: string,
): Promise<Result<ActivityData[]>> => {
  try {
    const response = await fetch(API_GET_SEEKER_ACTIVITIES + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      // next: { tags: [TAGS.activity] },
    });
    if (!response.ok) return errorResult("error fetching activity");
    const data = await response.json();
    return {
      success: true,
      message: "Activity fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
