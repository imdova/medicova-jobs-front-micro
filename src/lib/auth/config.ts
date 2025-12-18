import { AuthOptions } from "next-auth";
import { providers } from "./providers";
import { callbacks } from "./callbacks";

// Ensure NEXTAUTH_URL is set (required for OAuth providers)
// This is a fallback for development - should be set in .env file
if (!process.env.NEXTAUTH_URL) {
  const url = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SERVER_BASE || 
      (process.env.NODE_ENV === 'production' 
        ? "https://jobacademy.net" 
        : "http://localhost:3000");
  process.env.NEXTAUTH_URL = url;
}

// Validate NEXTAUTH_SECRET
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set in environment variables");
}

if (process.env.NEXTAUTH_SECRET.length < 32) {
  console.warn(
    "[next-auth] Warning: NEXTAUTH_SECRET should be at least 32 characters long for security"
  );
}

export const authOptions: AuthOptions = {
  providers,
  callbacks,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
