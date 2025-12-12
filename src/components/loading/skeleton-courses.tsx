const CourseSkeleton = () => {
  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">Courses and Certificates</h3>
        <div className="h-[37px] w-[37px] animate-pulse rounded bg-gray-200"></div>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2">
        <div className="flex items-start gap-3 rounded-base border p-2">
          <div className="h-[50px] w-[50px] animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h6 className="w-full animate-pulse bg-gray-200 font-semibold text-transparent">
                name
              </h6>
            </div>
            <p className="w-fit animate-pulse bg-gray-200 text-sm text-transparent"> 
              title
            </p>
            <p className="w-fit animate-pulse bg-gray-200 text-sm text-transparent">
              <span>Jan 2020 - Dec 2021</span>
            </p>
            <div className="flex text-sm text-muted-foreground">
              <p className="w-fit animate-pulse bg-gray-200 text-sm text-transparent">
                location
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSkeleton;
