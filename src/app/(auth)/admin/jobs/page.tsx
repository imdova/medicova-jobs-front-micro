"use client";
import { Button, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Add } from "@mui/icons-material";
import { LayoutDashboard, LayoutList, Settings } from "lucide-react";
import OverviewJobs from "@/components/admin/overviews/OverviewJobs";
import JobList from "@/components/admin/lists/JobList";
import Link from "next/link";
import JobsSettings from "@/components/admin/settings/jobsSetting";

type Tab = "over-view" | "job-list" | "setting";

const tabs: { key: Tab; title: string; icon?: React.ReactNode }[] = [
  {
    key: "over-view",
    title: "Over View",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    key: "job-list",
    title: "Job List",
    icon: <LayoutList className="h-5 w-5" />,
  },
  {
    key: "setting",
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const JobsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="my-8 space-y-3 px-4">
      <div className="flex flex-col justify-between gap-5 sm:flex-row">
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
        <Button
          variant="contained"
          LinkComponent={Link}
          href={"/employer/job/posted"}
          startIcon={<Add className="h-5 w-5" />}
        >
          <span className="text-nowrap text-sm">New job</span>
        </Button>
      </div>
      {activeTab === "over-view" && <OverviewJobs />}
      {activeTab === "job-list" && <JobList isAdmin={true} />}
      {activeTab === "setting" && <JobsSettings />}
    </div>
  );
};

export default JobsPage;
