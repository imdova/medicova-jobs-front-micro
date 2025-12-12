import { User } from "next-auth";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Permission_Keys } from "./constants/enums/Permission_Keys.enum";
import { RoleState } from "./types/next-auth";

export default withAuth(function middleware(req) {
  const user = req.nextauth.token as unknown as User;
  const path = req.nextUrl.pathname;

  // Redirect to login page if there is no accessible user
  if (!user) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  let userType = user.type as RoleState | "unEmployee";
  if (path == "/me") {
    if (userType === "seeker") {
      return NextResponse.redirect(new URL(`/me/${user?.userName}`, req.url));
    } else if (userType === "unverified") {
      return NextResponse.redirect(new URL(`/auth/verify`, req.url));
    } else if (userType === "employer") {
      if (user?.hasCompany) {
        return NextResponse.redirect(new URL("/employer/dashboard", req.url));
      } else {
        return NextResponse.redirect(
          new URL("/employer/company-info", req.url),
        );
      }
    } else if (userType === "admin") {
      return NextResponse.redirect(new URL(`/admin/dashboard`, req.url));
    }
  }

  const hasAccess = hasAccessToURL(user, path);
  if (!hasAccess) {
    return NextResponse.rewrite(new URL("/403", req.url));
  }
  // Allow
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/job-seeker/:path*",
    "/employer/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/me",
  ],
};

const roleAccessMap: Record<string, string[]> = {
  employer: ["/employer/*"],
  unEmployee: ["/employer/company-info"],
  seeker: ["/job-seeker/*"],
  admin: ["/*"],
};

const permissionsAccessMap: {
  pattern: string;
  permissions: Permission_Keys[];
}[] = [
  {
    pattern: "/employer/subscription-plans",
    permissions: [Permission_Keys.Employer_ManagePayments],
  },
  {
    pattern: "/employer/job/*",
    permissions: [Permission_Keys.Employer_ManageJobs],
  },
  {
    pattern: "/employer/search/saved-search/[slug]",
    permissions: [Permission_Keys.Employer_ManageJobs],
  },
  {
    pattern: "/employer/setting/company-info",
    permissions: [Permission_Keys.Employer_ManageCompanySettings],
  },
  {
    pattern: "/employer/setting/users",
    permissions: [Permission_Keys.Employer_ManageCompanySettings],
  },
  {
    pattern: "/employer/setting/notifications",
    permissions: [Permission_Keys.Employer_ManageCompanySettings],
  },
];

const isCurrentPage = (pathname?: string, pattern?: string): boolean => {
  if (!pathname || !pattern) return false;
  const escapedPattern = pattern.replace(/[.+?^${}()|\\]/g, "\\$&");
  const regexPattern = escapedPattern
    .replace(/\/\*$/, "(\\/.*)?")
    .replace(/\/\\\*$/, "(\\/.*)?")
    .replace(/\[([^\]]+)\]/g, "[^\\/]+");
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(pathname);
};

export const hasRequiredPermissions = (
  permissions: Permission_Keys[],
  userPermissions: Permission_Keys[],
) =>
  permissions.length > 0
    ? permissions.some((perm) => userPermissions.includes(perm))
    : true;

function hasAccessToURL(
  user: { type: string; permissions: Permission_Keys[] },
  url: string,
): boolean {
  const rolePatterns = roleAccessMap[user.type] || [];
  const hasRoleAccess = rolePatterns.some((pattern) =>
    isCurrentPage(url, pattern),
  );
  if (!hasRoleAccess) return false;
  const matchingRoute = permissionsAccessMap.find(({ pattern }) =>
    isCurrentPage(url, pattern),
  );
  if (!matchingRoute) return true;
  return hasRequiredPermissions(matchingRoute.permissions, user.permissions);
}
