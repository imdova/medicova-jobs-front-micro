import { cn } from "@/util";
import { CircularProgress } from "@mui/material";

const Loading: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex h-[calc(100dvh-126px)] items-center justify-center", className)}>
      <CircularProgress />
      <h6 className="ml-4">Loading...</h6>
    </div>
  );
};

export const IconSkeleton = () => {
  return <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300"></div>;
};

export default Loading;
