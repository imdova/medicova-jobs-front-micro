import Avatar from "@/components/UI/Avatar";
import { ChatType } from "@/types/chat";
import { cn } from "@/util";
import { formatMessageDate, getOtherSideData } from "@/util/chat";
import { User } from "next-auth";

const ChatItem: React.FC<{
  chat: ChatType;
  user: User;
  selectedChat: ChatType | null;
  setSelectedChat: (chat: ChatType | null) => void;
}> = ({ chat, setSelectedChat, selectedChat, user }) => {
  const isSelected = selectedChat?.chat?.id === chat.chat.id;
  const data = getOtherSideData(chat, user);
  return (
    <div
      onClick={() => setSelectedChat(chat)}
      className={cn(
        "flex cursor-pointer items-start justify-between gap-1 border-b bg-gray-50 p-2 py-3 hover:bg-primary/10",
        isSelected && "bg-primary/10",
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar size={40} alt={data.name + "image"} src={data.image} />
        <div>
          <h6 className="font-bold">{data.name}</h6>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {chat.lastMessage.text}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-nowrap text-xs text-muted-foreground">
          {formatMessageDate(chat.lastMessage.created_at)}
        </p>
        {selectedChat?.chat?.id === chat.chat.id
          ? null
          : chat.unreadCount > 0 && (
              <p className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                {chat.unreadCount}
              </p>
            )}
      </div>
    </div>
  );
};

export default ChatItem;
