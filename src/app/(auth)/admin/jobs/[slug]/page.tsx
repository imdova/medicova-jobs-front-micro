"use client";

import { API_GET_JOB_BY_ID, JOB_APPLICATIONS } from "@/api/employer";
import NotFoundPage from "@/app/not-found";
import DataTable from "@/components/UI/data-table";
import useFetch from "@/hooks/useFetch";
import { ColumnConfig, JobData } from "@/types";
import { Eye, ListOrdered, SquarePen, View, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Tab, Tabs, Typography } from "@mui/material";
import Flag from "@/components/UI/flagitem";
import Loading from "@/components/loading/loading";
import ApplicationsCharts from "@/components/charts/applications-charts";
import { ApplicationsType } from "@/types/seeker";

interface SingleUserProps {
  params: {
    slug: string;
  };
}
type TopCountry = {
  id: string;
  code: string;
  name: string;
  job: number;
  employers: number;
  revenue: string;
};
interface JobFilter {
  searchQuery: string;
  location: string;
  category: string;
  specialty: string;
  educationDate: string;
  status: string;
}

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

type Tab = "over-view" | "applications-list";

const SingleJobOverview = ({ params }: SingleUserProps) => {
  const slug = params.slug;
  const { data: job, loading } = useFetch<JobData>(
    `${API_GET_JOB_BY_ID}${slug}`,
    { defaultLoading: true },
  );
  const { data: applications } = useFetch<PaginatedResponse<ApplicationsType>>(
    job?.id ? `${JOB_APPLICATIONS}?jobId=${job?.id}` : null,
  );

  const [selectedItems, setSelectedItems] = useState<(number | string)[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("over-view");
  const [filters, setFilters] = useState<JobFilter>({
    searchQuery: "",
    location: "",
    category: "",
    specialty: "",
    educationDate: "",
    status: "",
  });

  const columns: ColumnConfig<ApplicationsType>[] = [
    {
      header: "Full Name",
      render: (app) => (
        <div className="flex items-center gap-2">
          <Image
            className="h-8 w-8 rounded-full object-cover"
            src={app.applicant.avatar ?? "/images/avatar-placeholder.png"}
            width={200}
            height={200}
            alt={app.applicant.firstName}
          />
          <div>
            <Link
              className="hover:underline"
              href={`/admin/users/${app.applicant.id}`}
            >
              <div className="">
                <span className="text-sm">{app.applicant.firstName} </span>
                <span className="text-sm">{app.applicant.lastName}</span>
              </div>
            </Link>
            <p className="text-xs text-blue-700">{app.applicant.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Applied Date",
      render: (app) => {
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
      header: "Phone",
      render: (app) => (
        <span className="text-sm">{app.applicant.phone || "-"}</span>
      ),
    },
    {
      header: "Country",
      render: (app) => (
        <span className="text-sm">{app.applicant.country?.name || "-"}</span>
      ),
    },
    {
      header: "Category",
      render: (app) => (
        <span className="text-sm">{app.applicant.category || "-"}</span>
      ),
    },
    {
      header: "Specialty",
      render: (app) => (
        <span className="text-sm">{app.applicant.specialty || "-"}</span>
      ),
    },
    {
      header: "Career Level",
      render: (app) => (
        <span className="text-sm">{app.applicant.careerLevel || "-"}</span>
      ),
    },
    {
      header: "Education",
      render: (app) => (
        <span className="text-sm">
          {app.applicant.lastEducation?.degree || "-"}
        </span>
      ),
    },
    {
      header: "Experience",
      render: (app) => (
        <span className="text-sm">
          {app.applicant.yearsOfExperience?.totalYears || "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (app) => {
        const getStatusStyle = (status: string) => {
          switch (status) {
            case "Review":
              return "bg-yellow-100 text-yellow-800";
            case "Viewed":
              return "bg-blue-100 text-blue-800";
            case "Shortlisted":
              return "bg-purple-100 text-purple-800";
            case "Interviewed":
              return "bg-indigo-100 text-indigo-800";
            case "Accepted":
              return "bg-green-100 text-green-800";
            case "Rejected":
              return "bg-red-100 text-red-800";
            case "Withdrawn":
              return "bg-gray-200 text-gray-700";
            default:
              return "bg-gray-100 text-gray-500";
          }
        };

        const status = app.status || "-";
        const badgeStyle = getStatusStyle(status);

        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${badgeStyle}`}
          >
            {status}
          </span>
        );
      },
    },
  ];
  if (loading) return <Loading />;
  if (!job) return <NotFoundPage />;
  const tabs: { key: Tab; title: string; icon?: React.ReactNode }[] = [
    {
      key: "over-view",
      title: "Job Overview",
      icon: <View className="h-5 w-5" />,
    },
    {
      key: "applications-list",
      title: "Applicant List",
      icon: <ListOrdered className="h-5 w-5" />,
    },
  ];
  return (
    <div className="my-8 space-y-3 px-4">
      {/* Tab Buttons */}
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
      </div>

      <div className="mb-4 rounded-lg border bg-white p-4 shadow-soft">
        <h1 className="mb-4 text-2xl font-bold">{job.title}</h1>
        <div className="relative flex justify-between">
          {/* Student Details */}
          <div className="flex w-full flex-col items-center gap-6 lg:flex-row">
            <Image
              className="h-[250px] max-w-[250px] rounded-xl object-cover lg:h-[120px] lg:w-[150px]"
              src={job.company?.avatar ?? "/images/avatar-placeholder.png"}
              alt="Seeker image"
              width={300}
              height={300}
            />
            <div className="flex-1">
              <div className="mb-4 flex flex-col items-center justify-between gap-3 lg:flex-row">
                <div>
                  <div className="flex flex-col items-center gap-3 lg:flex-row">
                    <h1 className="max-w-[400px] text-lg font-bold">
                      {job.company?.name}
                    </h1>
                    {/* {Seeker?.isVerified && (
                    <span className="rounded-full bg-primary px-2 py-1 text-xs capitalize text-white">
                      {Seeker.type}
                    </span>
                  )} */}
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {job.country?.name}
                    </span>
                  </div>
                </div>
                <div className="flex h-full items-start justify-end gap-3">
                  <Link
                    className="flex w-fit items-center gap-1 rounded-lg border bg-white p-3 text-sm"
                    href={"#"}
                  >
                    <SquarePen size={12} />
                    Edit
                  </Link>
                  <Link
                    className="flex w-fit items-center gap-1 rounded-lg border bg-white p-3 text-sm"
                    href={`/admin/students/profile/${job.id}`}
                  >
                    <Eye size={12} />
                    View Applicants
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-5 sm:flex-row">
                {/* location info  */}
                {job.country && (
                  <div className="flex flex-col text-center md:text-start">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-semibold text-main">
                      {job.city}
                    </span>
                  </div>
                )}

                {job.jobIndustry && (
                  <div className="flex flex-col text-center md:text-start">
                    <span className="text-sm text-muted-foreground">Industry</span>
                    <span className="text-sm font-semibold text-main">
                      {job.jobIndustry}
                    </span>
                  </div>
                )}
                {job.jobCategory && (
                  <div className="flex flex-col text-center md:text-start">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-semibold text-main">
                      {job.jobCategory}
                    </span>
                  </div>
                )}
                {job.created_at && (
                  <div className="flex flex-col text-center md:text-start">
                    <span className="text-sm text-muted-foreground">
                      Submission Date
                    </span>
                    <span className="text-sm font-semibold text-main">
                      {new Date(job.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          {/* job overview */}
          {activeTab === "over-view" && (
            <div>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-soft">
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#F3E8FF] text-[#AD46FF]">
                    <Eye size={20} />
                  </div>
                  <div>
                    <span className="block text-sm">Total Job Views</span>
                    <h1 className="font-bold">%75</h1>
                    <span className="block text-xs text-primary">
                      +15% from last month
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-soft">
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#E4F8FFE5] text-[#55BEE6]">
                    <UsersRound size={20} />
                  </div>
                  <div>
                    <span className="block text-sm">Total Applicants</span>
                    <h1 className="font-bold">1,245</h1>
                    <span className="block text-xs text-primary">
                      +12% from last month
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-10">
                <div className="col-span-1 rounded-xl border bg-white p-4 shadow-soft lg:col-span-6">
                  <ApplicationsCharts />
                </div>
                <div className="col-span-1 overflow-hidden rounded-xl border bg-white shadow-soft lg:col-span-4">
                  <div className="mb-3 flex justify-between gap-8 p-3">
                    <Typography>
                      Top Countries
                      <span className="ml-1 text-xs text-muted-foreground">
                        (Revenue)
                      </span>
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
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <h2 className="text-xl font-semibold">
                    Total Job Applications
                  </h2>
                </div>

                <DataTable
                  data={applications?.data || []}
                  total={applications?.total}
                  columns={columns}
                  searchQuery={filters.searchQuery}
                  selected={selectedItems}
                  setSelected={setSelectedItems}
                  cellClassName="p-2 text-sm"
                  headerClassName="p-2 text-sm"
                  isSelectable
                  columnManager={true}
                  noDataMessage={{
                    title: "No applications found",
                    description: "Try adjusting your filters",
                    action: {
                      label: "Clear Filters",
                      href: "#",
                    },
                  }}
                  exportOptions={[
                    { label: "PDF", action: () => console.log("Exporting") },
                    { label: "CSV", action: () => console.log("Exporting") },
                  ]}
                  options={[
                    {
                      label: "View Profile",
                      action: () => console.log("viewed profile"),
                      icon: <Eye size={15} />,
                    },
                  ]}
                  actionOptions={[
                    {
                      label: "View Profile",
                      action: () => console.log("viewed profile"),
                      icon: <Eye size={15} />,
                    },
                  ]}
                />
              </div>
            </div>
          )}
          {/* applicant list Panel */}
          {activeTab === "applications-list" && (
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h2 className="text-xl font-semibold">
                  Total Job Applications
                </h2>
              </div>

              <DataTable
                data={applications?.data || []}
                total={applications?.total}
                columns={columns}
                searchQuery={filters.searchQuery}
                selected={selectedItems}
                setSelected={setSelectedItems}
                cellClassName="p-2 text-sm"
                headerClassName="p-2 text-sm"
                isSelectable
                columnManager={true}
                noDataMessage={{
                  title: "No applications found",
                  description: "Try adjusting your filters",
                  action: {
                    label: "Clear Filters",
                    href: "#",
                  },
                }}
                exportOptions={[
                  { label: "PDF", action: () => console.log("Exporting") },
                  { label: "CSV", action: () => console.log("Exporting") },
                ]}
                options={[
                  {
                    label: "View Profile",
                    action: () => console.log("viewed profile"),
                    icon: <Eye size={15} />,
                  },
                ]}
                actionOptions={[
                  {
                    label: "View Profile",
                    action: () => console.log("viewed profile"),
                    icon: <Eye size={15} />,
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SingleJobOverview;
