"use client";
import { Button, Tab, Tabs } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import JobCard from "@/components/UI/job-card";
import { JobsTabs } from "@/types";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchInput from "@/components/UI/search-Input";
import { filteredJobs, searchJobsByQuery } from "@/util/job/searchInJobs";
import { Add } from "@mui/icons-material";
import CustomPagination from "@/components/UI/CustomPagination";
import TimeRangePicker from "@/components/UI/TimeRangePicker.tsx";
import { filterItemsByDate } from "@/util/general";
import { Suspense, useState } from "react";
import Loading from "@/components/loading/loading";
import { useCompanyJobsData } from "@/hooks/useCompanyJobsData";

const tabs: JobsTabs[] = ["all", "active", "closed", "expired", "draft"];

const page = () => {
  return (
    <Suspense>
      <JobList />
    </Suspense>
  );
};

export default page;

const JobList = () => {
  const searchParams = useSearchParams();

  // stats
  const [activeTab, setActiveTab] = useState(0);

  // search params
  const startDate = searchParams?.get("startDate") || "";
  const endDate = searchParams?.get("endDate") || "";
  const query = searchParams?.get("q") || "";
  const page = parseInt(String(searchParams?.get("page") || 1));
  const limit = parseInt(String(searchParams?.get("limit") || 10));

  // fetch jobs
  const { jobs, loading, total } = useCompanyJobsData({ page, limit });

  const filteredJobsQuery = searchJobsByQuery(jobs, query);
  const filteredJobsDate = filterItemsByDate(
    filteredJobsQuery,
    startDate,
    endDate,
  );
  const tabJobs = filteredJobs(filteredJobsDate, tabs[activeTab]);

  if (loading) return <Loading />;
  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-3 flex items-center justify-between gap-3">
        {/* Search Input */}
        <SearchInput
          isBounce={true}
          variant="outlined"
          placeholder="Search your job by title"
          InputProps={{
            endAdornment: <SearchIcon className="text-muted-foreground" />,
          }}
          sx={{
            width: { xs: "100%", md: "40%" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
            },
          }}
        />

        {/* Filter Section */}
        <div className="flex gap-8">
          <TimeRangePicker />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-[calc(100vw-40px)]">
        <Tabs
          value={activeTab}
          onChange={(e, value) => setActiveTab(value)}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons={false}
          className="text-base"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className="text-nowrap"
              label={`${tab} (${filteredJobs(filteredJobsDate, tab).length})`}
            />
          ))}
        </Tabs>
      </div>
      <div className="flex flex-col gap-4 p-2">
        {total === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 p-5">
            <h3 className="text-center text-xl font-semibold text-muted-foreground">
              No jobs found
            </h3>
            <p className="text-center text-sm text-muted-foreground">
              You can create a new job by clicking the button below
            </p>
            <Button
              variant="contained"
              LinkComponent={Link}
              href="/employer/job/posted"
              color="primary"
              startIcon={<Add />}
            >
              Create a new job
            </Button>
          </div>
        )}
        {tabJobs.map((job) => (
          <JobCard key={job.id} job={job} isEdit={true} />
        ))}
      </div>
      {activeTab === 0 && jobs.length < total && (
        <CustomPagination totalItems={total} />
      )}
    </div>
  );
};
