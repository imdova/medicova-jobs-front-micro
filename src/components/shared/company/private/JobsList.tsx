"use client";
import React, { useState } from "react";
import { Add } from "@mui/icons-material";
import JobCardSkeleton from "@/components/loading/skeleton-job-card";
import Guard from "@/components/auth/Guard";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import { Button, IconButton, Tooltip } from "@mui/material";
import JobsClampedList from "../public/JobsClampedList";
import QuickPostJobModal from "./QuickPostJobModal";
import { useCompanyJobsData } from "@/hooks/useCompanyJobsData";

const JobsList = ({ companyId }: { companyId: string }) => {
  const { jobs, loading } = useCompanyJobsData({ companyId });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onOpen = () => setIsModalOpen(true);
  const onClose = () => setIsModalOpen(false);
  return (
    <React.Fragment>
      <QuickPostJobModal
        key={"body-post-job"}
        companyId={companyId}
        isOpen={isModalOpen}
        onClose={onClose}
      />

      {/* Title */}
      <div className="flex items-center justify-between rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
        <h3 className="text-xl font-semibold text-main">Latest jobs:</h3>
        <Guard permissions={[Permission_Keys.Employer_ManageJobs]}>
          <Tooltip title="Create Job Now">
            <IconButton
              className="rounded border border-solid border-gray-200 p-2"
              onClick={onOpen}
            >
              <Add />
            </IconButton>
          </Tooltip>
        </Guard>
      </div>
      {/* Loop through MinJobCard 8 times */}

      {loading ? (
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
          <JobCardSkeleton />
        </div>
      ) : (
        <div>
          {jobs.length > 0 ? (
            <JobsClampedList
              className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2"
              data={jobs}
            />
          ) : (
            <Guard permissions={[Permission_Keys.Employer_ManageJobs]}>
              <div className="flex flex-col items-center justify-center gap-4 rounded-base border border-gray-200 bg-white p-8 shadow-lg">
                <p className="text-center text-sm text-muted-foreground">
                  You haven&apos;t posted any jobs yet.
                  <br />
                  Post a job for free and start attracting candidates.
                </p>
                <Button onClick={onOpen} variant="contained">
                  Post a job for free
                </Button>
              </div>
            </Guard>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default JobsList;
