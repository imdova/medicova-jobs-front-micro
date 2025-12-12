import { NotificationEnum } from "@/constants/enums/notifications.enum";
import { cn, formatDistanceToNow } from "@/util";
import React from "react";
import { Mail, Trash2 } from "lucide-react";
import { Notification } from "@/types";
import Avatar from "./Avatar";
import CellOptions from "./CellOptions";
import { Button, CircularProgress } from "@mui/material";
import { getProgressColor } from "@/util/general";
import { useAppDispatch } from "@/store/hooks";
import { toggleNotificationRead } from "@/store/slices/notificationsSlice";
import { Badge } from "./Badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getActionsForNotification,
  getIconForType,
  getPlaceholderImage,
  getTagsForNotification,
  getTextColorForType,
} from "@/util/notifications";
import { RoleState } from "@/types/next-auth";

const NotificationCard: React.FC<{
  type: RoleState;
  notification: Notification;
  onDelete?: (item: Notification) => void;
  size?: "small" | "normal";
  isCardAction?: boolean;
}> = ({ notification, onDelete, size = "normal", isCardAction, type }) => {
  const isSmall = size === "small";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const tags = getTagsForNotification(notification);
  const icon = getIconForType(notification.type);
  const { image, url } = getPlaceholderImage(notification);
  const { mainAction, secondaryAction, dropdownActions, cardAction } =
    getActionsForNotification(notification, router);
  const iconBgColor = getTextColorForType(notification.type);

  const defaultDropDownOptions: ActionOption[] = [
    {
      label: notification?.isRead ? "Mark as Un Read" : "Mark as Read",
      icon: <Mail className="h-4 w-4" />,
      action: () =>
        dispatch(
          toggleNotificationRead(notification.id, !notification?.isRead, type),
        ),
    },
  ];

  const deleteOption: ActionOption[] = onDelete
    ? [
        {
          label: "Delete",
          icon: <Trash2 className="h-4 w-4 text-red-500" />,
          action: () => onDelete(notification),
        },
      ]
    : [];

  const dropDownOptions: ActionOption[] = [
    ...dropdownActions.map((option) => ({
      ...option,
      action: () => {
        option.action?.(notification);
        dispatch(toggleNotificationRead(notification.id, true, type));
      },
    })),
    ...defaultDropDownOptions,
    ...deleteOption,
  ];

  return (
    <div
      onClick={() => {
        if (isCardAction && cardAction?.action) {
          cardAction?.action?.();
          dispatch(toggleNotificationRead(notification.id, true, type));
        }
      }}
      className={`flex w-full justify-between gap-4 border-b border-gray-200 p-4 px-6 transition-all duration-200 hover:bg-neutral-100 ${
        notification.isRead ? "bg-white" : "bg-blue-50"
      }`}
    >
      {notification.type === NotificationEnum.PROFILE_INCOMPLETE ? (
        <div
          className={cn(
            "grid grid-cols-1 grid-rows-1",
            isSmall ? "h-[50px] w-[50px]" : "h-[70px] w-[70px]",
          )}
        >
          <CircularProgress
            variant="determinate"
            value={notification.metaData.percentage || 0}
            size={isSmall ? 50 : 70}
            sx={{
              color: getProgressColor(notification.metaData.percentage || 0),
            }}
            className="col-start-1 row-start-1"
          />
          <div className="col-start-1 row-start-1 flex items-center justify-center">
            <span
              className={cn("font-black", isSmall ? "text-sm" : "text-xl")}
              style={{
                color: getProgressColor(notification.metaData.percentage || 0),
              }}
            >
              {notification.metaData.percentage || 0}%
            </span>
          </div>
        </div>
      ) : (
        <div className="relative grid grid-cols-1 grid-rows-1">
          {url ? (
            <Link href={url} className="z-0 col-start-1 row-start-1">
              <Avatar
                src={image}
                size={isSmall ? 40 : 60}
                shape="circle"
                className={cn(
                  "rounded-full border object-cover",
                  isSmall ? "h-[40px] w-[40px]" : "h-[60px] w-[60px]",
                )}
              />
            </Link>
          ) : (
            <Avatar
              src={image}
              size={isSmall ? 40 : 60}
              shape="circle"
              className={cn(
                "z-0 col-start-1 row-start-1 rounded-full border object-cover",
                isSmall ? "h-[40px] w-[40px]" : "h-[60px] w-[60px]",
              )}
            />
          )}
          <div className="z-10 col-start-1 row-start-1 flex h-fit justify-end">
            <div
              className={cn(
                "flex items-center justify-center rounded-full border-2 border-white bg-secondary p-1 text-white",
                isSmall ? "h-6 w-6" : "h-8 w-8",
                iconBgColor,
              )}
            >
              {icon}
            </div>
          </div>
          {/* Unread indicator dot */}
          {!notification.isRead && (
            <div
              className={cn(
                "absolute rounded-full border-2 border-white bg-red-500",
                isSmall
                  ? "-right-0.5 -top-0.5 h-2 w-2"
                  : "-right-1 -top-1 h-3 w-3",
              )}
            ></div>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex">
          {cardAction.action && !isCardAction ? (
            <button
              // onClick={cardAction.action}
              onClick={() => {
                cardAction?.action?.();
                dispatch(toggleNotificationRead(notification.id, true, type));
              }}
              className="w-fit"
            >
              <h6
                className={cn(
                  "font-semibold text-gray-800 hover:cursor-pointer hover:underline",
                  !notification.isRead ? "font-bold" : "",
                  isSmall ? "text-sm" : "text-base",
                )}
              >
                {notification.title}
              </h6>
            </button>
          ) : (
            <h6
              className={cn(
                "font-semibold text-gray-800",
                !notification.isRead ? "font-bold" : "",
                isSmall ? "text-sm" : "text-base",
              )}
            >
              {notification.title}
            </h6>
          )}
          {isSmall && (
            <p className={cn("ml-3 text-[9px] text-gray-400")}>
              {formatDistanceToNow(notification.created_at || null)}
            </p>
          )}
        </div>
        <p
          className={cn(
            "max-w-[700px]",
            isSmall ? "text-xs" : "text-sm",
            notification.isRead ? "text-gray-600" : "text-gray-700",
          )}
        >
          {notification.message}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant={tag.status}>
              {tag.link ? (
                <Link
                  className={cn("", isSmall ? "text-xs" : "text-sm")}
                  href={tag.link}
                >
                  {tag.text}
                </Link>
              ) : (
                tag.text
              )}
            </Badge>
          ))}
        </div>
        {(mainAction.label || secondaryAction.label) && (
          <div className="mt-2 flex gap-2">
            {mainAction.label && (
              <Button
                variant="contained"
                size={isSmall ? "small" : "medium"}
                startIcon={mainAction.icon}
                onClick={() => {
                  mainAction?.action?.();
                  dispatch(toggleNotificationRead(notification.id, true, type));
                }}
              >
                {typeof mainAction.label === "function"
                  ? mainAction.label(notification)
                  : mainAction.label}
              </Button>
            )}
            {secondaryAction.label && (
              <Button
                variant="outlined"
                size={isSmall ? "small" : "medium"}
                startIcon={secondaryAction.icon}
                // onClick={secondaryAction.action}
                onClick={() => {
                  secondaryAction?.action?.();
                  dispatch(toggleNotificationRead(notification.id, true, type));
                }}
              >
                {typeof secondaryAction.label === "function"
                  ? secondaryAction.label(notification)
                  : secondaryAction.label}
              </Button>
            )}
          </div>
        )}
        {!isSmall && (
          <p className={cn("text-gray-400", isSmall ? "text-xs" : "text-sm")}>
            {formatDistanceToNow(notification.created_at || null)}
          </p>
        )}
      </div>
      {!isSmall && (
        <div>
          <CellOptions options={dropDownOptions} item={notification} />
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
