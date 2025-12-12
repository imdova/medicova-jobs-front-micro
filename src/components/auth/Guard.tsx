"use client";
import { hasRequiredPermissions } from "@/config/routeConfigs";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import { useSession } from "next-auth/react";
import React from "react";

interface GuardProps {
  permissions: Permission_Keys[];
  children: React.ReactNode;
  loading?: React.ReactNode;
  fallback?: React.ReactNode;
}

const Guard: React.FC<GuardProps> = ({
  permissions,
  children,
  loading = null,
  fallback = null,
}) => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      return <>{fallback}</>;
    },
  });

  if (status === "loading") {
    return <>{loading}</> || <p>Loading...</p>; // or a spinner
  }

  const userPermissions: Permission_Keys[] = session?.user?.permissions || []; // Ensure permissions are available

  // Check if the user has all required permissions

  if (hasRequiredPermissions(permissions, userPermissions)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default Guard;
