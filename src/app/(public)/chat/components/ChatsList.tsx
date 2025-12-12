import { FetchResult } from "@/hooks/useFetch";
import { ChatType } from "@/types/chat";
import { IconButton, TextField } from "@mui/material";
import { ChevronRight, Search } from "lucide-react";
import { User } from "next-auth";
import { useState } from "react";
import { SkeletonChatItem } from "./loading";
import ChatItem from "./ChatItem";
import { getOtherSideData } from "@/util/chat";

const ChatsList: React.FC<{
  user: User;
  selectedChat: ChatType | null;
  setSelectedChat: (id: ChatType | null) => void;
  data: FetchResult<PaginatedResponse<ChatType>>;
}> = ({ user, selectedChat, setSelectedChat, data }) => {
  const { data: chats, loading } = data;
  const [query, setQuery] = useState("");

  const filterChats = chats?.data
    .filter((chat) => {
      const data = getOtherSideData(chat, user);
      return data.name.toLowerCase().includes(query.toLowerCase());
    })
    .sort((a, b) => {
      const aTime = a.lastMessage?.created_at
        ? new Date(a.lastMessage?.created_at).getTime()
        : 0;
      const bTime = b.lastMessage?.created_at
        ? new Date(b.lastMessage?.created_at).getTime()
        : 0;
      return bTime - aTime;
    });

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      aria-expanded={isExpanded}
      className="fixed z-10 h-[calc(100dvh-126px)] max-w-80 -translate-x-80 rounded-base border border-gray-200 bg-white shadow-soft transition-transform duration-500 aria-expanded:translate-x-0 md:static md:w-full lg:w-1/3"
    >
      <IconButton
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-14 block bg-primary text-white hover:bg-primary/90 md:hidden"
      >
        <ChevronRight className={isExpanded ? "rotate-180" : "rotate-0"} />
      </IconButton>
      {/* Search Field */}
      <TextField
        variant="outlined"
        placeholder="Search messages"
        InputProps={{
          startAdornment: <Search className="text-gray-400" />,
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border-b border-solid border-gray-200 p-2"
      />
      <div className="scroll-bar-hidden max-h-[calc(100dvh-182px)] overflow-y-auto">
        {/* <p className="border-b p-4 text-muted-foreground">Pinned</p> */}
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonChatItem key={index} />
          ))}
        {/* <p className="border-b p-4 text-muted-foreground">All Chats</p> */}
        {filterChats?.map((chat, index) => (
          <ChatItem
            chat={chat}
            user={user}
            key={index}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        ))}
      </div>
      {/* List with Dividers */}
    </div>
  );
};

export default ChatsList;
