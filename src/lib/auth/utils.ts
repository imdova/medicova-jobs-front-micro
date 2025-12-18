import {
  forgetPassword,
  gmailLogin,
  refreshToken,
  serverSignIn,
  verifyUser,
} from "../access";
import { API_RESET_PASSWORD } from "@/api/users";
import { getCookies, setCookies } from "../cookies";
import { RequestInternal, User, Session } from "next-auth";
import { divideName } from "@/util";
import { JWT } from "next-auth/jwt";
import { RoleState } from "@/types/next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "./config";

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

/**
 * Safely gets the server session, handling JWT decryption errors gracefully.
 * Returns null if the session cannot be decrypted (e.g., due to secret change).
 */
export async function getSafeServerSession(): Promise<Session | null> {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error: any) {
    // Handle JWT decryption errors (e.g., when secret changes)
    if (
      error?.name === "JWEDecryptionFailed" ||
      error?.message?.includes("decryption operation failed")
    ) {
      // Silently return null - the session is invalid and will be treated as no session
      // This happens when the NEXTAUTH_SECRET changes and old sessions can't be decrypted
      return null;
    }
    // Log other errors but still return null to prevent crashes
    if (process.env.NODE_ENV === "development") {
      console.warn("[getSafeServerSession] Error getting session:", error?.message || error);
    }
    return null;
  }
}
