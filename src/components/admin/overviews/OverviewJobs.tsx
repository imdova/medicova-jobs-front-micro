"use client";
import { Typography } from "@mui/material";
import React, { useState } from "react";
import { BotOff, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { Company, JobData } from "@/types";
import { API_GET_COMPANIES, API_GET_JOBS } from "@/api/employer";
import StatusCard from "@/components/UI/StatusCard";
import DataTable from "@/components/UI/data-table";
import Flag from "@/components/UI/flagitem";
import JobCarts from "@/components/charts/jobs-chart";
import CompanyMiniCard, {
  CompanyMiniCardSkeleton,
} from "../ui/CompanyMiniCard";
import JobList from "../lists/JobList";

type TopCountry = {
  id: string;
  code: string;
  name: string;
  job: number;
  employers: number;
  revenue: string;
};

const tabs = ["New Jobs", "Active Jobs", "Inactive Jobs"];
const topCountriesData: TopCountry[] = [
  {
    id: "1",
    code: "EG",
    name: "Egypt",
    job: 18,
    employers: 35,
    revenue: "75k",
  },
  {
    id: "2",
    code: "US",
    name: "United States",
    job: 120,
    employers: 250,
    revenue: "1.2M",
  },
  {
    id: "3",
    code: "IN",
    name: "India",
    job: 95,
    employers: 180,
    revenue: "850k",
  },
  {
    id: "4",
    code: "DE",
    name: "Germany",
    job: 45,
    employers: 90,
    revenue: "500k",
  },
  {
    id: "5",
    code: "JP",
    name: "Japan",
    job: 60,
    employers: 110,
    revenue: "700k",
  },
  {
    id: "6",
    code: "AU",
    name: "Australia",
    job: 30,
    employers: 65,
    revenue: "400k",
  },
];
const statusCards: StatusCardType[] = [
  {
    title: "All Jobs",
    value: "2,420",
    icon: (
      <BriefcaseBusiness className="block h-11 w-11 rounded-full bg-blue-50 p-2 text-blue-800" />
    ),
    trend: {
      value: "+20",
      description: "Since last Week",
      trendDirection: "up",
    },
  },
  {
    title: "Active Jobs",
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
    title: "InActive Jobs",
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
// data jobs columns

const OverviewJobs: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<(number | string)[]>([]);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const exportOpen = Boolean(exportAnchorEl);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [query, setQuery] = useState("");
  const exportHandleClick = (event: any) => {
    setExportAnchorEl(event.currentTarget);
  };
  const exportHandleClose = () => {
    setExportAnchorEl(null);
  };
  const { data: jobs } = useFetch<PaginatedResponse<JobData>>(API_GET_JOBS); // Only one source of truth
  const { data: companies, loading } = useFetch<PaginatedResponse<Company>>(
    API_GET_COMPANIES,
    {
      defaultLoading: true,
    },
  );
  const topCompanies = companies?.data
    ?.sort(
      (a, b) => Number(b.completencePercent) - Number(a.completencePercent),
    )
    ?.filter((x) => Boolean(x.username));

  return (
    <div className="space-y-4">
      {/* start Overveiw page */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-8">
        <div className="col-span-1 h-full lg:col-span-5">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {statusCards.map((card) => (
              <StatusCard key={card.title} {...card} />
            ))}
          </div>
          {/* Chart Section */}
          <div className="relative mt-3 h-[calc(100%-97px)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
            <JobCarts />
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-3 lg:col-span-3">
          <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft">
            <div className="mb-2 flex items-center justify-between border-b p-1 pb-2">
              <h5 className="text-xl font-semibold text-main">
                Total Employers
                <span className="ml-1 text-xs text-muted-foreground">(Revenue)</span>
              </h5>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <CompanyMiniCardSkeleton key={item} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {topCompanies
                  ?.slice(0, 4)
                  .map((company) => (
                    <CompanyMiniCard key={company.id} company={company} />
                  ))}
              </div>
            )}
          </div>
          <div className="mt-3 flex-1 overflow-hidden rounded-xl border bg-white shadow-soft">
            <div className="mb-3 flex justify-between gap-8 p-3">
              <Typography>
                Top Countries
                <span className="ml-1 text-xs text-muted-foreground">(Revenue)</span>
              </Typography>
            </div>
            <div className="max-w-[calc(100vw-1rem)]">
              <DataTable
                data={topCountriesData}
                total={topCountriesData.length}
                cellClassName="p-2 text-xs"
                className="border-none shadow-none"
                // searchQuery={query}
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
                    header: "Country",
                    sortable: true,
                    render: (item) => (
                      <div className="flex">
                        <Flag {...item} />{" "}
                        <span className="ml-2 text-xs">{item.name}</span>
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
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      <JobList isAdmin={true} />
    </div>
  );
};

export default OverviewJobs;
