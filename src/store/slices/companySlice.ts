import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_GET_COMPANY_BY_ID,
  API_UPDATE_COMPANY,
  API_UPDATE_COMPANY_USER_NAME,
} from "@/api/employer";
import { Company } from "@/types";
import revalidateTag from "@/lib/revalidate";
import { TAGS } from "@/api";
import { RootState } from "../store";
import { toast } from "sonner";

// ─── State Shape ───────────────────────────────────────────────
interface CompanyState {
  data: Company | null;
  previousData: Company | null; // for rollback
  loading: boolean;
  cachedId: string | null;
}

const initialState: CompanyState = {
  data: null,
  previousData: null,
  loading: true,
  cachedId: null,
};

export const fetchCompany = createAsyncThunk(
  "company/fetchCompany",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_COMPANY_BY_ID + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      if (response.ok) {
        const data: Company = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch company");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch company",
      );
    }
  },
  {
    condition: (id: string, { getState }) => {
      const state = getState() as RootState;
      const currentCompany = state.company.data;
      const loading = state.company.loading;
      const cachedId = state.company.cachedId;
      if (loading && cachedId === id) return false;
      if (currentCompany) return false;
      return true;
    },
  },
);

// ─── Update Company Thunk (Optimistic) ─────────────────────────
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (
    { id, updates }: { id: string; updates: Partial<Company> },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ ...updates, id });
      const response = await fetch(API_UPDATE_COMPANY, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });
      if (response.ok) {
        const data: Company = await response.json();
        revalidateTag(TAGS.company);
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to update company");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update company",
      );
    }
  },
);

export const updateCompanyUserName = createAsyncThunk(
  "company/updateCompanyUserName",
  async (
    { id, username }: { id: string; username: string },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ id, username });
      const response = await fetch(API_UPDATE_COMPANY_USER_NAME, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });

      if (response.ok) {
        const data: Company = await response.json();
        revalidateTag(TAGS.company);
        return data;
      }

      const error = await response.json();
      return rejectWithValue(error.message || "Failed to update username");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update username",
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

// ─── Slice Definition ──────────────────────────────────────────
const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompany: (state) => {
      state.data = null;
      state.previousData = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Company ───
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        showToast({
          title: "Error Fetching Company",
          message: action.payload as string,
        });
      })
      // ─── Update Company ───
      .addCase(updateCompany.pending, (state, action) => {
        if (state.data) {
          state.previousData = state.data;
          state.data = {
            ...state.data,
            ...action.meta.arg.updates,
          };
        }
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.data = action.payload;
        state.previousData = null;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        if (state.previousData) {
          state.data = state.previousData;
        }
        state.previousData = null;
        showToast({
          title: "Error Updating Company",
          message: action.payload as string,
        });
      })
      // ─── Update Company Username ───
      .addCase(updateCompanyUserName.pending, (state, action) => {
        if (state.data) {
          state.previousData = state.data;
          const username = action.meta.arg.username;
          if (username) {
            state.data = {
              ...state.data,
              username: username,
            };
          }
        }
      })
      .addCase(updateCompanyUserName.fulfilled, (state, action) => {
        if (state.data) {
          state.data = {
            ...state.data,
            username: action.payload.username,
          };
        }
        state.previousData = null;
        window.history.replaceState(null, "", `/co/${action.payload.username}`);
      })
      .addCase(updateCompanyUserName.rejected, (state, action) => {
        if (state.previousData) {
          state.data = state.previousData; // rollback on error
        }
        state.previousData = null;
        showToast({
          title: "Error Updating Company Username",
          message: action.payload as string,
        });
      });
  },
});

// ─── Export Actions & Reducer ──────────────────────────────────
export const { clearCompany } = companySlice.actions;
export const companyReducer = companySlice.reducer;
