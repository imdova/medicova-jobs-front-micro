// src/components/PlanCard.tsx
import React from "react";
import StatusBadge from "./StatusBadge";
import UserAvatars from "./UserAvatars";
import { PlanDetails } from "../types/types";
import { Button } from "@mui/material";
import Link from "next/link";

interface PlanCardProps {
  plan: PlanDetails;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  return (
    <div className="rounded-base border h-fit border-gray-200 bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
        <StatusBadge status={plan.status === "active" ? "active" : "default"}>
          {plan.status === "active" ? "Active" : "Inactive"}
        </StatusBadge>
      </div>
      <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

      <div className="mt-4">
        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
        <span className="text-base font-medium text-gray-500"> per month</span>
      </div>

      <UserAvatars
        avatars={plan.users.avatars}
        current={plan.users.current}
        total={plan.users.total}
      />

      <Button
        variant="contained"
        className="mt-6 flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        LinkComponent={Link}
        href={"/plans"}
      >
        Upgrade plan
        <svg
          className="-mr-1 ml-2 h-4 w-4 -rotate-45"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
    </div>
  );
};

export default PlanCard;
