import {
  API_CREATE_SAVED_JOB,
  API_DELETE_SAVED_JOB_BY_ID,
  API_GET_SAVED_JOBS_BY_SEEKER_ID,
} from "@/api/seeker";
import { JobData } from "@/types";
import { toQueryString } from "@/util/general";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface SavedJobState {
  jobs: string[]; // Assuming JobData is your job type
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: SavedJobState = {
  jobs: [],
  loading: false,
  saving: false,
  error: null,
};

// Async thunk for saving a job
export const toggleSaveJobToList = createAsyncThunk(
  "savedJobs/toggleSaveJob",
  async (
    {
      seekerId,
      jobId,
      isSaved,
    }: { seekerId: string; jobId: string; isSaved?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(
        isSaved ? API_DELETE_SAVED_JOB_BY_ID : API_CREATE_SAVED_JOB,
        {
          method: isSaved ? "DELETE" : "POST",
          body: JSON.stringify({ seekerId, jobId }),
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      if (response.ok) {
        return { jobId, isSaved };
      }
      return rejectWithValue("Failed to save job");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to save job",
      );
    }
  },
);
type Filter = {
  page: number;
  limit: number;
};

interface SavedJobType {
  id: string;
  jobId: string;
}

// Async thunk for fetching saved jobs
export const fetchSavedJobs = createAsyncThunk(
  "savedJobs/fetchSavedJobs",
  async (
    { seekerId, filter }: { seekerId?: string | null; filter: Filter },
    { rejectWithValue },
  ) => {
    try {
      if (!seekerId) return;
      const query = toQueryString(filter);
      const response = await fetch(
        API_GET_SAVED_JOBS_BY_SEEKER_ID + seekerId + query,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      if (!response.ok) return rejectWithValue("Failed to fetch saved jobs");
      const result: PaginatedResponse<{
        job: JobData;
        savedJob: SavedJobType;
      }> = await response.json();
      const savedJobs = result.data.map((x) => x.job.id);
      return savedJobs || [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch saved jobs",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { savedJobs: SavedJobState };
      return state.savedJobs.jobs.length === 0;
    },
  },
);

const savedJobsSlice = createSlice({
  name: "savedJobs", // Name of the slice
  initialState,
  reducers: {
    clearSavedJobs: (state) => {
      state.jobs = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save job
      .addCase(toggleSaveJobToList.pending, (state, action) => {
        state.saving = true;
        const jobId = action.meta.arg.jobId;
        // Optimistically update state
        if (state.jobs.includes(jobId)) {
          state.jobs = state.jobs.filter((id) => id !== jobId);
        } else {
          state.jobs.unshift(jobId);
        }
        state.error = null;
      })
      .addCase(toggleSaveJobToList.fulfilled, (state) => {
        state.saving = false;
        state.error = null;
      })
      .addCase(toggleSaveJobToList.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
        const { jobId, isSaved } = action.meta.arg;
        // Roll back change based on previous state
        if (isSaved) {
          // It was saved before, we removed it, so add it back
          if (!state.jobs.includes(jobId)) {
            state.jobs.unshift(jobId);
          }
        } else {
          // It was not saved before, we added it, so remove it
          state.jobs = state.jobs.filter((id) => id !== jobId);
        }
      })
      // Fetch saved jobs
      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload || [];
        state.error = null;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSavedJobs } = savedJobsSlice.actions;
export const savedJobsReducer = savedJobsSlice.reducer;
