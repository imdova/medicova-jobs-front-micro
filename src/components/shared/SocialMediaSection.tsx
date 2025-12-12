"use client";
import React, { useState, type ReactElement } from "react";
import { IconButton, MenuItem, Select, Tooltip } from "@mui/material";
import {
  Edit,
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
import { Company, FieldConfig } from "@/types";
import useUpdateApi from "@/hooks/useUpdateApi";
import { API_UPDATE_SEEKER } from "@/api/seeker";
import { TAGS } from "@/api";
import FormModal from "@/components/form/FormModal/FormModal";
import { socialMediaOptions } from "@/constants/general";
import { User } from "next-auth";
import { API_UPDATE_COMPANY } from "@/api/employer";
import Guard from "../auth/Guard";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import { SocialMediaLinks, UserProfile } from "@/types/seeker";

type SocialMediaSectionProps = {
  user: UserProfile | Company;
  isMe: boolean;
  isLocked?: boolean;
  type: User["type"];
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

const defaultFields: FieldConfig[] = [
  {
    name: "instagram",
    label: "Instagram",
    type: "text",
    textFieldProps: {
      InputProps: {
        startAdornment: socialMediaIcons.instagram,
      },
    },
  },
  {
    name: "twitter",
    label: "Twitter",
    type: "text",
    textFieldProps: {
      InputProps: {
        startAdornment: socialMediaIcons.twitter,
      },
    },
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    type: "text",
    textFieldProps: {
      InputProps: {
        startAdornment: socialMediaIcons.linkedin,
      },
    },
  },
  {
    name: "website",
    label: "Website",
    type: "text",
    textFieldProps: {
      InputProps: {
        startAdornment: socialMediaIcons.website,
      },
    },
  },
];

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  user,
  isMe,
  isLocked,
  type,
}) => {
  const socialLinks = user?.socialLinks as SocialMediaLinks;
  const initialFields: FieldConfig[] = Object.entries(socialLinks || {})
    .filter(([_, value]) => value)
    .map(([key, value]) => ({
      name: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      type: "text",
      textFieldProps: {
        InputProps: {
          startAdornment: socialMediaIcons[key as keyof SocialMediaLinks] || (
            <LinkOutlined />
          ),
        },
      },
    }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState<FieldConfig[]>(
    initialFields.length > 0 ? initialFields : defaultFields,
  );

  const { isLoading, error, update, reset } = useUpdateApi<UserProfile>((e) => {
    setIsModalOpen(false);
  });

  const open = () => {
    setIsModalOpen(true);
    setFields(initialFields.length > 0 ? initialFields : defaultFields);
  };
  const close = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleUpdate = async (formData: Partial<UserProfile | Company>) => {
    await update(
      type === "seeker" ? API_UPDATE_SEEKER : API_UPDATE_COMPANY,
      { body: { id: user?.id, socialLinks: formData } },
      type === "seeker" ? TAGS.profile : TAGS.company,
    );
  };

  const addNewField = (inputValue: keyof SocialMediaLinks) => {
    const newFields: FieldConfig[] = [
      ...fields,
      {
        name: inputValue,
        label: inputValue.charAt(0).toUpperCase() + inputValue.slice(1),
        type: "text",
        textFieldProps: {
          InputProps: {
            startAdornment: socialMediaIcons[inputValue] || <LinkOutlined />,
          },
        },
      },
    ];
    if (inputValue) {
      setFields(newFields);
    }
  };
  const removeField = (fieldName: string) => {
    setFields((pv) => pv.filter((field) => field.name !== fieldName));
  };

  const filteredSocialMediaOptions = socialMediaOptions.filter(
    (option) => !fields.some((field) => field.name === option.value),
  );

  return (
    <div className="relative mb-5 rounded-base border border-gray-200 bg-white p-4 shadow-soft md:p-5">
      <div className="flex items-center justify-between">
        <h6 className="mb-2 text-xl font-semibold text-main">Social Links</h6>
        {isMe && (
          <IconButton
            onClick={open}
            className="rounded border border-solid border-gray-200 p-2"
          >
            <Edit />
          </IconButton>
        )}
      </div>
      <FormModal
        open={isModalOpen}
        onClose={close}
        onSubmit={handleUpdate}
        error={error?.message}
        loading={isLoading}
        fields={fields}
        title="Social Media Links"
        removeField={fields.length > 1 ? removeField : undefined}
        initialValues={socialLinks || {}}
      >
        <div className="border-t border-gray-200 p-4">
          <Select
            className={`w-full bg-white`}
            labelId={"linkLabel"}
            id={"link"}
            displayEmpty
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            onChange={(e) =>
              addNewField(e.target.value as keyof SocialMediaLinks)
            }
            renderValue={(value) => {
              const selected = filteredSocialMediaOptions.find(
                (opt) => opt.value == value,
              )?.label;
              return selected ? (
                selected
              ) : (
                <span className="text-neutral-400">Select Link</span>
              );
            }}
          >
            <MenuItem value="" disabled>
              <em>Select Link</em>
            </MenuItem>
            {filteredSocialMediaOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {socialMediaIcons[option.value] || <LinkOutlined />}{" "}
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      </FormModal>
      {!socialLinks || Object.keys(socialLinks).length === 0 ? (
        <p className="text-muted-foreground">No social media links found.</p>
      ) : isLocked ? (
        <p className="text-muted-foreground">This Social Media links are private.</p>
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

export default SocialMediaSection;
