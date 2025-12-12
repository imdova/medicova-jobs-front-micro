"use client";
import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import UpdateEmail from "@/components/settings/UpdateEmail";
import UpdatePhone from "@/components/settings/UpdatePhone";

const EmployersCompanyInfoSettings = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <CircularProgress />
        <h6 className="ml-4">Loading...</h6>
      </div>
    );
  }
  if (status === "unauthenticated" || !user) return notFound();

  return (
    <div className="space-y-2">
      <UpdateEmail user={user} isCompany={true} />
      <UpdatePhone user={user} />
    </div>
  );
};

export default EmployersCompanyInfoSettings;
