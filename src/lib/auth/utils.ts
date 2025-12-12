import {
  forgetPassword,
  gmailLogin,
  refreshToken,
  serverSignIn,
  verifyUser,
} from "../access";
import { API_RESET_PASSWORD } from "@/api/users";
import { getCookies, setCookies } from "../cookies";
import { RequestInternal, User } from "next-auth";
import { divideName } from "@/util";
import { JWT } from "next-auth/jwt";
import { RoleState } from "@/types/next-auth";

export async function authenticateUser(credentials: any) {
  if (!credentials?.email || !credentials?.password) return null;
  try {
    const response = await serverSignIn(credentials);
    return response.success && response.data ? response.data : null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function changePasswordWithOTP(credentials: any) {
  if (!credentials?.email || !credentials?.otp) return null;
  try {
    const response = await forgetPassword({
      email: credentials.email,
      newPassword: credentials.password,
      otp: credentials.otp,
    });
    return response.success ? response.data : null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function authenticateToken(
  credentials: Record<"email" | "password" | "token", string> | undefined,
  req: Pick<RequestInternal, "body" | "query" | "headers" | "method">,
): Promise<User | null> {
  const { token, email, password } =
    credentials || (req.body as Record<string, string>);
  const response = await verifyUser({
    token,
    email,
    password,
  });
  if (!response.success || !response.data) {
    return null;
  }
  return response.data;
}

export async function resetPassword(credentials: any) {
  const { token, newPassword } = credentials;
  const response = await fetch(API_RESET_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: token,
      newPassword: newPassword,
    }),
  });
  if (!response.ok) {
    return null;
  }
  const session = await response.json();
  return session;
}

export async function handleSocialLogin(
  user: any,
  account: any,
): Promise<boolean> {
  try {
    const userType = (await getCookies("userType")) as RoleState;
    const { firstName, lastName } = divideName(user?.name);
    const response = await gmailLogin({
      email: user.email,
      firstName: firstName || user.name,
      lastName: lastName || user.name,
      picture: user.image,
      accessToken: account?.access_token,
      userType: userType || undefined,
    });

    if (!response.success) {
      setCookies("user-error", JSON.stringify(response.message));
      return false;
    }
    const userData = JSON.stringify(response.data);
    setCookies("user", userData);
    return true;
  } catch (error) {
    console.error("Social login error:", error);
    return false;
  }
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.id) return token;

    const response = await refreshToken(token.id as string);
    if (response.success && response.data) {
      const user = response.data;
      return {
        ...token,
        accessToken: user.newToken,
        accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
      };
    }
    return token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return token;
  }
}
