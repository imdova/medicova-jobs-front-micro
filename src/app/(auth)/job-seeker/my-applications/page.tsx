import HeaderSection from "./components/HeaderSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { Button, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import SearchInput from "@/components/UI/search-Input";
import { CheckCircle, Eye, SearchIcon, Star } from "lucide-react";
import ApplicationsResult from "./components/applicationsResult";
import ApplicationsFilter from "./components/ApplicationsFilter";
import { updateSearchParams } from "@/util/general";
import {
  getApplications,
  getApplicationStatusCount,
} from "@/lib/actions/applications.actions";
import { notFound } from "next/navigation";
import { KeyboardReturn } from "@mui/icons-material";
import { ApplicationStatus } from "@/constants/enums/application-status.enum";

const tabs: {
  type: ApplicationStatus;
  icon: React.ReactNode;
}[] = [
  {
    type: ApplicationStatus.REVIEW,
    icon: <Eye className="h-4 w-4 text-blue-500" />,
  },
  {
    type: ApplicationStatus.VIEWED,
    icon: <CheckCircle className="h-4 w-4 text-indigo-500" />,
  },
  {
    type: ApplicationStatus.SHORTLISTED,
    icon: <Star className="h-4 w-4 text-yellow-500" />,
  },
  {
    type: ApplicationStatus.WITHDRAWN,
    icon: <KeyboardReturn className="h-4 w-4 text-amber-600" />,
  },
];

const page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const activeTab = (searchParams?.tab as ApplicationStatus) || null;
  const query = (searchParams?.q as string) || "";
  const startDate = (searchParams?.startDate as string) || null;
  const endDate = (searchParams?.endDate as string) || null;

  const page = parseInt(String(searchParams?.page || 1));
  const limit = parseInt(String(searchParams?.limit || 10));
  const data = await getServerSession(authOptions);
  const user = data?.user;

  if (!user?.id) return notFound();

  const { data: applicationsData, success: applicantsSuccess } =
    await getApplications({
      seekerId: user?.id,
      page,
      limit,
      startDate,
      status: activeTab,
    });
  const { data: applications, total } = applicationsData || {
    data: [],
    total: 0,
  };

  const applicationStatusCounter = await getApplicationStatusCount(user?.id);
  const sumApplicationStatus = (statusCounter: Record<string, number>) => {
    return Object.values(statusCounter).reduce((sum, count) => sum + count, 0);
  };

  const allApplications = sumApplicationStatus(
    applicationStatusCounter?.data || {},
  );

  return (
    <div className="space-y-4 px-4 md:px-5">
      <HeaderSection />
      <div className="flex items-center justify-between">
        <h6 className="text-xl font-medium">Applications History</h6>
        <div className="flex w-full gap-2 md:w-auto">
          <SearchInput
            isBounce={true}
            variant="outlined"
            placeholder="Search your job by title"
            InputProps={{
              endAdornment: <SearchIcon className="text-muted-foreground" />,
            }}
          />
          <ApplicationsFilter />
        </div>
      </div>
      {/* <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5"> */}

      <div className="body-container m-0 overflow-hidden rounded-base border border-gray-200 bg-white shadow-soft">
        <Tabs
          value={activeTab || "all"}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons={false}
          className="text-base"
        >
          <Tab
            LinkComponent={Link}
            href={updateSearchParams("tab", "", searchParams)}
            value={"all"}
            label={
              <div className="flex items-center gap-2">
                <span className="text-sm">all ({allApplications})</span>
              </div>
            }
          />
          {tabs.map((tab) => (
            <Tab
              key={tab.type}
              LinkComponent={Link}
              href={updateSearchParams("tab", tab.type, searchParams)}
              value={tab.type}
              label={
                <div className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span className="text-sm">
                    {tab.type} ({applicationStatusCounter?.data?.[tab.type]})
                  </span>
                </div>
              }
            />
          ))}
        </Tabs>
      </div>
      <ApplicationsResult applications={applications} />
      {applications.length === 0 && !activeTab ? (
        <div className="flex min-h-64 w-full flex-col items-center justify-center gap-2 p-5">
          <h3 className="text-center text-xl font-semibold text-muted-foreground">
            No applications found
          </h3>
          <p className="text-center text-sm text-muted-foreground">
            You have not applied to any jobs yet.
          </p>
          <Button LinkComponent={Link} href="/search" variant="contained">
            Find Jobs
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default page;
