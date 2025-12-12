import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_GET_COMPANIES } from "@/api/employer";
import { Company } from "@/types";
import { RootState } from "../store";
import { toQueryString } from "@/util/general";
import { toast } from "@/components/UI/showToast";

// ─── State Shape ───────────────────────────────────────────────
interface CompanyState {
  data: Company[];
  total?: number;
  page?: number;
  limit?: number;
  previousData: Company[] | null; // for rollback
  fetching: boolean;
  loading: boolean;
  cachedQuery: string | null;
  error: string | null;
}

const initialState: CompanyState = {
  data: [],
  total: 0,
  page: 1,
  limit: 10,
  previousData: null,
  fetching: false,
  loading: true,
  cachedQuery: null,
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (filter: { limit: number; page: number }, { rejectWithValue }) => {
    try {
      const query = toQueryString(filter);
      const response = await fetch(API_GET_COMPANIES + query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      if (response.ok) {
        const data: PaginatedResponse<Company> = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch companies");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch company",
      );
    }
  },
  {
    condition: (filter: { limit: number; page: number }, { getState }) => {
      const state = getState() as RootState;
      const { cachedQuery, fetching } = state.companies;
      if (fetching || cachedQuery === toQueryString(filter)) return false;
      return true;
    },
  },
);

// ─── Slice Definition ──────────────────────────────────────────
const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompany: (state) => {
      state.data = [];
      state.cachedQuery = null;
      state.previousData = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Companies ───
      .addCase(fetchCompanies.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.fetching = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.cachedQuery = toQueryString(action.meta.arg);
        state.error = null;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        toast.error("Error Fetching Company", {
          description: action.payload as string,
        });
      });
  },
});

// ─── Export Actions & Reducer ──────────────────────────────────
export const { clearCompany } = companySlice.actions;
export const companiesReducer = companySlice.reducer;
