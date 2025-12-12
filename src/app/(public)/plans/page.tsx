"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { SUBSCRIPTION_PLANS } from "@/constants/subscriptionPlans";
import PlanCard from "./components/planCard";

const SubscriptionPlansPage: React.FC = () => {
  const handleGetStarted = (planName: string) => {
    console.log(`Getting started with ${planName} plan`);
    // Add your logic here
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        textAlign="center"
        className="text-main"
        fontWeight={600}
        mb={2}
        fontSize="1.8rem"
      >
        Ready to get started?
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        className="text-muted-foreground"
        mb={4}
        fontSize="0.9rem"
      >
        14 days unlimited free trial. No contract or credit card required.
      </Typography>

      <div className="grid grid-cols-2 justify-center gap-3 lg:grid-cols-4">
        {SUBSCRIPTION_PLANS.map((plan, index) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            index={index}
            onGetStarted={handleGetStarted}
          />
        ))}
      </div>
    </Box>
  );
};

export default SubscriptionPlansPage;
