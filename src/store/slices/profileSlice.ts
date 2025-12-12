import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/types/seeker";
import {
  API_CREATE_CAREER_PREFERENCE,
  API_GET_CAREER_PREFERENCES_BY_SEEKER_ID,
  API_GET_SEEKER_BY_USERNAME,
  API_RECALCULATE_COMPLETENESS,
  API_UPDATE_CAREER_PREFERENCE,
  API_UPDATE_SEEKER,
} from "@/api/seeker";
import { RootState } from "../store";
import { CareerPreference } from "@/types";

// ─── State Shape ───────────────────────────────────────────────
interface UpdateStatus {
  loading: boolean;
  success: UserProfile | null;
  error: { data: UserProfile | null; message: string } | null;
}

interface UserProfileState {
  data: UserProfile | null;
  loading: boolean;
  careerPreferenceLoading: boolean;
  completenessLoading: boolean;
  error: string | null;
  previousData: UserProfile | null; // for rollback
  updateStatus: Record<string, UpdateStatus>;
}

const initialState: UserProfileState = {
  data: null,
  error: null,
  previousData: null,
  loading: false,
  careerPreferenceLoading: false,
  completenessLoading: false,
  updateStatus: {},
};

// ─── Fetch User Profile ────────────────────────────────────────
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (userName: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_SEEKER_BY_USERNAME + userName, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      if (response.ok) {
        const data: UserProfile = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch user profile");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch user profile",
      );
    }
  },
  {
    condition: (userName: string, { getState }) => {
      const state = getState() as RootState;
      const currentProfile = state.profile.data;
      // if (state.profile.loading) return false;
      if (currentProfile && currentProfile.userName === userName) return false;
      return true;
    },
  },
);
export const fetchUserCompleteness = createAsyncThunk(
  "userProfile/fetchUserCompleteness",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        API_RECALCULATE_COMPLETENESS + id + "/completence",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      if (response.ok) {
        const data: number = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch user completeness");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to fetch user completeness",
      );
    }
  },
  {
    condition: (userName: string, { getState }) => {
      const state = getState() as RootState;
      const currentProfile = state.profile.data;
      if (state.profile.completenessLoading) return false;
      if (
        currentProfile?.completeness &&
        currentProfile.userName === userName &&
        currentProfile.completeness > 0
      )
        return false;
      return true;
    },
  },
);
export const fetchUserCareerPreference = createAsyncThunk(
  "userProfile/fetchUserCareerPreference",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        API_GET_CAREER_PREFERENCES_BY_SEEKER_ID + id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );
      if (response.ok) {
        const data: CareerPreference = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch user completeness");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to fetch user completeness",
      );
    }
  },
  {
    condition: (userName: string, { getState }) => {
      const state = getState() as RootState;
      const currentProfile = state.profile.data;
      if (state.profile.careerPreferenceLoading) return false;
      if (
        currentProfile?.careerPreference &&
        currentProfile.userName === userName
      )
        return false;
      return true;
    },
  },
);
export const updateUserCareerPreference = createAsyncThunk(
  "userProfile/updateUserCareerPreference",
  async (
    {
      id,
      updates,
      key,
    }: { id: string; updates: Partial<CareerPreference>; key?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(API_UPDATE_CAREER_PREFERENCE, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ id, ...updates }),
      });
      if (response.ok) {
        const data: CareerPreference = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch user completeness");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to fetch user completeness",
      );
    }
  },
);
export const createUserCareerPreference = createAsyncThunk(
  "userProfile/createUserCareerPreference",
  async (
    {
      id,
      updates,
      key,
    }: { id: string; updates: Partial<CareerPreference>; key?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(API_CREATE_CAREER_PREFERENCE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ seekerId: id, ...updates }),
      });
      if (response.ok) {
        const data: CareerPreference = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch user completeness");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error
          ? err.message
          : "Failed to fetch user completeness",
      );
    }
  },
);

// ─── Update User Profile (Optimistic) ──────────────────────────
export const updateUserProfile = createAsyncThunk(
  "userProfile/updateUserProfile",
  async (
    {
      id,
      updates,
    }: { id: string; updates: Partial<UserProfile>; key?: string },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ id, ...updates });
      //for testing errors : const body = JSON.stringify({  ...updates, id:id.replace("1", "2") });
      const response = await fetch(API_UPDATE_SEEKER, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });
      if (response.ok) {
        const data: UserProfile = await response.json();
        // revalidatePath("/me/" + data.userName);
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to update user profile");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update user profile",
      );
    }
  },
);

