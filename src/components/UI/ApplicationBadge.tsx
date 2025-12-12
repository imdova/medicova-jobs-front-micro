import { ApplicationStatus } from "@/constants/enums/application-status.enum";
import { cn } from "@/util";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Review: "bg-yellow-100 text-yellow-800",
  Viewed: "bg-blue-100 text-blue-800",
  Shortlisted: "bg-purple-100 text-purple-800",
  Interviewed: "bg-indigo-100 text-indigo-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Withdrawn: "bg-gray-200 text-gray-700",
};

const ApplicationBadge = ({ status }: { status: ApplicationStatus }) => {
  return (
    <span
      className={cn(
        "rounded-base px-3 py-2 text-sm",
        STATUS_COLORS[status] || "bg-gray-100 text-gray-500",
      )}
    >
      {status}
    </span>
  );
};

export default ApplicationBadge;
