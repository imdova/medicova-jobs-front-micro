"use server";

import {
  API_FORGET_PASSWORD,
  API_GET_ME,
  API_GET_ROLE_BY_ID,
  API_GMAIL_LOGIN,
  API_LOGIN,
  API_REFRESH_ACCESS_TOKEN,
  API_SEND_OTP,
  API_VALIDATE_OTP,
  API_VERIFY_USER,
} from "@/api/users";
import { Result } from "@/types";
import { RoleState, UserResponse } from "@/types/next-auth";
import { errorResult } from "@/util/general";
import {
  getAdminProfile,
  getEmployerProfile,
  getSeekerProfile,
} from "@/util/user";
import { User } from "next-auth";
import { getCompany } from "../actions/employer.actions";

export const sendOTP = async (email: string): Promise<Result> => {
  try {
    const response = await fetch(API_SEND_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      return {
        success: true,
        message: "OTP sent successfully",
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

export const validateOTP = async ({
  otp,
  email,
}: {
  otp: string;
  email: string;
}): Promise<Result> => {
  try {
    const response = await fetch(API_VALIDATE_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (response.ok) {
      return {
        success: true,
        message: "OTP validated successfully",
        data: await response.json(),
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

export const getUserFromResponse = async (
  userResponse: UserResponse,
): Promise<User> => {
  const employer = getEmployerProfile(userResponse);
  const seeker = getSeekerProfile(userResponse);
  const admin = getAdminProfile(userResponse);
  const company = await getCompany(employer?.companyId);
  const user: User = {
    id: userResponse.profile.id,
    email: userResponse.profile.email,
    firstName: userResponse.profile.firstName,
    lastName: userResponse.profile.lastName,
    userName: seeker?.userName || null,
    type: userResponse.type,
    category: employer?.type || admin?.type || null,
    image: userResponse.profile.avatar || null,
    accessToken: userResponse.accessToken,
    companyId: employer?.companyId,
    hasCompany: Boolean(company?.name),
    permissions: userResponse.permissions,
  };
  return user;
};

export async function verifyUser({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token: string;
}): Promise<Result<User>> {
  const response = await fetch(API_VERIFY_USER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      token: token,
      email: email,
      password: password,
    }),
  });
  if (!response.ok) return errorResult("Verify User");

  const userResponse: UserResponse = await response.json();
  const user = await getUserFromResponse(userResponse);
  return {
    success: true,
    message: "Verify User successfully",
    data: user,
  };
}

export const serverSignIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Result<User>> => {
  try {
    const response = await fetch(API_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) return errorResult("serverSignIn");
    const userResponse: UserResponse = await response.json();
    const user = await getUserFromResponse(userResponse);
    return {
      success: true,
      message: "login successfully",
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};

export type GoogleRegisterData = {
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  userType: RoleState;
  email: string;
};

export const gmailLogin = async (
  data: GoogleRegisterData,
): Promise<Result<User>> => {
  try {
    const response = await fetch(API_GMAIL_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) return errorResult("register");
    const userResponse: UserResponse = await response.json();
    const user = await getUserFromResponse(userResponse);
    return {
      success: true,
      message: "Registered successfully",
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};

export type GoogleLoginData = {
  accessToken: string;
  email: string;
};

export const forgetPassword = async (data: {
  email: string;
  newPassword: string;
  otp: string | null;
}): Promise<Result> => {
  try {
    const response = await fetch(API_FORGET_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return {
        success: true,
        message: "Password changed successfully",
        data: await response.json(),
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

export const getRole = async (roleId: string): Promise<Result> => {
  try {
    const response = await fetch(API_GET_ROLE_BY_ID + roleId, {
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
        message: "Role fetched successfully",
        data: data.forUserType,
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

export const getMe = async (): Promise<Result> => {
  try {
    const response = await fetch(API_GET_ME, {
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
        message: "User fetched successfully",
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
export const refreshToken = async (id: string): Promise<Result> => {
  try {
    const response = await fetch(API_REFRESH_ACCESS_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "User fetched successfully",
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
