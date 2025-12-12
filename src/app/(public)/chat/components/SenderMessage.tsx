import Avatar from "@/components/UI/Avatar";
import { useCompanyData } from "@/hooks/useCompanyData";
import { ChatMessageType } from "@/types/chat";
import { formatTime } from "@/util/chat";
import { User } from "next-auth";

const SenderMessage: React.FC<{ message: ChatMessageType; user: User }> = ({
  message,
  user,
}) => {
  const { company } = useCompanyData();
  const image = user.type === "employer" ? company?.avatar : user.image;

  return (
    <div className="mb-4 flex justify-end gap-4">
      <div className="max-w-[75%] space-y-2">
        {Array.from({ length: 1 }).map((_, index) => (
          <div key={index} className="rounded-base bg-primary/10 p-2">
            <p className="text-sm">{message.text}</p>
            <p className="w-full text-right text-xs text-muted-foreground">
              {formatTime(message.created_at)}
            </p>
          </div>
        ))}
      </div>
      <Avatar
        src={image}
        alt={user.name + " Image"}
        className="border border-primary-100"
      />
    </div>
  );
};

export default SenderMessage;
