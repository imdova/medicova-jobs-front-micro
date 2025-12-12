"use client";
import React, { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import Link from "next/link";
import { Company, FieldConfig } from "@/types";
import { Edit } from "@mui/icons-material";
import FormModal from "@/components/form/FormModal/FormModal";
import Guard from "@/components/auth/Guard";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import { useCompanyData } from "@/hooks/useCompanyData";
import { useAppDispatch } from "@/store/hooks";
import { updateCompanyUserName } from "@/store/slices/companySlice";

const userNameField: FieldConfig[] = [
  {
    name: "username",
    type: "text",
    required: true,
    textFieldProps: {
      label: "User Name",
      placeholder: "Enter User Name",
      InputProps: {
        startAdornment: <InputAdornment position="start">co/</InputAdornment>,
      },
    },
    rules: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters long",
      },
      maxLength: {
        value: 50,
        message: "Username cannot exceed 50 characters",
      },
      pattern: {
        value: /^[a-z0-9-_]+$/,
        message:
          "Username must contain only lowercase letters, numbers, hyphens, or underscores (no spaces or uppercase)",
      },
    },
  },
];

const PublicUrLChanger: React.FC<{ company: Company }> = ({ company }) => {
  const dispatch = useAppDispatch();
  useCompanyData(company?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const open = () => setIsModalOpen(true);
  const close = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async (formData: Partial<Company>) => {
    if (formData.username) {
      dispatch(
        updateCompanyUserName({ id: company.id, username: formData.username }),
      );
    }
    close();
  };

  return (
    <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      {/* Title and Description */}
      <FormModal
        open={isModalOpen}
        onClose={close}
        onSubmit={handleUpdate}
        fields={userNameField}
        title="Enter Your user Name"
        initialValues={{ username: company.username }}
      />

      <div className="flex items-start justify-between">
        <h6 className="mb-2 text-2xl font-semibold text-main">
          Company Public Profile
        </h6>
        <Guard permissions={[Permission_Keys.Employer_ManageCompanySettings]}>
          <IconButton
            onClick={open}
            className="rounded border border-solid border-gray-200 p-2"
          >
            <Edit />
          </IconButton>
        </Guard>
      </div>
      {/* <div className="flex items-center justify-between">
        <label className="text-lg font-semibold text-main">
          Public Company Page
        </label>
        <Switch color="primary" defaultChecked />
      </div> */}
      <div className="my-1 flex items-center justify-between rounded-base bg-primary/10 p-2 py-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Your company&apos;s public profile URL:
          </p>
          <Link
            target="_blank"
            href={`https://www.medicova.net/co/${company.username}?public=true`}
            className="text-sm text-primary underline"
          >
            co/{company.username}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicUrLChanger;
