import { ChatMessageType, ChatType } from "@/types/chat";
import { User } from "next-auth";
import { getEmployerProfile } from "./user";

export const getOtherSideData = (chat: ChatType, user: User) => {
  const userId = user.type === "employer" ? user.companyId : user.id;
  const isParticipant = userId === chat.chat.participantId;
  const isAdmin = chat.chat.initiatorType === "system_admin";
  const data = isParticipant
    ? isAdmin
      ? {
          name: "Medicova",
          image: "/logo.jpg",
        }
      : {
          name: chat.initiatorInfo.name,
          image: chat.initiatorInfo.image,
        }
    : {
        name: chat.participantInfo.name,
        image: chat.participantInfo.image,
      };
  return data;
};
export const getOtherSideUserId = (chat: ChatType | null, user: User) => {
  const userId = user.type === "employer" ? user.companyId : user.id;
  const isParticipant = userId === chat?.chat?.participantId;
  const data = isParticipant
    ? chat?.chat?.initiatorId
    : chat?.chat?.participantId;
  return data || null;
};

export function formatTime(dateInput: string | Date): string {
  const date = new Date(dateInput);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${hours}:${minutesStr} ${ampm}`;
}

export function formatMessageDate(inputDateStr: string): string {
  // Defensive: handle null/undefined/invalid input
  if (!inputDateStr) return "";
  let inputDate: Date;
  try {
    inputDate = new Date(inputDateStr);
    if (isNaN(inputDate.getTime())) throw new Error("Invalid date");
  } catch {
    return "";
  }
  const now = new Date();

  // Helper to format time in hh:mm AM/PM
  const formatTime = (date: Date) => {
    let hours =
      date instanceof Date && !isNaN(date as any) ? date.getHours() : 0;
    const minutes =
      date instanceof Date && !isNaN(date as any) ? date.getMinutes() : 0;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // Helper to check if same day
  const isSameDay = (d1: Date, d2: Date) =>
    d1 instanceof Date &&
    d2 instanceof Date &&
    !isNaN(d1 as any) &&
    !isNaN(d2 as any) &&
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Helper to check if yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(inputDate, now)) {
    return formatTime(inputDate);
  } else if (isSameDay(inputDate, yesterday)) {
    return "yesterday";
  }

  // Helper to get start of week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

  if (inputDate.getTime() >= startOfWeek.getTime()) {
    return inputDate.toLocaleDateString("en-US", { weekday: "long" });
  }

  // Return as M/D/YYYY
  const month = inputDate.getMonth() + 1;
  const day = inputDate.getDate();
  const year = inputDate.getFullYear();
  return `${month}/${day}/${year}`;
}

export function insertDateTitles(
  messages: ChatMessageType[],
  myId: string,
): ChatMessageType[] {
  // First sort messages by date ascending
  const sorted = [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const result: ChatMessageType[] = [];
  let lastDateTitle: string | null = null;

  for (const msg of sorted) {
    const dateTitle = (() => {
      const formatted = formatMessageDate(msg.created_at);
      const timePattern = /^\d{1,2}:\d{2} (AM|PM)$/;
      return timePattern.test(formatted) ? "today" : formatted;
    })();

    if (dateTitle !== lastDateTitle) {
      // Insert date title item
      result.push({
        id: `date-${dateTitle}-${Math.random().toString(36).substr(2, 5)}`,
        created_at: "",
        senderId: "",
        recipientId: "",
        text: dateTitle,
        type: "text",
        dateTitle: dateTitle,
        status: "sent",
        senderUserId: "",
      });
      lastDateTitle = dateTitle;
    }

    result.push({
      ...msg,
      type: msg.senderId === myId ? "send" : "received",
    });
  }

  return result;
}
