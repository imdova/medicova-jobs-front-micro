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
import JobOverview from "@/components/UI/JobOverview";
import InfoBlock from "@/components/UI/info-block";
import {
  educationOptions,
  genderOptions,
  jobWorkPlaceOptions,
} from "@/constants/job";
import { formatExperienceRange, formatLocation } from "@/util/general";
import { FemaleOutlined, MaleOutlined } from "@mui/icons-material";
import { Gender } from "@/constants/enums/gender.enum";
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

  const workPlace =
    jobWorkPlaceOptions.find((x) => x.id === job.jobWorkPlace)?.label || "";
  const gender = genderOptions.find((x) => x.id === job.gender)?.label || "";
  const education =
    educationOptions.find((x) => x.id === job.educationLevel)?.label || "";

  const location = formatLocation(job);
  const expRang = formatExperienceRange(job);
  return (
    <div className="space-y-3 px-4">
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
        <div className="flex justify-between">
          <h1 className="mb-4 text-2xl font-bold">{job.title}</h1>
          <div className="flex h-full items-start justify-end gap-3">
            <Link
              className="flex w-fit items-center gap-1 rounded-lg border bg-white p-3 text-sm"
              href={`/employer/job/posted/${job.id}`}
            >
              <SquarePen size={12} />
              Edit
            </Link>
            <Link
              className="flex w-fit items-center gap-1 rounded-lg border bg-white p-3 text-sm"
              href={`/employer/job/manage-jobs/${job.id}`}
            >
              <Eye size={12} />
              View Applicants
            </Link>
          </div>
        </div>
        <div className="relative flex justify-between">
          {/* Student Details */}
          <div className="flex w-full flex-col items-center gap-6 lg:flex-row">
            <Image
              className="h-[120px] w-[120px] rounded-full border object-cover"
              src={job.company?.avatar ?? "/images/avatar-placeholder.png"}
              alt="Seeker image"
              width={300}
              height={300}
            />
            <div className="space-y-4">
              <div>
                <h1 className="max-w-[400px] text-lg font-bold">
                  {job.company?.name}
                </h1>
                <span className="text-sm text-muted-foreground">{location}</span>
              </div>
              <div className="flex flex-col gap-5 sm:flex-row">
                {/* location info  */}
                <InfoBlock
                  label="Career Level"
                  value={
                    <div>
                      <h6 className="line-clamp-1 text-sm">
                        {job.jobCareerLevel}
                      </h6>
                    </div>
                  }
                />
                <InfoBlock
                  label="Job Type"
                  value={
                    <div>
                      <h6 className="line-clamp-1 text-sm">
                        {job.jobEmploymentType ? job.jobEmploymentType : ""}{" "}
                        {workPlace ? `| ${workPlace}` : ""}
                      </h6>
                    </div>
                  }
                />
                <InfoBlock
                  label="Category"
                  value={
                    <div>
                      <h6 className="line-clamp-1 text-sm">
                        {job.jobCategory}
                      </h6>
                    </div>
                  }
                />
                <InfoBlock
                  label="Specialty"
                  value={
                    <div>
                      <h6 className="line-clamp-1 text-sm">
                        {job.jobSpeciality}
                      </h6>
                    </div>
                  }
                />
                <InfoBlock
                  label="Experience"
                  value={
                    <div>
                      <h6 className="line-clamp-1 text-sm">{expRang}</h6>
                    </div>
                  }
                />
                <InfoBlock
                  label="Degree"
                  value={
                    <div>
                      <h6 className="line-clamp-1 text-sm">{education}</h6>
                    </div>
                  }
                />
                <InfoBlock
                  label="Offered Salary"
                  value={
                    <div>
                      <h6 className="line-clamp-1 text-sm">
                        ${job.salaryRangeStart}-${job.salaryRangeEnd}{" "}
                      </h6>
                    </div>
                  }
                />
                <InfoBlock
                  label="Required Age"
                  value={
                    <div>
                      <h6 className="line-clamp-1 text-sm">
                        ({job.minAge}-{job.maxAge}) Years{" "}
                      </h6>
                    </div>
                  }
                />
                <InfoBlock
                  label="Gender"
                  value={
                    <div className="flex">
                      {job.gender === Gender.MALE ? (
                        <MaleOutlined
                          fontSize="small"
                          className="text-primary"
                        />
                      ) : (
                        <FemaleOutlined
                          fontSize="small"
                          className="text-primary"
                        />
                      )}
                      <h6 className="line-clamp-1 text-sm">{gender}</h6>
                    </div>
                  }
                />
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
              {/* <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-10">
                <div className="col-span-1 rounded-xl border bg-white p-4 shadow-soft lg:col-span-7">
                  <ApplicationsCharts />
                </div>
                <JobOverview
                  data={job}
                  className="col-span-1 lg:col-span-3 block rounded-base border border-gray-200 shadow-soft bg-green-50 p-4"
                />
              </div> */}
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
