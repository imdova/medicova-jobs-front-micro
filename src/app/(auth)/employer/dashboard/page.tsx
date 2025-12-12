"use client";
import { Button, Tab, Tabs } from "@mui/material";
import { Add } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";
import { notFound } from "next/navigation";
import { formatLocation, getOptionLabel } from "@/util/general";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading/loading";
import useFetch from "@/hooks/useFetch";
import {
  API_GET_COMPANY_BY_ID,
  API_GET_JOB_APPLICATIONS,
} from "@/api/employer";
import { Company, JobData } from "@/types";
import {
  DollarSign,
  Eye,
  LayoutList,
  SquarePen,
  User as UserIcon,
  UsersRound,
} from "lucide-react";
import Avatar from "@/components/UI/Avatar";
import InfoBlock from "@/components/UI/info-block";
import { companySizeOptions } from "@/constants";
import StatCard from "@/components/UI/statCard";
import SingleEmployersChart from "@/components/charts/single-employer-charts";
import DataTable from "@/components/UI/data-table";
import JobList from "@/components/admin/lists/JobList";
import ApplicationList from "@/components/admin/lists/ApplicationList";
import { ApplicationsType } from "@/types/seeker";
import { useCompanyData } from "@/hooks/useCompanyData";
import JobsList from "@/components/shared/company/private/JobsList";

const INITIAL_DURATIONS = 29;

const cards = [
  {
    icon: <UsersRound size={20} />,
    title: "Total Jobs",
    value: "1,245",
    change: "+12% from last month",
    bg: "bg-[#E4F8FFE5]",
    text: "text-[#55BEE6]",
  },
  {
    icon: <UsersRound size={20} />,
    title: "Total Applicants",
    value: "1,245",
    change: "+12% from last month",
    bg: "bg-[#E4F8FFE5]",
    text: "text-[#55BEE6]",
  },
  {
    icon: <DollarSign size={20} />,
    title: "Total Purchase",
    value: "450",
    change: "+8% from last month",
    bg: "bg-[#DCFCE7]",
    text: "text-[#008236]",
  },
];

type Tab =
  | "employer-overview"
  | "job-list"
  | "applicant-list"
  | "user-activity";

const tabs: { key: Tab; title: string; icon?: React.ReactNode }[] = [
  {
    key: "employer-overview",
    title: "Employer Overview",
    icon: <UserIcon className="h-4 w-4" />,
  },
  {
    key: "job-list",
    title: "Job List",
    icon: <LayoutList className="h-4 w-4" />,
  },
  {
    key: "applicant-list",
    title: "Applicant List",
    icon: <UsersRound className="h-4 w-4" />,
  },
];

