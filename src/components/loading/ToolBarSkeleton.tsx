const tabs = ["blocks", "styles", "forms", "settings"];

const ToolBarSkeleton = () => {
  return (
    <aside className="bg-muted/30 w-96 border-l">
      {/* Tabs */}
      <div className="flex h-[50px] items-center justify-center border-b text-xs">
        {tabs.map((tab) => (
          <div
            key={tab}
            className="flex h-full flex-1 items-center justify-center text-sm capitalize"
          >
            <div className="h-3 w-16 animate-pulse rounded bg-gray-300" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="scroll-bar-minimal max-h-[calc(100vh-146px)] space-y-4 overflow-y-auto p-4">
        {/* Section Title */}
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-300" />

        {/* Block Placeholder */}
        <div className="space-y-3">
          <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Form/Settings Section */}
        <div className="space-y-2 pt-6">
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-300" />
          <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
        </div>

        {/* Button Placeholder */}
        <div className="flex justify-end pt-6">
          <div className="h-8 w-24 animate-pulse rounded bg-gray-300" />
        </div>
      </div>
    </aside>
  );
};

export default ToolBarSkeleton;
