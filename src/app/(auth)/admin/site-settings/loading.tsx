import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className={"flex h-[calc(100dvh-126px)] items-center justify-center"}>
      <CircularProgress />
      <h6 className="ml-4">Loading...</h6>
    </div>
  );
}
