"use client";
import { cn } from "@/util";
import { Button, Collapse } from "@mui/material";
import { useState } from "react";
interface ClampedListProps<T, P> extends React.HTMLAttributes<HTMLDivElement> {
  data: T[];
  componentProps: P;
  initialVisibleItems: number;
  type: string;
  buttonClassName?: string;
  Component: React.FC<P & { item: T; index: number }>;
}

function ClampedList<T extends { id?: string }, P>({
  data,
  initialVisibleItems,
  Component,
  componentProps,
  buttonClassName,
  type,
  ...props
}: ClampedListProps<T, P>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggle = () => setIsExpanded(!isExpanded);
  const remainingItems = data.length - initialVisibleItems;

  return (
    <>
      <div {...props}>
        {data.slice(0, initialVisibleItems).map((item, index) => (
          <Component
            key={item.id}
            index={index}
            item={item}
            {...componentProps}
          />
        ))}
      </div>
      <Collapse in={isExpanded}>
        <div {...props}>
          {data.slice(initialVisibleItems).map((item, index) => (
            <Component
              key={item.id}
              index={index + initialVisibleItems}
              item={item}
              {...componentProps}
            />
          ))}
        </div>
      </Collapse>
      {/* Show more/less button */}
      {data.length > initialVisibleItems ? (
        <div
          className={cn(
            "mt-4 flex items-center justify-center",
            buttonClassName,
          )}
        >
          <Button className="p-0" variant="text" onClick={toggle}>
            {isExpanded
              ? `Show less ${type} ${remainingItems > 1 ? "s" : ""}`
              : `Show ${remainingItems} more ${type} ${remainingItems > 1 ? "s" : ""}`}
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default ClampedList;
