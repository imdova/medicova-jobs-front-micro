import React from "react";

const SkeletonSideBar = () => {
  return (
    <div className="flex flex-row w-full h-full">
      {/* Sidebar Skeleton */}
      <div className="flex flex-col w-full p-4 space-y-3">
        {/* Skeleton for each Tab */}
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="mx-2 my-1 h-[45px] flex flex-row items-center justify-between "
          >
            <div className="flex flex-row items-center gap-2 px-3">
              <div className="h-6 w-6 bg-gray-400 rounded-full animate-pulse"></div>
              {/* Adjust width dynamically for variety */}
              <div
                className={`h-4 ${
                  index === 0
                    ? "w-20"
                    : index === 1
                    ? "w-32"
                    : index === 2
                    ? "w-24"
                    : "w-28"
                } bg-gray-400 rounded animate-pulse`}
              ></div>
            </div>
            {/* Show the right-side icon only for the last two tabs */}
            {index > 1 && (
              <div className="h-4 w-4 bg-gray-400 rounded-full animate-pulse mr-3"></div>
            )}
          </div>
        ))}

        {/* Divider */}
        <div className="h-px w-full bg-gray-300"></div>

        {/* More Skeleton Tabs */}
        {[...Array(2)].map((_, index) => (
          <div
            key={index + 4}
            className="mx-2 my-1 h-[45px] flex flex-row items-center justify-between"
          >
            <div className="flex flex-row items-center gap-2 px-3">
              <div className="h-6 w-6 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="h-4 w-28 bg-gray-400 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-4 bg-gray-400 rounded-full animate-pulse mr-3"></div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default SkeletonSideBar;
