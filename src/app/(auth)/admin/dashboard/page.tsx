"use client";
import TeamList from "@/components/admin/lists/TeamList";
import OverViewEmployers from "@/components/admin/overviews/OverviewEmployers";
// import OverviewFinance from "@/components/admin/overviews/OverviewFinance";
import OverviewJobs from "@/components/admin/overviews/OverviewJobs";
import OverviewSeeker from "@/components/admin/overviews/OverviewSeeker";
import TransactionsOverView from "@/components/admin/overviews/TransactionsOverView";
import { Tab, Tabs } from "@mui/material";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import { useState } from "react";

type Tab = "finance" | "employers" | "seekers" | "jobs" | "team";

const tabs: { key: Tab; title: string; icon?: React.ReactNode }[] = [
  {
    key: "finance",
    title: "Finance",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    key: "employers",
    title: "Employers",
    icon: <Users className="h-4 w-4" />,
  },
  {
    key: "seekers",
    title: "Seekers",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    key: "jobs",
    title: "Jobs",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    key: "team",
    title: "Team",
    icon: <Settings className="h-4 w-4" />,
  },
];

const Page = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  return (
    <div>
      <div className="mb-2 grid grid-cols-1">
        <div className="col-start-1">
          <Tabs
            value={activeTab}
            variant="scrollable"
            onChange={(e, newValue) => setActiveTab(newValue)}
            aria-label="responsive tabs example"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.key}
                value={tab.key}
                label={
                  <span className="flex items-center gap-2 text-xs">
                    {tab.icon}
                    {tab.title}
                  </span>
                }
              />
            ))}
          </Tabs>
        </div>
      </div>
      {activeTab === "finance" && <TransactionsOverView />}
      {activeTab === "employers" && <OverViewEmployers />}
      {activeTab === "seekers" && <OverviewSeeker />}
      {activeTab === "jobs" && <OverviewJobs />}
      {/* TODO: {activeTab === "team" && <TeamList />} */}
    </div>
  );
};

export default Page;
