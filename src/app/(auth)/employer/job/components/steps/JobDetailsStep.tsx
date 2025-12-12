"use client";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  RadioGroup,
  Radio,
  FormHelperText,
} from "@mui/material";
import TextEditor from "@/components/editor/editor";
import { EmploymentType, Industry, JobData } from "@/types";
import { Controller, FieldValues, Path, useForm } from "react-hook-form";
import { Add, Female, Male, Remove } from "@mui/icons-material";
import IndustryForm from "../industry";
import MultiTextInput from "@/components/form/MultiTextInput";
import {
  currencyOptions,
  educationOptions,
  genderOptions,
  jobWorkPlaceOptions,
  startDateTypeOptions,
} from "@/constants/job";
import { disableEnterKey } from "@/util";
import { SalaryCurrency } from "@/constants/enums/currency.enum";
import useIsLeaving from "@/hooks/useIsLeaving";
import LeaveConfirmationModal from "@/components/UI/LeaveConfirmationModal";
import JobLocationSelection from "@/components/pages/post-job/locationSelection";
import { Gender } from "@/constants/enums/gender.enum";
import { useEffect } from "react";
import { JobWorkPlace } from "@/constants/enums/work-place.enum";

// Icons to represent gender visually
const genderIcons: Record<keyof typeof Gender, React.ReactNode> = {
  MALE: (
    <Male className="h-7 w-7 text-blue-500 group-aria-selected:text-white" />
  ),
  FEMALE: (
    <Female className="h-7 w-7 text-pink-500 group-aria-selected:text-white" />
  ),
  ANY: null,
};

interface JobDetailProps {
  jobData: JobData;
  onSubmit: (data: JobData, isClean?: boolean) => void;
  onDraft: (data: Partial<JobData>, preventDefault: boolean) => void;
  draftLoading: boolean;
  industries: Industry[];
  initialJobData: JobData;
  employmentTypes: EmploymentType[];
  isDirty: boolean;
}

/**
 * JobDetailsStep Component
 *
 * This component renders the first step of a multi-step job posting form.
 * It contains form fields related to job details, location, experience, and salary.
 * Uses react-hook-form for form state management and validation.
 *
 * @param {JobData} jobData - The initial data to populate the form.
 * @param {JobData} initialJobData - Default job values for form reset.
 * @param {(data: JobData, isClean?: boolean) => void} onSubmit - Callback for form submission.
 * @param {(data: Partial<JobData>, preventDefault: boolean) => void} onDraft - Callback for saving draft.
 * @param {boolean} draftLoading - Indicates if draft save is in progress.
 * @param {boolean} isDirty - Indicates if the form has unsaved changes.
 * @returns {JSX.Element} A form UI to collect job posting data.
 */

