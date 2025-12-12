import { API_GET_JOB_APPLICATIONS } from "@/api/employer";
import ApplicationBadge from "@/components/UI/ApplicationBadge";
import Avatar from "@/components/UI/Avatar";
import DataTable from "@/components/UI/data-table";
import useFetch from "@/hooks/useFetch";
import { ApplicationsType } from "@/types/seeker";
import { toQueryString } from "@/util/general";
import Link from "next/link";

interface TopApplicantsProps {
  seekerId?: string;
  companyId?: string;
  jobId?: string;
}

const TopApplicants: React.FC<TopApplicantsProps> = ({
  seekerId,
  companyId,
  jobId,
}) => {
  const query = toQueryString({ seekerId, companyId, jobId });
  const { data: applications, loading } = useFetch<
    PaginatedResponse<ApplicationsType>
  >(query ? API_GET_JOB_APPLICATIONS + query : API_GET_JOB_APPLICATIONS);

  return (
    <div className="col-span-1 rounded-base border bg-white shadow-soft lg:col-span-4">
      <h2 className="border-b border-gray-200 p-4 text-lg font-semibold">
        Top Applicants
      </h2>
      <DataTable
        data={applications?.data || []}
        loading={loading}
        expectedLength={8}
        className="border-none shadow-none"
        columns={[
          {
            header: "Job Title",
            render: (app) => (
              <Link
                className="line-clamp-2 text-sm transition hover:text-primary hover:underline"
                href={`/admin/jobs/${app.job.id}`}
              >
                {app.job.title || "-"}
              </Link>
            ),
          },
          {
            header: "Seeker",
            render: (app) => (
              <div className="flex items-center gap-2">
                <Avatar
                  src={app.applicant.avatar}
                  size={30}
                  alt={app.applicant.firstName}
                />
                <Link
                  className="line-clamp-2 text-sm transition hover:text-primary hover:underline"
                  href={`/admin/seekers/${app.applicant.userName}`}
                >
                  {`${app.applicant.firstName} ${app.applicant.lastName} ` ||
                    "-"}
                </Link>
              </div>
            ),
          },
          {
            key: "created_at",
            header: "Date",
            render: (app) => {
              const formattedDate = new Date(app.created_at).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              );

              return (
                <span className="line-clamp-1 min-w-24 text-sm">
                  {formattedDate || "-"}
                </span>
              );
            },
          },
          {
            key: "status",
            header: "Status",
            render: (app) => <ApplicationBadge status={app.status} />,
          },
        ]}
      />
    </div>
  );
};

export default TopApplicants;
