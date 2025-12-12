"use client";
import React from "react";
import PlanCard from "./components/PlanCard";
import {
  planDetails,
  paymentMethods,
  billingHistory,
} from "./constants/billingData";
import { PaymentMethodsList } from "./components/PaymentMethodCard";
import BillingHistory from "./components/BillingHistory";
import Guard from "@/components/auth/Guard";
import Loading from "@/components/loading/loading";
import NotFoundPage from "@/app/not-found";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";

const PlansAndBilling: React.FC = () => {
  return (
    <Guard
      fallback={<NotFoundPage />}
      permissions={[Permission_Keys.Employer_ManagePayments]}
      loading={<Loading />}
    >
      <div className="min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Plans and billing
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your plan and billing details
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PlanCard plan={planDetails} />
            <PaymentMethodsList
              paymentMethods={paymentMethods.slice(0, 1)}
              onEditPaymentMethod={(e) => console.log(e)}
            />
          </div>

          <div className="mt-8">
            <BillingHistory records={billingHistory} />
          </div>
        </div>
      </div>
    </Guard>
  );
};

export default PlansAndBilling;
