"use client";

import React, { useState } from "react";
import { useAppDispatch } from "@/store/hooks";

// Types
import { Company, FieldConfig } from "@/types";

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
import { updateCompany } from "@/store/slices/companySlice";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import Guard from "@/components/auth/Guard";

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
  onSubmit: (formData: Partial<Company>) => void;
  initialValue: string;
}> = ({ open, onClose, onSubmit, initialValue }) => (
  <FormModal
    open={open}
    onClose={onClose}
    onSubmit={onSubmit}
    fields={fields}
    title="About Company"
    description="Add a brief company description for potential employees. This section is public."
    initialValues={{ about: initialValue }}
  />
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
        <h5 className="mb-2 text-xl font-semibold text-main">About Company:</h5>
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

const CompanyAboutCard: React.FC<{ company: Company }> = ({ company }) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleUpdate = async (formData: Partial<Company>) => {
    dispatch(updateCompany({ id: company.id, updates: formData }));
    setIsModalOpen(false);
  };

  const aboutEmpty =
    !company?.about ||
    company?.about.trim() === "" ||
    company?.about.trim() === "<p></p>";

  return (
    <>
      {/* About Form Modal */}
      <AboutFormModal
        open={isModalOpen}
        onClose={handleClose}
        onSubmit={handleUpdate}
        initialValue={company.about || ""}
      />

      {/* If empty show placeholder, else show content */}
      {aboutEmpty ? (
        <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
          <h5 className="mb-2 text-xl font-semibold text-main">About Company :</h5>
          <Guard fallback={<p className="w-full text-center text-sm text-muted-foreground">
            No about information
          </p>} permissions={[Permission_Keys.Employer_ManageCompanySettings]}>
            <EmptyCard
              src="/images/activities.png"
              description="Your About Section is empty."
              buttonText="Write About Your Company"
              onClick={handleOpen}
            />
          </Guard>
        </div>
      ) : (
        <AboutContent about={company.about || ""} onEdit={handleOpen} />
      )}
    </>
  );
};

export default CompanyAboutCard;
