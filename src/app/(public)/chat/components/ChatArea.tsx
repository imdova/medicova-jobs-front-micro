import { API_GET_CHAT_MESSAGES } from "@/api/general";
import { CHAT_API } from "@/api/notifications";
import useFetch from "@/hooks/useFetch";
import { ChatMessageType, ChatType } from "@/types/chat";
import { getOtherSideUserId } from "@/util/chat";
import { toQueryString } from "@/util/general";
import { User } from "next-auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { NoUserPlaceholder } from "./loading";
import ChatHeader from "./ChatHeader";
import { CircularProgress } from "@mui/material";
import ChatBody from "./ChatBody";
import ChatInputField from "./ChatInputField";

const ChatArea: React.FC<{
  user: User;
  selectedChat: ChatType | null;
  setSelectedChat: (id: ChatType | null) => void;
  setChatList: React.Dispatch<
    React.SetStateAction<PaginatedResponse<ChatType> | null>
  >;
}> = ({ user, selectedChat, setChatList }) => {
  const [limit, setLimit] = useState(20);
  const [preventAutoScroll, setPreventAutoScroll] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const query = toQueryString({ limit: limit, id: selectedChat?.chat.id });
  const { data, setData, loading } = useFetch<
    PaginatedResponse<ChatMessageType>
  >(selectedChat ? API_GET_CHAT_MESSAGES + query : null, {
    fetchOnce: false,
    fetchOnUrlChange: true,
  });
  const socketRef = useRef<Socket | null>(null);

  const selectedChatRef = useRef<ChatType | null>(selectedChat);

  const receivedMessage = async (message: ChatMessageType) => {
    if (selectedChatRef.current?.chat.id === message.chat?.id) {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: [...prev.data, message],
        };
      });
    }
    setChatList((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: prev.data.map((chat) => {
          if (chat.chat.id === message.chat?.id) {
            return {
              ...chat,
              lastMessage: message,
              unreadCount:
                chat.chat.id != selectedChatRef.current?.chat.id
                  ? chat.unreadCount + 1
                  : chat.unreadCount,
            };
          }
          return chat;
        }),
      };
    });

    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Sound playback failed", err);
      });
    }
  };

  const connectSocket = (token: string) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    const type = user.type;
    const apiSocket = CHAT_API[type].socket;
    const eventName = CHAT_API[type].event;
    const socket = io(apiSocket, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO");
    });

    socket.on(eventName, (data: ChatMessageType) => {
      receivedMessage(data);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socketRef.current = socket;
  };

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    setLimit(20);
  }, [selectedChat]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/notification.mp3");
    }
  }, []);

  useEffect(() => {
    connectSocket(user.accessToken);
    return () => {
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = useCallback(() => {
    setLimit((prev) => {
      if (prev >= Number(data?.total)) {
        return prev; // no more increase
      }
      return prev + 10;
    });
  }, [data?.total]);

  const isMoreLoading = loading && Number(data?.data?.length) < limit;
  const isFirstLoading = loading && !isMoreLoading;

  if (!selectedChat) {
    return <NoUserPlaceholder />;
  }

  return (
    <div className="flex h-full w-full flex-col justify-between">
      {/* Chat Header */}
      <ChatHeader selectedChat={selectedChat} user={user} />
      {/* Chat Messages */}
      {isFirstLoading ? (
        <div className="flex w-full flex-grow items-center justify-center px-4">
          <CircularProgress />
          <h6 className="ml-4">Loading...</h6>
        </div>
      ) : (
        <ChatBody
          loadMore={handleLoadMore}
          selectedChat={selectedChat}
          user={user}
          data={data}
          limit={limit}
          isMoreLoading={isMoreLoading}
          preventAutoScroll={preventAutoScroll}
          setChatList={setChatList}
          setPreventAutoScroll={setPreventAutoScroll}
        />
      )}
      {/* Chat Input */}
      <ChatInputField
        selectedChat={selectedChat}
        user={user}
        data={data}
        setData={setData}
        setChatList={setChatList}
        setPreventAutoScroll={setPreventAutoScroll}
      />
    </div>
  );
};

export default ChatArea;
