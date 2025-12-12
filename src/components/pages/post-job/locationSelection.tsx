import SearchableSelect from "@/components/UI/SearchableSelect";
import { useLocationData } from "@/hooks/useLocationData";
import { JobData } from "@/types";
import { FormControl, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";

interface LocationSectionProps {
  formMethods: UseFormReturn<JobData>;
}

const JobLocationSelection: React.FC<LocationSectionProps> = ({
  formMethods,
}) => {
  const { control, watch, setValue } = formMethods;
  const countryCode = watch("country.code");
  const { countries, states } = useLocationData(countryCode);

  return (
    <div className="flex min-w-[300px] flex-1 flex-wrap gap-2 ">
      <div className="min-w-[150px] flex-1">
        <label className="mb-2 text-lg font-semibold text-main">
          Job Location *
        </label>
        <Controller
          name="country.name"
          control={control}
          rules={{ required: "country is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl error={Boolean(error)} fullWidth>
              <SearchableSelect
                options={countries.map((x) => ({
                  value: x.name,
                  label: x.name,
                }))}
                {...field}
                onChange={(e) => {
                  const country = countries.find(
                    (country) => country.name === e.target.value,
                  );
                  field.onChange(e.target.value);
                  setValue("country.code", country?.isoCode || "");
                  setValue("state.name", "");
                  setValue("state", null);
                }}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span className="text-gray-400">Job Location</span>;
                  }
                  return selected;
                }}
              />
              {error && (
                <p className="mt-2 text-sm text-red-500">{error.message}</p>
              )}
            </FormControl>
          )}
        />
      </div>
      <div className="min-w-[150px] flex-1">
        <label className="mb-2 text-lg font-semibold text-main">
          Job State *
        </label>
        <Controller
          name="state.name"
          control={control}
          rules={{ required: "State is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl error={Boolean(error)} fullWidth>
              <SearchableSelect
                options={states.map((x) => ({
                  value: x.name,
                  label: x.name,
                }))}
                {...field}
                onChange={(e) => {
                  const state = states.find(
                    (state) => state.name === e.target.value,
                  );
                  field.onChange(e.target.value);
                  setValue("state.code", state?.isoCode || "");
                }}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span className="text-gray-400">Job State</span>;
                  }
                  return selected;
                }}
              />
              {error && (
                <p className="mt-2 text-sm text-red-500">{error.message}</p>
              )}
            </FormControl>
          )}
        />
      </div>
      <div className="min-w-[150px] flex-1">
        <label className="mb-2 text-lg font-semibold text-main">
          City/Area *
        </label>
        <Controller
          name="city"
          control={control}
          rules={{ required: "city is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              className="w-full"
              name="city"
              placeholder="Enter The Job City / Area"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </div>
    </div>
  );
};

export default JobLocationSelection;
