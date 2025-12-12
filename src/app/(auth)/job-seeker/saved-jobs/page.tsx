import CustomPagination from "@/components/UI/CustomPagination";
import { getAllJobs } from "@/lib/actions/job.actions";
import SavedJobsPage from "./savedJobs";

const page: React.FC = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const { q, page, limit } = params as {
    [key: string]: any;
  };
  const data = await getAllJobs({ q, page, limit });
  const { data: jobs, total } = data.data || { data: [], total: 0 };
  return (
    <main className="container mx-auto my-8 min-h-screen w-full p-2 px-2 md:px-6 md:pl-9 lg:max-w-[1170px]">
      <SavedJobsPage jobs={jobs} total={total} />
      {total > 0 && total > jobs.length && (
        <CustomPagination totalItems={total} />
      )}
    </main>
  );
};

export default page;
