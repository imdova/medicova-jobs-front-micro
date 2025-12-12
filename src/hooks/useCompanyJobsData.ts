import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearJobsSuccess,
  fetchJobsByCompanyId,
} from "@/store/slices/jobSlice";
import { JobData } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface GetJobsProps {
  companyId?: string | null;
  page?: number | string;
  limit?: number | string;
}

export const useCompanyJobsData = (
  jobProps?: GetJobsProps | null,
  onSuccess?: (result?: JobData) => void,
) => {
  const { companyId, page = 1, limit = 10 } = jobProps || {};
  const { data: session } = useSession();
  const user = session?.user;
  const id = companyId || user?.companyId || null;

  const dispatch = useAppDispatch();
  const {
    data: jobs,
    loading,
    adding,
    removing,
    updating,
    success,
    error,
    lastResult,
    total,
  } = useAppSelector((state) => state.companyJobs);

  // Fetch jobs only once per companyId
  useEffect(() => {
    if (!id) return;
    dispatch(
      fetchJobsByCompanyId({
        companyId: id,
        page: Number(page),
        limit: Number(limit),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

  // Handle success callback
  useEffect(() => {
    if (success) {
      onSuccess?.(lastResult || undefined);
      dispatch(clearJobsSuccess());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, dispatch, onSuccess]);

  return {
    jobs,
    loading,
    adding,
    removing,
    updating,
    error,
    total,
  };
};
