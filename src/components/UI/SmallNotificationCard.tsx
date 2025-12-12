import { NotificationItem } from "@/types";
import { formatDistanceToNow } from "@/util";
import { AccessTime, MoreVert } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Image from "next/image";

export const SmallNotificationCard: React.FC<NotificationItem> = ({
  isRead,
  image,
  title,
  description,
  timeStamp,
  tags,
}) => {
  return (
    <div
      className={` ${isRead ? "" : "bg-neutral-50"} flex w-full justify-between border-b border-gray-100 p-2`}
    >
      <div className="mr-2 grid grid-cols-1 grid-rows-1">
        <Image
          src={image}
          alt="image"
          width={40}
          height={40}
          className="col-start-1 row-start-1 min-h-[40px] min-w-[40px] rounded-full border object-cover"
        />
      </div>
      <div className="flex max-w-full flex-1 flex-col gap-1">
        <h6 className="line-clamp-1 text-sm font-bold text-main">
          {title}
          <span className="ml-2 text-xs text-gray-400">
            {" "}
            <AccessTime className="mb-[2px] mr-1 h-4 w-4" />
            {formatDistanceToNow(timeStamp)}
          </span>
        </h6>
        <p className="line-clamp-1 max-w-[400px] text-wrap text-sm text-muted-foreground">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`rounded px-2 py-1 text-xs text-gray-500 ${tag.status === "normal" ? "bg-gray-100" : tag.status === "error" ? "bg-red-100" : tag.status === "warning" ? "bg-yellow-100" : "bg-green-100"}`}
            >
              {tag.text}
            </span>
          ))}
        </div>
      </div>
      <div>
        <IconButton size="medium" className="p-1">
          <MoreVert className="h-5 w-5" />
        </IconButton>
      </div>
    </div>
  );
};
