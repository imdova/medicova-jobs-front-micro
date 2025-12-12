"use client";
import { notFound } from "next/navigation";
import JobApplicantsResult from "./jobApplicants";
import { filterSections } from "@/constants";
import CustomPagination from "@/components/UI/CustomPagination";
import Filter from "@/components/Layout/filter/filter";
import useFetch from "@/hooks/useFetch";
import { toQueryString } from "@/util/general";
import { API_GET_JOB_APPLICATIONS } from "@/api/employer";
import Loading from "@/components/loading/loading";
import { ApplicationsType } from "@/types/seeker";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const query = toQueryString({ jobId: id });
  const { data, loading, error } = useFetch<
    PaginatedResponse<ApplicationsType>
  >(query ? API_GET_JOB_APPLICATIONS + query : null, {
    defaultLoading: true,
  });
  if (loading) return <Loading />;
  if (error) return notFound();
  const { data: applications, total } = data || { data: [], total: 0 };
  return (
    <div className="flex min-h-screen w-full px-2">
      {/* Left Column: Filter Section */}
      <Filter sections={filterSections} />
      {/* Right Column: Job Applicants */}
      <JobApplicantsResult applications={applications} />
      {total > 0 && total > applications.length && (
        <CustomPagination totalItems={total} />
      )}
    </div>
  );
};

export default Page;
