"use client";

import UpdateEmail from "@/components/settings/UpdateEmail";
import UpdatePassword from "@/components/settings/UpdatePassword";
import { CircularProgress } from "@mui/material";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";

const LoginDetailsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;

  if (status === "loading") {
    return (
      <div className="flex h-full min-h-[70vh] items-center justify-center">
        <CircularProgress />
        <h6 className="ml-4">Loading...</h6>
      </div>
    );
  }
  if (status === "unauthenticated") return notFound();
  return (
    <div>
      <UpdateEmail user={user} />
      <UpdatePassword user={user} />
    </div>
  );
};

export default LoginDetailsPage;
