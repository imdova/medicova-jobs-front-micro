import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminUser } from "@/types/admin";
import { RegisterCategory } from "@/constants/enums/register-category.enum";
import {
  API_ASSIGN_ACCOUNTS,
  API_ASSIGN_COMPANIES,
  API_DEASSIGN_ACCOUNTS,
  API_DEASSIGN_COMPANIES,
  API_GET_ADMIN_PROFILES,
  API_GET_ASSIGNED_COMPANIES,
  API_GET_ASSIGNED_USERS,
  API_UPDATE_ADMIN_PROFILE,
} from "@/api/employees";
import { toQueryString } from "@/util/general";
import { User } from "next-auth";
import { Company, registerData } from "@/types";
import { toast } from "@/components/UI/showToast";
import { InviteAdminFormValues } from "@/util/schemas/admin-user.schema";
import { API_REGISTER_USER } from "@/api/users";
import { RootState } from "../store";

// 🔹 Default values
const defaultValues: AdminUser = {
  id: "",
  firstName: "",
  lastName: "",
  avatar: "",
  email: "",
  phone: "",
  title: "",
  type: RegisterCategory.ADMIN_EMPLOYEE,
  departmentId: "",
  active: true,
  created_at: "",
  updated_at: "",
  companyIds: [],
};

interface AdminsState {
  data: AdminUser[];
  previousData: AdminUser[] | null;
  cachedQuery: string | null;
  fetching: boolean;
  loading: boolean;
  fetchingAssignedCompanies: boolean;
  fetchingAssignedAdmins: boolean;
  isOpen: boolean;
  error: string | null;
  defaultValues: AdminUser;
}

const initialState: AdminsState = {
  data: [],
  previousData: null,
  cachedQuery: null,
  fetching: false,
  loading: false,
  fetchingAssignedCompanies: false,
  fetchingAssignedAdmins: false,
  isOpen: false,
  error: null,
  defaultValues,
};

interface UserFilter {
  type?: string | string[];
  q?: string;
  limit?: number;
  page?: number;
}

interface FetchAdminsParams {
  filter: UserFilter;
  user: User;
}

// ─── Fetch Admins ──────────────────────────────
export const fetchAdmins = createAsyncThunk(
  "admins/fetchAdmins",
  async ({ filter, user }: FetchAdminsParams, { rejectWithValue }) => {
    try {
      if (user.category === RegisterCategory.SUPER_ADMIN) {
        const params = toQueryString(filter);
        const res = await fetch(API_GET_ADMIN_PROFILES + params);
        if (res.ok) {
          const data: PaginatedResponse<AdminUser> = await res.json();
          return data.data;
        }
        return rejectWithValue("Failed to fetch admins");
      } else {
        if (!user.id) {
          return rejectWithValue("Admin ID is required");
        }
        const res = await fetch(
          API_GET_ASSIGNED_USERS.replace("{adminId}", user.id) + user.id,
        );
        if (res.ok) {
          const data: AdminUser[] = await res.json();
          return data;
        }
        return rejectWithValue("Failed to fetch admins");
      }
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch admins",
      );
    }
  },
  {
    condition: ({ filter }: FetchAdminsParams, { getState }) => {
      const state = getState() as RootState;
      const { cachedQuery, fetching } = state.admins;
      if (fetching || cachedQuery === toQueryString(filter)) return false;
      return true;
    },
  },
);

interface InviteAdminsParams {
  values: InviteAdminFormValues;
  user: User;
}

export const inviteAdmin = createAsyncThunk(
  "admins/inviteAdmin",
  async ({ values, user }: InviteAdminsParams, { rejectWithValue }) => {
    try {
      const body: registerData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        type: "admin",
        rolesIds: values.rolesIds?.map((x) => x.value) || [],
        category: values.category,
        metaData: {
          title: values.title,
          departmentId: values.departmentId,
        },
      };
      if (user.category !== RegisterCategory.SUPER_ADMIN) {
        return rejectWithValue("Only super admin can invite admins");
      }
      const res = await fetch(API_REGISTER_USER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        return { success: true, data: body };
      }
      return rejectWithValue("Failed to invite admin");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch admins",
      );
    }
  },
);
interface UpdateAdminBody {
  firstName: string;
  lastName: string;
  title: string;
  lastSeen: string;
  phone: string;
}

