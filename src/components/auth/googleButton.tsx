import React from "react";
import { Button } from "@mui/material";
import { DevIconGoogle } from "@/components/icons/icons";
import { RoleState } from "@/types/next-auth";
import { signIn } from "next-auth/react";
import { setCookies } from "@/lib/cookies";

const GoogleButton = ({
  children,
  userType,
}: {
  children: React.ReactNode;
  userType?: RoleState;
}) => {
  return (
    <Button
      className="h-[42px] w-full"
      variant="outlined"
      onClick={async () => {
        await setCookies("userType", userType ?? "");
        signIn("google", { callbackUrl: "/me" });
      }}
    >
      <DevIconGoogle className="m-2 h-6 w-6" />
      {children}
    </Button>
  );
};

export default GoogleButton;
