import { RoleBasedLinks } from "@/types";
import { MessageOutlined } from "@mui/icons-material";
import { Permission_Keys } from "./enums/Permission_Keys.enum";

export const roleBasedLinks: RoleBasedLinks = {
  employer: [
    {
      id: 1,
      label: "Dashboard",
      path: "/employer/dashboard",
      permissions: [Permission_Keys.Employer_ManageJobs],
    },
    {
      id: 1,
      label: "My Jobs",
      path: "/employer/job/manage-jobs",
      permissions: [Permission_Keys.Employer_ManageJobs],
    },
    {
      id: 1,
      label: "CV Search",
      path: "/employer/search",
      permissions: [Permission_Keys.Employer_InteractWithJobSeekers],
    },
    {
      id: 1,
      label: "Report",
      path: "#",
      permissions: [Permission_Keys.Employer_ManageJobs],
    },
    {
      id: 1,
      label: "Billing",
      path: "/employer/subscription-plans",
      permissions: [Permission_Keys.Employer_ManagePayments],
    },
  ],
  unEmployee: [
    {
      id: 1,
      label: "Dashboard",
      path: "/employer/dashboard",
      permissions: [Permission_Keys.Employer_ManageJobs],
    },
    {
      id: 1,
      label: "My Jobs",
      path: "/employer/job/manage-jobs",
      permissions: [Permission_Keys.Employer_ManageJobs],
    },
    {
      id: 1,
      label: "CV Search",
      path: "/employer/search",
      permissions: [Permission_Keys.Employer_InteractWithJobSeekers],
    },
    {
      id: 1,
      label: "Report",
      path: "#",
      permissions: [Permission_Keys.Employer_ManageJobs],
    },
    {
      id: 1,
      label: "Billing",
      path: "/employer/subscription-plans",
      permissions: [Permission_Keys.Employer_ManagePayments],
    },
  ],
  seeker: [
    {
      id: 1,
      label: "Find Job",
      path: "/search",
      permissions: [],
    },
    {
      id: 1,
      label: "Applications",
      path: "/job-seeker/my-applications",
      permissions: [],
    },
    {
      id: 1,
      label: "Courses",
      path: "#",
      permissions: [],
    },
    {
      id: 1,
      label: "Settings",
      path: "/job-seeker/setting",
      pattern: "/job-seeker/setting/*",
      permissions: [],
    },
  ],
  admin: [
    {
      id: 1,
      label: "Admin Dashboard",
      path: "/admin",
      permissions: [Permission_Keys.Admin_Jobs_ViewJob],
    },
    {
      id: 1,
      label: "User Management",
      path: "/admin/users",
      permissions: [Permission_Keys.Admin_Settings_ManageUserPermissions],
    },
    {
      id: 1,
      label: "Settings",
      path: "/admin/settings",
      permissions: [Permission_Keys.Admin_Settings_ConfigurePlatformFeatures],
    },
  ],
  default: [
    {
      id: 1,
      label: "Jobs",
      path: "/search",
      permissions: [],
    },
    {
      id: 2,
      label: "Post a Job",
      path: "/employer/job/posted",
      permissions: [Permission_Keys.Employer_ManageJobs],
    },
    {
      id: 3,
      label: "Blog",
      path: "/blogs",
      permissions: [],
    },
    {
      id: 4,
      label: "About",
      path: "/about",
      permissions: [],
    },
    {
      id: 5,
      label: "Contact",
      path: "/contact",
      permissions: [],
    },
    {
      id: 6,
      label: "Courses",
      path: "https://courses.medicova.net/",
      permissions: [],
    },
  ],
  unverified: [
    {
      id: 0,
      label: "Verify Account",
      icon: MessageOutlined,
      notifications: 1,
      path: "/auth/verify",
      pattern: "/auth/verify",
      permissions: [],
    },
  ],
};
