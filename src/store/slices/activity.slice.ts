import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_CREATE_SEEKER_ACTIVITY,
  API_UPDATE_SEEKER_ACTIVITY,
  API_GET_SEEKER_ACTIVITIES,
  API_DELETE_SEEKER_ACTIVITY,
} from "@/api/seeker";
import { ActivityData } from "@/types/seeker"; // define this similar to ExperienceData
import { toast } from "sonner";
import { RootState } from "../store";

interface ActivityState {
  data: ActivityData[];
  previousData: ActivityData[] | null;
  cachedId: string | null;
  fetching: boolean;
  loading: boolean;
}

const initialState: ActivityState = {
  data: [],
  previousData: null,
  cachedId: null,
  fetching: false,
  loading: false,
};

// ─── Fetch Activities ─────────────────────────────────────────
export const fetchActivities = createAsyncThunk(
  "activity/fetchActivities",
  async (seekerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_SEEKER_ACTIVITIES + seekerId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (response.ok) {
        const data: ActivityData[] = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch activities");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch activities",
      );
    }
  },
  {
    condition: (seekerId: string, { getState }) => {
      const state = getState() as RootState;
      const currentActivities = state.activity.data;
      const fetching = state.activity.fetching;
      if (fetching) return false;
      if (currentActivities && currentActivities.length > 0) return false;
      if (seekerId === state.activity.cachedId) return false;
      return true;
    },
  },
);

// ─── Create Activity ─────────────────────────────────────────
export const createActivity = createAsyncThunk(
  "activity/createActivity",
  async (
    {
      seekerId,
      activity,
    }: { seekerId: string; activity: Partial<ActivityData>; key?: string },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ seekerId, ...activity });
      const response = await fetch(API_CREATE_SEEKER_ACTIVITY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });

      if (response.ok) {
        const data: ActivityData = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to create activity");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to create activity",
      );
    }
  },
);

// ─── Update Activity ─────────────────────────────────────────
export const updateActivity = createAsyncThunk(
  "activity/updateActivity",
  async (
    { id, updates }: { id: string; updates: Partial<ActivityData> },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ id, ...updates });
      const response = await fetch(API_UPDATE_SEEKER_ACTIVITY, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });

      if (response.ok) {
        const data: ActivityData = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to update activity");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update activity",
      );
    }
  },
);

// ─── Delete Activity ─────────────────────────────────────────
export const deleteActivity = createAsyncThunk(
  "activity/deleteActivity",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_DELETE_SEEKER_ACTIVITY + id, {
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
      return rejectWithValue(error.message || "Failed to delete activity");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to delete activity",
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
const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.data = [];
      state.fetching = false;
      state.cachedId = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Activities ───
      .addCase(fetchActivities.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.fetching = false;
        state.data = action.payload;
        state.cachedId = action.meta.arg;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.fetching = false;
        showToast({
          title: "Error on Fetching Activities",
          message: action.payload as string,
        });
      })

      // ─── Create Activity ─── (Optimistic)
      .addCase(createActivity.pending, (state, action) => {
        state.previousData = state.data;
        const tempId = "temp-" + Date.now();
        state.data = [
          ...state.data,
          { ...(action.meta.arg.activity as ActivityData), id: tempId },
        ];
        state.loading = true;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.data = state.data.map((a) =>
          String(a.id).startsWith("temp") ? action.payload : a,
        );
        state.loading = false;
      })
      .addCase(createActivity.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Creating Activity",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Update Activity ─── (Optimistic)
      .addCase(updateActivity.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.map((a) =>
          a.id === action.meta.arg.id
            ? { ...a, ...action.meta.arg.updates }
            : a,
        );
        state.loading = true;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.data = state.data.map((a) =>
          a.id === action.payload.id ? action.payload : a,
        );
        state.loading = false;
      })
      .addCase(updateActivity.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Updating Activity",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Delete Activity ─── (Optimistic)
      .addCase(deleteActivity.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.filter((a) => a.id !== action.meta.arg);
        state.loading = true;
      })
      .addCase(deleteActivity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Deleting Activity",
          message: action.payload as string,
        });
        state.loading = false;
      });
  },
});

// ─── Export ────────────────────────────────────────────────────
export const { clearActivities } = activitySlice.actions;
export const activityReducer = activitySlice.reducer;
