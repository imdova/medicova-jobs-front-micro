"use client";
import {
  Button,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import React, { useState } from "react";
import {
  BotOff,
  BriefcaseBusiness,
  Download,
  Eye,
  Search,
  ShieldCheck,
} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { ColumnConfig, Company } from "@/types";
import { API_GET_COMPANIES, JOB_APPLICATIONS } from "@/api/employer";
import Link from "next/link";

import StatusCard from "@/components/UI/StatusCard";
import DataTable from "@/components/UI/data-table";
import Flag from "@/components/UI/flagitem";
import Image from "next/image";
import ApplicationsCharts from "@/components/charts/applications-charts";
import CompanyMiniCard, { CompanyMiniCardSkeleton } from "@/components/admin/ui/CompanyMiniCard";
import { ApplicationsType } from "@/types/seeker";

type TopCountry = {
  id: string;
  code: string;
  name: string;
  job: number;
  employers: number;
  revenue: string;
};

const tabs = ["New Application", "Active Application", "Inactive Application"];
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
    title: "All Applications",
    value: "2,420",
    icon: (
      <BriefcaseBusiness className="block h-12 w-12 rounded-full bg-blue-50 p-2 text-blue-800" />
    ),
    trend: {
      value: "+20",
      description: "Since last Week",
      trendDirection: "up",
    },
  },
  {
    title: "Active Applications",
    value: "1,517",
    icon: (
      <ShieldCheck className="block h-12 w-12 rounded-full bg-primary/10 p-2 text-primary" />
    ),
    trend: {
      value: "20%",
      trendDirection: "up",
    },
  },
  {
    title: "InActive Applications",
    value: "903",
    icon: (
      <BotOff className="block h-12 w-12 rounded-full bg-amber-50 p-2 text-amber-800" />
    ),
    trend: {
      value: "20%",
      trendDirection: "down",
    },
  },
];
// data Applications columns
const columns: ColumnConfig<ApplicationsType>[] = [
  {
    header: "#",
    render: (_job, index) => <span>{index + 1}</span>, // Now works
  },
  {
    header: "Company",
    render: (app: ApplicationsType) => (
      <div className="flex items-center gap-2">
        <Image
          className="h-8 w-8 rounded-full object-cover"
          src={app.job.company.avatar || "/images/avatar-placeholder.png"}
          width={200}
          height={200}
          alt={app.job.company.name}
        />
        <Link
          className="text-sm transition hover:text-primary hover:underline"
          href={`/admin/employers/${app.job.company.username}`}
        >
          {app.job.company.name || "-"}
        </Link>
      </div>
    ),
  },
  {
    header: "Job Title",
    render: (app: ApplicationsType) => (
      <Link
        className="text-sm transition hover:text-primary hover:underline"
        href={`/admin/jobs/${app.job.id}`}
      >
        {app.job.title || "-"}
      </Link>
    ),
  },
  {
    header: "Seeker",
    render: (app: ApplicationsType) => (
      <div className="flex items-center gap-2">
        <Image
          className="h-8 w-8 rounded-full object-cover"
          src={app.applicant.avatar || "/images/avatar-placeholder.png"}
          width={200}
          height={200}
          alt={app.applicant.firstName}
        />
        <div className="flex flex-col">
          <Link
            className="text-sm transition hover:text-primary hover:underline"
            href={`/admin/seekers/${app.applicant.userName}`}
          >
            {`${app.applicant.firstName} ${app.applicant.lastName} ` || "-"}
          </Link>
          <Link
            className="text-xs text-blue-600 transition"
            href={`mailto:${app.applicant.userName}`}
          >
            {app.applicant.email || "-"}
          </Link>
        </div>
      </div>
    ),
  },
  {
    key: "created_at",
    header: "Date",
    render: (app: ApplicationsType) => {
      const formattedDate = new Date(app.created_at).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );

      return <span className="text-sm">{formattedDate || "-"}</span>;
    },
  },
  {
    key: "status",
    header: "Status",
    render: (job: ApplicationsType) => {
      const status = job.status;

      const statusStyles: Record<string, string> = {
        Review: "bg-yellow-100 text-yellow-800",
        Viewed: "bg-blue-100 text-blue-800",
        Shortlisted: "bg-purple-100 text-purple-800",
        Interviewed: "bg-indigo-100 text-indigo-800",
        Accepted: "bg-green-100 text-green-800",
        Rejected: "bg-red-100 text-red-800",
        Withdrawn: "bg-gray-200 text-gray-700",
      };

      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            statusStyles[status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];

const ApplicationsOverView: React.FC = () => {
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
  const { data: applications } =
    useFetch<PaginatedResponse<ApplicationsType>>(JOB_APPLICATIONS);
  console.log(applications);
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
    <>
      {/* start Overveiw page */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-8">
        <div className="col-span-1 lg:col-span-5">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {statusCards.map((card) => (
              <StatusCard key={card.title} {...card} />
            ))}
          </div>
          <div className="relative mt-3 overflow-hidden rounded-xl border bg-white shadow-soft">
            <ApplicationsCharts />
          </div>
        </div>
        <div className="col-span-1 flex flex-col lg:col-span-3">
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
      <div className="mt-3 !p-0">
        <div className="rounded-xl border bg-white p-4 shadow-soft">
          <div className="space-y-4">
            <div className="flex flex-col justify-between md:flex-row md:items-end">
              <div>
                <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <h2 className="text-xl font-semibold">Recent Applications</h2>
                </div>
                <div className="body-container overflow-x-auto">
                  <Tabs
                    value={activeTab}
                    onChange={(e, v) => setActiveTab(v)}
                    aria-label="basic tabs example"
                    variant="scrollable"
                    scrollButtons={false}
                    className="text-base"
                  >
                    {tabs.map((tab) => (
                      <Tab
                        key={tab}
                        className="text-nowrap text-xs"
                        label={tab}
                        value={tab}
                      />
                    ))}
                  </Tabs>
                </div>
              </div>
              <div className="m-2 flex flex-wrap items-end gap-2">
                <TextField
                  variant="outlined"
                  placeholder="Search For Jobs"
                  value={query}
                  InputProps={{
                    startAdornment: <Search />,
                  }}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div>
                  <Button
                    onClick={exportHandleClick}
                    variant="outlined"
                    aria-controls={exportOpen ? "export-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={exportOpen ? "true" : undefined}
                    className="space-x-2"
                  >
                    <Download className="inline-block h-5 w-5" />
                    <p className="inline-block text-sm">Export</p>
                    <ExpandMore className="inline-block h-5 w-5" />
                  </Button>
                  <Menu
                    id="export-menu"
                    anchorEl={exportAnchorEl}
                    open={exportOpen}
                    onClose={exportHandleClose}
                    className="mt-2"
                  >
                    <MenuItem className="hover:bg-gray-200">PDF</MenuItem>
                    <MenuItem className="hover:bg-gray-200">
                      Excel (CSV)
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
            <div>
              <DataTable<ApplicationsType>
                data={applications?.data || []}
                isSelectable
                searchQuery={query}
                columns={columns}
                selected={selectedItems}
                setSelected={setSelectedItems}
                options={[
                  {
                    label: "View Profile",
                    action: () => console.log("viewed profile"),
                    icon: <Eye size={15} />,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ApplicationsOverView;
