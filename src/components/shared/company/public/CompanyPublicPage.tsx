import { Suspense } from "react";
import { Company } from "@/types";
import JobCardSkeleton from "@/components/loading/skeleton-job-card";
import CompanyPublicJobList from "./CompanyPublicJobList";
import CompanyPublicAbout from "./CompanyPublicAbout";
import CompanyPublicHeader from "./CompanyPublicHeader";
import CompanyPublicSocial from "./CompanyPublicSocial";

const CompanyPublicPage: React.FC<{ company: Company }> = ({ company }) => {
  return (
    <div className="w-full px-4 md:px-5">
      <div className="flex gap-5">
        {/* Left + Center Sections */}
        <div className="flex-1 space-y-2">
          {/* Header Section */}
          <CompanyPublicHeader company={company} />
          {/* Left Section */}
          <CompanyPublicAbout company={company} />
          {/* Center Section + Profile Form */}
          <div className="flex items-center justify-between rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
            <h3 className="text-xl font-semibold text-main">Latest jobs:</h3>
          </div>
          {/* Loop through MinJobCard 8 times */}
          <Suspense
            fallback={
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                <JobCardSkeleton />
              </div>
            }
          >
            <CompanyPublicJobList companyId={company.id} />
          </Suspense>
        </div>
        {/* Right Sections */}
        <div className="hidden min-w-80 max-w-80 space-y-2 md:block">
          <CompanyPublicSocial company={company} />
        </div>
      </div>
    </div>
  );
};

export default CompanyPublicPage;
