import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Sector } from "@/types";
import {
  API_GET_COMPANY_SECTORS,
  API_GET_COMPANY_TYPES,
  API_GET_COMPANY_TYPES_BY_SECTOR,
} from "@/api/admin";

type SectorResponse = PaginatedResponse<Sector>;

interface SectorState {
  sectors: {
    data: SectorResponse;
    loading: boolean;
    error: string | null;
  };
  types: {
    data: SectorResponse;
    loading: boolean;
    error: string | null;
  };
}

const initialState: SectorState = {
  sectors: {
    data: { data: [], total: 0, limit: 0, page: 0 },
    loading: false,
    error: null,
  },
  types: {
    data: { data: [], total: 0, limit: 0, page: 0 },
    loading: false,
    error: null,
  },
};

// Async thunk for fetching sectors
export const fetchSectors = createAsyncThunk(
  "sector/fetchSectors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_COMPANY_SECTORS, {
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
      return rejectWithValue("Failed to fetch sectors");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch sectors",
      );
    }
  },
);

// Async thunk for fetching sector types
export const fetchSectorTypes = createAsyncThunk(
  "sector/fetchSectorTypes",
  async (sectorId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        sectorId === "all"
          ? API_GET_COMPANY_TYPES
          : API_GET_COMPANY_TYPES_BY_SECTOR + sectorId,
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
      return rejectWithValue("Failed to fetch sector types");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch sector types",
      );
    }
  },
);

const sectorSlice = createSlice({
  name: "sector",
  initialState,
  reducers: {
    clearSectors: (state) => {
      state.sectors.data = { data: [], total: 0, limit: 0, page: 0 };
      state.sectors.error = null;
    },
    clearSectorTypes: (state) => {
      state.types.data = { data: [], total: 0, limit: 0, page: 0 };
      state.types.error = null;
    },
  },
  extraReducers: (builder) => {
    // sectors reducers
    builder
      .addCase(fetchSectors.pending, (state) => {
        state.sectors.loading = true;
        state.sectors.error = null;
      })
      .addCase(fetchSectors.fulfilled, (state, action) => {
        state.sectors.loading = false;
        state.sectors.data = action.payload;
        state.sectors.error = null;
      })
      .addCase(fetchSectors.rejected, (state, action) => {
        state.sectors.loading = false;
        state.sectors.error = action.payload as string;
      })
      // sector types reducers
      .addCase(fetchSectorTypes.pending, (state) => {
        state.types.loading = true;
        state.types.error = null;
      })
      .addCase(fetchSectorTypes.fulfilled, (state, action) => {
        state.types.loading = false;
        state.types.data = action.payload;
        state.types.error = null;
      })
      .addCase(fetchSectorTypes.rejected, (state, action) => {
        state.types.loading = false;
        state.types.error = action.payload as string;
      });
  },
});

export const { clearSectors, clearSectorTypes } = sectorSlice.actions;
export const sectorReducer = sectorSlice.reducer;
