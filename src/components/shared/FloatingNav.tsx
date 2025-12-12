"use client";

import { Button } from "@/components/UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { ScrollArea } from "@/components/UI/scroll-area";
import { isCurrentPage } from "@/util";
import { Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const devMode = process.env.NODE_ENV === "development";

const navSections = [
  {
    label: "General",
    items: [
      { name: "About", path: "/about" }, //
      { name: "Contact", path: "/contact" }, // improve form
      { name: "Plans", path: "/plans" }, // buttons needs improvements
      { name: "Search", path: "/search" }, // needs improvements
      { name: "Explore", path: "/a/explore" }, // same as search
    ],
  },
  {
    label: "Auth",
    items: [
      { name: "Sign In", path: "/auth/signin" }, // form needs improvements
      { name: "Register", path: "/auth/register" }, // same as register
      { name: "Forget Password", path: "/auth/forget" }, // has form
      { name: "Reset Password", path: "/auth/reset" }, // form needs improvements
      { name: "Verify", path: "/auth/verify" },
      { name: "Verify Email", path: "/auth/verify-email" },
      { name: "Change Email", path: "/auth/verify/change-email" },
      {
        name: "Company Change Email",
        path: "/auth/verify/company-change-email",
      },
      { name: "Complete Invite", path: "/auth/verify/complete-invite" },
    ],
  },
  {
    label: "Admin → Dashboard",
    items: [
      { name: "Dashboard", path: "/admin/dashboard" }, //TODO needs huge improvements >>> 1
      { name: "Reports", path: "/admin/dashboard/reports" }, //TODO needs huge improvements >>> 2
    ],
  },
  {
    label: "Admin → Employers",
    items: [
      { name: "Employers", path: "/admin/employers" }, // charts needs improvements
      { name: "Employer slug", path: "/admin/employers/slug" },
    ],
  },
  {
    label: "Admin → Employees",
    items: [
      { name: "Employees", path: "/admin/employees" },
      { name: "Employee id", path: "/admin/employees/id" },
    ],
  },
  {
    label: "Admin → Seekers",
    items: [
      { name: "Seekers", path: "/admin/seekers" },
      { name: "Seeker slug", path: "/admin/seekers/slug" },
    ],
  },
  {
    label: "Admin → Jobs",
    items: [
      { name: "Jobs", path: "/admin/jobs" },
      { name: "Job slug", path: "/admin/jobs/slug" },
    ],
  },
  {
    label: "Admin → Applications",
    items: [{ name: "Applications", path: "/admin/applications" }],
  },
  {
    label: "Admin → Blog",
    items: [
      { name: "All Posts", path: "/admin/blog" },
      { name: "New Post", path: "/admin/blog/new" },
      { name: "Edit Post slug", path: "/admin/blog/edit/slug" },
      { name: "Blog Settings", path: "/admin/blog/settings" },
    ],
  },
  {
    label: "Admin → Ads",
    items: [
      { name: "Ads Dashboard", path: "/admin/ads" },
      { name: "Campaigns", path: "/admin/ads/campaigns" },
      { name: "Campaign id", path: "/admin/ads/campaigns/id" },
      { name: "Create Ad", path: "/admin/ads/create" },
      { name: "Edit Ad id", path: "/admin/ads/edit/id" },
    ],
  },
  {
    label: "Admin → Billing",
    items: [
      { name: "Transactions", path: "/admin/transactions" },
      { name: "Plans", path: "/admin/plans" },
      { name: "Plan id", path: "/admin/plans/id" },
      { name: "Create Plan", path: "/admin/plans/create" },
      { name: "Edit Plan id", path: "/admin/plans/edit/id" },
      { name: "Invoices", path: "/admin/invoices" },
      { name: "Create Invoice", path: "/admin/invoices/create" },
      { name: "Edit Invoice id", path: "/admin/invoices/edit/id" },
      { name: "Preview Invoice id", path: "/admin/invoices/preview/id" },
    ],
  },
  {
    label: "Admin → Site Settings",
    items: [
      { name: "Content", path: "/admin/site-settings/content" },
      { name: "Branding", path: "/admin/site-settings/branding" },
      { name: "SEO", path: "/admin/site-settings/seo" },
      { name: "SEO Edit id", path: "/admin/site-settings/seo/edit/id" },
      { name: "SEO New", path: "/admin/site-settings/seo/new" },
      { name: "Snippets", path: "/admin/site-settings/snippets" },
      { name: "Tools", path: "/admin/site-settings/tools" },
      { name: "Notifications", path: "/admin/site-settings/notifications" },
      { name: "Profile", path: "/admin/site-settings/profile" },
    ],
  },
  {
    label: "Admin → Settings",
    items: [
      { name: "General Settings", path: "/admin/settings" },
      { name: "Profile", path: "/admin/settings/profile" },
      { name: "Notifications", path: "/admin/settings/notifications" },
    ],
  },
  {
    label: "Employer",
    items: [
      { name: "Dashboard", path: "/employer/dashboard" },
      { name: "Company Info", path: "/employer/company-info" },
      { name: "Manage Jobs", path: "/employer/job/manage-jobs" },
      { name: "Manage Job id", path: "/employer/job/manage-jobs/id" },
      { name: "Posted Jobs", path: "/employer/job/posted" },
      { name: "Posted Job id", path: "/employer/job/posted/id" },
      { name: "Job Overview slug", path: "/employer/job/over-view/slug" },
      { name: "Search", path: "/employer/search" },
      { name: "Saved Search", path: "/employer/search/saved-search" },
      { name: "Saved Search id", path: "/employer/search/saved-search/id" },
      { name: "Billing", path: "/employer/billing" },
      { name: "Settings", path: "/employer/setting" },
      { name: "Company Settings", path: "/employer/setting/company-info" },
      { name: "Notifications", path: "/employer/setting/notifications" },
      { name: "Roles", path: "/employer/setting/roles" },
      { name: "Users", path: "/employer/setting/users" },
    ],
  },
  {
    label: "Job Seeker",
    items: [
      { name: "My Applications", path: "/job-seeker/my-applications" },
      { name: "Saved Jobs", path: "/job-seeker/saved-jobs" },
      { name: "Browse Companies", path: "/job-seeker/browse-companies" },
      { name: "Settings", path: "/job-seeker/setting" },
      { name: "Notifications", path: "/job-seeker/setting/notifications" },
    ],
  },
  {
    label: "Blogs",
    items: [
      { name: "All Blogs", path: "/blogs" },
      { name: "Blog slug", path: "/blogs/slug" },
    ],
  },
  {
    label: "Shared",
    items: [
      { name: "Chat", path: "/chat" },
      { name: "Notifications", path: "/notifications" },
      { name: "Google", path: "/google" },
      { name: "Company id", path: "/co/id" },
      { name: "Job id", path: "/job/id" },
      { name: "Me id", path: "/me/id" },
      { name: "Dynamic Page", path: "/a/slug" },
    ],
  },
];

function FloatingNav() {
  const pathname = usePathname() || "/";
  if (!devMode) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="fixed right-4 bottom-4 rounded-full shadow-lg"
          size="icon"
        >
          <Layers className="h-5 w-5" />
          <span className="sr-only">Navigation</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="max-h-[70vh] w-72 overflow-hidden"
      >
        <ScrollArea className="h-[70vh] p-2">
          {navSections.map((section, i) => (
            <div key={section.label}>
              <DropdownMenuLabel>{section.label}</DropdownMenuLabel>
              {section.items.map((item) => {
                const isPage = isCurrentPage(pathname, item.path);
                return (
                  <DropdownMenuItem
                    key={item.path}
                    asChild
                    className={
                      isPage
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    <Link href={item.path}>{item.name}</Link>
                  </DropdownMenuItem>
                );
              })}
              {i !== navSections.length - 1 && <DropdownMenuSeparator />}
            </div>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FloatingNav;
