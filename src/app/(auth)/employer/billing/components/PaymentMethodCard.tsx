"use client";

import React from "react";
import StatusBadge from "./StatusBadge";
import { PaymentMethod } from "../types/types";
import { Button } from "@mui/material";
import { Pen } from "lucide-react";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onEdit: (paymentMethod: PaymentMethod) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onEdit,
}) => {
  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "💳"; // Replace with actual Visa icon
      case "mastercard":
        return "💳"; // Replace with actual Mastercard icon
      case "amex":
        return "💳"; // Replace with actual Amex icon
      default:
        return "💳";
    }
  };

  return (
    <div className="rounded-base border border-gray-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-center">
        <span className="text-2xl">{getCardIcon(paymentMethod.type)}</span>
        <div className="ml-4 flex-1">
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-900">
              ending in {paymentMethod.lastFour}
            </span>
            {paymentMethod.isDefault && (
              <StatusBadge status="default">Default</StatusBadge>
            )}
          </div>
          <p className="text-sm text-gray-500">Expiry {paymentMethod.expiry}</p>
          <p className="text-sm text-gray-500">{paymentMethod.email}</p>
        </div>
        <Button
          variant="outlined"
          className="mt-6  rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={() => onEdit(paymentMethod)}
          startIcon={<Pen className="h-4 w-4" />}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  onEditPaymentMethod: (paymentMethod: PaymentMethod) => void;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  paymentMethods,
  onEditPaymentMethod,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Payment methods</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your payment methods and billing information.
        </p>
      </div>

      <div className="grid gap-2">
        {paymentMethods.map((method, index) => (
          <PaymentMethodCard
            key={`${method.type}-${method.lastFour}-${index}`}
            paymentMethod={method}
            onEdit={onEditPaymentMethod}
          />
        ))}
      </div>
    </div>
  );
};

export { PaymentMethodCard, PaymentMethodsList };
