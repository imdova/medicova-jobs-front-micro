"use client";
import { JobData } from "@/types";
import { formatDistanceToNow } from "@/util";
import { formatLocation } from "@/util/general";
import { Search } from "@mui/icons-material";
import {
  InputAdornment,
  SelectChangeEvent,
  SelectProps,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface SelectJobProps extends Omit<SelectProps<string>, "children"> {
  jobs: JobData[];
}
const filterItems = (items: JobData[], searchTerm: string) => {
  return items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

const SelectJob: React.FC<SelectJobProps> = ({
  jobs,
  onChange,
  value,
  label,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="p-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-main">{label}</h2>
        <TextField
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search folders"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            classes: {
              input: "p-2", // Add padding to the input element
            },
          }}
        />
      </div>
      <div className="scroll-bar-minimal grid max-h-[200px] grid-flow-row gap-1 overflow-y-auto overflow-x-hidden p-2">
        {filterItems(jobs, searchTerm).map((job) => (
          <JobItem key={job.id} job={job} onChange={onChange} value={value} />
        ))}
      </div>
    </div>
  );
};

export default SelectJob;

interface JobItemProps {
  job: JobData;
  onChange?: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  value?: string;
}

const JobItem: React.FC<JobItemProps> = ({ job, onChange, value }) => {
  const isSelected = job.id === value;
  const location = formatLocation(job);
  const clickHandler = () => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: job.id || "" },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent, null);
    }
  };
  return (
    <button
      type="button"
      onClick={clickHandler}
      className={`${isSelected ? "scale-[1.01] border-primary shadow-lg" : "border-gray-200"} rounded-md border bg-white p-2 text-left duration-150 hover:scale-[1.01] hover:border-primary hover:shadow-lg`}
    >
      <h6 className="font-semibold text-main">
        {job.title}{" "}
        <span className="text-xs text-muted-foreground">
          {" | "}
          {location} | {formatDistanceToNow(job.created_at)}
        </span>
      </h6>
      {/* <p className="text-sm text-muted-foreground">
        {job.location} | {job.education} | {job.specialty}
      </p> */}
    </button>
  );
};
