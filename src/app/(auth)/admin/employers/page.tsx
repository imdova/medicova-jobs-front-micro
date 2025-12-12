"use client";
import { Button, Tab, Tabs } from "@mui/material";
import { Suspense, useState } from "react";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import { Add } from "@mui/icons-material";
import EmployerList from "@/components/admin/lists/EmployerList";
import OverViewEmployers from "@/components/admin/overviews/OverviewEmployers";
import EmployersSettings from "@/components/admin/settings/employersSettings";
import CompanyFormModal from "@/components/admin/forms/CompanyFormModal";

type Tab = "over-view" | "employer-list" | "setting";

const tabs: { key: Tab; title: string; icon?: React.ReactNode }[] = [
  {
    key: "over-view",
    title: "Over View",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    key: "employer-list",
    title: "Employer List",
    icon: <Users className="h-4 w-4" />,
  },
  {
    key: "setting",
    title: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
];
const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="my-8 w-full space-y-3 px-4 md:px-5">
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
                  <span className="flex items-center gap-2 text-xs">
                    {tab.icon}
                    {tab.title}
                  </span>
                }
              />
            ))}
          </Tabs>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="contained"
          className="max-h-[50px]"
          startIcon={<Add className="h-5 w-5" />}
        >
          <span className="text-nowrap text-xs">Add Company</span>
        </Button>
        <CompanyFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
      {activeTab === "over-view" && <OverViewEmployers />}
      {activeTab === "employer-list" && (
        <Suspense>
          <EmployerList />
        </Suspense>
      )}
      {activeTab === "setting" && <EmployersSettings />}
    </div>
  );
};

export default AdminPage;
