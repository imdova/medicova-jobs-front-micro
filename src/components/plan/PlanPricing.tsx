import React from "react";
import { Typography, Divider } from "@mui/material";

const PlanPricing: React.FC<{ description: string }> = ({ description }) => {
  return (
    <>
      <Divider sx={{ my: 1.5 }} />
      <Typography
        variant="body2"
        sx={{ color: "#000", marginTop: "6px", fontSize: "0.75rem" }}
      >
        {description}
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
