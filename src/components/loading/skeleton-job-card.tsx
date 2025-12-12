const JobCardSkeleton = ({ className = "" }) => {
  return (
    <div
      className={`flex animate-pulse flex-col rounded-[10px] border border-gray-200 bg-white p-4 shadow-soft ${className}`}
    >
      <div className="my-1 mb-2 h-4 w-3/4 rounded bg-gray-200" />

      <div className="flex items-center gap-2">
        <div className="h-[45px] w-[45px] rounded-md bg-gray-200" />
        <div className="flex flex-wrap gap-2 text-muted-foreground">
          <div className="mb-1 mr-2 flex items-center gap-1">
            <div className="h-4 w-4 rounded bg-gray-200" />
            <div className="h-3 w-20 rounded bg-gray-200" />
          </div>
          <div className="mb-1 mr-2 flex items-center gap-1">
            <div className="h-4 w-4 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="mb-2 ml-[6px] mt-3 flex max-w-[500px] flex-wrap">
        <div className="mr-2 mt-2 h-3 w-32 rounded bg-gray-200" />
        <div className="mr-2 mt-2 h-3 w-28 rounded bg-gray-200" />
        <div className="mr-2 mt-2 h-3 w-24 rounded bg-gray-200" />
        <div className="mr-2 mt-2 h-5 w-36 rounded-full bg-gray-200" />
      </div>

      <div className="mb-1 mr-2 mt-2 flex items-center gap-1">
        <div className="h-4 w-4 rounded bg-gray-200" />
        <div className="h-3 w-24 rounded bg-gray-200" />
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-4 w-20 rounded bg-gray-200" />
      </div>
    </div>
  );
};

export default JobCardSkeleton;
