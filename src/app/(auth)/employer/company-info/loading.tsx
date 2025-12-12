import React from "react";
import { CircularProgress } from "@mui/material";

const LoadingPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <CircularProgress />
      <h6 className="ml-4">Loading...</h6>
    </div>
  );
};

export default LoadingPage;
