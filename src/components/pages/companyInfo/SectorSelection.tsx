import { useSectorsData } from "@/hooks/useSectorsData";
import { Company } from "@/types";
import { FormControl, MenuItem, Select, Tooltip } from "@mui/material";
import {
  Control,
  Controller,
  Path,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface SectorSelectionProps {
  control: Control<Company, any>;
  watch: UseFormWatch<Company>;
  setValue: UseFormSetValue<Company>;
}

const SectorSelection: React.FC<SectorSelectionProps> = ({
  control,
  watch,
  setValue,
}) => {
  const sectorId = watch("companySectorId");
  const { sectors, types } = useSectorsData({ sectorId });
  // TODO:
  return (
    <div className="flex flex-wrap gap-3 md:flex-nowrap">
      {/* Company Sector Selector */}
      <div className="min-w-[200px] flex-1">
        <label className="text-lg font-semibold text-main">
          Company Sector *
        </label>
        <Controller
          name="companySectorName"
          control={control}
          rules={{ required: "Company Sector is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl error={Boolean(error)} fullWidth>
              <Select
                {...field}
                value={field.value ?? undefined}
                onChange={(e) => {
                  const selectSector = e.target.value;
                  field.onChange(e.target.value);
                  const sector = sectors.data.data.find(
                    (sector) => sector.name === selectSector,
                  );
                  setValue("companySectorId" as Path<Company>, sector?.id);
                  setValue("companyTypeId" as Path<Company>, "");
                  setValue("companyTypeName" as Path<Company>, "");
                }}
                displayEmpty
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: {
                    sx: { maxHeight: 300 },
                  },
                }}
                renderValue={(selected?: string) => {
                  if (!selected) {
                    return (
                      <em className="text-gray-400">Select Company Sector</em>
                    );
                  }
                  return <span>{selected}</span>;
                }}
                className="max-w-full"
              >
                <MenuItem value="" disabled>
                  <em>Select Sector</em>
                </MenuItem>
                {sectors &&
                  sectors.data.data.map((sector) => (
                    <MenuItem key={sector.id} value={sector.name}>
                      {sector.name}
                    </MenuItem>
                  ))}
              </Select>

              {error && (
                <p className="mt-2 text-sm text-red-500">{error.message}</p>
              )}
            </FormControl>
          )}
        />
      </div>

      {/* Company Type Selector */}
      <div className="min-w-[200px] flex-1">
        <label className="text-lg font-semibold text-main">
          Company Type *
        </label>
        <Controller
          name="companyTypeName"
          control={control}
          rules={{ required: "Company Type is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl error={Boolean(error)} fullWidth>
              <Tooltip
                title={
                  sectorId ? undefined : "Please select company sector first"
                }
                placement="bottom"
              >
                <Select
                  {...field}
                  value={field.value ?? undefined}
                  displayEmpty
                  MenuProps={{
                    disableScrollLock: true,
                    PaperProps: {
                      sx: { maxHeight: 300 },
                    },
                  }}
                  onChange={(e) => {
                    const selectSector = e.target.value;
                    field.onChange(e.target.value);
                    const type = types.data.data.find(
                      (type) => type.name === selectSector,
                    );
                    setValue("companyTypeId" as Path<Company>, type?.id);
                  }}
                  renderValue={(selected?: string) => {
                    if (!selected) {
                      return (
                        <em className="text-gray-400">Select Company Type</em>
                      );
                    }
                    return <span>{selected}</span>;
                  }}
                  className="max-w-full"
                >
                  <MenuItem value="" disabled>
                    <em>Select Type</em>
                  </MenuItem>
                  {types &&
                    types.data.data.map((type) => (
                      <MenuItem key={type.id} value={type.name}>
                        {type.name}
                      </MenuItem>
                    ))}
                </Select>
              </Tooltip>

              {error && (
                <p className="mt-2 text-sm text-red-500">{error.message}</p>
              )}
            </FormControl>
          )}
        />
      </div>
    </div>
  );
};

export default SectorSelection;