const JobDetailsStep: React.FC<JobDetailProps> = ({
  jobData,
  onSubmit,
  onDraft,
  draftLoading,
  industries,
  employmentTypes,
  initialJobData,
  isDirty: initialIsDirty,
}) => {
  // Initialize form using react-hook-form with initial and default values
  const formMethods = useForm({
    values: jobData,
    defaultValues: initialJobData,
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setFocus,
    reset,
  } = formMethods;

  // Handle navigation warning when leaving with unsaved changes
  const { isLeaving, handleUserDecision } = useIsLeaving({
    preventDefault: isDirty,
  });

  // Called when saving the draft, includes updated form data
  const onDraftSubmit = (preventDefault?: boolean) => {
    const data = watch();
    const jobData = { ...data, draft: true };
    reset(jobData);
    onDraft(jobData, preventDefault || false);
  };

  // Called when submitting the full form
  const submitHandler = (data: JobData) => {
    onSubmit(data, !(initialIsDirty || isDirty));
  };

  const onError = (errors: FieldValues) => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0] as Path<JobData>;
      // Focus field
      setFocus(firstErrorField);

      // Scroll field into center of viewport
      setTimeout(() => {
        const el = document.querySelector<HTMLInputElement>(
          `[name="${firstErrorField}"]`,
        );
        el?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    }
  };

  return (
    <>
      {/* Modal to confirm leaving with unsaved changes */}
      <LeaveConfirmationModal
        isOpen={isLeaving && isDirty}
        additionalButtons={[
          {
            text: "Save Draft",
            onClick: () => {
              handleUserDecision(true);
              onDraftSubmit(true);
            },
            color: "warning",
            variant: "contained",
          },
        ]}
        onLeave={() => {
          handleUserDecision(true);
        }}
        onStay={() => {
          handleUserDecision(false);
        }}
      />
      {/* Main form element */}
      <form
        onSubmit={handleSubmit(submitHandler, onError)}
        onKeyDown={disableEnterKey} // Prevent form submit on Enter key
        noValidate
      >
        {/* Job details section */}
        <div className="mb-4 rounded-base border border-gray-200 bg-white p-4 shadow-soft">
          <h5 className="mb-12 mt-4 text-center text-3xl font-bold text-main">
            Job Details
          </h5>
          <div className="mb-6 md:w-1/2 md:pr-3">
            <label className="mb-2 text-lg font-semibold text-main">
              Title *
            </label>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: "title is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="w-full"
                  placeholder="Enter The Job Title"
                  error={!!errors?.title?.message}
                />
              )}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>
          {/* Industry */}
          <IndustryForm formMethods={formMethods} industries={industries} />
          {/* Dropdowns employment type - education level  */}
          <div className="mb-6 flex flex-wrap gap-2 md:flex-nowrap">
            <div className="min-w-[150px] flex-1">
              <label className="mb-1 text-lg font-semibold text-main">
                Type of Employment *
              </label>
              <Controller
                name="jobEmploymentTypeId"
                control={control}
                defaultValue={""}
                rules={{ required: "Employment type is required" }}
                render={({ field }) => (
                  <FormControl
                    component="fieldset"
                    error={Boolean(errors?.jobEmploymentTypeId)}
                    fullWidth
                  >
                    <RadioGroup
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      sx={{
                        display: "flex",
                        px: 1,
                        gap: 1,
                        flexDirection: "row",
                      }}
                    >
                      {employmentTypes.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          value={item.id}
                          name="gender"
                          control={<Radio style={{ display: "none" }} />}
                          label={item.name}
                          className={`h-[42px] cursor-pointer border-input-border rounded-base border px-3 font-normal focus:outline-offset-2 focus:outline-secondary ${
                            field.value === item.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "text-neutral-500 hover:border-black hover:text-muted-foreground"
                          }`}
                        />
                      ))}
                    </RadioGroup>

                    {errors?.jobEmploymentTypeId && (
                      <FormHelperText>
                        {errors.jobEmploymentTypeId.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>
            <div className="min-w-[150px] flex-1">
              <label className="mb-1 text-lg font-semibold text-main">
                Education Level *
              </label>
              <Controller
                name="educationLevel"
                control={control}
                defaultValue={""}
                rules={{ required: "Education Level is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.educationLevel)}>
                    <Select
                      {...field}
                      MenuProps={{
                        disableScrollLock: true,
                        PaperProps: {
                          sx: { maxHeight: 300 },
                        },
                      }}
                      displayEmpty
                      renderValue={(selected) => {
                        const selectedEducationLevel = educationOptions.find(
                          (c) => c.id === selected,
                        );
                        if (!selectedEducationLevel) {
                          return (
                            <span className="text-gray-400">
                              Education Level
                            </span>
                          );
                        }
                        return selectedEducationLevel.label;
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select Your Education Level</em>
                      </MenuItem>
                      {educationOptions.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.educationLevel && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.educationLevel.message}
                      </p>
                    )}
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2 md:flex-nowrap">
            {/* Age */}
            <div className="flex min-w-[300px] flex-1 flex-wrap gap-2 md:flex-nowrap">
              <div className="min-w-[150px] flex-1">
                <label className="mb-2 text-lg font-semibold text-main">
                  Min Age *
                </label>
                <Controller
                  name="minAge"
                  control={control}
                  defaultValue={null}
                  rules={{
                    required: "min age is required",
                    min: {
                      value: 18,
                      message: "min age must be at least 18",
                    },
                    max: {
                      value: 80,
                      message: "min age must be at most 80",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      type="number"
                      inputProps={{ min: 16, max: 100 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">y</InputAdornment>
                        ),
                      }}
                      placeholder="Enter The Min Age"
                      error={!!errors?.minAge?.message}
                    />
                  )}
                />
                {errors.minAge && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.minAge.message}
                  </p>
                )}
              </div>
              <div className="min-w-[150px] flex-1">
                <label className="mb-2 text-lg font-semibold text-main">
                  Max Age *
                </label>
                <Controller
                  name="maxAge"
                  control={control}
                  defaultValue={null}
                  rules={{
                    required: "max age is required",
                    min: {
                      value: 16,
                      message: "min age must be at least 16",
                    },
                    max: {
                      value: 100,
                      message: "min age must be at most 100",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      type="number"
                      inputProps={{ min: 16, max: 100 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">y</InputAdornment>
                        ),
                      }}
                      placeholder="Enter The Max Age"
                      error={!!errors?.maxAge?.message}
                    />
                  )}
                />
                {errors.maxAge && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.maxAge.message}
                  </p>
                )}
              </div>
            </div>
            {/* Work Place */}
            <div className="mb-6 md:w-1/2 md:pr-3">
              <label className="mb-1 text-lg font-semibold text-main">
                Work Place *
              </label>
              <Controller
                name="jobWorkPlace"
                control={control}
                defaultValue={JobWorkPlace.ONSITE}
                rules={{ required: "Work Place is required" }}
                render={({ field }) => (
                  <FormControl
                    component="fieldset"
                    error={Boolean(errors?.jobWorkPlace)}
                    fullWidth
                  >
                    <RadioGroup
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      sx={{
                        display: "flex",
                        flexWrap: { xs: "wrap", md: "nowrap" },
                        px: 1,
                        gap: 1,
                        flexDirection: "row",
                      }}
                    >
                      {jobWorkPlaceOptions.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          value={item.id}
                          name="gender"
                          control={<Radio style={{ display: "none" }} />}
                          label={item.label}
                          className={`h-[42px] cursor-pointer rounded-base border border-input-border px-3 font-normal focus:outline-offset-2 focus:outline-secondary ${
                            field.value === item.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "text-neutral-500 hover:border-black hover:text-muted-foreground"
                          }`}
                        />
                      ))}
                    </RadioGroup>

                    {errors?.jobWorkPlace && (
                      <FormHelperText>
                        {errors.jobWorkPlace.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-nowrap">
            <JobLocationSelection formMethods={formMethods} />
            <div className="mb-6 md:w-1/2 md:pr-3">
              <label className="mb-1 text-lg font-semibold text-main">
                Gender *
              </label>

              <Controller
                name="gender"
                control={control}
                defaultValue={Gender.FEMALE}
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <FormControl
                    component="fieldset"
                    error={Boolean(errors?.gender)}
                    fullWidth
                  >
                    <RadioGroup
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      sx={{
                        display: "flex",
                        flexWrap: { xs: "wrap", md: "nowrap" },
                        px: 1,
                        gap: 1,
                        flexDirection: "row",
                      }}
                    >
                      {genderOptions.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          value={item.id}
                          name="gender"
                          control={<Radio style={{ display: "none" }} />}
                          label={
                            <>
                              {genderIcons[item.id as keyof typeof Gender]}
                              {item.label}
                            </>
                          }
                          className={`h-[42px] cursor-pointer rounded-base border border-input-border px-3 font-normal focus:outline-offset-2 focus:outline-secondary ${
                            field.value === item.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "text-neutral-500 hover:border-black hover:text-muted-foreground"
                          }`}
                        />
                      ))}
                    </RadioGroup>

                    {errors?.gender && (
                      <FormHelperText>{errors.gender.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="mb-4 rounded-base border border-gray-200 bg-white p-4 shadow-soft">
          <h5 className="mb-12 mt-4 text-center text-3xl font-bold text-main">
            Experience & Salary Details
          </h5>

          {/* Salary Details */}
          <div className="mb-6 flex flex-wrap gap-2 md:flex-nowrap">
            <div className="flex-1">
              <div className="mb-4 flex min-w-[300px] flex-1 flex-wrap gap-2 md:flex-nowrap">
                <div className="min-w-[150px] flex-1">
                  <label className="mb-2 text-lg font-semibold text-main">
                    Min Years Exp *
                  </label>
                  <Controller
                    name="minExpYears"
                    control={control}
                    defaultValue={null}
                    rules={{
                      required: "min experience years is required",
                      min: {
                        value: 0,
                        message: "min experience years must be greater than 0",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="w-full"
                        type="number"
                        inputProps={{ min: 0 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">y</InputAdornment>
                          ),
                        }}
                        placeholder="Enter The Min Experience Years"
                        error={!!errors?.minExpYears?.message}
                      />
                    )}
                  />
                  {errors.minExpYears && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.minExpYears.message}
                    </p>
                  )}
                </div>
                <div className="min-w-[150px] flex-1">
                  <label className="mb-2 text-lg font-semibold text-main">
                    Max Years Exp *
                  </label>
                  <Controller
                    name="maxExpYears"
                    control={control}
                    defaultValue={null}
                    rules={{
                      required: "max experience years is required",
                      min: {
                        value: 0,
                        message: "max experience years must be greater than 0",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="w-full"
                        type="number"
                        inputProps={{ min: 0 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">y</InputAdornment>
                          ),
                        }}
                        placeholder="Enter The Max Experience Years"
                        error={!!errors?.maxExpYears?.message}
                      />
                    )}
                  />
                  {errors.maxExpYears && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.maxExpYears.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex min-w-[300px] flex-1 flex-wrap gap-2 md:flex-nowrap">
                <div className="w-[90px]">
                  <label className="mb-2 text-lg font-semibold text-main">
                    Currency*
                  </label>
                  <Controller
                    name="salaryCurrency"
                    defaultValue={SalaryCurrency.USD}
                    rules={{ required: "Currency is required" }}
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={Boolean(errors.educationLevel)}
                      >
                        <Select
                          {...field}
                          MenuProps={{
                            disableScrollLock: true,
                          }}
                          displayEmpty
                          renderValue={(selected) => {
                            const selectedItem = currencyOptions.find(
                              (c) => c.id === selected,
                            );
                            if (!selectedItem) {
                              return (
                                <span className="text-gray-400">Currency</span>
                              );
                            }
                            return selectedItem.label;
                          }}
                        >
                          {currencyOptions.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.educationLevel && (
                          <p className="mt-2 text-sm text-red-500">
                            {errors.educationLevel.message}
                          </p>
                        )}
                      </FormControl>
                    )}
                  />
                </div>
                <div className="min-w-[150px] flex-1">
                  <label className="mb-2 text-lg font-semibold text-main">
                    Salary start range *
                  </label>
                  <Controller
                    name="salaryRangeStart"
                    control={control}
                    defaultValue={null}
                    rules={{
                      required: "salary rang start is required",
                      min: {
                        value: 0,
                        message: "salary range start must be greater than 0",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="w-full"
                        type="number"
                        inputProps={{ min: 0 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {currencyOptions.find(
                                (c) => c.id === watch("salaryCurrency"),
                              )?.icon || "$"}
                            </InputAdornment>
                          ),
                        }}
                        placeholder="Enter The Salary Range Start"
                        error={!!errors?.salaryRangeStart?.message}
                      />
                    )}
                  />
                  {errors.salaryRangeStart && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.salaryRangeStart.message}
                    </p>
                  )}
                </div>
                <div className="min-w-[150px] flex-1">
                  <label className="mb-2 text-lg font-semibold text-main">
                    Salary end range *
                  </label>
                  <Controller
                    name="salaryRangeEnd"
                    control={control}
                    defaultValue={null}
                    rules={{
                      required: "salary range end is required",
                      min: {
                        value: 0,
                        message: "salary range end must be greater than 0",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="w-full"
                        type="number"
                        inputProps={{ min: 0 }}
                        placeholder="Enter The Salary Range End"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {currencyOptions.find(
                                (c) => c.id === watch("salaryCurrency"),
                              )?.icon || "$"}
                            </InputAdornment>
                          ),
                        }}
                        // value={field.value ? Number(field.value).toLocaleString('en-US') : ''}
                        // onChange={(e) => field.onChange(e.target.value.replace(/[^\d]/g, ''))}
                        error={!!errors?.salaryRangeEnd?.message}
                      />
                    )}
                  />
                  {errors.salaryRangeEnd && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.salaryRangeEnd.message}
                    </p>
                  )}
                </div>
              </div>
              <Controller
                name="hideSalary"
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <FormControl error={!!errors.hideSalary} fullWidth>
                    <FormControlLabel
                      control={<Checkbox {...field} color="primary" />}
                      label="Hide Salary in job post"
                    />
                    {errors.hideSalary && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.hideSalary.message}
                      </p>
                    )}
                  </FormControl>
                )}
              />
            </div>

            {/* Additional Salary Details */}
            <div className="min-w-[150px] flex-1">
              <label className="mb-2 text-lg font-semibold text-main">
                Additional Salary Details
              </label>
              <Controller
                name="salaryDetails"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="w-full"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        height: "auto",
                      },
                    }}
                    multiline
                    minRows={4}
                    maxRows={6}
                    placeholder="Eg. Bonus Commission, Salary in Local Currency, etc."
                  />
                )}
              />
            </div>
          </div>
          {/* Number of Vacancies */}
          <div className="flex flex-wrap gap-2 md:flex-nowrap">
            <div className="mb-6 md:w-1/2 md:pr-3">
              <label className="mb-1 text-lg font-semibold text-main">
                Number of Vacancies *
              </label>
              <Controller
                name="availableVacancies"
                control={control}
                defaultValue={1}
                rules={{
                  required: "Vacancy is required",
                  min: {
                    value: 1,
                    message: "Vacancy must be at least 1",
                  },
                }}
                render={({ field }) => (
                  <FormControl
                    component="fieldset"
                    error={!!errors?.availableVacancies?.message}
                    fullWidth
                  >
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        className="h-[42px] w-[42px]"
                        color={errors?.availableVacancies ? "error" : "primary"}
                        onClick={() =>
                          field.onChange((Number(field.value) || 2) - 1)
                        }
                        disabled={!field.value || field.value <= 1} // Disable the minus button when count is 1
                      >
                        <Remove />
                      </Button>
                      <TextField
                        {...field}
                        className="h-14 w-20"
                        type="number"
                        placeholder="Num of Vacancies"
                        error={!!errors?.availableVacancies?.message}
                      />

                      <Button
                        variant="outlined"
                        className="h-[42px] w-[42px]"
                        color={errors?.availableVacancies ? "error" : "primary"}
                        onClick={() =>
                          field.onChange((Number(field.value) || 0) + 1)
                        }
                      >
                        <Add />
                      </Button>
                    </div>

                    {errors.availableVacancies && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.availableVacancies.message}
                      </p>
                    )}
                  </FormControl>
                )}
              />
            </div>
            <div className="mb-6 md:w-1/2 md:pr-3">
              <label className="mb-1 text-lg font-semibold text-main">
                start date *
              </label>
              <Controller
                name="startDateType"
                control={control}
                defaultValue=""
                rules={{ required: "Start Date Type is required" }}
                render={({ field }) => (
                  <FormControl
                    component="fieldset"
                    error={Boolean(errors?.startDateType)}
                    fullWidth
                  >
                    <RadioGroup
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      sx={{
                        display: "flex",
                        flexWrap: { xs: "wrap", md: "nowrap" },
                        px: 1,
                        gap: 1,
                        flexDirection: "row",
                      }}
                    >
                      {startDateTypeOptions.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          value={item.id}
                          name="startDateType"
                          control={<Radio style={{ display: "none" }} />}
                          label={item.label}
                          className={`h-[42px] cursor-pointer rounded-base border border-input-border px-3 font-normal focus:outline-offset-2 focus:outline-secondary ${
                            field.value === item.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "text-neutral-500 hover:border-black hover:text-muted-foreground"
                          }`}
                        />
                      ))}
                    </RadioGroup>

                    {errors?.startDateType && (
                      <FormHelperText>
                        {errors.startDateType.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>
          </div>
        </div>
        {/* About the job section */}
        <div className="mb-4 rounded-base border border-gray-200 bg-white p-4 shadow-soft">
          <h5 className="mb-12 mt-4 text-center text-3xl font-bold text-main">
            About The Job
          </h5>
          <div className="mb-4 w-full">
            <h6 className="mb-2 text-xl font-bold text-main">
              Job Description
            </h6>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextEditor {...field} value={jobData.description} hasLinks={false} />
              )}
            />
          </div>
          <div className="w-full">
            <h6 className="mb-2 text-xl font-bold text-main">
              Job Requirements
            </h6>
            <Controller
              name="requirements"
              control={control}
              render={({ field }) => (
                <TextEditor {...field} value={jobData.requirements} hasLinks={false} />
              )}
            />
          </div>
        </div>
        {/* Skills & Keywords section */}
        <div className="mb-4 rounded-base border border-gray-200 bg-white p-4 shadow-soft">
          <h5 className="mb-12 mt-4 text-center text-3xl font-bold text-main">
            Skills & Keywords
          </h5>

          <div className="mb-8 rounded-md bg-green-50 p-4">
            <h6 className="mb-2 text-xl font-semibold text-main">
              Skills related to the job post{" "}
            </h6>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <MultiTextInput
                  {...field}
                  placeholder="Add your skills (press Enter after each)"
                />
              )}
            />
          </div>
          {/* Keywords */}
          <div className="rounded-md bg-green-50 p-4">
            <h6 className="text-xl font-semibold text-main">Keywords</h6>
            <p className="mb-3 text-sm text-muted-foreground">
              Enter keywords including any related job titles, technologies, or
              keywords the candidate should have in his CV.
            </p>
            <Controller
              name="keywords"
              control={control}
              render={({ field }) => (
                <MultiTextInput
                  {...field}
                  placeholder="Add your Keywords (press Enter after each)"
                />
              )}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-between flex gap-2 rounded-base border border-gray-200 bg-white p-4 shadow-soft md:justify-end">
          {/* <Button variant="outlined" >Back</Button> */}
          <Button
            onClick={() => onDraftSubmit()}
            disabled={draftLoading || !(initialIsDirty || isDirty)}
            className="bg-[#FFAE35] text-[#464748] hover:enabled:bg-[#e19e39] disabled:opacity-50"
          >
            {draftLoading ? "Loading... " : "Save and Publish Later"}
          </Button>
          <Button type="submit" variant="contained">
            next
          </Button>
        </div>
      </form>
    </>
  );
};

export default JobDetailsStep;
