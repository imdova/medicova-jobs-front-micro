import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  API_GET_ADMIN_DEPARTMENTS,
  API_CREATE_ADMIN_DEPARTMENT,
  API_UPDATE_ADMIN_DEPARTMENT,
  API_DELETE_ADMIN_DEPARTMENT,
} from "@/api/admin"; // define in your api file
import { toast } from "sonner";
import { Department } from "@/types";

interface DepartmentState {
  data: Department[];
  previousData: Department[] | null;
  fetching: boolean;
  loading: boolean;
  cached: boolean;
}

const initialState: DepartmentState = {
  data: [],
  previousData: null,
  fetching: false,
  loading: false,
  cached: false,
};

// ─── Fetch Departments ──────────────────────────────────────────────
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_ADMIN_DEPARTMENTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (response.ok) {
        const data: PaginatedResponse<Department> = await response.json();
        return data.data;
      }
      return rejectWithValue("Failed to fetch departments");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch departments",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      if (state.departments.fetching) return false;
      if (state.departments.cached) return false;
      return true;
    },
  },
);

// ─── Create Department ──────────────────────────────────────────────
export const createDepartment = createAsyncThunk(
  "departments/createDepartment",
  async (department: Partial<Department>, { rejectWithValue }) => {
    try {
      const response = await fetch(API_CREATE_ADMIN_DEPARTMENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(department),
      });

      if (response.ok) {
        const data: Department = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to create department");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to create department",
      );
    }
  },
);

// ─── Update Department ──────────────────────────────────────────────
export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async (
    { id, updates }: { id: string; updates: Partial<Department> },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(API_UPDATE_ADMIN_DEPARTMENT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (response.ok) {
        const data: Department = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to update department");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update department",
      );
    }
  },
);

// ─── Delete Department ──────────────────────────────────────────────
export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_DELETE_ADMIN_DEPARTMENT + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (response.ok) return { id };
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to delete department");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to delete department",
      );
    }
  },
);

// ─── Toast Helper ──────────────────────────────────────────────
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

// ─── Slice ──────────────────────────────────────────────
const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    clearDepartments: (state) => {
      state.data = [];
      state.fetching = false;
      state.loading = false;
      state.cached = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch ───
      .addCase(fetchDepartments.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.data = action.payload;
        state.fetching = false;
        state.cached = true;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.fetching = false;
        showToast({
          title: "Error on Fetching Departments",
          message: action.payload as string,
        });
      })

      // ─── Create ─── (Optimistic)
      .addCase(createDepartment.pending, (state, action) => {
        state.previousData = state.data;
        const tempId = "temp-" + Date.now();
        state.data.push({
          ...(action.meta.arg as Department),
          id: tempId,
          created_at: new Date().toISOString(),
        });
        state.loading = true;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.data = state.data.map((d) =>
          String(d.id).startsWith("temp") ? action.payload : d,
        );
        state.loading = false;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Creating Department",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Update ─── (Optimistic)
      .addCase(updateDepartment.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.map((d) =>
          d.id === action.meta.arg.id
            ? { ...d, ...action.meta.arg.updates }
            : d,
        );
        state.loading = true;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.data = state.data.map((d) =>
          d.id === action.payload.id ? action.payload : d,
        );
        state.loading = false;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Updating Department",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Delete ─── (Optimistic)
      .addCase(deleteDepartment.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.filter((d) => d.id !== action.meta.arg);
        state.loading = true;
      })
      .addCase(deleteDepartment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Deleting Department",
          message: action.payload as string,
        });
        state.loading = false;
      });
  },
});

// ─── Export ──────────────────────────────────────────────
export const { clearDepartments } = departmentsSlice.actions;
export const departmentsReducer = departmentsSlice.reducer;
