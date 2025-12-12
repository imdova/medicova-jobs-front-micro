"use client";

import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import CategoriesTab from "@/components/blog/settings/CategoriesTab";
import AuthorsTab from "@/components/blog/settings/AuthorsTab";
import { LayoutList, Users } from "lucide-react";

type Tab = "Authors" | "categories-list";

interface TabPanelProps {
  children?: React.ReactNode;
  index: Tab;
  value: Tab;
}

const tabs: { key: Tab; title: string; icon?: React.ReactNode }[] = [
  {
    key: "categories-list",
    title: "Categories List",
    icon: <LayoutList className="h-4 w-4" />,
  },
  {
    key: "Authors",
    title: "Authors",
    icon: <Users className="h-4 w-4" />,
  },
];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`blog-settings-tabpanel-${index}`}
      aria-labelledby={`blog-settings-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function BlogSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0].key);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: Tab) => {
    setActiveTab(newValue);
  };

  return (
    <div className="my-8 w-full space-y-3 px-4 md:px-5">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Blog Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your blog categories and authors
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 md:flex-row">
        <div className="flex flex-1 flex-col items-center justify-between overflow-hidden rounded-base border border-gray-200 shadow-soft sm:flex-row md:items-center">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
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

      <TabPanel value={activeTab} index={"categories-list"}>
        {/* <CategoriesTab /> */}
        <CategoriesTab />
      </TabPanel>
      <TabPanel value={activeTab} index={"Authors"}>
        <AuthorsTab />
      </TabPanel>
    </div>
  );
}
