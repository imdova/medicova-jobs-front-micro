import { getJobsByCompanyId } from "@/lib/actions/job.actions";
import JobsClampedList from "./JobsClampedList";

const CompanyPublicJobList = async ({ companyId }: { companyId: string }) => {
  const { success, data } = await getJobsByCompanyId(companyId);

  if (!success) {
    return null;
  }
  const { data: jobs, total } = data || { data: [], total: 0 };
  const filteredJobs = jobs.filter((job) => job.draft === false);
  return (
    <div>
      {filteredJobs.length > 0 ? (
        <JobsClampedList
          className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2"
          data={filteredJobs}
        />
      ) : (
        <div className="flex min-h-24 items-center justify-center rounded-base border border-gray-200 bg-white p-5 shadow-lg">
          <p className="text-center text-sm text-gray-500">
            This company has no jobs yet
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyPublicJobList;
