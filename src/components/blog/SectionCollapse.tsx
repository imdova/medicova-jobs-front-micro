import { KeyboardArrowDown } from "@mui/icons-material";
import { Collapse } from "@mui/material";
import { useState } from "react";

const SectionCollapse = ({
  title,
  icon,
  children,
  defaultValue = false,
}: {
  title: string;
  defaultValue?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultValue);
  const toggle = () => setIsExpanded((pv) => !pv);

  return (
    <div className="border-b pb-2">
      <div
        className={`flex h-[45px] min-h-[40px] cursor-pointer flex-row justify-start transition-all duration-300 ease-in-out`}
        onClick={toggle}
      >
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-4 text-left normal-case">
            <span className="border rounded-[4px] p-2">
              {icon && icon}
            </span>
            <span className=" font-semibold">{title}</span>
          </div>
          <KeyboardArrowDown
            className={`${isExpanded ? "rotate-180" : ""} transition-transform duration-300`}
          />
        </div>
      </div>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </div>
  );
};

export default SectionCollapse;