// ─── Slice Definition ──────────────────────────────────────────
const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.data = null;
      state.previousData = null;
      state.loading = false;
    },
    clearSuccess: (state, action: PayloadAction<{ key: string }>) => {
      const { key } = action.payload;
      state.updateStatus[key].success = null;
    },
    clearError: (state, action: PayloadAction<{ key: string }>) => {
      const { key } = action.payload;
      state.updateStatus[key].error = null;
    },
    clearAllSuccess: (state) => {
      Object.keys(state.updateStatus).forEach((key) => {
        state.updateStatus[key].success = null;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch User Profile ───
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ─── Update User Profile ───
      .addCase(updateUserProfile.pending, (state, action) => {
        if (state.data) {
          state.previousData = state.data;
          state.data = {
            ...state.data,
            ...action.meta.arg.updates,
          };
        }
        const key = action.meta.arg.key || "none";
        if (key) {
          state.updateStatus[key] = {
            loading: true,
            success: null,
            error: null,
          };
        }
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.data) {
          state.data = {
            ...state.data,
            ...action.payload,
          };
        } else {
          state.data = action.payload;
        }
        state.previousData = null;
        state.error = null;
        const key = action.meta.arg.key || "none";
        if (key) {
          state.updateStatus[key] = {
            loading: false,
            success: action.payload,
            error: null,
          };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        if (state.previousData) {
          state.data = state.previousData;
        }
        const key = action.meta.arg.key || "none";
        if (key) {
          state.updateStatus[key] = {
            loading: false,
            success: null,
            error: {
              data: state.previousData,
              message: action.payload as string,
            },
          };
        }
        state.previousData = null;
      })
      .addCase(fetchUserCompleteness.fulfilled, (state, action) => {
        if (state.data) {
          state.data = {
            ...state.data,
            completeness: action.payload,
          };
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserCompleteness.pending, (state) => {
        state.completenessLoading = true;
      })
      .addCase(fetchUserCareerPreference.pending, (state) => {
        state.careerPreferenceLoading = true;
      })
      .addCase(fetchUserCareerPreference.fulfilled, (state, action) => {
        if (state.data) {
          state.data = {
            ...state.data,
            careerPreference: action.payload,
          };
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserCareerPreference.pending, (state, action) => {
        if (state.data) {
          state.previousData = state.data;
          const careerPreference = state.data.careerPreference;
          if (careerPreference) {
            state.data = {
              ...state.data,
              careerPreference: {
                ...careerPreference,
                ...action.meta.arg.updates,
              },
            };
          }
        }
        const key = action.meta.arg.key || "none";
        if (key) {
          state.updateStatus[key] = {
            loading: true,
            success: null,
            error: null,
          };
        }
      })
      .addCase(updateUserCareerPreference.fulfilled, (state, action) => {
        if (state.data) {
          state.data = {
            ...state.data,
            careerPreference: action.payload,
          };
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserCareerPreference.rejected, (state, action) => {
        if (state.previousData) {
          state.data = state.previousData;
        }
        const key = action.meta.arg.key || "none";
        if (key) {
          state.updateStatus[key] = {
            loading: false,
            success: null,
            error: {
              data: state.previousData,
              message: action.payload as string,
            },
          };
        }
        state.previousData = null;
      })
      .addCase(createUserCareerPreference.pending, (state, action) => {
        const key = action.meta.arg.key || "none";
        if (key) {
          state.updateStatus[key] = {
            loading: true,
            success: null,
            error: null,
          };
        }
      })
      .addCase(createUserCareerPreference.fulfilled, (state, action) => {
        if (state.data) {
          state.data = {
            ...state.data,
            careerPreference: action.payload,
          };
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(createUserCareerPreference.rejected, (state, action) => {
        const key = action.meta.arg.key || "none";
        if (key) {
          state.updateStatus[key] = {
            loading: false,
            success: null,
            error: {
              data: state.previousData,
              message: action.payload as string,
            },
          };
        }
        state.previousData = null;
      });
  },
});

// ─── Export Actions & Reducer ──────────────────────────────────
export const { clearUserProfile, clearSuccess, clearError, clearAllSuccess } =
  userProfileSlice.actions;
export const userProfileReducer = userProfileSlice.reducer;
