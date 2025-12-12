"use client";

import { useEffect, useRef, useState } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { API_CHANGE_EMAIL } from "@/api/users";
import { User } from "next-auth";

export default function VerifyPage() {
  const {
    data: session,
    status: sessionStatus,
    update: updateSession,
  } = useSession();
  const hasRun = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const redirect = () => {
    const user = session?.user;
    const isEmployer = user?.type === "employer";
    if (typeof window !== "undefined") {
      window.location.replace(
        isEmployer ? "/employer/setting" : "/job-seeker/setting",
      );
    }
  };

  useEffect(() => {
    if (
      !token ||
      hasRun.current ||
      sessionStatus === "loading" ||
      sessionStatus === "unauthenticated"
    )
      return;

    hasRun.current = true;

    const verifyEmail = async () => {
      try {
        const response = await fetch(API_CHANGE_EMAIL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newMail: email, token }),
        });

        if (!response?.ok) {
          setStatus("error");
          setMessage("An error occurred during change email");
          setTimeout(() => {
            redirect();
          }, 2000);
          return;
        }
        const updatedUser = await response.json();
        const newData: Partial<User> = {
          email: updatedUser.email,
        };
        setStatus("success");
        setMessage("Email Changed successfully!");
        await updateSession(newData);
        setTimeout(() => {
          redirect();
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email, sessionStatus]);

  useEffect(() => {
    if (hasRun.current) return;
    if (sessionStatus === "unauthenticated") {
      if (typeof window !== "undefined") {
        window.location.replace("/auth/signin");
      }
    }
  }, [sessionStatus]);

  if (!token || !email) return notFound();

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary/10 px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-xl transition-all duration-300">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Icon */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 shadow-inner">
            {status === "loading" && (
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            )}
            {status === "success" && (
              <CheckCircle className="h-10 w-10 text-green-600 transition-transform duration-500" />
            )}
            {status === "error" && (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>

          {/* Status Text */}
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Email Changed!"}
            {status === "error" && "Verification Failed"}
          </h1>

          {/* Message */}
          <p className="text-md text-center leading-relaxed text-gray-600">
            {message}
          </p>
          <p className="text-md text-center leading-relaxed text-gray-600">
            {status === "success" && "You will be redirected in few seconds"}
          </p>
        </div>
      </div>
    </div>
  );
}
