import { roleBasedLinks } from "@/constants/header";
import { roleBasedSideBarLinks } from "@/constants/side-bar";
import { NavItem } from "@/types";
import { User } from "next-auth";
import { RoleState } from "@/types/next-auth";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import { matchRoute } from "@/util";

// Unified Route Configs
export const routeConfigs: RouteConfig[] = [
  // Default
  {
    pattern: "/",
    headerType: "transparent",
    sideBarType: "none",
    linksType: "default",
  },
  {
    pattern: "/about",
    headerType: "transparent",
    sideBarType: "none",
    linksType: "default",
  },
  {
    pattern: "/contact",
    headerType: "transparent",
    sideBarType: "none",
    linksType: "default",
  },
  {
    pattern: "/blogs/*",
    headerType: "full",
    sideBarType: "none",
    linksType: "default",
  },
  {
    pattern: "/plans",
    headerType: "full",
    sideBarType: "minimal",
    linksType: "userType",
  },
  {
    pattern: "/search",
    headerType: "transparent",
    sideBarType: "none",
    linksType: "userType",
  },
  {
    pattern: "/a/[slug]",
    headerType: "full",
    sideBarType: "minimal",
    linksType: "userType",
  },
  {
    pattern: "/blog",
    headerType: "full",
    sideBarType: "minimal",
    linksType: "userType",
  },
  {
    pattern: "/me/[id]",
    headerType: "full",
    sideBarType: "full",
    linksType: "userType",
  },
  {
    pattern: "/co/[id]",
    headerType: "full",
    sideBarType: "full",
    linksType: "userType",
  },
  {
    pattern: "/job/[slug]",
    headerType: "full",
    sideBarType: "full",
    linksType: "userType",
  },
  {
    pattern: "/chat",
    headerType: "full",
    sideBarType: "minimal",
    linksType: "userType",
  },
  {
    pattern: "/notifications",
    headerType: "full",
    sideBarType: "full",
    linksType: "userType",
  },

  // Employer Specific
  {
    pattern: "/employer/search",
    headerType: "full",
    sideBarType: "minimal",
    linksType: "userType",
  },
  {
    pattern: "/employer/subscription-plans",
    headerType: "full",
    sideBarType: "minimal",
    linksType: "userType",
  },
  {
    pattern: "/employer/job/manage-jobs/[id]",
    headerType: "full",
    sideBarType: "minimal",
    linksType: "userType",
  },
  {
    pattern: "/employer/search/saved-search/[slug]",
    headerType: "full",
    sideBarType: "minimal",
    linksType: "userType",
  },
  {
    pattern: "/employer/*",
    headerType: "full",
    sideBarType: "full",
    linksType: "userType",
  },

  // Job Seeker
  {
    pattern: "/job-seeker/*",
    headerType: "full",
    sideBarType: "full",
    linksType: "userType",
  },

  // Admin
  {
    pattern: "/admin/blog/new",
    headerType: "none",
    sideBarType: "none",
    linksType: "userType",
  },
  {
    pattern: "/admin/invoices/create",
    headerType: "none",
    sideBarType: "admin-minimal",
    linksType: "userType",
  },
  {
    pattern: "/admin/employees",
    headerType: "full",
    sideBarType: "admin-full",
    linksType: "userType",
  },
  {
    pattern: "/admin/blog/edit/*",
    headerType: "none",
    sideBarType: "none",
    linksType: "userType",
  },
  {
    pattern: "/admin/blog/*",
    headerType: "full",
    sideBarType: "admin-full",
    linksType: "userType",
  },
  {
    pattern: "/admin/*",
    headerType: "full",
    sideBarType: "admin-full",
    linksType: "userType",
  },

  // Auth
  {
    pattern: "/auth/*",
    headerType: "minimal",
    sideBarType: "none",
    linksType: "userType",
  },
];

// Header Links
export function getNavLinks(user?: User, pathname?: string) {
  const userType = user?.type;
  if (pathname) {
    const type = matchRoute(routeConfigs, pathname)?.linksType;
    if (type === "userType" && userType) {
      return roleBasedLinks[userType] || roleBasedLinks.default;
    }
  }
  return roleBasedLinks.default;
}

export const hasRequiredPermissions = (
  permissions: Permission_Keys[],
  userPermissions: Permission_Keys[],
) =>
  permissions.length > 0
    ? permissions.some((perm) => userPermissions.includes(perm))
    : true;

// Sidebar Links
export function getSideBarLinks(user?: User, pathname?: string): NavItem[] {
  let userType = user?.type as RoleState;
  const userPermissions: Permission_Keys[] = user?.permissions || []; // Ensure permissions are available\
  if (userType === "employer" && !user?.hasCompany) {
    userType = "unEmployee";
  }
  if (pathname) {
    const type = matchRoute(routeConfigs, pathname)?.linksType;
    if (type === "default") return roleBasedSideBarLinks.default;
    if (userType) {
      const links =
        roleBasedSideBarLinks[userType] || roleBasedSideBarLinks.default;
      const filteredLinks = links.filter((x) =>
        hasRequiredPermissions(x.permissions, userPermissions),
      );
      return filteredLinks;
    }
  }
  return roleBasedSideBarLinks.default;
}
