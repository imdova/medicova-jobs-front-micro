import {
  API_DELETE_ALL_SEEKER_NOTIFICATIONS,
  API_DELETE_SEEKER_NOTIFICATIONS,
  API_GET_SEEKER_NOTIFICATIONS,
  API_MARK_ALL_SEEKER_NOTIFICATIONS_READ,
  API_MARK_ALL_SEEKER_NOTIFICATIONS_UNREAD,
  API_MARK_SEEKER_NOTIFICATIONS_READ,
  API_MARK_SEEKER_NOTIFICATIONS_UNREAD,
  API_SEEKER_SOCKET,
} from "./seeker";
import {
  API_GET_EMPLOYER_NOTIFICATIONS,
  API_DELETE_EMPLOYER_NOTIFICATIONS,
  API_MARK_EMPLOYER_NOTIFICATIONS_READ,
  API_MARK_EMPLOYER_NOTIFICATIONS_UNREAD,
  API_MARK_ALL_EMPLOYER_NOTIFICATIONS_READ,
  API_MARK_ALL_EMPLOYER_NOTIFICATIONS_UNREAD,
  API_DELETE_ALL_EMPLOYER_NOTIFICATIONS,
  API_EMPLOYERS_SOCKET,
} from "./employer";
import {
  API_GET_ADMIN_NOTIFICATIONS,
  API_DELETE_ADMIN_NOTIFICATIONS,
  API_MARK_ADMIN_NOTIFICATIONS_READ,
  API_MARK_ADMIN_NOTIFICATIONS_UNREAD,
  API_MARK_ALL_ADMIN_NOTIFICATIONS_READ,
  API_MARK_ALL_ADMIN_NOTIFICATIONS_UNREAD,
  API_DELETE_ALL_ADMIN_NOTIFICATIONS,
  API_ADMIN_SOCKET,
} from "./admin";
import { RoleState } from "@/types/next-auth";

type NotificationApiConfig = {
  fetch: string;
  delete: string;
  markRead: string;
  markUnread: string;
  markAllRead: string;
  markAllUnread: string;
  deleteAll: string;
  socket: string;
  event: string;
};

export const NOTIFICATION_API: Record<RoleState, NotificationApiConfig> = {
  seeker: {
    fetch: API_GET_SEEKER_NOTIFICATIONS,
    delete: API_DELETE_SEEKER_NOTIFICATIONS,
    markRead: API_MARK_SEEKER_NOTIFICATIONS_READ,
    markUnread: API_MARK_SEEKER_NOTIFICATIONS_UNREAD,
    markAllRead: API_MARK_ALL_SEEKER_NOTIFICATIONS_READ,
    markAllUnread: API_MARK_ALL_SEEKER_NOTIFICATIONS_UNREAD,
    deleteAll: API_DELETE_ALL_SEEKER_NOTIFICATIONS,
    socket: API_SEEKER_SOCKET,
    event: "seeker.notification",
  },
  employer: {
    fetch: API_GET_EMPLOYER_NOTIFICATIONS,
    delete: API_DELETE_EMPLOYER_NOTIFICATIONS,
    markRead: API_MARK_EMPLOYER_NOTIFICATIONS_READ,
    markUnread: API_MARK_EMPLOYER_NOTIFICATIONS_UNREAD,
    markAllRead: API_MARK_ALL_EMPLOYER_NOTIFICATIONS_READ,
    markAllUnread: API_MARK_ALL_EMPLOYER_NOTIFICATIONS_UNREAD,
    deleteAll: API_DELETE_ALL_EMPLOYER_NOTIFICATIONS,
    socket: API_EMPLOYERS_SOCKET,
    event: "employer.notification",
  },
  admin: {
    fetch: API_GET_ADMIN_NOTIFICATIONS,
    delete: API_DELETE_ADMIN_NOTIFICATIONS,
    markRead: API_MARK_ADMIN_NOTIFICATIONS_READ,
    markUnread: API_MARK_ADMIN_NOTIFICATIONS_UNREAD,
    markAllRead: API_MARK_ALL_ADMIN_NOTIFICATIONS_READ,
    markAllUnread: API_MARK_ALL_ADMIN_NOTIFICATIONS_UNREAD,
    deleteAll: API_DELETE_ALL_ADMIN_NOTIFICATIONS,
    socket: API_ADMIN_SOCKET,
    event: "admin.notification",
  },
  unEmployee: {
    fetch: "",
    delete: "",
    markRead: "",
    markUnread: "",
    markAllRead: "",
    markAllUnread: "",
    deleteAll: "",
    socket: "",
    event: "unEmployee.notification",
  },
  unverified: {
    fetch: "",
    delete: "",
    markRead: "",
    markUnread: "",
    markAllRead: "",
    markAllUnread: "",
    deleteAll: "",
    socket: "",
    event: "unverified.notification",
  },
};
export namespace WebSocketEvents {
  export enum Connection {
    CONNECTED = "connected",
    EXCEPTION = "exception",
    DISCONNECTED = "disconnected",
  }
  export enum Seeker {
    NOTIFICATION = "seeker.notification",
    MESSAGE_RECEIVED = "seeker.messageReceived",
    SEND_MESSAGE = "seeker.sendMessage",
  }
  export enum Employer {
    NOTIFICATION = "employer.notification",
    MESSAGE_RECEIVED = "employer.messageReceived",
    SEND_MESSAGE = "employer.sendMessage",
  }
  export enum Admin {
    NOTIFICATION = "admin.notification",
    MESSAGE_RECEIVED = "admin.messageReceived",
    SEND_MESSAGE = "admin.sendMessage",
  }
}

export const CHAT_API = {
  seeker: {
    socket: API_SEEKER_SOCKET,
    event: WebSocketEvents.Seeker.MESSAGE_RECEIVED,
  },
  employer: {
    socket: API_EMPLOYERS_SOCKET,
    event: WebSocketEvents.Employer.MESSAGE_RECEIVED,
  },
  admin: {
    socket: API_ADMIN_SOCKET,
    event: WebSocketEvents.Admin.MESSAGE_RECEIVED,
  },
  unEmployee: {
    socket: "",
    event: "",
  },
  unverified: {
    socket: "",
    event: "",
  },
};
