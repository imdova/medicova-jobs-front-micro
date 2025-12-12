"use client";

import React, { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateUserProfile } from "@/store/slices/profileSlice";

// Types
import { FieldConfig } from "@/types";
import { UserProfile } from "@/types/seeker";

// UI Components
import EmptyCard from "@/components/UI/emptyCard";
import FormModal from "@/components/form/FormModal/FormModal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/Collapsible";
import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";

// Utils
import { findCutIndex } from "@/util/forms";

/* -------------------------------------------------------------------------- */
/*                                CONFIGURATION                               */
/* -------------------------------------------------------------------------- */
const fields: FieldConfig[] = [{ name: "about", type: "textEditor", componentProps: { hasLinks: false, className: "p-2" } }];

// Preview limits
const PREVIEW_LIMIT = 400;
const MAX_LIMIT = 500;

/* -------------------------------------------------------------------------- */
/*                               HELPER COMPONENTS                            */
/* -------------------------------------------------------------------------- */

/**
 * Renders the "About" modal form.
 */
const AboutFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<UserProfile>) => void;
  initialValue: string;
}> = ({ open, onClose, onSubmit, initialValue }) => (
  <FormModal
    open={open}
    onClose={onClose}
    onSubmit={onSubmit}
    fields={fields}
    title="Introduce Yourself to Employers"
    description="Highlight your skills, experience, and commitment. Let potential employers know why you are the right fit to make a difference in their team!"
    initialValues={{ about: initialValue }}
  >
    <p className="my-2 rounded bg-primary/10 p-2 px-4 text-sm font-normal text-muted-foreground">
      <strong className="text-main">Note:</strong> Please avoid sharing any
      contact information or external links in this section.
    </p>
  </FormModal>
);

/**
 * Renders the About section content with collapsible preview.
 */
const AboutContent: React.FC<{ about: string; onEdit: () => void }> = ({
  about,
  onEdit,
}) => {
  const cutIndex = findCutIndex(about, PREVIEW_LIMIT);
  const isLong = about.length > MAX_LIMIT;

  const previewHTML = isLong ? about.slice(0, cutIndex) : about;
  const restHTML = isLong ? about.slice(cutIndex) : "";

  return (
    <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      {/* Header with edit button */}
      <div className="flex items-center justify-between">
        <h5 className="mb-2 text-xl font-semibold text-main">About</h5>
        <IconButton
          className="rounded border border-solid border-gray-200 p-2"
          onClick={onEdit}
        >
          <Edit />
        </IconButton>
      </div>

      {/* Collapsible text */}
      <Collapsible className="col-span-2">
        <div
          className="prose text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: previewHTML }}
        />

        {isLong && (
          <>
            <CollapsibleContent className="CollapsibleContent mx-1">
              <div
                className="prose text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: restHTML }}
              />
            </CollapsibleContent>

            <CollapsibleTrigger className="group mt-2 w-full text-center text-sm text-muted-foreground hover:text-main">
              <span className="text-sm group-aria-expanded:hidden">
                Show more
              </span>
              <span className="hidden text-sm group-aria-expanded:inline">
                Show less
              </span>
            </CollapsibleTrigger>
          </>
        )}
      </Collapsible>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

const SeekerAboutCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleUpdate = async (formData: Partial<UserProfile>) => {
    dispatch(updateUserProfile({ id: user.id, updates: formData }));
    setIsModalOpen(false);
  };

  const aboutEmpty =
    !user?.about ||
    user?.about.trim() === "" ||
    user?.about.trim() === "<p></p>";

  return (
    <>
      {/* About Form Modal */}
      <AboutFormModal
        open={isModalOpen}
        onClose={handleClose}
        onSubmit={handleUpdate}
        initialValue={user.about || ""}
      />

      {/* If empty show placeholder, else show content */}
      {aboutEmpty ? (
        <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
          <h5 className="mb-2 text-xl font-semibold text-main">About</h5>
          <EmptyCard
            src="/images/activities.png"
            description="Your About Section is empty."
            buttonText="Write About Yourself"
            onClick={handleOpen}
          />
        </div>
      ) : (
        <AboutContent about={user.about || ""} onEdit={handleOpen} />
      )}
    </>
  );
};

export default SeekerAboutCard;
