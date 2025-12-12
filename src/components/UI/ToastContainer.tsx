"use client";
import React from "react";
import { Toast } from "./Toast";
import { useAppSelector } from "@/store/hooks";

const positionClasses = {
  "top-right": "top-5 right-5",
  "top-left": "top-5 left-5",
  "bottom-right": "bottom-5 right-5",
  "bottom-left": "bottom-5 left-5",
};

export const ToastContainer: React.FC = () => {
  const toasts = useAppSelector((state) => state.toast.toasts);

  // Group toasts by position for flexibility
  const toastsByPosition = toasts.reduce<Record<string, typeof toasts>>(
    (acc, toast) => {
      const pos = toast.position || "top-right";
      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(toast);
      return acc;
    },
    {},
  );

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, toasts]) => (
        <div
          key={position}
          className={`fixed z-50 flex max-w-sm flex-col ${positionClasses[position as keyof typeof positionClasses] || positionClasses["top-right"]}`}
        >
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>
      ))}
    </>
  );
};
