"use client";

import { usePathname } from "next/navigation";
import VerticalTabs from "./vertical-tabs";
import { User } from "next-auth";
import { cn, matchRoute } from "@/util";
import { routeConfigs } from "@/config/routeConfigs";

export default function DynamicSideBar({ user }: { user?: User }) {
  const pathname = usePathname() || "/";
  const { sideBarType, headerType } = matchRoute(routeConfigs, pathname) || {};

  const isMinimal =
    sideBarType === "minimal" || sideBarType === "admin-minimal";
  const isFull = sideBarType === "full" || sideBarType === "admin-full";
  const hasHeader = headerType !== "none";
  const isAdmin = sideBarType?.includes("admin");

  if (!isFull && !isMinimal) return null;

  const asideWidth = isFull
    ? "w-[50px] min-w-[50px] lg:w-[250px]"
    : "w-[50px] min-w-[50px]";

  const asideMargin = isAdmin ? (hasHeader ? "ml-5" : "") : "ml-5";

  const innerContainerClass = isMinimal
    ? "w-[50px] hover:w-[250px] hover:shadow-2xl"
    : "w-[50px] max-lg:hover:w-[250px] max-lg:hover:shadow-2xl lg:w-[250px]";

  const withHeader = hasHeader
    ? "top-[98px] max-h-[calc(100dvh-126px)] min-h-[calc(100dvh-126px)]"
    : "top-[2px] max-h-[calc(100dvh-4px)] min-h-[calc(100dvh-4px)]";

  return (
    <aside
      className={cn(
        "group/sideBard z-50 hidden transition-all duration-300 md:block max-h-[calc(100dvh-4px)]",
        asideWidth,
        asideMargin,
      )}
    >
      <div
        className={cn(
          "scroll-bar-hidden group fixed",
          "z-30 overflow-y-auto overflow-x-hidden rounded-base border border-gray-200 bg-white py-4 shadow-soft transition-all duration-300",
          withHeader,
          innerContainerClass,
        )}
      >
        <div className="min-w-[250px]">
          <VerticalTabs user={user} pathname={pathname} isMinimal={isMinimal} />
        </div>
      </div>
    </aside>
  );
}
