import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  API_CREATE_ROLE,
  API_UPDATE_ROLE,
  API_GET_ROLE_BY_ID,
  API_GET_ROLES_BY_USER_TYPE,
  API_GET_ROLES_BY_COMPANY,
} from "@/api/users";
import { Role } from "@/types/next-auth";
import { RoleFormData } from "@/types/permissions";
import { toast } from "sonner";

// ─── State ──────────────────────────────────────────────
interface RoleState {
  data: Role[];
  total: number;
  page: number;
  limit: number;
  previousData: Role[] | null;
  fetching: boolean;
  loading: boolean;
  cached: boolean;
}

const initialState: RoleState = {
  data: [],
  total: 0,
  page: 1,
  limit: 10,
  previousData: null,
  fetching: false,
  loading: false,
  cached: false,
};

// ─── Fetch Roles By UserType ──────────────────────────────────────────────
export const fetchRolesByUserType = createAsyncThunk(
  "roles/fetchByUserType",
  async (
    {
      userType,
      page,
      limit,
    }: { userType: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const query = page && limit ? `?page=${page}&limit=${limit}` : "";
      const response = await fetch(
        API_GET_ROLES_BY_USER_TYPE + userType + query,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );

      if (response.ok) {
        const data: PaginatedResponse<Role> = await response.json();
        return data.data;
      }
      return rejectWithValue("Failed to fetch roles by user type");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to fetch roles by user type",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      if (state.roles.fetching) return false;
      if (state.roles.cached) return false;
      return true;
    },
  },
);

// ─── Fetch Roles By Company ──────────────────────────────────────────────
export const fetchRolesByCompany = createAsyncThunk(
  "roles/fetchByCompany",
  async (
    {
      companyId,
      page,
      limit,
    }: { companyId: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const query = page && limit ? `?page=${page}&limit=${limit}` : "";
      const response = await fetch(
        API_GET_ROLES_BY_COMPANY + companyId + query,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );

      if (response.ok) {
        const data: Role[] = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch roles by company");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch roles by company",
      );
    }
  },
);

// ─── Fetch Role By Id ──────────────────────────────────────────────
export const fetchRoleById = createAsyncThunk(
  "roles/fetchById",
  async (roleId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_ROLE_BY_ID + roleId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (response.ok) {
        const data: Role = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch role");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch role",
      );
    }
  },
);

// ─── Create Role ──────────────────────────────────────────────
export const createRole = createAsyncThunk(
  "roles/createRole",
  async (role: RoleFormData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_CREATE_ROLE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(role),
      });

      if (response.ok) {
        const data: Role = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to create role");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to create role",
      );
    }
  },
);

// ─── Update Role ──────────────────────────────────────────────
export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async (
    { id, updates }: { id: string; updates: Partial<RoleFormData> },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(API_UPDATE_ROLE, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (response.ok) {
        const data: Role = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to update role");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update role",
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
const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearRoles: (state) => {
      state.data = [];
      state.fetching = false;
      state.loading = false;
      state.cached = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Roles (UserType, Company, ById) ───
      .addCase(fetchRolesByUserType.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchRolesByUserType.fulfilled, (state, action) => {
        state.data = action.payload;
        state.fetching = false;
        state.cached = true;
      })
      .addCase(fetchRolesByUserType.rejected, (state, action) => {
        state.fetching = false;
        showToast({
          title: "Error Fetching Roles",
          message: action.payload as string,
        });
      })
      .addCase(fetchRolesByCompany.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchRolesByCompany.fulfilled, (state, action) => {
        state.data = action.payload;
        state.fetching = false;
        state.cached = true;
      })
      .addCase(fetchRolesByCompany.rejected, (state, action) => {
        state.fetching = false;
        showToast({
          title: "Error Fetching Roles",
          message: action.payload as string,
        });
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        const exists = state.data.find((r) => r.id === action.payload.id);
        if (exists) {
          state.data = state.data.map((r) =>
            r.id === action.payload.id ? action.payload : r,
          );
        } else {
          state.data.push(action.payload);
        }
      })

      // ─── Create Role ─── (Optimistic)
      .addCase(createRole.pending, (state, action) => {
        state.previousData = state.data;
        const tempId = "temp-" + Date.now();
        state.data.push({
          name: action.meta.arg.name,
          description: action.meta.arg.description,
          id: tempId,
          permissions: [],
          users: 0,
          created_at: new Date().toISOString(),
        });
        state.loading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.data = state.data.map((r) =>
          String(r.id).startsWith("temp") ? action.payload : r,
        );
        state.loading = false;
      })
      .addCase(createRole.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error Creating Role",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Update Role ─── (Optimistic)
      .addCase(updateRole.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.map((r) =>
          r.id === action.meta.arg.id
            ? { ...r, ...action.meta.arg.updates }
            : r,
        );
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.data = state.data.map((r) =>
          r.id === action.payload.id ? action.payload : r,
        );
        state.loading = false;
      })
      .addCase(updateRole.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error Updating Role",
          message: action.payload as string,
        });
        state.loading = false;
      });
  },
});

// ─── Export ──────────────────────────────────────────────
export const { clearRoles } = rolesSlice.actions;
export const rolesReducer = rolesSlice.reducer;
