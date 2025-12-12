import {
  applyForJob,
  getApplications,
} from "@/lib/actions/applications.actions";
import { ApplicationsFilter, JobApplicationData } from "@/types/seeker";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface JobApplicationState {
  applications: {
    data: JobApplicationData[];
    loading: boolean;
    applying: boolean;
    error: string | null;
  };
}

const initialState: JobApplicationState = {
  applications: {
    data: [],
    loading: false,
    applying: false,
    error: null,
  },
};

// Async thunk for applying to a job
export const submitJobApplication = createAsyncThunk(
  "jobApplication/submitApplication",
  async (applicationData: Partial<JobApplicationData>, { rejectWithValue }) => {
    try {
      const result = await applyForJob(applicationData);
      if (result.success && result.data) {
        return result.data;
      }
      return rejectWithValue("Failed to submit job application");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to submit job application",
      );
    }
  },
);

// Async thunk for fetching seeker's applications
export const fetchApplications = createAsyncThunk(
  "jobApplication/fetchApplications",
  async (filter: ApplicationsFilter, { rejectWithValue }) => {
    try {
      const result = await getApplications(filter);
      if (result.success && result.data) {
        return result.data.data;
      }
      return rejectWithValue("Failed to fetch applications");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch applications",
      );
    }
  },
);

const jobApplicationSlice = createSlice({
  name: "jobApplication",
  initialState,
  reducers: {
    clearApplications: (state) => {
      state.applications.data = [];
      state.applications.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit job application
      .addCase(submitJobApplication.pending, (state) => {
        state.applications.applying = true;
        state.applications.error = null;
      })
      .addCase(submitJobApplication.fulfilled, (state, action) => {
        state.applications.applying = false;
        state.applications.data.unshift(action.payload); // Add new application to the beginning of the list
        state.applications.error = null;
      })
      .addCase(submitJobApplication.rejected, (state, action) => {
        state.applications.applying = false;
        state.applications.error = action.payload as string;
      })
      // Fetch seeker's applications
      .addCase(fetchApplications.pending, (state) => {
        state.applications.loading = true;
        state.applications.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.applications.loading = false;
        state.applications.data = action.payload;
        state.applications.error = null;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.applications.loading = false;
        state.applications.error = action.payload as string;
      });
  },
});

export const { clearApplications } = jobApplicationSlice.actions;
export const jobApplicationsReducer = jobApplicationSlice.reducer;
