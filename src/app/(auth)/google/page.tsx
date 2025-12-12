"use client";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const token = searchParams.token;

  useEffect(() => {
    if (token) {
      signIn("token-credentials", {
        token: token,
        callbackUrl: "/me",
        redirect: true,
      });
    }
  }, [token]);

  return null;
}