const Page = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      return notFound();
    },
  });
  const user = session?.user;
  const { company, loading } = useCompanyData(user?.companyId);
  const { data: result } = useFetch<PaginatedResponse<ApplicationsType>>(
    company?.id ? `${API_GET_JOB_APPLICATIONS}?companyId=${company?.id}` : null,
  );
  const { data: applicants, total } = result || { data: [], total: 0 };
  const [activeTab, setActiveTab] = useState("employer-overview");

  if (status === "loading" || loading) {
    return <Loading />;
  }
  if (!company) return notFound();

  const location = formatLocation(company);
  return (
    <div className="w-full space-y-3 px-4 md:px-5">
      {/* Tab Buttons */}
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
          // onClick={() => setModalOpen(true)}
          LinkComponent={Link}
          href={"/employer/job/posted"}
          variant="contained"
          className="h-auto px-8"
          startIcon={<Add className="h-6 w-6" />}
        >
          <span className="text-nowrap text-xs">Post Job Now</span>
        </Button>
      </div>

      <div className="card p-4">
        <div className="relative flex justify-between">
          <div className="flex w-full flex-col items-center gap-6 lg:flex-row">
            <Avatar src={company.avatar} size={120} alt={company.name} />
            <div className="flex-1">
              {/* Header Section */}
              <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Company Name */}
                <div>
                  <h2 className="max-w-[400px] text-center text-lg font-bold text-main lg:text-start">
                    {company.name}
                  </h2>
                  <h6 className="text-sm">{company.title}</h6>
                </div>
                <InfoBlock
                  label="Company Admin"
                  value={
                    <div className="flex flex-col gap-1">
                      <h6 className="line-clamp-1 w-fit cursor-pointer text-sm underline hover:text-primary hover:no-underline">
                        Alice Johnson
                      </h6>
                      <div className="flex items-center gap-2 text-xs text-main">
                        <a
                          href="mailto:alice@example.com"
                          className="w-fit text-xs underline hover:text-primary"
                        >
                          alice@example.com
                        </a>
                        <a
                          href="tel:+1234567890"
                          className="w-fit text-xs underline hover:text-primary"
                        >
                          +1 (234) 567-890
                        </a>
                      </div>
                    </div>
                  }
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
                  <Link
                    href={`/employer/company-info`}
                    className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow-sm transition hover:border-primary hover:text-primary"
                  >
                    <SquarePen size={14} />
                    Edit
                  </Link>
                  <Link
                    href={`/co/${company.username}`}
                    className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow-sm transition hover:border-primary hover:text-primary"
                  >
                    <Eye size={14} />
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex flex-col gap-5 text-center sm:flex-row sm:justify-start sm:gap-8 sm:text-left">
                <InfoBlock label="Location" value={location} />

                <InfoBlock
                  label="Account Manager"
                  value={
                    <div>
                      <h6 className="line-clamp-1 w-fit cursor-pointer text-sm underline hover:text-primary hover:no-underline">
                        Alice Johnson
                      </h6>
                    </div>
                  }
                />

                {company.companyTypeId && (
                  <InfoBlock label="Type" value={company.companyTypeId} />
                )}
                {company.size && (
                  <InfoBlock
                    label="Company Size"
                    value={getOptionLabel(companySizeOptions, company.size)}
                  />
                )}

                {company.created_at && (
                  <InfoBlock
                    label="Date"
                    value={new Date(company.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === "employer-overview" && (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {cards.map((state, index) => (
              <StatCard key={index} {...state} />
            ))}
          </div>

          {/* Charts and Recent Jobs */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-10">
            <div className="col-span-1 h-full lg:col-span-6">
              <div className="h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
                <SingleEmployersChart />
              </div>
            </div>

            {/* Right Panel – Table */}
            <div className="col-span-1 card lg:col-span-4">
              <h2 className="border-b border-gray-200 p-4 text-lg font-semibold">
                Top Applicants
              </h2>

              <DataTable
                data={applicants}
                className="border-none shadow-none"
                noDataMessage={{
                  title: "No applicants found",
                  description: "Create more jobs to get applicants",
                }}
                columns={[
                  {
                    header: "Job Title",
                    render: (app: ApplicationsType) => (
                      <Link
                        className="line-clamp-2 text-sm transition hover:text-primary hover:underline"
                        href={`/employer/job/over-view/${app.job.id}`}
                      >
                        {app.job.title || "-"}
                      </Link>
                    ),
                  },
                  {
                    header: "Seeker",
                    render: (app: ApplicationsType) => (
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={app.applicant.avatar}
                          size={30}
                          alt={app.applicant.firstName}
                        />
                        <Link
                          className="line-clamp-2 text-sm transition hover:text-primary hover:underline"
                          href={`/me/${app.applicant.userName}`}
                        >
                          {`${app.applicant.firstName} ${app.applicant.lastName} ` ||
                            "-"}
                        </Link>
                      </div>
                    ),
                  },
                  {
                    key: "created_at",
                    header: "Date",
                    render: (app: ApplicationsType) => {
                      const formattedDate = new Date(
                        app.created_at,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <span className="line-clamp-1 min-w-24 text-sm">
                          {formattedDate || "-"}
                        </span>
                      );
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
                ]}
              />
            </div>
          </div>
          <JobsList companyId={company?.id} />
        </>
      )}

      {activeTab === "job-list" && (
        <JobList companyId={company?.id} isAdmin={false} />
      )}

      {activeTab === "applicant-list" && (
        <ApplicationList companyId={company?.id} />
      )}
    </div>
  );
};

export default Page;
