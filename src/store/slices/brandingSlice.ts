import { BrandingData } from "@/types/branding";
import { applyBrandingColors } from "@/util/branding";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const data: BrandingData = {
  generalData: {
    siteName: "Medicova",
    siteTitle: "Medicova | Healthcare Jobs Platform",
    siteDescription:
      "Find top healthcare and medical jobs with Medicova. We connect healthcare professionals with the best job opportunities across clinics, hospitals, and medical centers.",
    siteKeywords:
      "Medicova, healthcare jobs, medical jobs, nursing jobs, doctor jobs, hospital careers, medical vacancies, healthcare hiring, clinical jobs",
  },
  assetsData: {
    primaryLogo: "/images/logo-dark.png",
    secondaryLogo: "/images/logo.png",
    footerIcon: "/images/logo.png",
    invoiceIcon: "/images/medicova.jpg",
    favicon: "/favicon.ico", 
    appIcon: "/favicon.ico",
  },
  colorsData: {
    primary: "#2ba149",
    "primary-100": "#ecf7f3",
    "primary-900": "#31b151",
    "primary-foreground": "#ffffff",
    background: "#ffffff25",
    "light-primary": "#82c341",
    "light-primary-transparent": "#82c341e5",
    "primary-transparent": "#2ba149e5",
    "text-main": "#161439",
    "text-muted-foreground": "#6d6c80",
    warning: "#ff9900",
    "warning-100": "#f8e6d0",
    error: "#ff0000",
  },
};

// Async thunk to fetch branding data from your API
export const fetchBrandingData = createAsyncThunk(
  "branding/fetchBrandingData",
  async () => {
    const response = await fetch("/api/branding"); // update with your real API URL
    const data = await response.json();
    return data as BrandingData;
  },
);

export const updateBrandingData = createAsyncThunk(
  "branding/updateBrandingData",
  async (newData: Partial<BrandingData>) => {
    const response = await fetch("/api/branding/update", {
      method: "PUT", // or PATCH depending on your API
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error("Failed to update branding data");
    }

    const updated = await response.json();
    return updated as BrandingData;
  },
);

interface BrandingState {
  data: BrandingData;
  loading: boolean;
  error: string | null;
}

const initialState: BrandingState = {
  data: data,
  loading: false,
  error: null,
};

const brandingSlice = createSlice({
  name: "branding",
  initialState,
  reducers: {
    setBrandingData(state, action: PayloadAction<BrandingData>) {
      state.data = action.payload;
    },
    patchBrandingData(state, action: PayloadAction<Partial<BrandingData>>) {
      state.data = {
        ...state.data,
        ...action.payload,
        colorsData: {
          ...state.data?.colorsData,
          ...action.payload.colorsData,
        },
      } as BrandingData;

      // Immediately apply new colors
      if (action.payload.colorsData) {
        applyBrandingColors(action.payload.colorsData);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrandingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandingData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        applyBrandingColors(action.payload.colorsData);
      })
      .addCase(fetchBrandingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch branding data";
      })
      .addCase(updateBrandingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrandingData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        applyBrandingColors(action.payload.colorsData);
      })
      .addCase(updateBrandingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update branding";
      });
  },
});

export const { setBrandingData, patchBrandingData } = brandingSlice.actions;
export const brandingReducer = brandingSlice.reducer;
