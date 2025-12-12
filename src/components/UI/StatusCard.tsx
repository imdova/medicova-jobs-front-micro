import clsx from "clsx";
import React from "react";

const StatusCard: React.FC<StatusCardType> = ({
  title,
  value,
  icon,
  trend,
  className,
}) => {
  const trendColor =
    trend?.trendDirection === "up" ? "text-green-600" : "text-red-600";
  const trendIcon =
    trend?.trendDirection === "up" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
        />
      </svg>
    );

  return (
    <article
      className={clsx(
        "rounded-base shadow-soft border border-gray-200 bg-white p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-medium text-gray-900">{value}</p>
        </div>
        {icon}
      </div>
      {trend && (
        <div className={`mt-1 flex gap-1 ${trendColor}`}>
          {trend.value && trendIcon}
          <p className="flex gap-2">
            {trend.value && (
              <span className="text-[10px] font-medium">{trend.value}</span>
            )}
            <span className="text-xs text-gray-500">{trend.description}</span>
          </p>
        </div>
      )}
    </article>
  );
};

export default StatusCard;
