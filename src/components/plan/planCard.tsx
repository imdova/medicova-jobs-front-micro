import React from "react";
import { Card, CardContent, Button, Box } from "@mui/material";
import PlanBadge from "./PlanBadge";
import PlanHeader from "./PlanHeader";
import PlanPricing from "./PlanPricing";
import PlanFeatures from "./PlanFeatures";
import Link from "next/link";
import { Pen } from "lucide-react";
import { SubscriptionPlan } from "@/types/finance";
import { getButtonStyles, getPlanCardStyles } from "@/util/planStyles";

interface PlanCardProps {
  plan: SubscriptionPlan;
  index: number;
  onGetStarted: (planName: string) => void;
  edit?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  index,
  onGetStarted,
  edit,
}) => {
  return (
    <Box sx={getPlanCardStyles(plan.name, index, plan.highlight)}>
      {edit && (
        <Link
          href={`/admin/plans/edit/${plan.id}`}
          className="absolute -left-2 -top-2 cursor-pointer rounded-full border border-gray-200 bg-white p-2 text-black shadow-lg duration-300 hover:scale-125 hover:border-primary hover:bg-primary hover:text-white hover:shadow-2xl"
        >
          <Pen className="h-4 w-4" />
        </Link>
      )}
      {plan.badge && <PlanBadge planName={plan.name} badge={plan.badge} />}

      <CardContent sx={{ p: 2 }}>
        <PlanHeader plan={plan} />

        <PlanPricing description={plan.vatDescription} />

        <Button
          fullWidth
          sx={getButtonStyles(index)}
          onClick={() => onGetStarted(plan.name)}
          className="text-sm"
        >
          Get started
        </Button>

        <PlanFeatures features={plan.features} planIndex={index} />
      </CardContent>
    </Box>
  );
};

export default PlanCard;
