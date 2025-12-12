import { API_GET_JOBS } from "@/api/employer";
import MinJobCard from "@/components/UI/job-card-min";
import useFetch from "@/hooks/useFetch";
import { JobData } from "@/types";
import { filteredJobs } from "@/util/job/searchInJobs";
import Link from "next/link";

const RelatedJobs: React.FC<{ job: JobData }> = ({ job }) => {
  const { data: jobs, loading } =
    useFetch<PaginatedResponse<JobData>>(API_GET_JOBS);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="mt-4 bg-[url('/images/jobs-background.jpg')] bg-cover bg-center">
      <div className="bg-white/80 shadow-md">
        <div className="container mx-auto p-4 lg:max-w-[1170px]">
          <h2 className="my-6 text-center text-[45px] font-bold leading-none text-secondary md:text-[60px]">
            <span className="text-[45px] font-bold text-main md:text-[60px]">
              Related
            </span>{" "}
            Jobs
          </h2>
          <p className="mx-auto mb-8 max-w-[700px] text-center text-2xl text-muted-foreground"></p>

          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {/* card  */}
            {filteredJobs(jobs?.data || [], "active").map((job, i) => (
              <MinJobCard item={job} key={i} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/search"
              className="rounded-[8px] bg-primary px-6 py-3 font-semibold uppercase text-primary-foreground transition-colors duration-300 hover:bg-primary-foreground hover:text-primary focus:ring-2 focus:ring-white"
            >
              Explore All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedJobs;
