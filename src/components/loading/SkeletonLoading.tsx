const SkeletonLoading = () => {
  return (
    <div className="flex rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      {/* Title and Description */}
      <div className="flex-1">
        <h6 className="mb-2">
          <span className="w-fit animate-pulse bg-gray-200 text-2xl font-bold leading-normal text-transparent">
            Complete
          </span>
          <span className="w-fit animate-pulse bg-gray-200 text-2xl font-bold leading-normal text-transparent">
            your profile
          </span>
        </h6>

        <p>
          <span className="w-fit max-w-60 animate-pulse bg-gray-200 text-transparent">
            You are almost there
          </span>
          <span className="w-fit max-w-60 animate-pulse bg-gray-200 text-transparent">
            —let&lsquo;s finish
          </span>
          <span className="w-fit max-w-60 animate-pulse bg-gray-200 text-transparent">
            setting things up to
          </span>
          <span className="w-fit max-w-60 animate-pulse bg-gray-200 text-transparent">
            be able to apply for jobs!
          </span>
        </p>
      </div>
      {/* Circular Progress with Value */}
      <div className="grid h-[70px] w-[70px] animate-pulse grid-cols-1 grid-rows-1">
        <div className="col-start-1 row-start-1 rounded-full bg-gray-200 text-transparent"></div>
        <div className="col-start-1 row-start-1 flex items-center justify-center">
          <span className="h-[50px] w-[50px] rounded-full bg-white text-xl font-black text-transparent">
            0%
          </span>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;
