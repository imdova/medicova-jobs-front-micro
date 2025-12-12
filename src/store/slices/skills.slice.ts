import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_GET_SEEKER_SKILLS,
  API_CREATE_SEEKER_SKILL,
  API_DELETE_SEEKER_SKILL,
} from "@/api/seeker";
import { SkillData } from "@/types/seeker"; // define this type like ExperienceData
import { toast } from "sonner";
import { RootState } from "../store";

interface SkillState {
  data: SkillData[];
  previousData: SkillData[] | null;
  cachedId: string | null;
  fetching: boolean;
  loading: boolean;
}

const initialState: SkillState = {
  data: [],
  previousData: null,
  cachedId: null,
  fetching: false,
  loading: false,
};

// ─── Fetch Skills ─────────────────────────────────────────
export const fetchSkills = createAsyncThunk(
  "skill/fetchSkills",
  async (seekerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_GET_SEEKER_SKILLS + seekerId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      if (response.ok) {
        const data: SkillData[] = await response.json();
        return data;
      }
      return rejectWithValue("Failed to fetch skills");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch skills",
      );
    }
  },
  {
    condition: (seekerId: string, { getState }) => {
      const state = getState() as RootState;
      const currentSkills = state.skills.data;
      const fetching = state.skills.fetching;
      if (fetching) return false;
      if (currentSkills && currentSkills.length > 0) return false;
      if (seekerId === state.skills.cachedId) return false;
      return true;
    },
  },
);

// ─── Create Skill ─────────────────────────────────────────
export const createSkill = createAsyncThunk(
  "skill/createSkill",
  async (
    {
      seekerId,
      skill,
    }: { seekerId: string; skill: Partial<SkillData>; key?: string },
    { rejectWithValue },
  ) => {
    try {
      const body = JSON.stringify({ seekerId, ...skill });
      const response = await fetch(API_CREATE_SEEKER_SKILL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body,
      });

      if (response.ok) {
        const data: SkillData = await response.json();
        return data;
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to create skill");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to create skill",
      );
    }
  },
);

// ─── Delete Skill ─────────────────────────────────────────
export const deleteSkill = createAsyncThunk(
  "skill/deleteSkill",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_DELETE_SEEKER_SKILL + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      console.log("🚀 ~ response:", response);

      if (response.ok) {
        return { id };
      }
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to delete skill");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to delete skill",
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
const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {
    clearSkills: (state) => {
      state.data = [];
      state.fetching = false;
      state.cachedId = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Fetch Skills ───
      .addCase(fetchSkills.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.fetching = false;
        state.data = action.payload;
        state.cachedId = action.meta.arg;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.fetching = false;
        showToast({
          title: "Error on Fetching Skills",
          message: action.payload as string,
        });
      })

      // ─── Create Skill ─── (Optimistic)
      .addCase(createSkill.pending, (state, action) => {
        state.previousData = state.data;
        const tempId = "temp-" + Date.now();
        state.data = [
          ...state.data,
          { ...(action.meta.arg.skill as SkillData), id: tempId },
        ];
        state.loading = true;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.data = state.data.map((s) =>
          String(s.id).startsWith("temp") ? action.payload : s,
        );
        state.loading = false;
      })
      .addCase(createSkill.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Creating Skill",
          message: action.payload as string,
        });
        state.loading = false;
      })

      // ─── Delete Skill ─── (Optimistic)
      .addCase(deleteSkill.pending, (state, action) => {
        state.previousData = state.data;
        state.data = state.data.filter((s) => s.id !== action.meta.arg);
        state.loading = true;
      })
      .addCase(deleteSkill.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        if (state.previousData) state.data = state.previousData;
        showToast({
          title: "Error on Deleting Skill",
          message: action.payload as string,
        });
        state.loading = false;
      });
  },
});

// ─── Export ────────────────────────────────────────────────────
export const { clearSkills } = skillSlice.actions;
export const skillReducer = skillSlice.reducer;
