import React, { Suspense, useState } from "react";
import DataTable from "@/components/UI/data-table";
import Flag from "@/components/UI/flagitem";
import { BotOff, ShieldCheck, Users } from "lucide-react";
import { Company, Option } from "@/types";
import StatusCard from "@/components/UI/StatusCard";
import useFetch from "@/hooks/useFetch";
import { API_GET_COMPANIES } from "@/api/employer";

import EmployersChart from "@/components/charts/employers-charts";
import Avatar from "@/components/UI/Avatar";
import { Tab, Tabs, Tooltip } from "@mui/material";
import { cn } from "@/util";
import { formatMoney } from "@/util/general";
import EmployerList from "../lists/EmployerList";

type TopCountry = {
  id: string;
  code?: string;
  name: string;
  job: number;
  employers: number;
  revenue: number;
};

const topCountriesData: TopCountry[] = [
  {
    id: "1",
    code: "US",
    name: "United States",
    job: 150,
    employers: 280,
    revenue: 2500000,
  },
  {
    id: "2",
    code: "IN",
    name: "India",
    job: 120,
    employers: 220,
    revenue: 1800000,
  },
  {
    id: "3",
    code: "JP",
    name: "Japan",
    job: 85,
    employers: 160,
    revenue: 1200000,
  },
  {
    id: "4",
    code: "DE",
    name: "Germany",
    job: 75,
    employers: 140,
    revenue: 950000,
  },
  {
    id: "5",
    code: "AU",
    name: "Australia",
    job: 45,
    employers: 95,
    revenue: 650000,
  },
  {
    id: "6",
    code: "EG",
    name: "Egypt",
    job: 35,
    employers: 70,
    revenue: 450000,
  },
];
const topTypesData: TopCountry[] = [
  {
    id: "1",
    name: "Hospital",
    job: 120,
    employers: 250,
    revenue: 1200000,
  },
  {
    id: "2",
    name: "Medical Center",
    job: 95,
    employers: 180,
    revenue: 850000,
  },
  {
    id: "3",
    name: "Clinics and medical offices",
    job: 60,
    employers: 110,
    revenue: 700000,
  },
  {
    id: "4",
    name: "Rehabilitation Center",
    job: 45,
    employers: 90,
    revenue: 500000,
  },
  {
    id: "5",
    name: "Home Care",
    job: 30,
    employers: 65,
    revenue: 400000,
  },
  {
    id: "6",
    name: "Imaging and radiology center",
    job: 18,
    employers: 35,
    revenue: 75000,
  },
];

const topEmployersData = [
  {
    id: 1,
    name: "TechCorp Solutions",
    applications: 245,
    spends: 12500,
    jobs: 45,
    logo: "https://via.placeholder.com/40/2563eb?text=TC",
  },
  {
    id: 2,
    name: "MediHealth Inc",
    applications: 189,
    spends: 9800,
    jobs: 32,
    logo: "https://via.placeholder.com/40/10b981?text=MH",
  },
  {
    id: 3,
    name: "Global Finance Ltd",
    applications: 156,
    spends: 8200,
    jobs: 28,
    logo: "https://via.placeholder.com/40/ef4444?text=GF",
  },
  {
    id: 4,
    name: "EduTech Systems",
    applications: 134,
    spends: 7500,
    jobs: 25,
    logo: "https://via.placeholder.com/40/4b5563?text=ES",
  },
  {
    id: 5,
    name: "Green Energy Co",
    applications: 112,
    spends: 6800,
    jobs: 20,
    logo: "https://via.placeholder.com/40/059669?text=GE",
  },
  {
    id: 6,
    name: "Retail Plus",
    applications: 98,
    spends: 5900,
    jobs: 18,
    logo: "https://via.placeholder.com/40/7c3aed?text=RP",
  },
];

const statusCards: StatusCardType[] = [
  {
    title: "Total Employers",
    value: "2,420",
    icon: (
      <Users className="block h-11 w-11 rounded-full bg-blue-50 p-2 text-blue-800" />
    ),
    trend: {
      value: "+20",
      description: "Since last Week",
      trendDirection: "up",
    },
  },
  {
    title: "Active Employers",
    value: "1,517",
    icon: (
      <ShieldCheck className="block h-11 w-11 rounded-full bg-primary/10 p-2 text-primary" />
    ),
    trend: {
      value: "20%",
      trendDirection: "up",
    },
  },
  {
    title: "InActive Employers",
    value: "903",
    icon: (
      <BotOff className="block h-11 w-11 rounded-full bg-amber-50 p-2 text-amber-800" />
    ),
    trend: {
      value: "20%",
      trendDirection: "down",
    },
  },
];

const tableTabs: Option[] = [
  { label: "Top Countries", value: "countries" },
  { label: "Top Company types", value: "categories" },
];

