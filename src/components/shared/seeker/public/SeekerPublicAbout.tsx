import React from "react";
import { UserProfile } from "@/types/seeker";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/Collapsible";
import { findCutIndex } from "@/util/forms";

const PREVIEW_LIMIT = 400;
const MAX_LIMIT = 500;

const SeekerPublicAbout: React.FC<{ user: UserProfile }> = ({ user }) => {
  const about = user?.about || "";
  if (!about) {
    return (
      <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
        <h5 className="mb-2 text-xl font-semibold text-main">About</h5>
        <p className="w-full text-center text-sm text-muted-foreground">
          No about information
        </p>
      </div>
    );
  }

  // Limit preview to ~150 characters

  const cutIndex = findCutIndex(about, PREVIEW_LIMIT);
  const isLong = about.length > MAX_LIMIT;
  const previewHTML = isLong ? about.slice(0, cutIndex) : about;
  const restHTML = isLong ? about.slice(cutIndex) : "";

  return (
    <div className="rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      {/* Header with edit button */}
      <div className="flex items-center justify-between">
        <h5 className="mb-2 text-xl font-semibold text-main">About</h5>
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

export default SeekerPublicAbout;
