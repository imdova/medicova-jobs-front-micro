export type ChatInitiatorEnum = "company" | "system_admin";
export type ChatParticipantEnum = "company" | "system_admin" | "seeker";
export type ChatInfo = {
  id: string;
  created_at: string;
  initiatorId: string;
  participantId: string;
  initiatorType: ChatInitiatorEnum;
  participantType: ChatParticipantEnum;
};

export type ChatMessageType = {
  id: string;
  created_at: string;
  senderId: string;
  recipientId: string;
  text: string;
  type?: "send" | "received" | "text";
  dateTitle?: string;
  status: "sent" | "seen";
  senderUserId: string;
  chat?: ChatInfo;
};

export type ChatType = {
  chat: ChatInfo;
  lastMessage: ChatMessageType;
  unreadCount: number;
  isPinned: boolean;
  pinOrder: number | null;
  initiatorInfo: {
    name: string;
    image: string;
  };
  participantInfo: {
    name: string;
    image: string;
  };
};
