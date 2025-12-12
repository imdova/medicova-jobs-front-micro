"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// Types
import { FieldConfig } from "@/types";
import { ActivityData, UserProfile } from "@/types/seeker";

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
import educationImage from "@/components/icons/education.png";

// Utils
import Image from "next/image";
import { formatDate } from "@/util";
import {
  createActivity,
  deleteActivity,
  fetchActivities,
  updateActivity,
} from "@/store/slices/activity.slice";

/* -------------------------------------------------------------------------- */
/*                                CONFIGURATION                               */
/* -------------------------------------------------------------------------- */
// Preview limits
const INITIAL_VISIBLE_ITEMS = 2;

/* -------------------------------------------------------------------------- */
/*                               HELPER COMPONENTS                            */
/* -------------------------------------------------------------------------- */

/**
 * Renders the "About" modal form.
 */
const ActivityFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (formData: Partial<ActivityData>) => void;
  onUpdate: (formData: Partial<ActivityData>) => void;
  onDelete: (formData: Partial<ActivityData>) => void;
  initialValue: Partial<ActivityData>;
}> = ({ open, onClose, onCreate, onUpdate, onDelete, initialValue }) => {
  const fields: FieldConfig[] = [
    {
      name: "title",
      type: "text",
      label: "Activity Title",
      textFieldProps: {
        placeholder: "e.g., Community Health Workshop, Blood Donation Drive",
      },
      required: true,
    },
    {
      name: "provider",
      type: "text",
      label: "Organizing Institution",
      gridProps: { xs: 8 },
      textFieldProps: {
        placeholder: "e.g., Red Cross, Local Health Department, Hospital XYZ",
      },
      required: true,
    },
    {
      name: "date",
      type: "date",
      label: "Activity Date",
      gridProps: { xs: 4 },
      textFieldProps: {
        placeholder: "e.g., 2000-06-18",
      },
      required: true,
    },
  ];

  const onSubmit = (formData: Partial<ActivityData>) => {
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
      deleteButtonText="Delete Activity"
      title="Add Activity"
      initialValues={initialValue}
    />
  );
};

/**
 * Renders the About section content with collapsible preview.
 */
const ActivitiesContent: React.FC<{
  activities: ActivityData[];
  onAdd: () => void;
  onEdit: (item: ActivityData) => void;
}> = ({ activities, onAdd, onEdit }) => {
  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">
          Activities & Achievements
        </h3>
        <IconButton
          className="rounded border border-solid border-gray-200 p-2"
          onClick={onAdd}
        >
          <Add />
        </IconButton>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {activities.slice(0, INITIAL_VISIBLE_ITEMS).map((activity) => (
          <ActivityItem key={activity.id} item={activity} onEdit={onEdit} />
        ))}
        {INITIAL_VISIBLE_ITEMS < activities.length && (
          <Collapsible>
            <CollapsibleContent className="CollapsibleContent">
              {activities.slice(INITIAL_VISIBLE_ITEMS).map((activity) => (
                <ActivityItem
                  key={activity.id}
                  item={activity}
                  onEdit={onEdit}
                />
              ))}
            </CollapsibleContent>
            <CollapsibleTrigger className="group mt-2 w-full text-center text-sm text-muted-foreground hover:text-main">
              Show
              <span className="text-sm group-aria-expanded:hidden">
                {" "}
                {activities.length - INITIAL_VISIBLE_ITEMS} more{" "}
              </span>
              <span className="hidden text-sm group-aria-expanded:inline">
                {" "}
                less{" "}
              </span>
              activities & achievements
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{
  item: ActivityData;
  onEdit: (item: ActivityData) => void;
}> = ({ item, onEdit }) => {
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
            {item.title}
          </h6>
          <IconButton onClick={() => onEdit(item)}>
            <Edit className="h-5 w-5" />
          </IconButton>
        </div>
        <p className="text-sm text-muted-foreground">{item.provider}</p>
        <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

const SeekerActivitiesCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { data: activities, fetching } = useAppSelector(
    (state) => state.activity,
  );
  useEffect(() => {
    if (!user.id) return;
    dispatch(fetchActivities(user.id));
  }, [dispatch, user.id]);

  const [initialValue, setInitialValue] = useState<Partial<ActivityData>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const onEdit = (item: ActivityData) => {
    setIsModalOpen(true);
    setInitialValue(item);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setInitialValue({});
  };

  const handleCreate = (formData: Partial<ActivityData>) => {
    dispatch(createActivity({ seekerId: user.id, activity: formData }));
    handleClose();
  };

  const handleUpdate = (formData: Partial<ActivityData>) => {
    if (formData.id) {
      dispatch(updateActivity({ id: formData.id, updates: formData }));
      handleClose();
    }
  };

  const handleDelete = (formData: Partial<ActivityData>) => {
    if (formData.id) {
      dispatch(deleteActivity(formData.id));
    }
    handleClose();
  };

  const isEmpty = activities.length === 0;

  if (fetching && isEmpty) {
    return <CourseSkeleton />;
  }

  return (
    <>
      {/* About Form Modal */}
      <ActivityFormModal
        open={isModalOpen}
        onClose={handleClose}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        initialValue={initialValue}
      />

      {/* If empty show placeholder, else show content */}
      {isEmpty ? (
        <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
          <h5 className="mb-2 text-xl font-semibold text-main">
            Activity & Achievements
          </h5>
          <EmptyCard
            src="/images/activities.png"
            description="Your Activities Section is empty."
            buttonText="Add Activity"
            onClick={handleOpen}
          />
        </div>
      ) : (
        <ActivitiesContent
          activities={activities}
          onAdd={handleOpen}
          onEdit={onEdit}
        />
      )}
    </>
  );
};

export default SeekerActivitiesCard;
