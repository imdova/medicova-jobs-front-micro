"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// Types
import { FieldConfig } from "@/types";
import { CertificationData, UserProfile } from "@/types/seeker";

// UI Components
import EmptyCard from "@/components/UI/emptyCard";
import FormModal from "@/components/form/FormModal/FormModal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/Collapsible";
import { IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import CourseSkeleton from "@/components/loading/skeleton-courses";

// Utils
import Image from "next/image";
import { useLocationData } from "@/hooks/useLocationData";
import {
  createCourse,
  deleteCourse,
  fetchCourses,
  updateCourse,
} from "@/store/slices/courses.slice";
import { formatDate } from "@/util";

/* -------------------------------------------------------------------------- */
/*                                CONFIGURATION                               */
/* -------------------------------------------------------------------------- */

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
const CourseFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (formData: Partial<CertificationData>) => void;
  onUpdate: (formData: Partial<CertificationData>) => void;
  onDelete: (formData: Partial<CertificationData>) => void;
  initialValue: Partial<CertificationData>;
}> = ({ open, onClose, onCreate, onUpdate, onDelete, initialValue }) => {
  const { countries } = useLocationData();
  const fields: FieldConfig[] = [
    {
      name: "title",
      type: "text",
      label: "Course Title",
      textFieldProps: {
        placeholder:
          "e.g., Advanced Cardiac Life Support (ACLS), Medical Terminology",
      },
      required: true,
    },
    {
      name: "provider",
      type: "text",
      label: "Course Provider",
      gridProps: { xs: 6 },
      textFieldProps: {
        placeholder: "e.g., American Heart Association, Coursera, WHO",
      },
      required: true,
    },
    {
      name: "issueDate",
      type: "date",
      label: "Issue Date",
      gridProps: { xs: 6 },
      textFieldProps: {
        placeholder: "e.g., 2000-06-18",
      },
      required: true,
    },
    {
      name: "description",
      type: "textArea",
      label: "Course Description",
      textFieldProps: {
        placeholder:
          "Briefly describe what the course covered, e.g., emergency procedures, patient care, healthcare technology.",
      },
    },
  ];

  const onSubmit = (formData: Partial<CertificationData>) => {
    if (formData?.id) {
      onUpdate(formData);
    } else {
      onCreate(formData);
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
const CourseContent: React.FC<{
  courses: CertificationData[];
  onAdd: () => void;
  onEdit: (item: CertificationData) => void;
}> = ({ courses, onAdd, onEdit }) => {
  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">
          Courses and Certificates
        </h3>
        <IconButton
          className="rounded border border-solid border-gray-200 p-2"
          onClick={onAdd}
        >
          <Add />
        </IconButton>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {courses.slice(0, INITIAL_VISIBLE_ITEMS).map((course, index) => (
          <CourseItem key={course.id} item={course} onEdit={onEdit} />
        ))}
        {INITIAL_VISIBLE_ITEMS < courses.length && (
          <Collapsible>
            <CollapsibleContent className="CollapsibleContent">
              {courses.slice(INITIAL_VISIBLE_ITEMS).map((course, index) => (
                <CourseItem key={course.id} item={course} onEdit={onEdit} />
              ))}
            </CollapsibleContent>
            <CollapsibleTrigger className="group mt-2 w-full text-center text-sm text-muted-foreground hover:text-main">
              Show
              <span className="text-sm group-aria-expanded:hidden">
                {" "}
                {courses.length - INITIAL_VISIBLE_ITEMS} more{" "}
              </span>
              <span className="hidden text-sm group-aria-expanded:inline">
                {" "}
                less{" "}
              </span>
              courses
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

const CourseItem: React.FC<{
  item: CertificationData;
  onEdit: (item: CertificationData) => void;
}> = ({ item, onEdit }) => {
  return (
    <div className="flex items-start gap-3 rounded-base border p-2">
      <Image
        src={"/images/certificate.svg"}
        alt="Experience"
        width={60}
        height={60}
        className="rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold leading-tight text-main">
            {item.title}
          </h6>
          <IconButton onClick={() => onEdit(item)}>
            <Edit className="h-5 w-5" />
          </IconButton>
        </div>
        <p className="text-sm text-muted-foreground">{item.provider} </p>
        <p className="text-sm text-muted-foreground">{formatDate(item.issueDate)}</p>
        {item.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {" "}
            <strong className="text-sm text-main">Description:- </strong>{" "}
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

const SeekerCoursesCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { data: courses, fetching } = useAppSelector((state) => state.courses);
  useEffect(() => {
    if (!user.id) return;
    dispatch(fetchCourses(user.id));
  }, [dispatch, user.id]);

  const [initialValue, setInitialValue] = useState<Partial<CertificationData>>(
    {},
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const onEdit = (item: CertificationData) => {
    setIsModalOpen(true);
    setInitialValue(item);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setInitialValue({});
  };

  const handleCreate = (formData: Partial<CertificationData>) => {
    dispatch(createCourse({ seekerId: user.id, course: formData }));
    handleClose();
  };

  const handleUpdate = (formData: Partial<CertificationData>) => {
    if (formData.id) {
      dispatch(updateCourse({ id: formData.id, updates: formData }));
      handleClose();
    }
  };

  const handleDelete = (formData: Partial<CertificationData>) => {
    if (formData.id) {
      dispatch(deleteCourse(formData.id));
    }
    handleClose();
  };

  const CoursesEmpty = courses.length === 0;

  if (fetching && CoursesEmpty) {
    return <CourseSkeleton />;
  }

  return (
    <>
      {/* About Form Modal */}
      <CourseFormModal
        open={isModalOpen}
        onClose={handleClose}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        initialValue={initialValue}
      />

      {/* If empty show placeholder, else show content */}
      {CoursesEmpty ? (
        <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
          <h5 className="mb-2 text-xl font-semibold text-main">
            Courses and Certificates
          </h5>
          <EmptyCard
            src="/images/activities.png"
            description="Your Courses Section is empty."
            buttonText="Add Course"
            onClick={handleOpen}
          />
        </div>
      ) : (
        <CourseContent courses={courses} onAdd={handleOpen} onEdit={onEdit} />
      )}
    </>
  );
};

export default SeekerCoursesCard;
