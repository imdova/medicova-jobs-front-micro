"use client";
import { routeConfigs } from "@/config/routeConfigs";
import { matchRoute } from "@/util";
import { usePathname } from "next/navigation";

const DynamicLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || "/";
  const sideBarType = matchRoute(routeConfigs, pathname)?.sideBarType || "";

  const className = (() => {
    const baseClasses = "flex min-h-[calc(100vh-150px)] w-full flex-row";
    switch (sideBarType) {
      case "full":
      case "minimal":
        return `container mx-auto ${baseClasses} my-8 md:max-w-[1300px]`;
      case "admin-full":
      case "admin-minimal":
        return baseClasses;
      default:
        return "";
    }
  })();

  return <div className={className}>{children}</div>;
};

export default DynamicLayout;
