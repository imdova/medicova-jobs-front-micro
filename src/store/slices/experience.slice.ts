import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_CREATE_SEEKER_EXPERIENCE,
  API_UPDATE_SEEKER_EXPERIENCE,
  API_GET_SEEKER_EXPERIENCE,
  API_DELETE_SEEKER_EXPERIENCE,
} from "@/api/seeker";
import { ExperienceData } from "@/types/seeker";
import { toast } from "sonner";
import { RootState } from "../store";

interface ExperienceState {
  data: ExperienceData[];
  previousData: ExperienceData[] | null; // for rollback
  cachedId: string | null;
  fetching: boolean;
  loading: boolean;
}

const initialState: ExperienceState = {
  data: [],
  fetching: false,
  previousData: null,
  cachedId: null,
  loading: false,
};

// ─── Fetch Experiences ─────────────────────────────────────────
export const fetchExperiences = createAsyncThunk(
  "experience/fetchExperiences",
  async (seekerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_SEEKER_EXPERIENCE + seekerId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (response.ok) {
        const data: ExperienceData[] = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch experiences");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch experiences",
      );
    }
  },
  {
    condition: (seekerId: string, { getState }) => {
      const state = getState() as RootState;
      const currentExperiences = state.experience.data;
      const fetching = state.experience.fetching;
      if (fetching) return false;
      if (currentExperiences && currentExperiences.length > 0) return false;
      if (seekerId === state.experience.cachedId) return false;
      return true;
    },
  },
);
// ─── Create Experience ─────────────────────────────────────────
export const createExperience = createAsyncThunk(
  "experience/createExperience",
  async (
    {
      seekerId,
      experience,
    }: { seekerId: string; experience: Partial<ExperienceData>; key?: string },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ seekerId, ...experience });
      const response = await fetch(API_CREATE_SEEKER_EXPERIENCE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });

      if (response.ok) {
        const data: ExperienceData = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to create experience");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to create experience",
      );
    }
  },
);

// ─── Update Experience ─────────────────────────────────────────
export const updateExperience = createAsyncThunk(
  "experience/updateExperience",
  async (
    { id, updates }: { id: string; updates: Partial<ExperienceData> },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ id, ...updates });
      const response = await fetch(API_UPDATE_SEEKER_EXPERIENCE, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });

      if (response.ok) {
        const data: ExperienceData = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to update experience");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update experience",
      );
    }
  },
);

// ─── Delete Experience ─────────────────────────────────────────
export const deleteExperience = createAsyncThunk(
  "experience/deleteExperience",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_DELETE_SEEKER_EXPERIENCE + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (response.ok) {
        return { id };
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to delete experience");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to delete experience",
      );
    }
  },
);

const showToast = (error: { title: string; message: string }) => {
  toast.error(error.title, {
    description: error.message,
    position: "bottom-right",
    style: {
      "--normal-bg": "color-mix(in oklab, var(--destructive) 5%, white)",
      "--normal-text": "var(--destructive)",
      "--normal-border": "color-mix(in oklab, var(--destructive) 25%, white)",
    } as React.CSSProperties,
  });
};

// ─── Slice ─────────────────────────────────────────────────────
const experienceSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {
    clearExperience: (state) => {
      state.data = [];
      state.fetching = false;
      state.cachedId = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Experiences ───
      .addCase(fetchExperiences.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.fetching = false;
        state.data = action.payload;
        state.cachedId = action.meta.arg;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.fetching = false;
        showToast({
          title: "Error on Fetching Experiences",
          message: action.payload as string,
        });
      })
      // ─── Create Experience ─── (Optimistic)
      .addCase(createExperience.pending, (state, action) => {
        state.previousData = state.data;
        const tempId = "temp-" + Date.now();
        state.data = [
          ...state.data,
          { ...(action.meta.arg.experience as ExperienceData), id: tempId },
        ];
        state.loading = true;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        // replace the temp item with the real one
        state.data = state.data.map((exp) =>
          String(exp.id).startsWith("temp") ? action.payload : exp,
        );
        state.loading = false;
      })
      .addCase(createExperience.rejected, (state, action) => {
        // rollback on failure
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Creating Experience",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Update Experience ─── (Optimistic)
      .addCase(updateExperience.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.map((exp) =>
          exp.id === action.meta.arg.id
            ? { ...exp, ...action.meta.arg.updates }
            : exp,
        );
        state.loading = true;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.data = state.data.map((exp) =>
          exp.id === action.payload.id ? action.payload : exp,
        );
        state.loading = false;
      })
      .addCase(updateExperience.rejected, (state, action) => {
        // rollback on failure
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Updating Experience",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Delete Experience ─── (Optimistic)
      .addCase(deleteExperience.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.filter((exp) => exp.id !== action.meta.arg);
        state.loading = true;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        // rollback on failure
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Deleting Experience",
          message: action.payload as string,
        });
        state.loading = false;
      });
  },
});

// ─── Export ────────────────────────────────────────────────────
export const { clearExperience } = experienceSlice.actions;
export const experienceReducer = experienceSlice.reducer;
