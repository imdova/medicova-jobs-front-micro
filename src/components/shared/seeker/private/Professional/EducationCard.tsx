"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import educationImage from "@/components/icons/education.png";

// Types
import { FieldConfig } from "@/types";
import { EducationData, UserProfile } from "@/types/seeker";

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
import EducationSkeleton from "@/components/loading/skeleton-education";

// Utils
import { formatLocation } from "@/util/general";
import Image from "next/image";
import { useLocationData } from "@/hooks/useLocationData";
import {
  createEducation,
  deleteEducation,
  fetchEducations,
  updateEducation,
} from "@/store/slices/education.slice";

/* -------------------------------------------------------------------------- */
/*                                CONFIGURATION                               */
/* -------------------------------------------------------------------------- */
import { educationOptions } from "@/constants/job";

const years = Array.from(
  { length: new Date().getFullYear() - 1980 + 1 },
  (v, k) => k + 1980,
).reverse();

// Preview limits
const INITIAL_VISIBLE_ITEMS = 2;

/* -------------------------------------------------------------------------- */
/*                               HELPER COMPONENTS                            */
/* -------------------------------------------------------------------------- */

/**
 * Renders the "About" modal form.
 */
const EducationFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (formData: Partial<EducationData>) => void;
  onUpdate: (formData: Partial<EducationData>) => void;
  onDelete: (formData: Partial<EducationData>) => void;
  initialValue: Partial<EducationData>;
}> = ({ open, onClose, onCreate, onUpdate, onDelete, initialValue }) => {
  const { countries } = useLocationData();
  const fields: FieldConfig[] = [
    {
      name: "inistitute",
      type: "text",
      label: "Educational Institute",
      textFieldProps: {
        placeholder: "e.g., University of Oxford, MIT, Delhi University",
      },
      required: true,
    },
    {
      name: "program",
      type: "text",
      label: "Program Name",
      textFieldProps: {
        placeholder:
          "e.g., Nursing, Radiologic Technology, Health Information Management",
      },
      required: true,
    },
    {
      name: "degree",
      type: "select",
      label: "Degree Awarded",
      textFieldProps: {
        placeholder: "e.g., Bachelor's, Master's, PhD",
      },
      gridProps: { xs: 8 },
      required: true,
      options: educationOptions.map((x) => ({
        label: x.label,
        value: x.id,
      })),
    },
    {
      name: "grade",
      label: "Final Grade or GPA",
      required: true,
      type: "text",
      textFieldProps: {
        placeholder: "e.g., 3.8 GPA, First Class Honours, A+",
      },
      gridProps: { xs: 4 },
    },
    {
      name: "startYear",
      label: "Year of Admission",
      type: "search-select",
      gridProps: { xs: 6 },
      textFieldProps: {
        placeholder: "e.g., 2019",
      },
      options: years.map((year) => ({
        value: year.toString(),
        label: year.toString(),
      })),
      required: true,
    },
    {
      name: "endYear",
      label: "Year of Graduation",
      type: "search-select",
      gridProps: { xs: 6 },
      textFieldProps: {
        placeholder: "e.g., 2023",
      },
      options: years.map((year) => ({
        value: year.toString(),
        label: year.toString(),
      })),
      rules: {
        validate: (value: string, formValues: EducationData) => {
          return !value ||
            !formValues?.startYear ||
            Number(value) >= Number(formValues.startYear)
            ? true
            : "End Year must be after Start Year";
        },
      },
      required: true,
    },
    {
      name: "country.code",
      type: "search-select",
      label: "Country of Institute",
      required: true,
      textFieldProps: {
        placeholder: "e.g., United States, India, United Kingdom",
      },
      options: countries.map((country) => ({
        value: country.isoCode,
        label: country.name,
      })),
    },
  ];

  const onSubmit = (formData: Partial<EducationData>) => {
    const country =
      countries.find(
        (country) => country.isoCode === formData?.country?.code,
      ) || null;
    const body = {
      ...formData,
      country: { code: country?.isoCode, name: country?.name },
    } as EducationData;

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
      deleteButtonText="Delete Education"
      title="Add Education"
      initialValues={initialValue}
    />
  );
};

/**
 * Renders the About section content with collapsible preview.
 */
