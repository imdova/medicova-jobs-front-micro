"use client";

import { Dialog, DialogContent, Typography } from "@mui/material";
import { Company } from "@/types";
import MainInformation from "@/components/pages/companyInfo/Main-Information";
import LocationSelection from "@/components/pages/companyInfo/LocationSelection";
import SectorSelection from "@/components/pages/companyInfo/SectorSelection";
import CompanyOwnership from "@/components/pages/companyInfo/CompanyOwnership";
import CompanyImage from "@/components/pages/companyInfo/CompanyImage";
import { API_UPDATE_COMPANY } from "@/api/employer";
import useUpdateApi from "@/hooks/useUpdateApi";
import { Path, useForm } from "react-hook-form";
import { TAGS } from "@/api";
import useIsLeaving from "@/hooks/useIsLeaving";
import React from "react";
import LeaveConfirmationModal from "@/components/UI/LeaveConfirmationModal";
import { getNestedValue } from "@/util/forms";
import { ModalHeader } from "@/components/form/FormModal/ModalHeader";
import { FormActions } from "@/components/form/FormModal/FormActions";

const defaultKeys: Path<Company>[] = [
  "avatar",
  "banner1",
  "banner2",
  "banner3",
  "name",
  "title",
  "about",
  "companySectorId",
  "companySectorName",
  "companyTypeId",
  "companyTypeName",
  "isPrivate",
  "isProfitable",
  "size",
  "yearFounded",
  "state.code",
  "state.name",
  "country.code",
  "country.name",
  "city",
];
function getDefaultValues<T>(
  array: Path<T>[],
  initialValues?: T,
  isNullable = false,
): T {
  const result = array.reduce((acc, path) => {
    const parts = String(path).split(".");
    let current = acc;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    const value = initialValues
      ? getNestedValue(initialValues, path) || (isNullable ? null : "")
      : isNullable
        ? null
        : "";
    current[lastPart] = value;

    return acc;
  }, {} as any);

  return result as T;
}

const CompanyFormModal: React.FC<{
  company?: Company;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: Company) => void;
}> = ({ company, isOpen, onClose, onSuccess }) => {
  const {
    isLoading,
    error,
    update,
    reset: resetApi,
  } = useUpdateApi<Company>(handleSuccess);
  const defaultValues = getDefaultValues<Company>(defaultKeys, company);
  const formMethods = useForm({ defaultValues });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
    setValue,
    reset,
  } = formMethods;

  const handleReset = (values: Company) => {
    reset(values);
    resetApi(values);
  };

  const { isLeaving, setLeavingManually, handleUserDecision } = useIsLeaving({
    preventDefault: isDirty,
  });

  const handleUpdate = async (formData: Company) => {
    const body = getDefaultValues<Company>(defaultKeys, formData, true);
    if (company?.id) {
      body.id = company?.id;
      update(API_UPDATE_COMPANY, { body }, TAGS.company);
    } else {
      update(API_UPDATE_COMPANY, { body }, TAGS.company);
    }
  };

  async function handleSuccess(updatedCompany: Company) {
    const newDefaultValues = getDefaultValues<Company>(
      defaultKeys,
      updatedCompany,
    );
    onClose();
    handleReset(newDefaultValues);
    onSuccess?.(updatedCompany);
  }

  async function onSuccessUpload(banners: string[]) {
    const [banner1, banner2, banner3] = banners;
    setValue("banner1" as Path<Company>, banner1);
    setValue("banner2" as Path<Company>, banner2);
    setValue("banner3" as Path<Company>, banner3);
  }
  return (
    <>
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
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { borderRadius: "10px" },
          "& .MuiPaper-root": {
            overflowX: "hidden",
            margin: 0,
            width: "calc(100% - 32px)",
          },
        }}
      >
        <ModalHeader
          title={""}
          description={""}
          // error={error}
          handleCancel={onClose}
        />
        <DialogContent className="m-0 h-full max-h-[calc(100dvh-200px)] p-0">
          <form onSubmit={handleSubmit(handleUpdate)} noValidate>
            <div className="scroll-bar-minimal max-h-[calc(100dvh-254px)] overflow-y-auto bg-background">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1">
                  <div className="p-3">
                    <MainInformation formMethods={formMethods} />
                    <SectorSelection
                      control={control}
                      watch={watch}
                      setValue={setValue}
                    />
                  </div>
                  <div className="p-3">
                    <CompanyOwnership control={control} errors={errors} />
                    {/* <CompanyContactInputs control={control} errors={errors} /> */}
                  </div>
                </div>

                {/* Right Column */}
                <div className="border-l border-gray-200 md:w-96">
                  <div className="p-3">
                    <h5 className="text-2xl font-semibold text-main md:mt-4">
                      Company Images
                    </h5>
                    <CompanyImage
                      company={defaultValues}
                      autoUpload={true}
                      onSuccess={onSuccessUpload}
                    />
                  </div>
                  <div className="p-3">
                    <LocationSelection
                      control={control}
                      errors={errors}
                      setValue={setValue}
                      watch={watch}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                  {error.message}
                </Typography>
              )}
            </div>

            <FormActions
              onCancel={onClose}
              isDirty={isDirty}
              isValid={isValid}
              loading={isLoading}
            />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CompanyFormModal;
