"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import experiencesImage from "@/components/icons/briefcase.png";

// Types
import { FieldConfig } from "@/types";
import { ExperienceData, UserProfile } from "@/types/seeker";
type OptExperienceData = ExperienceData & {
  startYear: string;
  endYear: string;
  startMonth: string;
  endMonth: string;
};

// UI Components
import EmptyCard from "@/components/UI/emptyCard";
import FormModal from "@/components/form/FormModal/FormModal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/Collapsible";
import { IconButton } from "@mui/material";
import { Add, Edit, LocationOnOutlined } from "@mui/icons-material";

// Utils
import { formatLocation } from "@/util/general";
import { formatDate, getDuration } from "@/util";
import Image from "next/image";
import { useLocationData } from "@/hooks/useLocationData";
import {
  createExperience,
  deleteExperience,
  fetchExperiences,
  updateExperience,
} from "@/store/slices/experience.slice";
import ExperienceSkeleton from "@/components/loading/skeleton-experince";

/* -------------------------------------------------------------------------- */
/*                                CONFIGURATION                               */
/* -------------------------------------------------------------------------- */
const years = Array.from(
  { length: new Date().getFullYear() - 1980 + 1 },
  (v, k) => k + 1980,
).reverse();
const months = [
  { full: "January", short: "Jan", number: "01" },
  { full: "February", short: "Feb", number: "02" },
  { full: "March", short: "Mar", number: "03" },
  { full: "April", short: "Apr", number: "04" },
  { full: "May", short: "May", number: "05" },
  { full: "June", short: "Jun", number: "06" },
  { full: "July", short: "Jul", number: "07" },
  { full: "August", short: "Aug", number: "08" },
  { full: "September", short: "Sep", number: "09" },
  { full: "October", short: "Oct", number: "10" },
  { full: "November", short: "Nov", number: "11" },
  { full: "December", short: "Dec", number: "12" },
];
// Preview limits
const INITIAL_VISIBLE_ITEMS = 2;
/* -------------------------------------------------------------------------- */
/*                               HELPER FUNCTIONS                            */
/* -------------------------------------------------------------------------- */

const getInitialValues = (values: Partial<ExperienceData>) => {
  const initialValues: Partial<OptExperienceData> = values
    ? {
        ...values,
        startYear: values.startDate?.split("-")[0],
        endYear: values.isPresent ? "" : values.endDate?.split("-")[0],
        startMonth: values.startDate?.split("-")[1],
        endMonth: values.isPresent ? "" : values.endDate?.split("-")[1],
      }
    : {};
  return initialValues;
};

/* -------------------------------------------------------------------------- */
/*                               HELPER COMPONENTS                            */
/* -------------------------------------------------------------------------- */

/**
 * Renders the "About" modal form.
 */
const ExperienceFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (formData: Partial<ExperienceData>) => void;
  onUpdate: (formData: Partial<ExperienceData>) => void;
  onDelete: (formData: Partial<ExperienceData>) => void;
  initialValue: Partial<ExperienceData>;
}> = ({ open, onClose, onCreate, onUpdate, onDelete, initialValue }) => {
  const [countryCode, setCountryCode] = useState(
    initialValue?.country?.code || "",
  );
  const { countries, states } = useLocationData(countryCode);
  const fields: FieldConfig[] = [
    {
      name: "title",
      type: "text",
      label: "Job Title",
      textFieldProps: { placeholder: "Enter Job Title" },
      required: true,
    },
    {
      name: "name",
      type: "text",
      required: true,
      label: "Company | Organization",
      textFieldProps: { placeholder: "Enter Company" },
    },
    {
      name: "startYear",
      type: "search-select",
      label: "Start Year",
      gridProps: { xs: 6 },
      textFieldProps: { placeholder: "Start Year" },
      options: years.map((year) => ({
        value: year.toString(),
        label: year.toString(),
      })),
      required: true,
    },
    {
      name: "startMonth",
      label: "Start Month",
      type: "search-select",
      gridProps: { xs: 6 },
      textFieldProps: { placeholder: "Start Month" },
      options: months.map((month) => ({
        value: month.number,
        label: month.full,
      })),

      required: true,
    },
    {
      // TODO: add Validations for the year and month
      name: "endYear",
      label: "End Year",
      type: "search-select",
      gridProps: { xs: 6 },
      textFieldProps: { placeholder: "End Year" },
      options: years.map((year) => ({
        value: year.toString(),
        label: year.toString(),
      })),
      rules: {
        validate: (value: string, formValues: OptExperienceData) => {
          return !value ||
            !formValues?.startYear ||
            Number(value) >= Number(formValues.startYear)
            ? true
            : "End Year must be after start year";
        },
      },
      required: true,
    },
    {
      name: "endMonth",
      label: "End Month",
      type: "search-select",
      gridProps: { xs: 6 },
      textFieldProps: { placeholder: "End Month" },
      options: months.map((month) => ({
        value: month.number,
        label: month.full,
      })),
      required: true,
    },
    {
      name: "isPresent",
      label: "I currently work there",
      type: "checkbox",
      resetFields: ["endYear", "endMonth"],
      hideFieldNames: ["endYear", "endMonth"], // Multiple fields to hide
    },
    {
      name: "country.code",
      type: "search-select",
      label: "Country",
      required: true,
      resetFields: ["state.code"],
      textFieldProps: {
        placeholder: "Select country",
      },
      options: countries.map((country) => ({
        value: country.isoCode,
        label: country.name,
      })),
      onChange: (value) => setCountryCode(value),
      gridProps: { xs: 6, md: 4 },
    },
    {
      name: "state.code",
      type: "search-select",
      label: "State",
      required: true,
      dependsOn: "country.code",
      textFieldProps: {
        placeholder: "Select state",
      },
      options: states.map((state) => ({
        value: state.isoCode,
        label: state.name,
      })),
      gridProps: { xs: 6, md: 4 },
    },
    {
      name: "city",
      type: "text",
      label: "City",
      required: true,
      textFieldProps: {
        placeholder: "Enter City",
      },
      gridProps: { xs: 12, md: 4 },
      rules: {
        minLength: { value: 2, message: "City must be at least 2 characters" },
      },
    },
  ];

  const onSubmit = (formData: Partial<OptExperienceData>) => {
    const { state: formState, country: formCountry } = formData;
    const country =
      countries.find((country) => country.isoCode === formCountry?.code) ||
      null;
    const state =
      states.find((state) => state.isoCode === formState?.code) || null;

    const startDate = formData.startYear + "-" + formData.startMonth;
    const endDate = formData.isPresent
      ? null
      : formData.endYear + "-" + formData.endMonth;

    const body = {
      ...formData,
      country: { code: country?.isoCode, name: country?.name },
      state: { code: state?.isoCode, name: state?.name },
      startDate,
      endDate,
    } as ExperienceData;

    if (body?.id) {
      onUpdate(body);
    } else {
      onCreate(body);
    }
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onDelete={initialValue?.id ? onDelete : undefined}
      fields={fields}
      title="Add Experience"
      deleteButtonText="Delete Experience"
      initialValues={initialValue}
    />
  );
};

/**
 * Renders the About section content with collapsible preview.
 */
