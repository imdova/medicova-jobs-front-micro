import Image from "next/image";
import SetForm from "./SetForm";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import VerifyToken from "@/components/UI/verifyToken";

const resetPage = async ({
  searchParams,
}: {
  searchParams: { token: string };
}) => {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <VerifyToken
          title="Token Send"
          description="Please check your email for the token"
        />
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="absolute inset-0 z-[-1] bg-[url('/images/background.png')] bg-cover bg-center opacity-20"></div>
      {/* Main Content */}
      <div className="m-auto flex h-screen flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center rounded-base border border-gray-50 bg-[#f8faff]/80 p-5 shadow-xl">
          {/* Lock Icon */}
          <Image
            src="/images/set-password.jpg"
            width={150}
            height={120}
            alt="set password"
            className="mt-5 object-contain mix-blend-multiply"
          />

          {/* Title */}
          <h4 className="mb-1 text-center text-3xl font-semibold text-main">
            Set a new password
          </h4>
          {/* Subtitle */}
          <p className="mb-4 text-center text-muted-foreground">
            Must be at least 8 character.
          </p>
          {/* Email Input */}

          {/* Email Input */}

          <SetForm token={token} />

          <Link
            href="/auth/signin"
            replace
            className="mt-5 flex items-center gap-2 text-muted-foreground hover:underline"
          >
            <ArrowBackIcon />
            <span>Back to login</span>
          </Link>
        </div>
        {/* Stages */}
        <div className="mt-5 flex h-1 w-full max-w-[400px] items-center justify-center gap-5 px-10">
          <div className="h-full flex-1 rounded bg-[#CDD3D1]"></div>
          <div className="h-full flex-1 rounded bg-secondary"></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default resetPage;
