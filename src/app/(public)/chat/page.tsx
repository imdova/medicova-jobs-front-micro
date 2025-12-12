"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading/loading";
import { notFound } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { API_GET_USER_CHATS } from "@/api/general";
import { ChatType } from "@/types/chat";
import ChatsList from "./components/ChatsList";
import ChatArea from "./components/ChatArea";

const ChatPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

  const userId = user?.type === "employer" ? user.companyId : user?.id;
  const data = useFetch<PaginatedResponse<ChatType>>(
    userId ? API_GET_USER_CHATS + userId : null,
    {},
    (data) => setSelectedChat(data.data[0]),
  );
  const { setData } = data;

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated" || !user) return notFound();
  return (
    <div className="flex h-[calc(100dvh-126px)] w-full gap-2 px-2">
      <ChatsList
        user={user}
        data={data}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
      <ChatArea
        user={user}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        setChatList={setData}
      />
    </div>
  );
};

export default ChatPage;
