"use client";
import { useCallback, useEffect, useState } from "react";
import Loading from "@/components/loading/loading";
import NotificationCard from "@/components/UI/NotificationCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  connectSocket,
  deleteSpecificNotifications,
  fetchNotifications,
  markAllAsRead,
} from "@/store/slices/notificationsSlice";
import { Notification } from "@/types";
import { Settings } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, Tab, Tabs } from "@mui/material";
import { useSession } from "next-auth/react";
import DeleteConfirmationDialog from "@/components/UI/DeleteConfirmationDialog";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { filterNotificationsByTab } from "@/util/notifications";
import { notFound } from "next/navigation";
import { NotificationFilter } from "@/types/notifications";

const NotificationsPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [itemToDelete, setItemToDelete] = useState<Notification | null>(null);
  const onClose = () => setItemToDelete(null);
  const [limit, setLimit] = useState(10);

  const dispatch = useAppDispatch();
  const { data, socketConnected, loading } = useAppSelector(
    (state) => state.notifications,
  );
  const notifications = data.data;

  useEffect(() => {
    const filter: NotificationFilter =
      user?.type === "employer"
        ? { employeeId: user.id, limit }
        : user?.type === "seeker"
          ? { employeeId: user.id, limit }
          : { limit };

    if (user?.id) {
      dispatch(
        fetchNotifications({
          filter,
          type: user.type,
        }),
      );
    }
    if (user?.accessToken && !socketConnected && user.id) {
      dispatch(connectSocket(user?.accessToken, filter, user.type));
    }
  }, [dispatch, user, socketConnected, limit]);

  const [activeTab, setActiveTab] = useState("all");

  const filterData = filterNotificationsByTab(
    activeTab.toLocaleLowerCase(),
    notifications,
  );
  // const unique = uniqueByField(filterData, "type");
  const handleDelete = () => {
    if (itemToDelete?.id && user?.type) {
      dispatch(deleteSpecificNotifications([itemToDelete?.id], user?.type));
    }
    onClose();
  };

  const handleLoadMore = useCallback(() => {
    setLimit((prev) => {
      if (prev >= Number(data.count)) {
        return prev; // no more increase
      }
      return prev + 10;
    });
  }, [data?.count]);

  useInfiniteScroll({
    onLoadMore: handleLoadMore,
    offset: 100, // Trigger when 100px from bottom
    enabled: limit < Number(data.count), // disable when limit reached
  });

  const isMoreLoading = loading && notifications.length < limit;

  const navItems: { title: string; value: string; number?: number }[] = [
    {
      title: "all",
      value: "all",
      number: filterNotificationsByTab("all", notifications).filter(
        (x) => !x.isRead,
      ).length,
    },
    {
      title: "Applications",
      value: "applications",
      number: filterNotificationsByTab("applications", notifications).filter(
        (x) => !x.isRead,
      ).length,
    },
    {
      title: "Messages",
      value: "messages",
      number: filterNotificationsByTab("messages", notifications).filter(
        (x) => !x.isRead,
      ).length,
    },
    {
      title: "Reminder",
      value: "reminder",
      number: filterNotificationsByTab("reminder", notifications).filter(
        (x) => !x.isRead,
      ).length,
    },
  ];
  if (status === "loading") return <Loading />;
  if (!user) return notFound();
  return (
    <>
      <DeleteConfirmationDialog
        open={Boolean(itemToDelete)}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${itemToDelete?.title} notification? This action cannot be undone.`}
        onDelete={handleDelete}
        onClose={onClose}
      />
      <div className="w-full px-4 md:px-5">
        <div className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white p-4 px-6 shadow-soft">
          <h1 className="text-xl font-semibold">Notifications</h1>
          <Button
            variant="text"
            onClick={() =>
              user?.id && dispatch(markAllAsRead(user.id, user.type))
            }
            className="text-sm text-muted-foreground hover:underline"
          >
            Mark All As Read
          </Button>
        </div>

        <div className="mt-4 grid grid-flow-row rounded-[10px] border border-gray-200 bg-white shadow-soft">
          <div className="grid grid-cols-1">
            <div className="col-span-1 flex items-center justify-between gap-3 overflow-hidden border-b border-gray-200">
              <Tabs value={activeTab} onChange={(_, tab) => setActiveTab(tab)}>
                {navItems.map((item, index) => (
                  <Tab
                    key={index}
                    value={item.value}
                    label={
                      <p className="text-sm">
                        {item.title}
                        {Number(item.number) > 0 && (
                          <span className="ml-2 inline-block h-4 w-4 rounded-3xl bg-secondary text-xs text-white">
                            {item.number}
                          </span>
                        )}
                      </p>
                    }
                  />
                ))}
                <span className="mx-4 block h-10 w-1 self-center border-l border-gray-300"></span>
                <Tab
                  value={"archive"}
                  label={<p className="text-sm text-gray-400">Archive</p>}
                />
              </Tabs>
              <div className="mx-2">
                <IconButton size="medium">
                  <Settings />
                </IconButton>
              </div>
            </div>
          </div>
          {filterData.map((notification) => (
            <NotificationCard
              type={user?.type}
              key={notification.id}
              notification={notification}
              onDelete={(item) => setItemToDelete(item)}
            />
          ))}
          {isMoreLoading && (
            <div className="flex items-center justify-center p-8">
              <CircularProgress size={40} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;

function uniqueByField<T, K extends keyof T>(array: T[], field: K): T[] {
  const seen = new Set<T[K]>();
  return array.filter((item) => {
    const value = item[field];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}
