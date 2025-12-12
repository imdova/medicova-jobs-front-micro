import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_CREATE_SEEKER_EDUCATION,
  API_UPDATE_SEEKER_EDUCATION,
  API_GET_SEEKER_EDUCATION,
  API_DELETE_SEEKER_EDUCATION,
} from "@/api/seeker";
import { EducationData } from "@/types/seeker";
import { toast } from "sonner";
import { RootState } from "../store";

interface EducationState {
  data: EducationData[];
  previousData: EducationData[] | null; // for rollback
  cachedId: string | null;
  fetching: boolean;
  loading: boolean;
}

const initialState: EducationState = {
  data: [],
  fetching: false,
  previousData: null,
  cachedId: null,
  loading: false,
};

// ─── Fetch Education ─────────────────────────────────────────
export const fetchEducations = createAsyncThunk(
  "education/fetchEducations",
  async (seekerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_SEEKER_EDUCATION + seekerId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (response.ok) {
        const data: EducationData[] = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch education");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch education",
      );
    }
  },
  {
    condition: (seekerId: string, { getState }) => {
      const state = getState() as RootState;
      const currentEducation = state.education.data;
      const fetching = state.education.fetching;
      if (fetching) return false;
      if (currentEducation && currentEducation.length > 0) return false;
      if (seekerId === state.education.cachedId) return false;
      return true;
    },
  },
);

// ─── Create Education ─────────────────────────────────────────
export const createEducation = createAsyncThunk(
  "education/createEducation",
  async (
    {
      seekerId,
      education,
    }: { seekerId: string; education: Partial<EducationData>; key?: string },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ seekerId, ...education });
      const response = await fetch(API_CREATE_SEEKER_EDUCATION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });

      if (response.ok) {
        const data: EducationData = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to create education");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to create education",
      );
    }
  },
);

// ─── Update Education ─────────────────────────────────────────
export const updateEducation = createAsyncThunk(
  "education/updateEducation",
  async (
    { id, updates }: { id: string; updates: Partial<EducationData> },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ id, ...updates });
      const response = await fetch(API_UPDATE_SEEKER_EDUCATION, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });

      if (response.ok) {
        const data: EducationData = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to update education");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update education",
      );
    }
  },
);

// ─── Delete Education ─────────────────────────────────────────
export const deleteEducation = createAsyncThunk(
  "education/deleteEducation",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_DELETE_SEEKER_EDUCATION + id, {
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
      return rejectWithValue(error.message || "Failed to delete education");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to delete education",
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
const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    clearEducation: (state) => {
      state.data = [];
      state.fetching = false;
      state.cachedId = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Education ───
      .addCase(fetchEducations.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchEducations.fulfilled, (state, action) => {
        state.fetching = false;
        state.data = action.payload;
      })
      .addCase(fetchEducations.rejected, (state, action) => {
        state.fetching = false;
        showToast({
          title: "Error on Fetching Education",
          message: action.payload as string,
        });
      })

      // ─── Create Education ─── (Optimistic)
      .addCase(createEducation.pending, (state, action) => {
        state.previousData = state.data;
        const tempId = "temp-" + Date.now();
        state.data = [
          ...state.data,
          { ...(action.meta.arg.education as EducationData), id: tempId },
        ];
        state.loading = true;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.data = state.data.map((edu) =>
          String(edu.id).startsWith("temp") ? action.payload : edu,
        );
        state.loading = false;
      })
      .addCase(createEducation.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Creating Education",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Update Education ─── (Optimistic)
      .addCase(updateEducation.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.map((edu) =>
          edu.id === action.meta.arg.id
            ? { ...edu, ...action.meta.arg.updates }
            : edu,
        );
        state.loading = true;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.data = state.data.map((edu) =>
          edu.id === action.payload.id ? action.payload : edu,
        );
        state.loading = false;
      })
      .addCase(updateEducation.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Updating Education",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Delete Education ─── (Optimistic)
      .addCase(deleteEducation.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.filter((edu) => edu.id !== action.meta.arg);
        state.loading = true;
      })
      .addCase(deleteEducation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Deleting Education",
          message: action.payload as string,
        });
        state.loading = false;
      });
  },
});

// ─── Export ────────────────────────────────────────────────────
export const { clearEducation } = educationSlice.actions;
export const educationReducer = educationSlice.reducer;
