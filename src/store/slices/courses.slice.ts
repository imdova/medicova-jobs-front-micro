import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_CREATE_SEEKER_COURSE,
  API_UPDATE_SEEKER_COURSE,
  API_GET_SEEKER_COURSES,
  API_DELETE_SEEKER_COURSE,
} from "@/api/seeker";
import { CertificationData } from "@/types/seeker"; // make sure you have this type
import { toast } from "sonner";
import { RootState } from "../store";

interface CourseState {
  data: CertificationData[];
  previousData: CertificationData[] | null; // rollback
  cachedId: string | null;
  fetching: boolean;
  loading: boolean;
}

const initialState: CourseState = {
  data: [],
  previousData: null,
  cachedId: null,
  fetching: false,
  loading: false,
};

// ─── Fetch Courses ─────────────────────────────────────────
export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (seekerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_SEEKER_COURSES + seekerId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (response.ok) {
        const data: CertificationData[] = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch courses");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch courses",
      );
    }
  },
  {
    condition: (seekerId: string, { getState }) => {
      const state = getState() as RootState;
      const currentCourses = state.courses.data;
      const fetching = state.courses.fetching;
      if (fetching) return false;
      if (currentCourses && currentCourses.length > 0) return false;
      if (seekerId === state.courses.cachedId) return false;
      return true;
    },
  },
);

// ─── Create Course ─────────────────────────────────────────
export const createCourse = createAsyncThunk(
  "course/createCourse",
  async (
    {
      seekerId,
      course,
    }: { seekerId: string; course: Partial<CertificationData>; key?: string },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ seekerId, ...course });
      const response = await fetch(API_CREATE_SEEKER_COURSE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });

      if (response.ok) {
        const data: CertificationData = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to create course");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to create course",
      );
    }
  },
);

// ─── Update Course ─────────────────────────────────────────
export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async (
    { id, updates }: { id: string; updates: Partial<CertificationData> },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ id, ...updates });
      const response = await fetch(API_UPDATE_SEEKER_COURSE, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });

      if (response.ok) {
        const data: CertificationData = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to update course");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update course",
      );
    }
  },
);

// ─── Delete Course ─────────────────────────────────────────
export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_DELETE_SEEKER_COURSE + id, {
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
      return rejectWithValue(error.message || "Failed to delete course");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to delete course",
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
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    clearCourses: (state) => {
      state.data = [];
      state.fetching = false;
      state.cachedId = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Courses ───
      .addCase(fetchCourses.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.fetching = false;
        state.data = action.payload;
        state.cachedId = action.meta.arg;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.fetching = false;
        showToast({
          title: "Error on Fetching Courses",
          message: action.payload as string,
        });
      })

      // ─── Create Course ─── (Optimistic)
      .addCase(createCourse.pending, (state, action) => {
        state.previousData = state.data;
        const tempId = "temp-" + Date.now();
        state.data = [
          ...state.data,
          { ...(action.meta.arg.course as CertificationData), id: tempId },
        ];
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.data = state.data.map((c) =>
          String(c.id).startsWith("temp") ? action.payload : c,
        );
        state.loading = false;
      })
      .addCase(createCourse.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Creating Course",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Update Course ─── (Optimistic)
      .addCase(updateCourse.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.map((c) =>
          c.id === action.meta.arg.id
            ? { ...c, ...action.meta.arg.updates }
            : c,
        );
        state.loading = true;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.data = state.data.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        );
        state.loading = false;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Updating Course",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Delete Course ─── (Optimistic)
      .addCase(deleteCourse.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.filter((c) => c.id !== action.meta.arg);
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Deleting Course",
          message: action.payload as string,
        });
        state.loading = false;
      });
  },
});

// ─── Export ────────────────────────────────────────────────────
export const { clearCourses } = courseSlice.actions;
export const coursesReducer = courseSlice.reducer;
