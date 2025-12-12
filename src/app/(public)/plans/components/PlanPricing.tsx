import React from 'react';
import { Typography, Divider } from '@mui/material';

interface PlanPricingProps {
  totalPrice?: string;
  discountedPrice?: string;
}

const PlanPricing: React.FC<PlanPricingProps> = ({ totalPrice, discountedPrice }) => {
  if (!totalPrice || !discountedPrice) return null;

  return (
    <>
      <Divider sx={{ my: 1.5 }} />
      <Typography
        variant="body2"
        sx={{ color: "#000", marginTop: "6px", fontSize: "0.75rem" }}
      >
        Total price {totalPrice} {discountedPrice} All prices are subject to VAT
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontStyle: "italic", marginTop: "6px", fontSize: "0.7rem" }}
      >
        Excl. Vat
      </Typography>
      <Divider sx={{ my: 1.5 }} />
    </>
  );
};

export default PlanPricing; 