import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import revalidateTag from "@/lib/revalidate";
import { TAGS } from "@/api";
import {
  API_CREATE_JOB,
  API_DELETE_JOB,
  API_GET_JOBS_BY_COMPANY_ID,
  API_UPDATE_JOB,
} from "@/api/employer";
import { JobData } from "@/types";

// ─── State Shape ───────────────────────────────────────────────
interface JobsState {
  data: JobData[];
  total: number;
  page: number;
  limit: number;
  previousData: JobData[] | null; // rollback
  loading: boolean;
  updating: boolean;
  adding: boolean; // ✅ New
  removing: boolean;
  success: boolean;
  error: string | null;
  lastResult: JobData | null; // <- store last created/updated job
}

const initialState: JobsState = {
  data: [],
  total: 0,
  page: 1,
  limit: 10,
  previousData: null,
  loading: true,
  updating: false,
  adding: false,
  removing: false,
  success: false,
  error: null,
  lastResult: null,
};

// ─── Fetch Jobs by Company ID ──────────────────────────────────
export const fetchJobsByCompanyId = createAsyncThunk<
  PaginatedResponse<JobData>,
  { companyId: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "jobs/fetchJobsByCompanyId",
  async ({ companyId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_GET_JOBS_BY_COMPANY_ID}${companyId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      if (response.ok) {
        const data: PaginatedResponse<JobData> = await response.json();
        return data;
      }

      return rejectWithValue("Failed to fetch jobs");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch jobs",
      );
    }
  },
  {
    condition: (
      {
        companyId,
        page,
        limit,
      }: { companyId: string; page: number; limit: number },
      { getState },
    ) => {
      const state = getState() as { companyJobs: JobsState };
      const {
        data: currentJobs,
        page: currentPage,
        limit: currentLimit,
        // loading,
      } = state.companyJobs;

      // Prevent fetch if already loading
      // if (loading) return false;

      // Prevent fetch if same company AND same page & limit
      if (
        currentJobs.length > 0 &&
        currentJobs[0]?.company?.id === companyId &&
        currentPage === page &&
        currentLimit === limit
      ) {
        return false;
      }

      return true;
    },
  },
);

// ─── Add JobData ───────────────────────────────────────────────────
export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (
    { companyId, job }: { companyId: string; job: Partial<JobData> },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch(API_CREATE_JOB, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ companyId, ...job }),
      });
      if (res.ok) {
        const data: JobData = await res.json();
        revalidateTag(TAGS.jobs);
        return data;
      }
      return rejectWithValue("Failed to add job");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to add job",
      );
    }
  },
);

// ─── Update JobData (Optimistic) ───────────────────────────────────
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (
    { id, updates }: { id: string; updates: Partial<JobData> },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch(API_UPDATE_JOB, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        const data: JobData = await res.json();
        revalidateTag(TAGS.jobs);
        return data;
      }
      return rejectWithValue("Failed to update job");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update job",
      );
    }
  },
);

// ─── Remove JobData ────────────────────────────────────────────────
export const removeJob = createAsyncThunk(
  "jobs/removeJob",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(API_DELETE_JOB + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      if (res.ok) {
        revalidateTag(TAGS.jobs);
        return id; // return deleted job id
      }
      return rejectWithValue("Failed to delete job");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to delete job",
      );
    }
  },
);

// ─── Duplicate JobData ─────────────────────────────────────────────
// export const duplicateJob = createAsyncThunk(
//   "jobs/duplicateJob",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const res = await fetch(API_DUPLICATE_JOB + id, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           accept: "application/json",
//         },
//       });
//       if (res.ok) {
//         const data: JobData = await res.json();
//         revalidateTag(TAGS.jobs);
//         return data;
//       }
//       return rejectWithValue("Failed to duplicate job");
//     } catch (err) {
//       return rejectWithValue(
//         err instanceof Error ? err.message : "Failed to duplicate job",
//       );
//     }
//   },
// );

// ─── Slice ─────────────────────────────────────────────────────
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobs: (state) => {
      state.data = [];
      state.total = 0;
      state.page = 1;
      state.limit = 10;
      state.previousData = null;
      state.loading = false;
      state.updating = false;
      state.success = false;
      state.error = null;
    },
    clearJobsSuccess: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch ───
      .addCase(fetchJobsByCompanyId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchJobsByCompanyId.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page ?? 1;
        state.limit = action.payload.limit ?? state.limit;
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(fetchJobsByCompanyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch jobs";
        state.success = false;
      })
      // ─── Add ───
      .addCase(addJob.pending, (state) => {
        state.adding = true;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.adding = false;
        state.data.unshift(action.payload);
        state.success = true;
        state.lastResult = action.payload;
      })
      .addCase(addJob.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      })

      // ─── Update (Optimistic) ───
      .addCase(updateJob.pending, (state, action) => {
        state.previousData = [...state.data];
        state.data = state.data.map((job) =>
          job.id === action.meta.arg.id
            ? { ...job, ...action.meta.arg.updates }
            : job,
        );
        state.updating = true;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.data = state.data.map((job) =>
          job.id === action.payload.id ? action.payload : job,
        );
        state.lastResult = action.payload;
        state.previousData = null;
        state.updating = false;
        state.success = true;
      })
      .addCase(updateJob.rejected, (state, action) => {
        if (state.previousData) {
          state.data = state.previousData; // rollback
        }
        state.previousData = null;
        state.updating = false;
        state.error = action.payload as string;
      })

      // ─── Remove ───
      .addCase(removeJob.pending, (state, action) => {
        state.previousData = [...state.data];
        state.data = state.data.filter((job) => job.id !== action.meta.arg);
        state.removing = true;
      })
      .addCase(removeJob.fulfilled, (state) => {
        state.removing = false;
        state.previousData = null;
        state.success = true;
      })
      .addCase(removeJob.rejected, (state, action) => {
        if (state.previousData) {
          state.data = state.previousData;
        }
        state.previousData = null;
        state.removing = false;
        state.error = action.payload as string;
      });

    // ─── Duplicate ───
    // .addCase(duplicateJob.pending, (state) => {
    //   state.updating = true;
    // })
    // .addCase(duplicateJob.fulfilled, (state, action) => {
    //   state.data.push(action.payload);
    //   state.updating = false;
    //   state.success = true;
    // })
    // .addCase(duplicateJob.rejected, (state, action) => {
    //   state.updating = false;
    //   state.error = action.payload as string;
    // });
  },
});

export const { clearJobs, clearJobsSuccess } = jobsSlice.actions;
export const companyJobsReducer = jobsSlice.reducer;
