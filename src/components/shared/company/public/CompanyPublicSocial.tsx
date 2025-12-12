"use client";
import React, { type ReactElement } from "react";
import { Tooltip } from "@mui/material";
import {
  Facebook,
  Instagram,
  Language,
  LinkedIn,
  LinkOutlined,
  Pinterest,
  Reddit,
  Telegram,
  Twitter,
  WhatsApp,
  YouTube,
} from "@mui/icons-material";
import Link from "next/link";
import { Company } from "@/types";
import { SocialMediaLinks } from "@/types/seeker";

type CompanyPublicSocialProps = {
  company: Company;
};

export const socialMediaIcons: { [K in keyof SocialMediaLinks]: ReactElement } =
  {
    instagram: <Instagram sx={{ color: "rgba(241, 9, 234, 1)" }} />,
    twitter: <Twitter sx={{ color: "rgba(91, 146, 250, 1)" }} />,
    linkedin: <LinkedIn sx={{ color: "rgba(0, 119, 181, 1)" }} />,
    website: <Language sx={{ color: "rgba(46, 174, 125, 1)" }} />,
    facebook: <Facebook sx={{ color: "rgba(59, 89, 152, 1)" }} />,
    youtube: <YouTube sx={{ color: "rgba(255, 0, 0, 1)" }} />,
    // tiktok: <TikTok sx={{ color: "rgba(0, 0, 0, 1)" }} />,
    // snapchat: <Snapchat sx={{ color: "rgba(255, 252, 0, 1)" }} />,
    pinterest: <Pinterest sx={{ color: "rgba(189, 8, 28, 1)" }} />,
    reddit: <Reddit sx={{ color: "rgba(255, 69, 0, 1)" }} />,
    // discord: <Discord sx={{ color: "rgba(114, 137, 218, 1)" }} />,
    telegram: <Telegram sx={{ color: "rgba(0, 136, 204, 1)" }} />,
    whatsapp: <WhatsApp sx={{ color: "rgba(37, 211, 102, 1)" }} />,
  };

const CompanyPublicSocial: React.FC<CompanyPublicSocialProps> = ({
  company,
}) => {
  const socialLinks = company?.socialLinks;

  return (
    <div className="relative mb-5 rounded-base border border-gray-200 bg-white p-4 shadow-soft md:p-5">
      <div className="flex items-center justify-between">
        <h6 className="mb-2 text-xl font-semibold text-main">Social Links</h6>
      </div>

      {!socialLinks || Object.keys(socialLinks).length === 0 ? (
        <p className="text-muted-foreground">No social media links found.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {Object.entries(socialLinks).map(
            ([key, link]) =>
              link && (
                <Tooltip key={key} title={key} placement="bottom">
                  <Link href={link} target="_blank" rel="noopener noreferrer">
                    {socialMediaIcons[key as keyof SocialMediaLinks] || (
                      <LinkOutlined />
                    )}
                  </Link>
                </Tooltip>
              ),
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyPublicSocial;
