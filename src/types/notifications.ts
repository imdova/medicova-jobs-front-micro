export type NotificationFilter = {
  page?: number;
  limit?: number;
  seekerId?: string | null;
  employeeId?: string | null;
  isRead?: string;
  createdFrom?: string;
  createdTo?: string;
};
