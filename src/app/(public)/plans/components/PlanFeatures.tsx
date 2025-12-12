import React from "react";
import { Typography, Chip } from "@mui/material";
import StatusBadge from "@/app/(auth)/employer/billing/components/StatusBadge";

interface PlanFeaturesProps {
  features: string[];
  planIndex: number;
}

const PlanFeatures: React.FC<PlanFeaturesProps> = ({ features, planIndex }) => {
  const getChipIndices = (index: number): number[] => {
    const chipMap = {
      0: [0, 2, 4],
      1: [1, 2, 4],
      2: [0, 2, 3, 5, 6],
      3: Array.from({ length: features.length }, (_, i) => i), // All features for Platinum
    };
    return chipMap[index as keyof typeof chipMap] || [];
  };

  const shouldShowChip = (featureIndex: number): boolean => {
    return getChipIndices(planIndex).includes(featureIndex);
  };

  return (
    <>
      <Typography
        variant="subtitle2"
        fontWeight={600}
        my={1.5}
        fontSize="0.85rem"
      >
        Features Included:
      </Typography>
      <ul style={{ padding: 0, listStyle: "none", margin: 0 }}>
        {features.map((feature, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <Typography
              variant="body2"
              component="span"
              sx={{
                marginRight: "8px",
                color: "#185D43",
                fontSize: "0.75rem",
                lineHeight: 1.3,
              }}
            >
              {feature}
            </Typography>
            {shouldShowChip(idx) && (
              <StatusBadge status={"bold"}>New</StatusBadge>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default PlanFeatures;
