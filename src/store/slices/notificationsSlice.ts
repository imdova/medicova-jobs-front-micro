import { NOTIFICATION_API } from "@/api/notifications";
import { API_SEEKER_SOCKET } from "@/api/seeker";
import { Notification } from "@/types";
import { RoleState } from "@/types/next-auth";
import { NotificationFilter } from "@/types/notifications";
import { generateId } from "@/util";
import { toQueryString } from "@/util/general";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

interface NotificationState {
  data: PaginatedResponse<Notification>;
  loading: boolean;
  error: string | null;
  socketConnected: boolean;
}

const initialState: NotificationState = {
  data: {
    data: [],
    total: 0,
    limit: 0,
    page: 0,
  },
  loading: false,
  error: null,
  socketConnected: false,
};

let socket: Socket | null = null;

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (
    { filter, type }: { filter: NotificationFilter; type: RoleState },
    { rejectWithValue },
  ) => {
    const API_END_POINT = NOTIFICATION_API[type].fetch;
    try {
      const query = toQueryString(filter);
      const response = await fetch(API_END_POINT + query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        return rejectWithValue("Failed to fetch notifications");
      }
      const result: PaginatedResponse<Notification> = await response.json();
      return result || [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch notifications",
      );
    }
  },
  {
    condition: (
      { filter }: { filter: NotificationFilter; type: RoleState },
      { getState },
    ) => {
      const state = getState() as { notifications: NotificationState };
      return state.notifications.data.data.length <= (filter.limit || 0);
    },
  },
);
export const refetchNotifications = createAsyncThunk(
  "notifications/refetchNotifications",
  async (
    { filter, type }: { filter: NotificationFilter; type: RoleState },
    { rejectWithValue },
  ) => {
    const API_END_POINT = NOTIFICATION_API[type].fetch;
    try {
      const query = toQueryString(filter);
      const response = await fetch(API_END_POINT + query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        return rejectWithValue("Failed to fetch notifications");
      }
      const result: PaginatedResponse<Notification> = await response.json();
      return result || [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch notifications",
      );
    }
  },
);

// Async thunk for toggling notification read status
export const toggleNotificationReadStatus = createAsyncThunk(
  "notifications/toggleReadStatus",
  async (
    {
      notificationId,
      isRead,
      type,
    }: { notificationId: string; isRead: boolean; type: RoleState },
    { rejectWithValue },
  ) => {
    try {
      const endpoint = isRead
        ? NOTIFICATION_API[type].markRead
        : NOTIFICATION_API[type].markUnread;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ids: [notificationId] }),
      });

      if (!response.ok) {
        return rejectWithValue("Failed to update notification status");
      }

      return { notificationId, isRead };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update notification status",
      );
    }
  },
);

// Async thunk for marking all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (
    { id, type }: { id: string; type: RoleState },
    { rejectWithValue },
  ) => {
    try {
      const API_END_POINT = NOTIFICATION_API[type].markAllRead;
      const response = await fetch(`${API_END_POINT}${id}/mark-all-read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        return rejectWithValue("Failed to mark all notifications as read");
      }
      return { id, isRead: true };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications as read",
      );
    }
  },
);

// Async thunk for marking all notifications as unread
export const markAllNotificationsAsUnread = createAsyncThunk(
  "notifications/markAllAsUnread",
  async (
    { id, type }: { id: string; type: RoleState },
    { rejectWithValue },
  ) => {
    try {
      const API_END_POINT = NOTIFICATION_API[type].markAllUnread;
      const response = await fetch(`${API_END_POINT}${id}/mark-all-unread`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return rejectWithValue("Failed to mark all notifications as unread");
      }

      return { id, isRead: false };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications as unread",
      );
    }
  },
);

// Async thunk for deleting specific notifications
export const deleteNotifications = createAsyncThunk(
  "notifications/deleteNotifications",
  async (
    { ids, type }: { ids: string[]; type: RoleState },
    { rejectWithValue },
  ) => {
    try {
      const API_END_POINT = NOTIFICATION_API[type].delete;
      const response = await fetch(API_END_POINT, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        return rejectWithValue("Failed to delete notifications");
      }

      return { ids };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to delete notifications",
      );
    }
  },
);

// Async thunk for deleting all notifications for a seeker
export const deleteAllNotifications = createAsyncThunk(
  "notifications/deleteAllNotifications",
  async (
    { id, type }: { id: string; type: RoleState },
    { rejectWithValue },
  ) => {
    try {
      const API_END_POINT = NOTIFICATION_API[type].delete;
      const response = await fetch(`${API_END_POINT}${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return rejectWithValue("Failed to delete all notifications");
      }

      return { id };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to delete all notifications",
      );
    }
  },
);

