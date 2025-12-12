import Avatar from "@/components/UI/Avatar";
import { ChatMessageType, ChatType } from "@/types/chat";
import { formatTime, getOtherSideData } from "@/util/chat";
import { User } from "next-auth";

const ReceivedMessage: React.FC<{
  message: ChatMessageType;
  selectedChat: ChatType;
  user: User;
}> = ({ message, selectedChat, user }) => {
  const data = getOtherSideData(selectedChat, user);

  return (
    <div className="mb-4 flex gap-4">
      <Avatar
        alt={data.name + " Image"}
        src={data.image}
        className="border border-primary-100"
      />
      <div className="max-w-[75%] space-y-2">
        {/* {Array.from({ length: 1 }).map((_, index) => ( */}
        <div className="rounded-base bg-neutral-100 p-2">
          <p className="text-sm">{message.text}</p>
          <p className="w-full text-right text-xs text-muted-foreground">
            {formatTime(message.created_at)}
          </p>
        </div>
        {/* ))} */}
      </div>
    </div>
  );
};

export default ReceivedMessage;
