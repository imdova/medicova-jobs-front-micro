"use client";
import { Drawer } from "@mui/material";
import VerticalTabs from "./vertical-tabs";
import { BaseHeaderProps } from "@/types";
import { useState } from "react";

const SideBarDrawer: React.FC<BaseHeaderProps> = ({ user, pathname }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => setIsOpen((pv) => !pv);
  const onClose = () => setIsOpen(false);
  return (
    <>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group w-[56px] text-2xl focus:outline-none sm:w-[76px] sm:text-3xl md:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <svg
          className="pointer-events-none"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12L20 12"
            className="origin-center -translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
          />
          <path
            d="M4 12H20"
            className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
          />
          <path
            d="M4 12H20"
            className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
          />
        </svg>
      </button>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            // borderRadius: "16px",
            padding: "1rem",
            // maxHeight: "calc(100dvh - 70px)",
            minWidth: "250px",
            // marginTop:"70px"
          },
        }}
      >
        <VerticalTabs user={user} pathname={pathname} />
      </Drawer>
    </>
  );
};

export default SideBarDrawer;