// Slice
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.data.data.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.data = initialState.data;
      state.error = null;
    },
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.socketConnected = action.payload;
    },
    toggleNotificationReadStatusOptimistic: (
      state,
      action: PayloadAction<{ notificationId: string; isRead: boolean }>,
    ) => {
      const { notificationId, isRead } = action.payload;
      const notification = state.data.data.find(
        (notif) => notif.id === notificationId,
      );
      if (notification) {
        notification.isRead = isRead;
      }
    },
    markAllNotificationsAsReadOptimistic: (state) => {
      state.data.data = state.data.data.map((notification) => ({
        ...notification,
        isRead: true,
      }));
    },
    markAllNotificationsAsUnreadOptimistic: (
      state,
      action: PayloadAction<string>,
    ) => {
      const seekerId = action.payload;
      state.data.data = state.data.data.map((notification) =>
        notification.seekerId === seekerId
          ? { ...notification, isRead: false }
          : notification,
      );
    },
    deleteNotificationsOptimistic: (state, action: PayloadAction<string[]>) => {
      const notificationIds = action.payload;
      state.data.data = state.data.data.filter(
        (notification) => !notificationIds.includes(notification.id),
      );
      // Update total count
      state.data.total = Math.max(0, state.data.total - notificationIds.length);
    },
    deleteAllNotificationsOptimistic: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(toggleNotificationReadStatus.fulfilled, (state, action) => {
        // The optimistic update already handled the UI change
        // This just confirms the server update was successful
        state.error = null;
      })
      .addCase(toggleNotificationReadStatus.rejected, (state, action) => {
        // Revert the optimistic update on failure
        const { notificationId, isRead } = action.meta.arg;
        const notification = state.data.data.find(
          (notif) => notif.id === notificationId,
        );
        if (notification) {
          notification.isRead = !isRead; // Revert to previous state
        }
        state.error = action.payload as string;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        // The optimistic update already handled the UI change
        // This just confirms the server update was successful
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.data.data = state.data.data.map((notification) => ({
          ...notification,
          isRead: false,
        }));
        state.error = action.payload as string;
      })
      .addCase(markAllNotificationsAsUnread.fulfilled, (state, action) => {
        // The optimistic update already handled the UI change
        // This just confirms the server update was successful
        state.error = null;
      })
      .addCase(markAllNotificationsAsUnread.rejected, (state, action) => {
        state.data.data = state.data.data.map((notification) => ({
          ...notification,
          isRead: true,
        }));
        state.error = action.payload as string;
      })
      .addCase(deleteNotifications.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(deleteNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteAllNotifications.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Actions
export const {
  addNotification,
  clearNotifications,
  setSocketConnected,
  toggleNotificationReadStatusOptimistic,
  markAllNotificationsAsReadOptimistic,
  markAllNotificationsAsUnreadOptimistic,
  deleteNotificationsOptimistic,
  deleteAllNotificationsOptimistic,
} = notificationsSlice.actions;

// Reducer
export const notificationsReducer = notificationsSlice.reducer;

// Socket connection handler
export const connectSocket =
  (token: string, filter: NotificationFilter, type: RoleState) =>
  (dispatch: any) => {
    const apiSocket = NOTIFICATION_API[type].socket;
    const eventName = NOTIFICATION_API[type].event;
    if (socket || !apiSocket) {
      return;
      // socket.disconnect();
    }
    socket = io(API_SEEKER_SOCKET, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      dispatch(setSocketConnected(true));
    });

    socket.on(eventName, (data: Notification) => {
      data.id = generateId();
      data.created_at = new Date().toISOString();
      data.isRead = false;
      dispatch(addNotification(data));
      dispatch(refetchNotifications({ filter, type }));
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      dispatch(setSocketConnected(false));
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      dispatch(setSocketConnected(false));
    });
  };

// Optional: function to disconnect
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Helper function to toggle notification read status with optimistic updates
export const toggleNotificationRead =
  (notificationId: string, isRead: boolean, type: RoleState) =>
  (dispatch: any) => {
    // Optimistically update the UI immediately
    dispatch(
      toggleNotificationReadStatusOptimistic({ notificationId, isRead }),
    );
    // Then make the API call
    dispatch(toggleNotificationReadStatus({ notificationId, isRead, type }));
  };

// Helper function to mark all notifications as read with optimistic updates
export const markAllAsRead =
  (id: string, type: RoleState) => (dispatch: any) => {
    dispatch(markAllNotificationsAsReadOptimistic());
    dispatch(markAllNotificationsAsRead({ id, type }));
  };

// Helper function to mark all notifications as unread with optimistic updates
export const markAllAsUnread =
  (id: string, type: RoleState) => (dispatch: any) => {
    // Optimistically update the UI immediately
    dispatch(markAllNotificationsAsUnreadOptimistic(id));
    // Then make the API call
    dispatch(markAllNotificationsAsUnread({ id, type }));
  };

// Helper function to delete specific notifications with optimistic updates
export const deleteSpecificNotifications =
  (ids: string[], type: RoleState) => (dispatch: any) => {
    // Optimistically update the UI immediately
    dispatch(deleteNotificationsOptimistic(ids));

    // Then make the API call
    dispatch(deleteNotifications({ ids, type }));
  };

// Helper function to delete all notifications for a seeker with optimistic updates
export const deleteAllNotificationsForSeeker =
  (id: string, type: RoleState) => (dispatch: any) => {
    // Optimistically update the UI immediately
    dispatch(deleteAllNotificationsOptimistic());

    // Then make the API call
    dispatch(deleteAllNotifications({ id, type }));
  };
