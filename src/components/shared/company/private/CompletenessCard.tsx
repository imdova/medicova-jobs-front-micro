"use client";
import React from "react";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { getProgressColor } from "@/util/general";

type CompletenessCardProps = {
  percentage: number;
  title: string;
  description: string;
  url: string;
};

const CompletenessCard: React.FC<CompletenessCardProps> = ({
  percentage,
  title,
  description,
  url,
}) => {
  if (!percentage || percentage >= 100) return null;
  const progressColor = getProgressColor(percentage);
  return (
    <div className="flex rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      {/* Title and Description */}
      <div className="flex-1">
        <Link
          href={url}
          className="mb-2 text-2xl font-bold hover:underline"
          style={{ color: progressColor }}
        >
          {title}
        </Link>

        <p className="max-w-60 text-muted-foreground">{description}</p>
      </div>
      {/* Circular Progress with Value */}
      <div className="grid h-[70px] w-[70px] grid-cols-1 grid-rows-1">
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={70}
          sx={{
            color: progressColor,
          }}
          className="col-start-1 row-start-1"
        />
        <div className="col-start-1 row-start-1 flex items-center justify-center">
          <span className="text-xl font-black" style={{ color: progressColor }}>
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompletenessCard;