const EducationContent: React.FC<{
  educations: EducationData[];
  onAdd: () => void;
  onEdit: (item: EducationData) => void;
}> = ({ educations, onAdd, onEdit }) => {
  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">Educations</h3>
        <IconButton
          className="rounded border border-solid border-gray-200 p-2"
          onClick={onAdd}
        >
          <Add />
        </IconButton>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {educations.slice(0, INITIAL_VISIBLE_ITEMS).map((experience, index) => (
          <EducationItem
            key={experience.id}
            item={experience}
            onEdit={onEdit}
          />
        ))}
        {INITIAL_VISIBLE_ITEMS < educations.length && (
          <Collapsible>
            <CollapsibleContent className="CollapsibleContent">
              {educations
                .slice(INITIAL_VISIBLE_ITEMS)
                .map((experience, index) => (
                  <EducationItem
                    key={experience.id}
                    item={experience}
                    onEdit={onEdit}
                  />
                ))}
            </CollapsibleContent>
            <CollapsibleTrigger className="group mt-2 w-full text-center text-sm text-muted-foreground hover:text-main">
              Show
              <span className="text-sm group-aria-expanded:hidden">
                {" "}
                {educations.length - INITIAL_VISIBLE_ITEMS} more{" "}
              </span>
              <span className="hidden text-sm group-aria-expanded:inline">
                {" "}
                less{" "}
              </span>
              educations
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

const EducationItem: React.FC<{
  item: EducationData;
  onEdit: (item: EducationData) => void;
}> = ({ item, onEdit }) => {
  const duration = item.endYear - item.startYear;
  const location = formatLocation(item);
  const degree =
    educationOptions.find((x) => x.id === item.degree)?.label || "";
  return (
    <div className="flex items-start gap-3 rounded-base border p-2">
      <Image
        src={educationImage}
        alt="Experience"
        width={70}
        height={70}
        className=""
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold leading-tight text-main">
            {item.inistitute}
          </h6>
          <IconButton onClick={() => onEdit(item)}>
            <Edit className="h-5 w-5" />
          </IconButton>
        </div>
        <p className="text-sm text-muted-foreground">
          {degree} in {item.program} - {item.grade}
        </p>
        <p className="text-sm text-muted-foreground">
          {item.startYear} -{item.endYear}{" "}
          {duration > 0 ? `(${duration} y)` : null}
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

const SeekerEducationCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { data: educations, fetching } = useAppSelector(
    (state) => state.education,
  );
  useEffect(() => {
    if (!user.id) return;
    dispatch(fetchEducations(user.id));
  }, [dispatch, user.id]);

  const [initialValue, setInitialValue] = useState<Partial<EducationData>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const onEdit = (item: EducationData) => {
    setIsModalOpen(true);
    setInitialValue(item);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setInitialValue({});
  };

  const handleCreate = (formData: Partial<EducationData>) => {
    dispatch(createEducation({ seekerId: user.id, education: formData }));
    handleClose();
  };

  const handleUpdate = (formData: Partial<EducationData>) => {
    if (formData.id) {
      dispatch(updateEducation({ id: formData.id, updates: formData }));
      handleClose();
    }
  };

  const handleDelete = (formData: Partial<EducationData>) => {
    if (formData.id) {
      dispatch(deleteEducation(formData.id));
    }
    handleClose();
  };

  const EducationEmpty = educations.length === 0;

  if (fetching && EducationEmpty) {
    return <EducationSkeleton />;
  }

  return (
    <>
      {/* About Form Modal */}
      <EducationFormModal
        open={isModalOpen}
        onClose={handleClose}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        initialValue={initialValue}
      />

      {/* If empty show placeholder, else show content */}
      {EducationEmpty ? (
        <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
          <h5 className="mb-2 text-xl font-semibold text-main">Education</h5>
          <EmptyCard
            src="/images/activities.png"
            description="Your Education Section is empty."
            buttonText="Add Education"
            onClick={handleOpen}
          />
        </div>
      ) : (
        <EducationContent
          educations={educations}
          onAdd={handleOpen}
          onEdit={onEdit}
        />
      )}
    </>
  );
};

export default SeekerEducationCard;
