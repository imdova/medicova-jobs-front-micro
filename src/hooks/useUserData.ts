import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearError,
  clearSuccess,
  fetchUserCareerPreference,
  fetchUserCompleteness,
  fetchUserProfile,
} from "@/store/slices/profileSlice";
import { UserProfile } from "@/types/seeker";
import { areMainFieldsEqual, UserProfileToUser } from "@/util/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useUserData = (
  initialUserName?: string | null,
  updateKey?: string, // <-- NEW: track per-update key
  onSuccess?: (data: UserProfile | null) => void,
  onError?: (data: UserProfile | null) => void,
) => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const username = initialUserName || user?.userName;
  const dispatch = useAppDispatch();

  const {
    data,
    loading: profileLoading,
    error: profileError,
    updateStatus,
  } = useAppSelector((state) => state.profile);

  // Scoped loading/success/error for this updateKey
  const scopedLoading = updateKey
    ? updateStatus[updateKey]?.loading
    : undefined;
  const scopedSuccess = updateKey
    ? updateStatus[updateKey]?.success
    : undefined;
  const scopedError = updateKey
    ? updateStatus[updateKey]?.error
    : updateStatus?.none?.error || undefined;

  const [cachedId, setCachedId] = useState<string | null>(null);

  // Fetch profile only if username changes
  useEffect(() => {
    if (data?.id) {
      dispatch(fetchUserCompleteness(data.id));
      dispatch(fetchUserCareerPreference(data.id));
    }
  }, [data?.id, dispatch]);

  // Fetch profile only if username changes
  useEffect(() => {
    if (!username || username === cachedId) return;
    dispatch(fetchUserProfile(username));
    setCachedId(username);
  }, [username, cachedId, dispatch]);

  // Run success callback only for the scoped key
  useEffect(() => {
    if (scopedSuccess) {
      onSuccess?.(scopedSuccess);

      if (updateKey) {
        dispatch(clearSuccess({ key: updateKey }));
      }
    }
  }, [scopedSuccess, updateKey, user, update, dispatch, onSuccess]);

  useEffect(() => {
    if (scopedError) {
      onError?.(scopedError.data);

      if (user && scopedError.data) {
        const prevUser = UserProfileToUser(scopedError.data);
        if (!areMainFieldsEqual(user, prevUser)) {
          setTimeout(() => {
            update(prevUser);
          }, 500);
        }
      }

      toast.error("Error on Updating User data", {
        description: scopedError?.message,
        position: "bottom-right",
        style: {
          "--normal-bg": "color-mix(in oklab, var(--destructive) 5%, white)",
          "--normal-text": "var(--destructive)",
          "--normal-border":
            "color-mix(in oklab, var(--destructive) 25%, white)",
        } as React.CSSProperties,
      });
      if (updateKey) {
        dispatch(clearError({ key: updateKey }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopedError, onError]);

  return {
    user: data,
    loading: profileLoading, // loading for fetching profile
    updating: scopedLoading ?? false, // loading for this form
    error: profileError,
    updateError: scopedError ?? null, // error for this form
  };
};