const ExperienceContent: React.FC<{
  experiences: ExperienceData[];
  onAdd: () => void;
  onEdit: (item: ExperienceData) => void;
}> = ({ experiences, onAdd, onEdit }) => {
  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">Experiences</h3>
        <IconButton
          className="rounded border border-solid border-gray-200 p-2"
          onClick={onAdd}
        >
          <Add />
        </IconButton>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        {experiences
          .slice(0, INITIAL_VISIBLE_ITEMS)
          .map((experience, index) => (
            <ExperienceItem
              key={experience.id}
              item={experience}
              index={index}
              length={experiences.length}
              onEdit={onEdit}
            />
          ))}
        {INITIAL_VISIBLE_ITEMS < experiences.length && (
          <Collapsible className="col-span-2">
            <CollapsibleContent className="CollapsibleContent">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {experiences
                  .slice(INITIAL_VISIBLE_ITEMS)
                  .map((experience, index) => (
                    <ExperienceItem
                      key={experience.id}
                      item={experience}
                      index={index + INITIAL_VISIBLE_ITEMS}
                      length={experiences.length}
                      onEdit={onEdit}
                    />
                  ))}
              </div>
            </CollapsibleContent>
            <CollapsibleTrigger className="group mt-2 w-full text-center text-sm text-muted-foreground hover:text-main">
              Show
              <span className="text-sm group-aria-expanded:hidden">
                {" "}
                {experiences.length - INITIAL_VISIBLE_ITEMS} more{" "}
              </span>
              <span className="hidden text-sm group-aria-expanded:inline">
                {" "}
                less{" "}
              </span>
              experiences
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

const ExperienceItem: React.FC<{
  item: ExperienceData;
  index: number;
  length: number;
  onEdit: (item: ExperienceData) => void;
}> = ({ item, index, length, onEdit }) => {
  const isLastItem = index === length - 1;
  const isOddLength = length % 2 !== 0;
  const spanTwoCols = isOddLength && isLastItem;

  const location = formatLocation(item);
  const duration = getDuration({
    startDate: item.startDate,
    endDate: item.isPresent ? undefined : item.endDate,
  });
  return (
    <div
      className={`${spanTwoCols ? "col-span-2" : "col-span-1"} flex items-start gap-3 rounded-base border border-gray-200 p-2`}
    >
      <Image src={experiencesImage} alt="Experience" width={60} height={60} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold leading-tight text-main">{item.name}</h6>
          <IconButton onClick={() => onEdit(item)}>
            <Edit className="h-5 w-5" />
          </IconButton>
        </div>
        <p className="text-sm text-muted-foreground">{item.title}</p>
        <p className="text-sm text-muted-foreground">
          {formatDate(item.startDate, { year: true, month: true, day: false })}{" "}
          -{" "}
          {item.isPresent
            ? "Now"
            : formatDate(item.endDate, {
                year: true,
                month: true,
                day: false,
              })}{" "}
          {duration}
        </p>
        <div className="flex text-sm text-muted-foreground">
          <LocationOnOutlined className="-ml-1 text-base" />
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

const SeekerExperienceCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { data: experiences, fetching } = useAppSelector(
    (state) => state.experience,
  );
  useEffect(() => {
    if (!user.id) return;
    dispatch(fetchExperiences(user.id));
  }, [dispatch, user.id]);

  const createInitialValue = getInitialValues({
    country: user.country || { code: "", name: "" },
    state: user.state || { code: "", name: "" },
    isPresent: true,
    city: user.city || "",
  });
  const [initialValue, setInitialValue] =
    useState<Partial<ExperienceData>>(createInitialValue);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const onEdit = (item: ExperienceData) => {
    setIsModalOpen(true);
    setInitialValue(getInitialValues(item));
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setInitialValue(createInitialValue);
  };

  const handleCreate = (formData: Partial<ExperienceData>) => {
    dispatch(createExperience({ seekerId: user.id, experience: formData }));
    handleClose();
  };

  const handleUpdate = (formData: Partial<ExperienceData>) => {
    if (formData.id) {
      dispatch(updateExperience({ id: formData.id, updates: formData }));
      handleClose();
    }
  };

  const handleDelete = (formData: Partial<ExperienceData>) => {
    if (formData.id) {
      dispatch(deleteExperience(formData.id));
    }
    handleClose();
  };

  const ExperienceEmpty = experiences.length === 0;

  if (fetching && ExperienceEmpty) {
    return <ExperienceSkeleton />;
  }

  return (
    <>
      {/* About Form Modal */}
      <ExperienceFormModal
        open={isModalOpen}
        onClose={handleClose}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        initialValue={initialValue}
      />

      {/* If empty show placeholder, else show content */}
      {ExperienceEmpty ? (
        <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
          <h5 className="mb-2 text-xl font-semibold text-main">Experiences</h5>
          <EmptyCard
            src="/images/activities.png"
            description="Your Experience Section is empty."
            buttonText="Add Experience"
            onClick={handleOpen}
          />
        </div>
      ) : (
        <ExperienceContent
          experiences={experiences}
          onAdd={handleOpen}
          onEdit={onEdit}
        />
      )}
    </>
  );
};

export default SeekerExperienceCard;
