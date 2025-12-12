import { API_SEND_MESSAGE } from "@/api/general";
import useUpdateApi from "@/hooks/useUpdateApi";
import { ChatMessageType, ChatType } from "@/types/chat";
import { generateId } from "@/util";
import { Attachment, EmojiEmotions } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { Loader, Send } from "lucide-react";
import { User } from "next-auth";
import { KeyboardEvent, useState } from "react";

const ChatInputField: React.FC<{
  user: User;
  selectedChat: ChatType;
  data: PaginatedResponse<ChatMessageType> | null;
  setData: React.Dispatch<
    React.SetStateAction<PaginatedResponse<ChatMessageType> | null>
  >;
  setPreventAutoScroll: React.Dispatch<React.SetStateAction<boolean>>;
  setChatList: React.Dispatch<
    React.SetStateAction<PaginatedResponse<ChatType> | null>
  >;
}> = ({
  selectedChat,
  user,
  data,
  setData,
  setPreventAutoScroll,
  setChatList,
}) => {
  const [message, setMessage] = useState("");
  const { isLoading, update } = useUpdateApi();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim()) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userId = user.type === "employer" ? user.companyId : user.id;
    const isInitiator = selectedChat.chat.initiatorId === userId;
    const recipientId = isInitiator
      ? selectedChat.chat.participantId
      : selectedChat.chat.initiatorId;

    const body = {
      chatId: selectedChat.chat.id,
      senderId: userId,
      recipientId: recipientId,
      text: message,
      senderUserId: user.id,
    };
    if (!data) return;
    const clonedData = [...data.data];
    if (userId && user.id) {
      const newMessage: ChatMessageType = {
        id: generateId(),
        created_at: new Date().toISOString(),
        recipientId: recipientId,
        senderId: userId,
        senderUserId: user.id,
        status: "sent",
        text: message,
        chat: selectedChat.chat,
      };
      const newData = {
        data: [...clonedData, newMessage],
        total: data.total,
        count: data.count,
        limit: data.limit,
        page: data.page,
      };
      setData(newData);
      setMessage("");
      setPreventAutoScroll(false);
      const newServerMessage = (await update(API_SEND_MESSAGE, {
        method: "POST",
        body,
      })) as ChatMessageType;

      const newServerData = {
        data: [...clonedData, newServerMessage],
        total: data.total,
        count: data.count,
        limit: data.limit,
        page: data.page,
      };
      setData(newServerData);

      setChatList((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map((chat) => {
            if (chat.chat.id === selectedChat.chat.id) {
              return {
                ...chat,
                lastMessage: newMessage,
              };
            }
            return chat;
          }),
        };
      });
    }
  };

  return (
    <div className="flex items-end gap-3 border-t p-4">
      <TextField
        fullWidth
        placeholder="Type a message"
        variant="outlined"
        multiline
        minRows={1} // Start with one row
        maxRows={6} // Limit to 6 rows, adjust as you like
        onKeyDown={handleKeyDown}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        InputProps={{
          startAdornment: (
            <div className="flex items-center">
              <IconButton component="label">
                <Attachment />
                <input type="file" hidden />
              </IconButton>
              <IconButton>
                <EmojiEmotions />
              </IconButton>
            </div>
          ),
        }}
        sx={{
          "& .MuiInputBase-root": {
            pl: 1,
            alignItems: "flex-end", // Align icons at the bottom with textarea
          },
          "& .MuiOutlinedInput-root": {
            p: 0,
            borderRadius: "10px",
            height: "auto",
          },
        }}
      />
      <IconButton
        onClick={sendMessage}
        className="rounded-base bg-primary p-4 text-white hover:bg-primary/90"
      >
        {isLoading ? (
          <Loader className="h-4 w-4" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </IconButton>
    </div>
  );
};

export default ChatInputField;
