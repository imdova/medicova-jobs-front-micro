import React from "react";
import { Switch } from "@mui/material";
import { JobData } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { updateJob } from "@/store/slices/jobSlice";

interface JobSwitchProps {
  job: JobData;
}

const JobSwitch: React.FC<JobSwitchProps> = ({ job }) => {
  const dispatch = useAppDispatch();
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const status = event.target.checked;
    if (job.id) {
      dispatch(updateJob({ id: job.id, updates: { active: status } }));
    }
  };

  return <Switch checked={job.active ? true : false} onChange={handleToggle} />;
};

export default JobSwitch;
