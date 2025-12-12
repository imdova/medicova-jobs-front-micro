"use client";

import { useCompanyData } from "@/hooks/useCompanyData";
import Loading from "@/components/loading/loading";
import Header from "./Header";
import About from "./About";
import JobsList from "./JobsList";
import CompletenessCard from "./CompletenessCard";
import PublicUrLChanger from "./PublicUrLChanger";
import PostFirstJobCard from "./PostFirstJobCard";
import SocialMediaCard from "./SocialMediaCard";

const CompanyPrivatePage = ({ companyId }: { companyId: string }) => {
  const { company, loading } = useCompanyData(companyId);
  if (loading) return <Loading />;
  if (!company) return null;
  return (
    <div className="w-full px-4 md:px-5">
      <div className="flex gap-5">
        {/* Left + Center Sections */}
        <div className="flex-1 space-y-2">
          {/* Header Section */}
          <Header company={company} />
          {/* Left Section */}
          <About company={company} />
          <JobsList companyId={company.id} />
        </div>
        {/* Right Sections */}
        <div className="hidden min-w-80 max-w-80 space-y-2 md:block">
          {/* Public Profile Section */}
          <CompletenessCard
            percentage={company?.completencePercent || 0}
            title=" Complete your company profile!"
            description="You are almost there—let's finish setting things up!"
            url="/employer/company-info"
          />
          <PublicUrLChanger company={company} />
          <PostFirstJobCard company={company} />
          <SocialMediaCard company={company} />
        </div>
      </div>
    </div>
  );
};

export default CompanyPrivatePage;
