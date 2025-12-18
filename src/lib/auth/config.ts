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
        ? "https://medicovajobs.cloud" 
        : "http://localhost:3000");
  process.env.NEXTAUTH_URL = url;
}

// Detect if we're using HTTPS or HTTP
// Priority:
// 1. Explicit environment variable NEXTAUTH_USE_SECURE_COOKIES (if set)
// 2. Check if NEXTAUTH_URL starts with https://
// 3. Default to false (HTTP) for safety if uncertain
const nextAuthUrl = process.env.NEXTAUTH_URL || '';
let isHttps = false;

if (process.env.NEXTAUTH_USE_SECURE_COOKIES !== undefined) {
  // Explicit override via environment variable
  isHttps = process.env.NEXTAUTH_USE_SECURE_COOKIES === 'true';
} else {
  // Auto-detect from NEXTAUTH_URL
  isHttps = nextAuthUrl.startsWith('https://');
}

// Log the detected protocol for debugging (in both dev and production for troubleshooting)
console.log('[NextAuth] Cookie configuration:', {
  NEXTAUTH_URL: nextAuthUrl,
  isHttps,
  useSecureCookies: isHttps,
  environment: process.env.NODE_ENV,
});

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
  cookies: {
    // Configure cookies based on protocol (HTTPS vs HTTP)
    // On HTTPS: Use secure prefixes (__Secure- and __Host-) for enhanced security
    // On HTTP: Use standard names without secure prefixes
    sessionToken: {
      name: isHttps ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isHttps, // Required for __Secure- prefix on HTTPS
      },
    },
    callbackUrl: {
      name: isHttps ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isHttps, // Required for __Secure- prefix on HTTPS
      },
    },
    csrfToken: {
      // __Host- prefix requires: Secure flag, Path="/", no Domain attribute
      name: isHttps ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/", // Required for __Host- prefix
        secure: isHttps, // Required for __Host- prefix on HTTPS
        // Note: Domain is not set (required for __Host- prefix)
      },
    },
  },
  useSecureCookies: isHttps, // Only use secure cookies on HTTPS
};
