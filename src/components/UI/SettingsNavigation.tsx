"use client";
import { Option } from "@/types";
import { isCurrentPage } from "@/util";
import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const SettingsNavTabs: React.FC<{ tabs: Option[] }> = ({ tabs }) => {
  const pathname = usePathname();
  const activeTab =
    tabs.find((tab) => isCurrentPage(pathname, tab.pattern || tab.value)) ||
    tabs[0];
  return (
    <div className="grid w-full grid-cols-1">
      <div className="col-span-full overflow-x-auto rounded-base border border-gray-200 bg-white shadow-soft">
        <Tabs
          value={activeTab.value}
          variant="scrollable"
          scrollButtons={false}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              value={tab.value}
              LinkComponent={Link}
              href={tab.value}
              label={
                <span className="flex items-center gap-2 text-sm">
                  {tab.icon}
                  {tab.label}
                </span>
              }
              className="font-semibold normal-case"
            />
          ))}
        </Tabs>
      </div>
    </div>
  );
};
const SettingsNavTabsSkeleton: React.FC<{ length: number }> = ({ length }) => {
  return (
    <div className="grid w-full grid-cols-1">
      <div className="col-span-full overflow-x-auto rounded-base border border-gray-200 bg-white shadow-soft">
        <Tabs variant="scrollable" scrollButtons={false}>
          {Array.from({ length }).map((tab, index) => (
            <Tab key={index} className="font-semibold normal-case" />
          ))}
        </Tabs>
      </div>
    </div>
  );
};
const SettingsNavigation: React.FC<{ tabs: Option[] }> = ({ tabs }) => {
  return (
    <Suspense fallback={<SettingsNavTabsSkeleton length={tabs.length} />}>
      <SettingsNavTabs tabs={tabs} />
    </Suspense>
  );
};

export default SettingsNavigation;
