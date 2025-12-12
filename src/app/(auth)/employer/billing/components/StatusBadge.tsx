// src/components/StatusBadge.tsx
import React from "react";

type StatusBadgeProps = {
  status: "active" | "paid" | "pending" | "failed" | "default" | "bold";
  children: React.ReactNode;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const statusClasses = {
    bold:"bg-primary text-white",
    active: "bg-green-50 text-green-700",
    paid: "bg-green-50 text-green-700",
    pending: "bg-yellow-50 text-yellow-700",
    failed: "bg-red-50 text-red-700",
    default: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status]}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