interface UpdateAdminParams {
  id: string;
  updates: Partial<UpdateAdminBody>;
}

// ─── Update Admin ──────────────────────────────
export const updateAdminProfile = createAsyncThunk(
  "admins/updateAdminProfile",
  async ({ id, updates }: UpdateAdminParams, { rejectWithValue }) => {
    try {
      const res = await fetch(API_UPDATE_ADMIN_PROFILE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        return (await res.json()) as AdminUser;
      }
      const error = await res.json();
      return rejectWithValue(error.message || "Failed to update admin");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update admin",
      );
    }
  },
);

export interface AssignCompanyFormValues {
  actorId: string;
  adminId: string;
  companiesIds: string[];
  oldCompaniesIds: string[];
}
export interface AssignAdminsFormValues {
  actorId: string;
  adminId: string;
  usersIds: string[];
  oldUsersIds: string[];
}

type AssignResponse = {
  adminId: string;
  companyId: string;
}[];

function diffIds(oldIds: string[], newIds: string[]) {
  const oldSet = new Set(oldIds);
  const newSet = new Set(newIds);

  const added = newIds.filter((id) => !oldSet.has(id));
  const removed = oldIds.filter((id) => !newSet.has(id));

  return { added, removed };
}

export const assignCompaniesToAdmin = createAsyncThunk(
  "admins/assignCompaniesToAdmin",
  async (body: AssignCompanyFormValues, { rejectWithValue }) => {
    try {
      const { added, removed } = diffIds(
        body.oldCompaniesIds,
        body.companiesIds,
      );
      // Step 1: Assign newly added companies first
      if (added.length > 0) {
        const assignRes = await fetch(API_ASSIGN_COMPANIES, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actorId: body.actorId,
            adminId: body.adminId,
            companiesIds: added,
          }),
        });
        if (assignRes.ok && removed.length === 0) {
          const data: AssignResponse = await assignRes.json();
          return data.map((item) => item.companyId);
        }
        if (!assignRes.ok) {
          const error = await assignRes.json();
          return rejectWithValue(
            (error.message as string) || "Failed to assign companies",
          );
        }
      }
      // Step 2: Deassign removed companies (return this response)
      if (removed.length > 0) {
        const deassignRes = await fetch(API_DEASSIGN_COMPANIES, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actorId: body.actorId,
            adminId: body.adminId,
            companiesIds: removed,
          }),
        });
        if (deassignRes.ok) {
          const data: AssignResponse = await deassignRes.json();
          return data.map((item) => item.companyId);
        }
        const error = await deassignRes.json();
        return rejectWithValue(
          (error.message as string) || "Failed to deassign companies",
        );
      }
      // Step 3: If nothing was removed, just return success
      return body.companiesIds;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update companies",
      );
    }
  },
);
export const assignAdminsToAdmin = createAsyncThunk(
  "admins/assignAdminsToAdmin",
  async (body: AssignAdminsFormValues, { rejectWithValue }) => {
    try {
      const { added, removed } = diffIds(body.oldUsersIds, body.usersIds);
      // Step 1: Assign newly added companies first
      if (added.length > 0) {
        const assignRes = await fetch(API_ASSIGN_ACCOUNTS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actorId: body.actorId,
            adminId: body.adminId,
            usersIds: added,
          }),
        });
        if (assignRes.ok && removed.length === 0) {
          const data: AdminUser[] = await assignRes.json();
          return data.map((item) => item.id);
        }
        if (!assignRes.ok) {
          const error = await assignRes.json();
          return rejectWithValue(
            (error.message as string) || "Failed to assign companies",
          );
        }
      }
      // Step 2: Deassign removed companies (return this response)
      if (removed.length > 0) {
        const deassignRes = await fetch(API_DEASSIGN_ACCOUNTS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actorId: body.actorId,
            adminId: body.adminId,
            usersIds: removed,
          }),
        });
        if (deassignRes.ok) {
          const data: AdminUser[] = await deassignRes.json();
          return data.map((item) => item.id);
        }
        const error = await deassignRes.json();
        return rejectWithValue(
          (error.message as string) || "Failed to deassign companies",
        );
      }
      // Step 3: If nothing was removed, just return success
      return body.usersIds;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update companies",
      );
    }
  },
);

