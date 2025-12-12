import React from "react";
import { Typography } from "@mui/material";
import { SubscriptionPlan } from "@/types/finance";

interface PlanHeaderProps {
  plan: SubscriptionPlan;
}

// Helper to format numbers with commas
const formatNumber = (value: number) => {
  if (Number(value) === 0) {
    return "Free";
  }
  return Number(value).toLocaleString();
};

const PlanHeader: React.FC<PlanHeaderProps> = ({ plan }) => {
  const getTitleStyles = () => {
    if (plan.highlight && plan.name === "Gold") {
      return {
        background: "linear-gradient(90deg, #185D43CC 0%, #82C341CC 60%)",
        WebkitBackgroundClip: "text",
        color: "transparent",
      };
    }
    return {};
  };

  return (
    <>
      <Typography variant="h5" fontWeight={700} sx={getTitleStyles()}>
        {plan.name}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        mb={2}
        fontSize="0.8rem"
      >
        {plan.description}
      </Typography>
      <Typography fontWeight={600}>
        {plan.discountedPrice !== undefined &&
        String(plan.discountedPrice) !== "" &&
        plan.discountedPrice < plan.price ? (
          <>
            <span
              style={{
                color: "#AEAEAE",
                fontSize: "16px",
                textDecoration: "line-through",
                marginRight: "8px",
              }}
            >
              {formatNumber(plan.price)}
            </span>
            <span style={{ color: "black", fontSize: "20px", fontWeight: 700 }}>
              {formatNumber(plan.discountedPrice)}
            </span>
            {plan.discountedPrice > 0 && (
              <span style={{ color: "#AEAEAE", fontSize: "16px" }}>
                {" "}
                EGP/{plan.duration > 1 ? plan.duration : null} mo
              </span>
            )}
          </>
        ) : (
          <>
            <span style={{ color: "black", fontSize: "20px" }}>
              {formatNumber(plan.price)}
            </span>
            {plan.price > 0 && (
              <span style={{ color: "#AEAEAE", fontSize: "16px" }}>
                {" "}
                EGP/{plan.duration > 1 ? plan.duration + " " : null}mo
              </span>
            )}
          </>
        )}
      </Typography>
    </>
  );
};

export default PlanHeader;
