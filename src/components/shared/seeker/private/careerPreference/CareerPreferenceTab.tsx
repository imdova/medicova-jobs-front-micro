"use client";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import {
  API_CREATE_CAREER_PREFERENCE,
  API_GET_CAREER_PREFERENCES_BY_SEEKER_ID,
  API_UPDATE_CAREER_PREFERENCE,
} from "@/api/seeker";
import { CareerPreference, FieldConfig, Industry, Option } from "@/types";
import LeaveConfirmationModal from "@/components/UI/LeaveConfirmationModal";
import useUpdateApi from "@/hooks/useUpdateApi";
import { useForm } from "react-hook-form";
import useIsLeaving from "@/hooks/useIsLeaving";
import { API_GET_EMPLOYMENT_TYPES, API_GET_INDUSTRIES } from "@/api/admin";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { jobWorkPlaceOptions } from "@/constants/job";
import { useLocationData } from "@/hooks/useLocationData";
import { LocationItem, UserProfile } from "@/types/seeker";
import { useAppDispatch } from "@/store/hooks";
import { useUserData } from "@/hooks/useUserData";
import {
  createUserCareerPreference,
  updateUserCareerPreference,
} from "@/store/slices/profileSlice";
import { useIndustriesData } from "@/hooks/useIndustriesData";
import { useFormState } from "@/hooks/useFormState";

interface CareerPreferenceFormProps {
  defaultValues: Omit<Partial<CareerPreference>, "country"> & {
    country: string[];
  };
  user: UserProfile;
}

const CareerPreferenceForm: React.FC<CareerPreferenceFormProps> = ({
  defaultValues,
  user,
}) => {
  const dispatch = useAppDispatch();
  useUserData(user?.userName, "career-preference");

  const formMethods = useFormState(true, [], defaultValues, "onChange");

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
    prevDefaultsRef,
  } = formMethods;

  const { isLeaving, setLeavingManually, handleUserDecision } = useIsLeaving({
    preventDefault: isDirty,
  });

  const { countries } = useLocationData();
  const {
    industries: { data: industries },
    employmentTypes: { data: employmentTypes },
  } = useIndustriesData();

  const submit = (formData: CareerPreferenceFormProps["defaultValues"]) => {
    const countriesArray: LocationItem[] = formData.country
      ?.map((x) => {
        const country = countries.find((c) => c.isoCode === x);
        return { code: country?.isoCode || "", name: country?.name || "" };
      })
      .filter((x) => Boolean(x));

    const body: Partial<CareerPreference> = {
      ...formData,
      country: countriesArray,
      availableForImmediateHiring: Boolean(
        formData.availableForImmediateHiring,
      ),
    };
    if (body?.id) {
      dispatch(
        updateUserCareerPreference({
          id: body.id,
          updates: body,
          key: "user-name",
        }),
      );
    } else {
      dispatch(
        createUserCareerPreference({
          id: user.id,
          updates: body,
          key: "user-name",
        }),
      );
    }
    prevDefaultsRef.current = formData;
    reset(formData);
  };

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

      <form onSubmit={handleSubmit(submit)} className="space-y-2">
        <div className="flex items-center justify-between rounded-base border border-gray-200 bg-primary/10 p-[16px] text-start shadow-soft">
          <div>
            <FormField
              field={
                {
                  name: "availableForImmediateHiring",
                  label: "Available for immediate hiring",
                  type: "checkbox",
                } as FieldConfig
              }
              control={control}
            />
            <p className="text-muted-foreground">
              Let companies know you can start immediately by adding
              the Immediate start badge to your profile
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-base border border-gray-200 bg-white p-5 shadow-soft">
          <h5 className="text-xl font-semibold text-main md:mt-4 lg:w-1/2">
            Specify your job preference setting accurately to help reach the
            right opportunity
          </h5>
          {/* personal info */}

          <FormField
            field={
              {
                name: "industriesIds",
                type: "radio",
                multiple: true,
                label: "Industries",
                options: industries.data?.map((industry) => ({
                  label: industry.name,
                  value: industry.id,
                })),
              } as FieldConfig
            }
            control={control}
          />
          <FormField
            field={
              {
                name: "relocation",
                label:
                  "willing to relocate to another city or country if I find the right opportunity?",
                type: "checkbox",
              } as FieldConfig
            }
            control={control}
          />

          {/* personal info */}
        </div>
        <div className="space-y-4 rounded-base border border-gray-200 bg-white p-5 shadow-soft">
          <h5 className="text-xl font-semibold text-main md:mt-4 lg:w-1/2">
            What is your preferred workplace settings?
          </h5>
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <FormField
                field={
                  {
                    name: "jobEmploymentTypesIds",
                    type: "radio",
                    multiple: true,
                    label: "Type of Employment",
                    options: employmentTypes?.data.map((type) => ({
                      label: type.name,
                      value: type.id,
                    })),
                  } as FieldConfig
                }
                control={control}
              />
            </div>
            <div className="flex-1">
              <FormField
                field={
                  {
                    name: "jobWorkPlace",
                    type: "radio",
                    label: "Work Place",
                    multiple: true,
                    options: jobWorkPlaceOptions.map((item) => ({
                      label: item.label,
                      value: item.id,
                    })),
                  } as FieldConfig
                }
                control={control}
              />
            </div>
          </div>
          <div className="flex w-full gap-4">
            <div className="w-full">
              <FormField
                field={
                  {
                    name: "country",
                    type: "search-select",
                    multiple: true,
                    returnOption: true,
                    label: "Country",
                    textFieldProps: {
                      placeholder: "Select country",
                    },
                    options: countries.map((country) => ({
                      value: country.isoCode,
                      label: country.name,
                    })),
                  } as FieldConfig
                }
                control={control}
              />
            </div>
          </div>
        </div>

        {isDirty && (
          <div className="sticky bottom-2 z-30 flex justify-end rounded-base border border-gray-200 bg-white p-3 shadow-soft md:static md:justify-start md:p-5">
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid}
              size="large"
            >
              Save Changes
            </Button>
            <Button
              onClick={() => reset()}
              variant="text"
              size="large"
              className="ml-2"
            >
              Reset
            </Button>
          </div>
        )}
      </form>
    </>
  );
};
export const CareerPreferenceTab: React.FC<{
  user: UserProfile;
}> = ({ user }) => {
  const careerPreference = user?.careerPreference;
  const defaultValues: Omit<Partial<CareerPreference>, "country"> & {
    country: string[];
  } = {
    id: careerPreference?.id,
    seekerId: user?.id || null,
    jobEmploymentTypesIds: careerPreference?.jobEmploymentTypesIds || [],
    industriesIds: careerPreference?.industriesIds || [],
    availableForImmediateHiring:
      careerPreference?.availableForImmediateHiring || false,
    relocation: careerPreference?.relocation || false,
    jobWorkPlace: careerPreference?.jobWorkPlace || null,
    country: careerPreference?.country?.map((x) => x.code) || [],
  };

  return <CareerPreferenceForm defaultValues={defaultValues} user={user} />;
};

export default CareerPreferenceTab;
