"use client";
import { Button, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import { Add } from "@mui/icons-material";
import OverviewSeekerPage from "@/components/admin/overviews/OverviewSeeker";
import SeekerList from "@/components/admin/lists/SeekerList";

type Tab = "over-view" | "seeker-list" | "setting";

const tabs: { key: Tab; title: string; icon?: React.ReactNode }[] = [
  {
    key: "over-view",
    title: "Over View",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    key: "seeker-list",
    title: "Seeker List",
    icon: <Users className="h-5 w-5" />,
  },
  {
    key: "setting",
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const SeekersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  return (
    <div className="w-full space-y-3 px-4 md:px-5 my-8">
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <div className="flex flex-1 flex-col items-center justify-between overflow-hidden rounded-base border border-gray-200 shadow-soft sm:flex-row md:items-center">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            aria-label="responsive tabs example"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.key}
                value={tab.key}
                label={
                  <span className="flex items-center gap-2 text-sm">
                    {tab.icon}
                    {tab.title}
                  </span>
                }
              />
            ))}
          </Tabs>
        </div>
        <Button variant="contained" startIcon={<Add className="h-5 w-5" />}>
          <span className="text-nowrap text-sm">Add Seeker</span>
        </Button>
      </div>

      {activeTab === "over-view" && <OverviewSeekerPage />}
      {activeTab === "seeker-list" && <SeekerList />}
    </div>
  );
};

export default SeekersPage;
