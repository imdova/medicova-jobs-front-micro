"use client";
import MinJobCard from "@/components/UI/job-card-min";
import { JobData } from "@/types";
import { Button, Collapse } from "@mui/material";
import { useState } from "react";

interface JobsClampedListProps extends React.HTMLAttributes<HTMLDivElement> {
  data: JobData[];
}

const INITIAL_VISIBLE_ITEMS = 2;

function JobsClampedList({ data, ...props }: JobsClampedListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggle = () => setIsExpanded(!isExpanded);
  const remainingItems = data.length - INITIAL_VISIBLE_ITEMS;

  return (
    <>
      <div {...props}>
        {data.slice(0, INITIAL_VISIBLE_ITEMS).map((item) => (
          <MinJobCard key={item.id} item={item} />
        ))}
      </div>
      <Collapse in={isExpanded}>
        <div {...props}>
          {data.slice(INITIAL_VISIBLE_ITEMS).map((item) => (
            <MinJobCard key={item.id} item={item} />
          ))}
        </div>
      </Collapse>
      {/* Show more/less button */}
      {data.length > INITIAL_VISIBLE_ITEMS ? (
        <div className="mt-4 flex items-center justify-center rounded-base border border-gray-200 bg-white p-3 shadow-lg">
          <Button className="p-0" variant="text" onClick={toggle}>
            {isExpanded
              ? `Show less jobs ${remainingItems > 1 ? "s" : ""}`
              : `Show ${remainingItems} more jobs ${remainingItems > 1 ? "s" : ""}`}
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default JobsClampedList;
