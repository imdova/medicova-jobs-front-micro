import React from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import LogoIcon from "../icons/logo";

const Header = () => {
  return (
    <div className="container mx-auto flex items-center justify-between p-2 lg:max-w-[1170px]">
      <Link href="/" className="flex items-center text-primary">
        <LogoIcon className="h-[50px] w-[40px]" />
        <div className="flex h-fit flex-col text-center">
          <h1 className="font-baiJamJuree text-[16px] font-bold leading-none">
            MEDICOVA
          </h1>
          <p className="font-baiJamJuree text-[8px] font-medium">
            MEDICAL COMMUNITY
          </p>
        </div>
      </Link>
      <Link href="/auth/register">
        <Button className="bg-muted-foreground px-3 py-2 font-semibold normal-case text-primary-foreground">
          Create an account
        </Button>
      </Link>
    </div>
  );
};

export default Header;
