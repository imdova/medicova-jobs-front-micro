"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { UseFormReturn } from "react-hook-form";
import { FieldConfig, Option } from "@/types";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { Female, Male } from "@mui/icons-material";
import {
  gendersOptions,
  maritalStatusOptions,
  nationalitiesOptions,
} from "@/constants";
import { Gender } from "@/constants/enums/gender.enum";
import LocationSelect from "@/components/form/selections/LocationSelect";
import { isValidPhoneNumber } from "@/util/forms";
import { cn } from "@/util";
import { UserProfile } from "@/types/seeker";
import { Divider } from "@mui/material";
import CategorySelect from "./CategorySelect";

interface ProfileFormProps {
  formMethods: UseFormReturn<Partial<UserProfile>>;
  className?: string;
}

const genderIcons: Record<keyof typeof Gender, React.ReactNode> = {
  MALE: (
    <Male className="h-7 w-7 text-blue-500 group-aria-selected:text-white" />
  ),
  FEMALE: (
    <Female className="h-7 w-7 text-pink-500 group-aria-selected:text-white" />
  ),
  ANY: null,
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  formMethods,
  className,
}) => {
  const { control } = formMethods;

  return (
    <div
      className={cn(
        "w-full space-y-3 rounded-base border border-gray-200 bg-white p-5 shadow-soft",
        className,
      )}
    >
      <h5 className="text-center text-xl font-semibold text-main mb-4">
        Your Personal Info
      </h5>
      <Divider />
      <div className="flex w-full gap-4">
        <div className="md:w-1/2">
          <FormField
            field={
              {
                label: "WhatsApp Number",
                name: "whatsapp",
                type: "phone",
                rules: {
                  validate: (value: string) =>
                    !value ||
                    isValidPhoneNumber(value) ||
                    "Please enter a valid phone number",
                },
              } as FieldConfig
            }
            control={control}
          />
        </div>
      </div>

      <div className="md:w-1/2">
        <FormField
          field={
            {
              name: "birthDate",
              type: "date",
              label: "Date of Birth*",
              dateFieldProps: {
                maxDate: dayjs().subtract(16, "years"),
              },
            } as FieldConfig
          }
          control={control}
        />
      </div>
      <div className="md:w-1/2">
        <FormField
          field={{
            name: "gender",
            type: "radio",
            label: "Gender",
            options: gendersOptions.map((x) => ({
              ...x,
              icon: genderIcons[x.value as keyof typeof Gender],
            })),
          }}
          control={control}
        />
      </div>
      <div className="md:w-1/2">
        <FormField
          field={{
            name: "nationality",
            type: "search-select",
            label: "Nationality",
            options: nationalitiesOptions,
          }}
          control={control}
        />
      </div>
      <div className="md:w-1/2">
        <FormField
          field={
            {
              name: "maritalStatus",
              type: "radio",
              label: "Marital Status",
              options: maritalStatusOptions,
            } as FieldConfig
          }
          control={control}
        />
      </div>
      <div className="md:w-1/2">
        <FormField
          field={
            {
              name: "hasDrivingLicence",
              type: "radio",
              label: "Do you have a driving license?",
              options: [
                { label: "yes", value: true },
                { label: "no", value: false },
              ] as Option<Record<any, any>>[],
            } as FieldConfig
          }
          control={control}
        />
      </div>
      {/* Location */}
      <LocationSelect formMethods={formMethods} />
      <CategorySelect formMethods={formMethods} />
    </div>
  );
};

export default ProfileForm;
