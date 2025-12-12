import { useIndustriesData } from "@/hooks/useIndustriesData";
import { Industry, JobData } from "@/types";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tooltip,
} from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";

interface IndustryFormProps {
  formMethods: UseFormReturn<JobData, any, JobData>;
  industries: Industry[];
}
const IndustryForm: React.FC<IndustryFormProps> = ({
  formMethods,
  industries,
}) => {
  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = formMethods;

  const industryId = watch("jobIndustryId");
  const categoryId = watch("jobCategoryId");

  const {
    categories: {
      data: { data: categories },
      loading: categoriesLoading,
    },
    careerLevels: {
      data: { data: careerLevels },
    },
    specialities: {
      data: { data: specialities },
    },
  } = useIndustriesData({
    categoryId,
    industryId,
  });

  return (
    <div>
      <div className="mb-6">
        <label className="mb-1 text-lg font-semibold text-main">
          Industry *
        </label>

        <Controller
          name="jobIndustryId"
          control={control}
          defaultValue={""}
          rules={{ required: "Employment type is required" }}
          render={({ field }) => (
            <FormControl
              component="fieldset"
              error={Boolean(errors?.jobIndustryId)}
              fullWidth
            >
              <RadioGroup
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const item = industries.find((x) => x.id === value);
                  setValue("jobCategoryId", null);
                  setValue("jobSpecialityId", null);
                  setValue("jobCareerLevelId", null);
                  setValue("jobIndustry", item?.name);
                  field.onChange(value);
                }}
                sx={{
                  display: "flex",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                  px: 1,
                  gap: 1,
                  flexDirection: "row",
                }}
              >
                {industries.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    value={item.id}
                    name="gender"
                    control={<Radio style={{ display: "none" }} />}
                    label={item.name}
                    className={`h-[42px] cursor-pointer rounded-base border border-input-border px-3 font-normal focus:outline-offset-2 focus:outline-secondary ${
                      field.value === item.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-neutral-500 hover:border-black hover:text-muted-foreground"
                    }`}
                  />
                ))}
              </RadioGroup>

              {errors?.jobIndustryId && (
                <FormHelperText>{errors.jobIndustryId.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>
      <div className="mb-6 flex flex-wrap gap-5 md:flex-nowrap">
        <div className="min-w-[150px] flex-1">
          <label className="text-lg font-semibold text-main">Category *</label>
          <Controller
            name="jobCategoryId"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <FormControl error={Boolean(errors.jobCategoryId)} fullWidth>
                <Tooltip
                  title={
                    industryId
                      ? categoriesLoading
                        ? "loading..."
                        : undefined
                      : "Please select industry first"
                  }
                  placement="bottom"
                >
                  <Select
                    {...field}
                    onChange={(e) => {
                      const id = e.target.value;
                      field.onChange(id);
                      const category = categories.find((x) => x.id === id);
                      setValue("jobSpecialityId", null);
                      setValue("jobCareerLevelId", null);
                      setValue("jobCategory", category?.name || "");
                    }}
                    displayEmpty
                    MenuProps={{
                      disableScrollLock: true,
                      PaperProps: {
                        sx: { maxHeight: 300 },
                      },
                    }}
                    disabled={!industryId || categoriesLoading}
                    renderValue={(selected) => {
                      const category = categories.find(
                        (i) => i.id === selected,
                      );
                      if (!category) {
                        return (
                          <span className="text-gray-400">Job Category</span>
                        );
                      }
                      return category.name;
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Job Category</em>
                    </MenuItem>
                    {categories.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Tooltip>

                {errors.jobCategoryId && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.jobCategoryId.message}
                  </p>
                )}
              </FormControl>
            )}
          />
        </div>
        <div className="min-w-[150px] flex-1">
          <label className="text-lg font-semibold text-main">Specialty *</label>
          <Controller
            name="jobSpecialityId"
            control={control}
            rules={{ required: "Specialty is required" }}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.jobSpecialityId)}>
                <Tooltip
                  title={
                    categoryId ? undefined : "Please select Category first"
                  }
                  placement="bottom"
                >
                  <Select
                    {...field}
                    onChange={(e) => {
                      const id = e.target.value;
                      field.onChange(id);
                      const specialty = specialities.find((x) => x.id === id);
                      setValue("jobSpeciality", specialty?.name || "");
                    }}
                    MenuProps={{
                      disableScrollLock: true,
                      PaperProps: {
                        sx: { maxHeight: 300 },
                      },
                    }}
                    disabled={!categoryId}
                    displayEmpty
                    renderValue={(selected) => {
                      const specialty = specialities.find(
                        (i) => i.id === selected,
                      );
                      if (!specialty) {
                        return (
                          <span className="text-gray-400">Job Specialty</span>
                        );
                      }
                      return specialty.name;
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Specialty</em>
                    </MenuItem>
                    {specialities.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Tooltip>
                {errors.jobSpecialityId && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.jobSpecialityId.message}
                  </p>
                )}
              </FormControl>
            )}
          />
        </div>
        <div className="min-w-[150px] flex-1">
          <label className="text-lg font-semibold text-main">
            Career Level *
          </label>
          <Controller
            name="jobCareerLevelId"
            control={control}
            rules={{ required: "Career Level is required" }}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.jobCareerLevelId)}>
                <Tooltip
                  title={
                    categoryId ? undefined : "Please select Category first"
                  }
                  placement="bottom"
                >
                  <Select
                    {...field}
                    onChange={(e) => {
                      const id = e.target.value;
                      field.onChange(id);
                      const career = careerLevels.find((x) => x.id === id);
                      setValue("jobCareerLevel", career?.name || "");
                    }}
                    MenuProps={{
                      disableScrollLock: true,
                      PaperProps: {
                        sx: { maxHeight: 300 },
                      },
                    }}
                    displayEmpty
                    disabled={!categoryId}
                    renderValue={(selected) => {
                      const careerLevel = careerLevels.find(
                        (i) => i.id === selected,
                      );
                      if (!careerLevel) {
                        return (
                          <span className="text-gray-400">
                            Job Career Level
                          </span>
                        );
                      }
                      return careerLevel.name;
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Career Level</em>
                    </MenuItem>
                    {careerLevels.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Tooltip>
                {errors.jobCareerLevelId && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.jobCareerLevelId.message}
                  </p>
                )}
              </FormControl>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default IndustryForm;
