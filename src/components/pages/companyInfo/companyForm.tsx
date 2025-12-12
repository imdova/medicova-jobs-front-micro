"use client";

import { Button } from "@mui/material";
import { Company } from "@/types";
import MainInformation from "@/components/pages/companyInfo/Main-Information";
import LocationSelection from "@/components/pages/companyInfo/LocationSelection";
import SectorSelection from "@/components/pages/companyInfo/SectorSelection";
import CompanyOwnership from "@/components/pages/companyInfo/CompanyOwnership";
import CompanyImage from "@/components/pages/companyInfo/CompanyImage";
import { useForm } from "react-hook-form";
import useIsLeaving from "@/hooks/useIsLeaving";
import React from "react";
import LeaveConfirmationModal from "@/components/UI/LeaveConfirmationModal";
import { updateCompany } from "@/store/slices/companySlice";
import { useCompanyData } from "@/hooks/useCompanyData";
import { useAppDispatch } from "@/store/hooks";
import { useSession } from "next-auth/react";

const CompanyInfoForm: React.FC<{ company: Company }> = ({ company }) => {
  const { update: sessionUpdate, data: session } = useSession();
  const dispatch = useAppDispatch();
  useCompanyData();
  const defaultValues: Company = {
    ...company,
    country: {
      name: company?.country?.name || "",
      code: company?.country?.code || "",
    },
    state: {
      name: company?.state?.name || "",
      code: company?.state?.code || "",
    },
    companySectorName: company?.companySectorName || null,
    companyTypeName: company?.companyTypeName || null,
  };

  const formMethods = useForm({ defaultValues });
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = formMethods;

  const { isLeaving, setLeavingManually, handleUserDecision } = useIsLeaving({
    preventDefault: isDirty,
  });

  const handleUpdate = async (formData: Partial<Company>) => {
    dispatch(updateCompany({ id: company?.id, updates: formData }));
    if (!company.name && formData.name && session?.user?.hasCompany === false) {
      sessionUpdate({
        hasCompany: true,
      });
    }
  };

  function onSuccess() {
    const formData = formMethods.getValues();
    reset(formData);
  }
  async function onSuccessUpload(banners: string[]) {
    const [banner1, banner2, banner3] = banners;
    handleUpdate({
      banner1,
      banner2,
      banner3,
    });
  }

  return (
    <div className="relative w-full px-0 md:px-5">
      <LeaveConfirmationModal
        isOpen={isLeaving}
        onLeave={() => {
          handleUserDecision(true);
        }}
        onStay={() => {
          setLeavingManually(false);
          handleUserDecision(false);
        }}
      />
      <form onSubmit={handleSubmit(handleUpdate)} noValidate>
        {isDirty && (
          <div className="sticky top-[70px] z-50 mb-3 flex justify-end rounded-base border border-gray-200 bg-white p-3 shadow-soft md:justify-start">
            <Button type="submit" variant="contained" size="large">
              Save Changes
            </Button>
            {isDirty && (
              <Button
                onClick={() => reset(company)}
                variant="text"
                size="large"
                className="ml-2"
              >
                Reset
              </Button>
            )}
          </div>
        )}
        <div className="mb-8 grid grid-cols-1 gap-4 px-2 md:grid-cols-12 md:px-0">
          <div className="col-span-1 space-y-4 md:col-span-9">
            <div className="rounded-base border-gray-200 bg-white p-3 md:border md:p-5 md:shadow-soft">
              <MainInformation formMethods={formMethods} />
              <SectorSelection
                control={control}
                watch={watch}
                setValue={setValue}
              />
            </div>
            <div className="rounded-base border-gray-200 bg-white p-3 md:border md:p-5 md:shadow-soft">
              <CompanyOwnership control={control} errors={errors} />
              {/* <CompanyContactInputs control={control} errors={errors} /> */}
            </div>

            <div className="rounded-base border-gray-200 bg-white p-3 md:border md:p-5 md:shadow-soft">
              <LocationSelection
                control={control}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-1 md:col-span-3">
            <div className="mb-4 rounded-base border-gray-200 bg-white p-3 md:border md:p-5 md:shadow-soft">
              <h5 className="text-2xl font-semibold text-main md:mt-4">
                Company Images
              </h5>
              <CompanyImage
                company={company}
                autoUpload={true}
                onSuccess={onSuccessUpload}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CompanyInfoForm;
