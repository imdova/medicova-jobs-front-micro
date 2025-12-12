import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Industry } from "@/types";
import {
  API_GET_CAREER_LEVELS,
  API_GET_CAREER_LEVELS_BY_CATEGORY,
  API_GET_CATEGORIES,
  API_GET_CATEGORIES_BY_INDUSTRY,
  API_GET_EMPLOYMENT_TYPES,
  API_GET_INDUSTRIES,
  API_GET_SPECIALITIES,
  API_GET_SPECIALITIES_BY_CATEGORY,
} from "@/api/admin";
import { toQueryString } from "@/util/general";

type IndustryResponse = PaginatedResponse<Industry>;

interface IndustryState {
  industries: {
    data: IndustryResponse;
    loading: boolean;
    error: string | null;
  };
  categories: {
    data: IndustryResponse;
    loading: boolean;
    error: string | null;
  };
  specialities: {
    data: IndustryResponse;
    loading: boolean;
    error: string | null;
  };
  careerLevels: {
    data: IndustryResponse;
    loading: boolean;
    error: string | null;
  };
  employmentTypes: {
    data: IndustryResponse;
    loading: boolean;
    error: string | null;
  };
}

const initialState: IndustryState = {
  industries: {
    data: { data: [], total: 0, limit: 0, page: 0 },
    loading: false,
    error: null,
  },
  categories: {
    data: { data: [], total: 0, limit: 0, page: 0 },
    loading: false,
    error: null,
  },
  specialities: {
    data: { data: [], total: 0, limit: 0, page: 0 },
    loading: false,
    error: null,
  },
  careerLevels: {
    data: { data: [], total: 0, limit: 0, page: 0 },
    loading: false,
    error: null,
  },
  employmentTypes: {
    data: { data: [], total: 0, limit: 0, page: 0 },
    loading: false,
    error: null,
  },
};

// Async thunk for fetching countries
export const fetchIndustries = createAsyncThunk(
  "industry/fetchIndustries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_INDUSTRIES, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch countries");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch countries",
      );
    }
  },
);

// Async thunk for fetching states
export const fetchCategories = createAsyncThunk(
  "industry/fetchCategories",
  async (industryId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        industryId === "all"
          ? API_GET_CATEGORIES
          : API_GET_CATEGORIES_BY_INDUSTRY + industryId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      }

      return rejectWithValue("Failed to fetch states");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch states",
      );
    }
  },
);
export const fetchSpecialities = createAsyncThunk(
  "industry/fetchSpecialities",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        categoryId === "all"
          ? API_GET_SPECIALITIES
          : API_GET_SPECIALITIES_BY_CATEGORY + categoryId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      }

      return rejectWithValue("Failed to fetch states");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch states",
      );
    }
  },
);
export const fetchCareerLevels = createAsyncThunk(
  "industry/fetchCareerLevels",
  async (categoryId: string | string[], { rejectWithValue }) => {
    try {
      const queryParams = toQueryString({ ids: categoryId });
      const response = await fetch(
        categoryId === "all"
          ? API_GET_CAREER_LEVELS
          : API_GET_CAREER_LEVELS_BY_CATEGORY + queryParams + "&limit=200",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      }

      return rejectWithValue("Failed to fetch states");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch states",
      );
    }
  },
);
export const fetchEmploymentTypes = createAsyncThunk(
  "industry/fetchEmploymentTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_EMPLOYMENT_TYPES, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }

      return rejectWithValue("Failed to fetch states");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch states",
      );
    }
  },
);

const industrySlice = createSlice({
  name: "industry",
  initialState,
  reducers: {
    clearIndustries: (state) => {
      state.industries.data = { data: [], total: 0, limit: 0, page: 0 };
      state.industries.error = null;
    },
    clearCategories: (state) => {
      state.categories.data = { data: [], total: 0, limit: 0, page: 0 };
      state.categories.error = null;
    },
    clearSpecialties: (state) => {
      state.specialities.data = { data: [], total: 0, limit: 0, page: 0 };
      state.specialities.error = null;
    },
    clearCareerLevels: (state) => {
      state.careerLevels.data = { data: [], total: 0, limit: 0, page: 0 };
      state.careerLevels.error = null;
    },
    clearEmploymentTypes: (state) => {
      state.careerLevels.data = { data: [], total: 0, limit: 0, page: 0 };
      state.careerLevels.error = null;
    },
  },
  extraReducers: (builder) => {
    // industries reducers
    builder
      .addCase(fetchIndustries.pending, (state) => {
        state.industries.loading = true;
        state.industries.error = null;
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.industries.loading = false;
        state.industries.data = action.payload;
        state.industries.error = null;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.industries.loading = false;
        state.industries.error = action.payload as string;
      })
      // categories reducers
      .addCase(fetchCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = action.payload;
        state.categories.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload as string;
      })
      // specialities reducers
      .addCase(fetchSpecialities.pending, (state) => {
        state.specialities.loading = true;
        state.specialities.error = null;
      })
      .addCase(fetchSpecialities.fulfilled, (state, action) => {
        state.specialities.loading = false;
        state.specialities.data = action.payload;
        state.specialities.error = null;
      })
      .addCase(fetchSpecialities.rejected, (state, action) => {
        state.specialities.loading = false;
        state.specialities.error = action.payload as string;
      })
      // careerLevels reducers
      .addCase(fetchCareerLevels.pending, (state) => {
        state.careerLevels.loading = true;
        state.careerLevels.error = null;
      })
      .addCase(fetchCareerLevels.fulfilled, (state, action) => {
        state.careerLevels.loading = false;
        state.careerLevels.data = action.payload;
        state.careerLevels.error = null;
      })
      .addCase(fetchCareerLevels.rejected, (state, action) => {
        state.careerLevels.loading = false;
        state.careerLevels.error = action.payload as string;
      })
      // employmentTypes reducers
      .addCase(fetchEmploymentTypes.pending, (state) => {
        state.employmentTypes.loading = true;
        state.employmentTypes.error = null;
      })
      .addCase(fetchEmploymentTypes.fulfilled, (state, action) => {
        state.employmentTypes.loading = false;
        state.employmentTypes.data = action.payload;
        state.employmentTypes.error = null;
      })
      .addCase(fetchEmploymentTypes.rejected, (state, action) => {
        state.employmentTypes.loading = false;
        state.employmentTypes.error = action.payload as string;
      });
  },
});

export const {
  clearCareerLevels,
  clearCategories,
  clearIndustries,
  clearSpecialties,
  clearEmploymentTypes,
} = industrySlice.actions;
export const industryReducer = industrySlice.reducer;
