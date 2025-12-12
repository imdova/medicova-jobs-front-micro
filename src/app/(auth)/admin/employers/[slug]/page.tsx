"use client";

import { API_GET_COMPANY_BY_USER_NAME } from "@/api/employer";
import NotFoundPage from "@/app/not-found";
import useFetch from "@/hooks/useFetch";
import { Company } from "@/types";
import {
  Eye,
  SquarePen,
  UsersRound,
  DollarSign,
  LayoutList,
  User,
  Activity,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Tabs, Tab, Button } from "@mui/material";
import SingleEmployersChart from "@/components/charts/single-employer-charts";
import Loading from "@/components/loading/loading";
import Avatar from "@/components/UI/Avatar";
import InfoBlock from "@/components/UI/info-block";
import StatCard from "@/components/UI/statCard";
import { companySizeOptions } from "@/constants";
import { getOptionLabel } from "@/util/general";
import { Add } from "@mui/icons-material";
import CompanyFormModal from "@/components/admin/forms/CompanyFormModal";
import JobList from "@/components/admin/lists/JobList";
import ApplicationList from "@/components/admin/lists/ApplicationList";
import { activitiesDummyData } from "@/constants/admin/dummyActivities";
import TopApplicants from "@/components/admin/overviews/topApplicants";
import DropMenu from "@/components/UI/drop-down";
import AssignPlan from "@/components/admin/forms/assignPlan";
import JobsList from "@/components/shared/company/private/JobsList";

interface SingleUserProps {
  params: {
    slug: string;
  };
}

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
  | "users"
  | "user-activity";

const tabs: { key: Tab; title: string; icon?: React.ReactNode }[] = [
  {
    key: "employer-overview",
    title: "Employer Overview",
    icon: <User className="h-4 w-4" />,
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
  {
    key: "users",
    title: "Company Users",
    icon: <UsersRound className="h-4 w-4" />,
  },
  {
    key: "user-activity",
    title: "User Activity",
    icon: <Activity className="h-4 w-4" />,
  },
];
// TODO: add company users
const SingleEmployerPage = ({ params }: SingleUserProps) => {
  const slug = params.slug;
  const {
    data: company,
    loading,
    setData,
  } = useFetch<Company>(API_GET_COMPANY_BY_USER_NAME + slug, {
    defaultLoading: true,
  });
  const [activeTab, setActiveTab] = useState("employer-overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  if (loading) return <Loading />;

  if (!company) return <NotFoundPage />;

  return (
    <div className="my-8 w-full space-y-3 px-4 md:px-5">
      {/* Tab Buttons */}
      <Link href="/admin/employers" className="group flex items-center">
        <ArrowLeft className="mr-2 h-8 w-8 rounded-full bg-gray-200 p-2 transition-transform duration-300 group-hover:-translate-x-2 group-hover:bg-primary group-hover:text-white" />
        <span className="group-hover:underline">Back To All Employers</span>
      </Link>
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
          variant="contained"
          className="max-h-[45px]"
          startIcon={<Add className="h-5 w-5" />}
        >
          <span className="text-nowrap text-xs">Post Job Now</span>
        </Button>
      </div>

      <div className="rounded-base border bg-white p-4 shadow-soft">
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
                      <h6 className="line-clamp-1 cursor-pointer text-sm underline hover:text-primary hover:no-underline">
                        Alice Johnson
                      </h6>
                      <div className="flex items-center gap-2 text-xs text-main">
                        <a
                          href="mailto:alice@example.com"
                          className="text-xs underline hover:text-primary"
                        >
                          alice@example.com
                        </a>
                        <a
                          href="tel:+1234567890"
                          className="text-xs underline hover:text-primary"
                        >
                          +1 (234) 567-890
                        </a>
                      </div>
                    </div>
                  }
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <SquarePen size={14} />
                    Edit
                  </button>
                  <div className="flex">
                    <Link
                      href={`/co/${company.username}`}
                      className="flex items-center gap-2 rounded-lg rounded-r-none border bg-white px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye size={14} />
                      View Profile
                    </Link>
                    <DropMenu
                      className="block min-w-0 rounded-lg rounded-l-none border border-gray-200 border-l-transparent p-2 hover:border-primary hover:bg-primary/10 hover:text-primary"
                      options={[
                        {
                          label: "Assign Plan",
                          action: () => {
                            setIsPlanOpen(true);
                          },
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Modal */}
                <CompanyFormModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  company={company as Company}
                  onSuccess={setData}
                />
                <AssignPlan
                  employerId={company.id}
                  open={isPlanOpen}
                  onClose={() => setIsPlanOpen(false)}
                />
              </div>

              {/* Info Section */}
              <div className="flex flex-col gap-5 text-center sm:flex-row sm:justify-start sm:gap-8 sm:text-left">
                {company.city && (
                  <InfoBlock label="Location" value={company.city} />
                )}

                <InfoBlock
                  label="Account Manager"
                  value={
                    <div>
                      <h6 className="line-clamp-1 cursor-pointer text-sm underline hover:no-underline">
                        Alice Johnson
                      </h6>
                    </div>
                  }
                />

                {company.companyTypeName && (
                  <InfoBlock label="Type" value={company.companyTypeName} />
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
            <TopApplicants companyId={company?.id} />
            {/* Right Panel – Table */}
          </div>
          <JobsList companyId={company?.id} />
        </>
      )}

      {activeTab === "job-list" && (
        <JobList companyId={company?.id} isAdmin={true} />
      )}

      {activeTab === "applicant-list" && (
        <ApplicationList companyId={company?.id} />
      )}
      {activeTab === "user-activity" && (
        <div className="rounded-lg border bg-white p-6">
          <h1 className="mb-6 text-xl font-bold text-gray-800">
            Recent User Activities
          </h1>

          <div className="space-y-8">
            {activitiesDummyData.map((activity, index) => (
              <div
                key={index}
                className="relative border-l-2 border-gray-200 pl-6"
              >
                {/* Date */}
                <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-green-500"></div>
                <h2 className="font-semibold text-gray-700">{activity.date}</h2>

                {/* Activities */}
                <div className="mt-2 space-y-4">
                  {activity.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="ml-4">
                      <p className="text-gray-600">{action.description}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        IP address {action.ipAddress}
                      </p>
                      {actionIndex === activity.actions.length - 1 && (
                        <p className="mt-2 text-sm text-gray-400">
                          {activity.time}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// const CompanyUsers

export default SingleEmployerPage;