interface FetchAssignedCompaniesParams {
  adminId: string;
  actorId: string;
}

export const fetchAssignedCompanies = createAsyncThunk(
  "admins/fetchAssignedCompanies",
  async (
    { adminId, actorId }: FetchAssignedCompaniesParams,
    { rejectWithValue },
  ) => {
    try {
      const url =
        API_GET_ASSIGNED_COMPANIES.replace("{adminId}", adminId) + actorId;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        return (await res.json()) as Company[];
      }
      const error = await res.json();
      return rejectWithValue(
        (error.message as string) || "Failed to assign companies to admin",
      );
    } catch (err) {
      return rejectWithValue(
        err instanceof Error
          ? (err.message as string)
          : "Failed to assign companies to admin",
      );
    }
  },
);
export const fetchAssignedAdmins = createAsyncThunk(
  "admins/fetchAssignedAdmins",
  async (
    { adminId, actorId }: FetchAssignedCompaniesParams,
    { rejectWithValue },
  ) => {
    try {
      const url =
        API_GET_ASSIGNED_USERS.replace("{adminId}", adminId) + actorId;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        return (await res.json()) as AdminUser[];
      }
      const error = await res.json();
      return rejectWithValue(
        (error.message as string) || "Failed to assign companies to admin",
      );
    } catch (err) {
      return rejectWithValue(
        err instanceof Error
          ? (err.message as string)
          : "Failed to assign companies to admin",
      );
    }
  },
);

