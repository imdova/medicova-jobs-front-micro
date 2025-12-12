import React from "react";
import { Card, CardContent, Button } from "@mui/material";
import { getPlanCardStyles, getButtonStyles } from "../utils/planStyles";
import PlanBadge from "./PlanBadge";
import PlanHeader from "./PlanHeader";
import PlanPricing from "./PlanPricing";
import PlanFeatures from "./PlanFeatures";
import { SubscriptionPlan } from "@/types/finance";

interface PlanCardProps {
  plan: SubscriptionPlan;
  index: number;
  onGetStarted: (planName: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, index, onGetStarted }) => {
  return (
    <Card sx={getPlanCardStyles(plan.name, index, plan.highlight)}>
      {plan.badge && <PlanBadge planName={plan.name} badge={plan.badge} />}

      <CardContent sx={{ p: 2 }}>
        <PlanHeader plan={plan} />

        <PlanPricing
          totalPrice={plan.price?.toString()}
          discountedPrice={plan.discountedPrice?.toString()}
        />

        <Button
          fullWidth
          sx={getButtonStyles(index)}
          onClick={() => onGetStarted(plan.name)}
          className="text-sm"
        >
          Get started
        </Button>

        <PlanFeatures features={plan.features.map((feature) => feature.name)} planIndex={index} />
      </CardContent>
    </Card>
  );
};

export default PlanCard;
