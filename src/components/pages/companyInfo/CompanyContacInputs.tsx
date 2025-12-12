import { TextField } from "@mui/material";
import { Company } from "@/types";
import PhoneNumberInput from "@/components/UI/phoneNumber";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { isValidPhoneNumber } from "@/util/forms";

interface CompanyContactProps {
  control: Control<Company, any>
  errors: FieldErrors<Company>
}

const CompanyContactInputs: React.FC<CompanyContactProps> = ({
  control,
  errors,
}) => {
  return (
    <div className="flex flex-wrap gap-5">
      <div className="min-w-[250px] flex-1">
        <label className="mb-2 text-lg font-semibold text-main">
          Email *
        </label>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "Email is required",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              className="w-full"
              placeholder="Enter your company Email"
              error={!!errors?.email?.message}
            />
          )}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="min-w-[250px] flex-1">
        <label className="mb-2 text-lg font-semibold text-main">
          Phone Number *
        </label>
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{
            required: "Phone Number is required",
            validate: (value) =>
              isValidPhoneNumber(value || "") || "Please enter a valid phone number",
          }}
          render={({ field }) => (
            <PhoneNumberInput
              {...field}
              placeholder="Enter Phone Number"
              fullWidth
              variant="outlined"
              id="phone"
              error={!!errors.phone}
            />
          )}
        />
        {errors.phone && (
          <p className="mt-2 text-sm text-red-500">
            {errors.phone.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyContactInputs;
