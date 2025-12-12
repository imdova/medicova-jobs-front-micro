"use client";

import {
  API_GET_COMPANIES,
  API_GET_COMPANY_BY_USER_NAME,
} from "@/api/employer";
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
import { Suspense, useState } from "react";
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
import { useAppSelector } from "@/store/hooks";
import AdminOverViewCard from "@/components/admin/ui/OverViewCard";
import AdminUserDrawer from "../addAdminUser";
import EmployerList from "@/components/admin/lists/EmployerList";

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

type Tab = "overview" | "companies" | "users" | "job-list" | "activity";

const tabs: { key: Tab; title: string; icon?: React.ReactNode }[] = [
  {
    key: "overview",
    title: "Overview",
    icon: <User className="h-4 w-4" />,
  },
  {
    key: "companies",
    title: "Companies",
    icon: <UsersRound className="h-4 w-4" />,
  },
  {
    key: "users",
    title: "Users",
    icon: <UsersRound className="h-4 w-4" />,
  },
  {
    key: "job-list",
    title: "Job List",
    icon: <LayoutList className="h-4 w-4" />,
  },

  {
    key: "activity",
    title: "Activity",
    icon: <Activity className="h-4 w-4" />,
  },
];
// TODO: add company users
const AdminOverViewPage = ({ params: { id } }: { params: { id: string } }) => {
  const { data: admins } = useAppSelector((state) => state.admins);
  const admin = admins.find((x) => x.id === id);
  const adminSuperVisor = admins.find((x) => x.adminIds?.includes(id));
  const { data: companies } = useFetch<PaginatedResponse<Company>>(
    API_GET_COMPANIES + "?limit=1000",
  );

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (!admin) return <Loading />;

  return (
    <div className="my-8 w-full space-y-3 px-4 md:px-5">
      {/* Tab Buttons */}
      <AdminUserDrawer />
      <Link href="/admin/employees" className="group flex w-fit items-center">
        <ArrowLeft className="mr-2 h-8 w-8 rounded-full bg-gray-200 p-2 transition-transform duration-300 group-hover:-translate-x-2 group-hover:bg-primary group-hover:text-white" />
        <span className="group-hover:underline">Back To Medicova Team</span>
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

      <AdminOverViewCard
        admins={admins}
        admin={admin}
        superVisor={adminSuperVisor}
        companies={companies?.data}
      />

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {cards.map((state, index) => (
              <StatCard key={index} {...state} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-10">
            <div className="col-span-1 h-full lg:col-span-6">
              <div className="h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
                <SingleEmployersChart />
              </div>
            </div>
            <TopApplicants companyId={admin.companyIds?.[0]} />
          </div>
          {admin.companyIds && <JobsList companyId={admin.companyIds?.[0]} />}
        </>
      )}

      {activeTab === "job-list" && admin.companyIds && (
        <JobList companyId={admin.companyIds[0]} isAdmin={true} />
      )}
      {activeTab === "companies" && admin.companyIds && (
        <Suspense>
          <EmployerList companyIds={admin.companyIds} />
        </Suspense>
      )}

      {activeTab === "activity" && (
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

export default AdminOverViewPage;
