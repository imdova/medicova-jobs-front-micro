import { getJobById } from "@/lib/actions/job.actions";
import { notFound } from "next/navigation";
import PostJobForm from "../../components/PostJobForm";
import {
  getEmploymentTypes,
  getIndustries,
} from "@/lib/actions/employer.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

/**
 * This page is used to edit a job
 * If the user is not the owner of the job, return 404
 * If the job is not found, return 404
 * If the job is found, render the PostJobForm with the job data
 * @param id the id of the job to edit
 * @param searchParams the search parameters (e.g. ?duplicate=true)
 * @returns the page component
 */
const page = async ({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const isDuplicated = searchParams?.duplicate === "true";
  const result = await getJobById(id);
  const job = result.success && result.data;
  if (!job) return notFound();

  const data = await getServerSession(authOptions);
  const user = data?.user;

  if (user?.companyId !== job.company?.id) return notFound();

  // Set default values for the job data
  // This is necessary because the job data is not always complete
  job.country = job.country || { code: "", name: "" };
  job.state = job.state || { code: "", name: "" };
  job.skills = job.skills || [];
  job.keywords = job.keywords || [];
  job.description = job.description || "<p></p>";
  job.requirements = job.requirements || "<p></p>";

  const industriesResult = await getIndustries();
  const industries = (industriesResult.success && industriesResult.data) || [];
  const employmentResult = await getEmploymentTypes();
  const employmentTypes =
    (employmentResult.success && employmentResult.data) || [];

  return (
    <div className="w-full px-4 md:px-5">
      <PostJobForm
        // If the user wants to duplicate the job, pass a new job with the same data
        job={isDuplicated ? { ...job, id: "" } : job}
        industries={industries}
        employmentTypes={employmentTypes}
      />
    </div>
  );
};

export default page;