// ─── Slice ─────────────────────────────────────
const adminsSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.isOpen = true;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      state.defaultValues = defaultValues;
    },
    setDefaultValues: (state, action) => {
      state.defaultValues = action.payload;
    },
    clearAdmins: (state) => {
      state.data = [];
      state.fetching = false;
      state.loading = false;
      state.cachedQuery = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch ───
      .addCase(fetchAdmins.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.fetching = false;
        state.data = action.payload;
        state.cachedQuery = toQueryString(action.meta.arg.filter);
        state.error = null;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.fetching = false;
        toast.error("Error on Fetching Admins", {
          description: action.payload as string,
        });
        state.error = action.payload as string;
      })
      // ─── inviteAdmin ───
      .addCase(inviteAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          toast.success(
            `Invitation sent to ${action.payload.data.email} successfully`,
            {
              description: `you have invited ${action.payload.data.firstName} ${action.payload.data.lastName} to join Medicova as ${action.payload.data.metaData?.title} successfully`,
            },
          );
        }
        state.error = null;
      })
      .addCase(inviteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Error on inviting Admin", {
          description: action.payload as string,
        });
      })

      // ─── Update ─── (Optimistic)
      .addCase(updateAdminProfile.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.map((a) =>
          a.id === action.meta.arg.id
            ? { ...a, ...action.meta.arg.updates }
            : a,
        );
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.data = state.data.map((a) =>
          a.id === action.payload.id ? action.payload : a,
        );
        state.loading = false;
        toast.success("Admin updated successfully", {
          description: "Admin updated successfully",
        });
        state.error = null;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        toast.error("Error on Updating Admin", {
          description: action.payload as string,
        });
        state.loading = false;
        state.error = action.payload as string;
      })
      // ─── fetchAssignedCompanies ─── (Optimistic)
      .addCase(fetchAssignedCompanies.pending, (state) => {
        state.fetchingAssignedCompanies = true;
        state.error = null;
      })
      .addCase(fetchAssignedCompanies.fulfilled, (state, action) => {
        const companiesIds = action.payload.map((a) => a.id);
        state.data = state.data.map((a) =>
          a.id === action.meta.arg.adminId
            ? { ...a, companyIds: companiesIds }
            : a,
        );
        state.fetchingAssignedCompanies = false;
        state.error = null;
      })
      .addCase(fetchAssignedCompanies.rejected, (state, action) => {
        const admin = state.data.find((a) => a.id === action.meta.arg.adminId);
        if (state.previousData) state.data = state.previousData;
        toast.error(
          `Error on Fetching Assigned Companies for admin ${admin?.firstName} ${admin?.lastName}`,
          {
            description: String(action.payload),
          },
        );
        state.fetchingAssignedCompanies = false;
        state.error = String(action.payload);
      })
      // ─── fetchAssignedAdmins ─── (Optimistic)
      .addCase(fetchAssignedAdmins.pending, (state) => {
        state.fetchingAssignedAdmins = true;
        state.error = null;
      })
      .addCase(fetchAssignedAdmins.fulfilled, (state, action) => {
        const adminIds = action.payload.map((a) => a.id);
        state.data = state.data.map((a) =>
          a.id === action.meta.arg.adminId
            ? { ...a, adminIds: adminIds }
            : a,
        );
        state.fetchingAssignedAdmins = false;
        state.error = null;
      })
      .addCase(fetchAssignedAdmins.rejected, (state, action) => {
        const admin = state.data.find((a) => a.id === action.meta.arg.adminId);
        if (state.previousData) state.data = state.previousData;
        toast.error(
          `Error on Fetching Assigned Admins for admin ${admin?.firstName} ${admin?.lastName}`,
          {
            description: String(action.payload),
          },
        );
        state.fetchingAssignedCompanies = false;
        state.error = String(action.payload);
      })
      // ─── assignCompaniesToAdmin ─── (Optimistic)
      .addCase(assignCompaniesToAdmin.pending, (state, action) => {
        const adminId = action.meta.arg.adminId;
        const companiesIds = action.meta.arg.companiesIds;
        state.previousData = state.data;
        state.data = state.data.map((a) =>
          a.id === adminId ? { ...a, companyIds: companiesIds } : a,
        );
        state.loading = true;
        state.error = null;
      })
      .addCase(assignCompaniesToAdmin.fulfilled, (state, action) => {
        const adminId = action.meta.arg.adminId;
        const companiesIds = action.payload;
        const admin = state.data.find((a) => a.id === adminId);
        state.data = state.data.map((a) =>
          a.id === adminId ? { ...a, companyIds: companiesIds } : a,
        );
        state.loading = false;
        toast.success("Companies assigned to admin successfully", {
          description: `you have assigned ${companiesIds.length} companies to ${admin?.firstName} ${admin?.lastName} successfully`,
        });
        state.error = null;
      })
      .addCase(assignCompaniesToAdmin.rejected, (state, action) => {
        const adminId = action.meta.arg.adminId;
        const admin = state.data.find((a) => a.id === adminId);
        if (state.previousData) state.data = state.previousData;
        toast.error(
          `Error on Assigning ${action.meta.arg.companiesIds.length} Companies to ${admin?.firstName} ${admin?.lastName}`,
          {
            description: String(action.payload),
          },
        );
        state.loading = false;
        state.error = String(action.payload);
      })
      // ─── assignAdminsToAdmin ─── (Optimistic)
      .addCase(assignAdminsToAdmin.pending, (state, action) => {
        const adminId = action.meta.arg.adminId;
        const usersIds = action.meta.arg.usersIds;
        state.previousData = state.data;
        state.data = state.data.map((a) =>
          a.id === adminId ? { ...a, adminIds: usersIds } : a,
        );
        state.loading = true;
        state.error = null;
      })
      .addCase(assignAdminsToAdmin.fulfilled, (state, action) => {
        const adminId = action.meta.arg.adminId;
        const usersIds = action.payload;
        const admin = state.data.find((a) => a.id === adminId);
        state.data = state.data.map((a) =>
          a.id === adminId ? { ...a, adminIds: usersIds } : a,
        );
        state.loading = false;
        toast.success("Admins assigned to admin successfully", {
          description: `you have assigned ${usersIds.length} admins to ${admin?.firstName} ${admin?.lastName} successfully`,
        });
        state.error = null;
      })
      .addCase(assignAdminsToAdmin.rejected, (state, action) => {
        const adminId = action.meta.arg.adminId;
        const admin = state.data.find((a) => a.id === adminId);
        if (state.previousData) state.data = state.previousData;
        toast.error(
          `Error on Assigning ${action.meta.arg.usersIds.length} Admins to ${admin?.firstName} ${admin?.lastName}`,
          {
            description: String(action.payload),
          },
        );
        state.loading = false;
        state.error = String(action.payload);
      });
  },
});

export const { openDrawer, closeDrawer, setDefaultValues, clearAdmins } =
  adminsSlice.actions;

export const adminsReducer = adminsSlice.reducer;