const OverViewEmployers: React.FC = () => {
  const [topTableType, setTopTableType] = useState("countries");

  return (
    <div className="space-y-4">
      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-8">
        <div className="col-span-1 h-full lg:col-span-5">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {statusCards.map((card) => (
              <StatusCard key={card.title} {...card} />
            ))}
          </div>
          {/* Chart Section */}
          <div className="relative mt-3 h-[calc(100%-97px)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
            <EmployersChart />
          </div>
        </div>
        {/* Right Column */}
        <div className="col-span-1 flex flex-col gap-3 lg:col-span-3">
          {/* Performance Overview */}
          <div className="rounded-base border border-gray-200 bg-white shadow-soft">
            <div className="mb-2 flex items-center justify-between border-b border-gray-200 p-1 pb-2">
              <h5 className="p-2 font-semibold text-main">
                Top Employers
                <span className="ml-1 text-xs text-muted-foreground">(Revenue)</span>
              </h5>

              {/* <DummyActionMenu /> */}
            </div>

            <DataTable
              data={topEmployersData.slice(0, 5)}
              cellClassName="p-2 text-xs"
              className="border-none shadow-none"
              columns={[
                {
                  key: "id",
                  header: "Rank",
                  sortable: true,
                  render: (item) => (
                    <div className="pl-2 text-xs">#{item.id}</div>
                  ),
                },
                {
                  key: "name",
                  header: "Company",
                  sortable: true,
                  render: (item) => (
                    <div className="flex items-center gap-2">
                      <Avatar src={item.logo} size={24} />
                      <h6 className="line-clamp-1 text-xs">{item.name}</h6>
                    </div>
                  ),
                },
                {
                  key: "jobs",
                  header: "Jobs",
                  sortable: true,
                },
                {
                  key: "applications",
                  header: "Applications",
                  sortable: true,
                },
                {
                  key: "spends",
                  header: "Spends",
                  sortable: true,
                  render: (item) => (
                    <div className="text-xs font-medium text-green-600">
                      ${formatMoney(item.spends)}
                    </div>
                  ),
                },
              ]}
            />
          </div>
          {/* Top Countries */}
          <div className="rounded-base border border-gray-200 bg-white shadow-soft">
            <div className="grid grid-cols-1 border-b border-gray-200">
              <div>
                <Tabs
                  value={topTableType}
                  onChange={(e, value) => setTopTableType(value)}
                  aria-label="basic tabs example"
                  variant="scrollable"
                  scrollButtons={false}
                  className="text-base"
                  sx={{
                    minHeight: "unset",
                    "& .MuiTab-root": {
                      minHeight: "unset",
                      padding: "12px 16px",
                      fontSize: "0.75rem",
                      textTransform: "none",
                      // whiteSpace: "nowrap",
                    },
                  }}
                >
                  {tableTabs.map((tab) => (
                    <Tab
                      key={tab.value}
                      label={
                        <h5
                          className={cn(
                            "text-sm font-semibold text-muted-foreground",
                            topTableType === tab.value && "text-main",
                          )}
                        >
                          {tab.label}
                        </h5>
                      }
                      value={tab.value}
                    />
                  ))}
                </Tabs>
              </div>
            </div>

            <DataTable
              data={
                topTableType === "countries" ? topCountriesData : topTypesData
              }
              defaultVisibleColumns={[
                "Rank",
                "Country",
                "Company Type",
                "Employers",
                "Jobs",
                "Revenue",
              ]}
              cellClassName="p-2 text-xs"
              className="border-none shadow-none"
              columns={[
                {
                  key: "id",
                  header: "Rank",
                  sortable: true,
                  render: (item) => (
                    <div className="pl-2 text-xs">#{item.id}</div>
                  ),
                },
                {
                  key: "name",
                  header:
                    topTableType === "countries" ? "Country" : "Company Type",
                  sortable: true,
                  render: (item) => (
                    <div className="flex">
                      {item?.code && (
                        <Flag code={item?.code} name={item?.name} />
                      )}{" "}
                      <Tooltip title={item.name}>
                        <span className="ml-2 line-clamp-1 text-xs">
                          {item.name}
                        </span>
                      </Tooltip>
                    </div>
                  ),
                },
                {
                  key: "employers",
                  header: "Employers",
                  sortable: true,
                },
                {
                  key: "job",
                  header: "Jobs",
                  sortable: true,
                },
                {
                  key: "revenue",
                  header: "Revenue",
                  sortable: true,
                  render: (item) => (
                    <div className="text-xs font-medium text-green-600">
                      ${formatMoney(item.revenue)}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
      <Suspense>
        <EmployerList compact={true} />
      </Suspense>
    </div>
  );
};

export default OverViewEmployers;
