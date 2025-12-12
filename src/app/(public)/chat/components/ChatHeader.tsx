import Avatar from "@/components/UI/Avatar";
import { ChatType } from "@/types/chat";
import { getOtherSideData } from "@/util/chat";
import { MoreVert, PushPin } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { User } from "next-auth";

type ReceiverProps = {
  user: User;
  selectedChat: ChatType;
};

const ChatHeader: React.FC<ReceiverProps> = ({ selectedChat, user }) => {
  const data = getOtherSideData(selectedChat, user);
  return (
    <div className="flex items-center justify-between border-b p-2">
      {/* User Info */}
      <div className="flex items-center gap-2">
        <Avatar size={60} src={data.image} alt={data.name + "image"} />
        <div>
          <h6
            // href={`/me/${data.userName}`}
            className="font-bold"
          >
            {data.name}
          </h6>
          {/* <p className="text-sm text-muted-foreground">{title}</p> */}
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex gap-2">
        <IconButton>
          <PushPin />
        </IconButton>
        <IconButton>
          <MoreVert />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatHeader;
