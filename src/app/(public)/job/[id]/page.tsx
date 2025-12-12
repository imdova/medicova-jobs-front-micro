import { getJobById } from "@/lib/actions/job.actions";
import { notFound } from "next/navigation";
import JobDetailPage from "./jobDetailsPage";

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const result = await getJobById(id);
  const job = result.success && result.data;
  if (!job) return notFound();

  return <JobDetailPage job={job} />;
};

export default Page;
