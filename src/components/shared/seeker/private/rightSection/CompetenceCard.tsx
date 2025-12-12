"use client";
import React from "react";
import { CircularProgress } from "@mui/material";
import { getProgressColor } from "@/util/general";

const SeekerCompetenceCard: React.FC<{ percentage: number }> = ({
  percentage,
}) => {
  if (!percentage || percentage >= 100) return null;
  const progressColor = getProgressColor(percentage || 0);
  return (
    <div className="flex rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      {/* Title and Description */}
      <div className="flex-1">
        <h6
          className="mb-2 text-xl font-bold"
          style={{ color: progressColor }}
        >
          Complete your profile
        </h6>
        <p className="max-w-60 text-sm text-muted-foreground">
          You are almost there—let&lsquo;s finish setting things up to be able
          to apply for jobs!
        </p>
      </div>
      {/* Circular Progress with Value */}
      <div className="grid h-[70px] w-[70px] grid-cols-1 grid-rows-1">
        <CircularProgress
          variant="determinate"
          thickness={6}
          value={percentage || 0}
          size={70}
          sx={{
            color: progressColor,
          }}
          className="col-start-1 row-start-1"
        />
        <div className="col-start-1 row-start-1 flex items-center justify-center">
          <span className="text-xl font-black" style={{ color: progressColor }}>
            {percentage || 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeekerCompetenceCard;
