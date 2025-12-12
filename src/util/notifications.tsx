import { NotificationEnum } from "@/constants/enums/notifications.enum";
import { AppRouterInstance, BadgeVariant, Notification } from "@/types";
import {
  AlertCircle,
  Bell,
  Info,
  MessageCircle,
  UserCheck,
  UserX,
  Lock,
  ShieldAlert,
  RefreshCw,
  Zap,
  FileWarning,
  Ban,
  Briefcase,
  Users,
  AlertTriangle,
  TrendingDown,
  LineChart,
  Megaphone,
  Send,
  User,
  ClipboardCheck,
  ClipboardX,
  Clipboard,
  Eye,
  PlusCircle,
  MessageSquare,
  Edit,
  CheckCircle,
  XCircle,
  LifeBuoy,
  FileText,
} from "lucide-react";

export const getActionsForNotification = (
  notification: Notification,
  router: AppRouterInstance,
) => {
  const cardAction: ActionOption = { label: null, icon: null };
  const mainAction: ActionOption = { label: null, icon: null };
  const secondaryAction: ActionOption = { label: null, icon: null };
  const dropdownActions: ActionOption[] = [];

  const addCardAction = (
    label: string,
    icon: React.ReactNode,
    action: () => void,
  ) => {
    cardAction.label = label;
    cardAction.icon = icon;
    cardAction.action = action;
  };

  const addMainAction = (
    label: string,
    icon: React.ReactNode,
    action: () => void,
  ) => {
    mainAction.label = label;
    mainAction.icon = icon;
    mainAction.action = action;
  };

  const addSecondaryAction = (
    label: string,
    icon: React.ReactNode,
    action: () => void,
  ) => {
    secondaryAction.label = label;
    secondaryAction.icon = icon;
    secondaryAction.action = action;
  };

  const addDropdownAction = (
    label: string,
    icon: React.ReactNode,
    action: () => void,
  ) => {
    dropdownActions.push({ label, icon, action });
  };

  // Type-specific actions
  switch (notification.type) {
    case NotificationEnum.NEW_JOB_MATCH:
      addMainAction("Apply Now", <PlusCircle className="h-4 w-4" />, () =>
        console.log(`Applying to job ${notification.metaData.job?.id}`),
      );
      break;
    case NotificationEnum.NEW_MESSAGE:
      addMainAction("Reply", <MessageSquare className="h-4 w-4" />, () =>
        console.log(`Replying to message`),
      );
      break;
    case NotificationEnum.PROFILE_INCOMPLETE:
      addMainAction("Complete Profile Now", <Edit className="h-4 w-4" />, () =>
        console.log("Navigating to profile edit"),
      );
      break;
    case NotificationEnum.PROFILE_REJECTED:
      addMainAction("Update Profile", <Edit className="h-4 w-4" />, () =>
        console.log("Navigating to profile edit"),
      );
      break;
    case NotificationEnum.JOB_DRAFT:
      addMainAction("Complete and publish", <Edit className="h-4 w-4" />, () =>
        console.log(`Navigating to job draft`),
      );
      break;
    case NotificationEnum.JOB_FLAGGED:
    case NotificationEnum.ACCOUNT_SUSPENDED:
    case NotificationEnum.PAYMENT_ISSUE:
      addMainAction("Contact Support", <LifeBuoy className="h-4 w-4" />, () =>
        console.log("Contacting support"),
      );
      break;
    case NotificationEnum.JOB_PENDING_APPROVAL:
      addMainAction("Approve", <CheckCircle className="h-4 w-4" />, () =>
        console.log(`Approving job ${notification.metaData.job?.id}`),
      );
      addSecondaryAction("Reject", <XCircle className="h-4 w-4" />, () =>
        console.log(`Rejecting job ${notification.metaData.job?.id}`),
      );
      break;
    case NotificationEnum.RECOMMENDED_LIST_ADDED:
      addMainAction("View List", <Eye className="h-4 w-4" />, () =>
        console.log(`Viewing recommended list`),
      );
      break;
    case NotificationEnum.NEW_APPLICATION:
      console.log(notification)
      addMainAction("Review Application", null, () =>
        router.push(
          `/employer/job/manage-jobs/${notification.metaData.job?.id}`,
        ),
      );
      break;
    case NotificationEnum.APPLICATION_VIEWED:
    case NotificationEnum.APPLICATION_SHORTLISTED:
    case NotificationEnum.APPLICATION_WITHDRAWN:
    case NotificationEnum.APPLICATION_SUBMITTED:
      addCardAction("View", null, () =>
        router.push("/job-seeker/my-applications"),
      );
      break;
    case NotificationEnum.JOB_SUBMITTED:
    case NotificationEnum.JOB_APPROVED:
    case NotificationEnum.JOB_REJECTED:
    case NotificationEnum.LOW_APPLICATIONS:
    case NotificationEnum.USER_REPORTED:
    case NotificationEnum.ACCOUNT_SUSPENSION_REQUEST:
    case NotificationEnum.JOB_REPORTED:
    case NotificationEnum.JOB_AUTO_FLAGGED:
      addCardAction("View", <Eye className="h-4 w-4" />, () =>
        console.log(`Viewing details`),
      );
      break;
    case NotificationEnum.NEW_FEATURE:
      addMainAction("View Feature", <FileText className="h-4 w-4" />, () =>
        console.log(`Navigate To new feature`),
      );
      break;
    case NotificationEnum.PROFILE_APPROVED:
    case NotificationEnum.ACCOUNT_SUSPENSION_WARNING:
    case NotificationEnum.PASSWORD_RESET:
    case NotificationEnum.NOTIFICATION_PREFERENCES_UPDATED:
    case NotificationEnum.PLATFORM_MAINTENANCE:
    case NotificationEnum.POLICY_UPDATE:
    case NotificationEnum.PLATFORM_ISSUE:
    case NotificationEnum.HIGH_USER_ACTIVITY:
    case NotificationEnum.LOW_ENGAGEMENT:
    case NotificationEnum.ANALYTICS_REPORT:
    case NotificationEnum.BROADCAST_SENT:
    case NotificationEnum.TARGETED_NOTIFICATION_SENT:
    case NotificationEnum.FEEDBACK_RECEIVED:
    case NotificationEnum.ACCOUNT_MANAGER_ASSIGNED:
    case NotificationEnum.BULK_ACTION_COMPLETED:
      addCardAction("View", <Eye className="h-4 w-4" />, () =>
        console.log(`Viewing details`),
      );
      break;
    default:
      addCardAction("View", <Eye className="h-4 w-4" />, () =>
        console.log(`Viewing details`),
      );
      break;
  }

  // Additional dropdown actions
  if (!cardAction.label) {
    addDropdownAction("View", <Eye className="h-4 w-4" />, () =>
      console.log(`Viewing notification`),
    );
  }
  if (notification.type !== NotificationEnum.NEW_MESSAGE) {
    addDropdownAction("Reply", <MessageSquare className="h-4 w-4" />, () =>
      console.log(`Replying to message`),
    );
  }
  // addDropdownAction("Mark as Read", <Mail className="h-4 w-4" />, () =>
  //   console.log(`Marking notification as read`),
  // );
  // addDropdownAction("Delete", <Trash2 className="h-4 w-4 text-red-500" />, () =>
  //   console.log(`Deleting notification`),
  // );

  return { cardAction, mainAction, secondaryAction, dropdownActions };
};

export const getTagsForNotification = (notification: Notification) => {
  const tags: { text: string; link?: string; status: BadgeVariant }[] = [];
  const maxTags = 5; // Limit to avoid clutter

  if (notification.metaData.job?.id) {
    tags.push({
      text: notification.metaData.job.title
        ? notification.metaData.job.title
        : `Job #${notification.metaData.job.id}`,
      link: `/job/${notification.metaData.job.id}`,
      status: "neutral",
    });
  }

  if (notification.metaData.company?.name) {
    tags.push({
      text: notification.metaData.company.name,
      link: `/co/${notification.metaData.company.username}`,
      status: "neutral",
    });
  }

  // Type-specific tags
  switch (notification.type) {
    case NotificationEnum.APPLICATION_WITHDRAWN:
      tags.push({ text: "Withdrawn", status: "warning" });
      break;
    case NotificationEnum.APPLICATION_SUBMITTED:
      tags.push({ text: "Applied", status: "success" });
      break;
    case NotificationEnum.JOB_FLAGGED:
    case NotificationEnum.JOB_DRAFT:
    case NotificationEnum.ACCOUNT_SUSPENDED:
    case NotificationEnum.JOB_REJECTED:
    case NotificationEnum.ACCOUNT_SUSPENSION_WARNING:
    case NotificationEnum.PAYMENT_ISSUE:
      tags.push({ text: "Action Required", status: "error" });
      break;
    case NotificationEnum.PLATFORM_MAINTENANCE:
    case NotificationEnum.PLATFORM_ISSUE:
      tags.push({ text: "System Alert", status: "warning" });
      // if (notification.expiresAt) {
      //   tags.push({ text: "Urgent", status: "warning" });
      // }
      break;
    case NotificationEnum.NEW_MESSAGE:
      tags.push({ text: "Message", status: "info" });
      break;
    case NotificationEnum.PROFILE_INCOMPLETE:
    case NotificationEnum.JOB_PENDING_APPROVAL:
    case NotificationEnum.PROFILE_APPROVED:
    case NotificationEnum.JOB_APPROVED:
    case NotificationEnum.BULK_ACTION_COMPLETED:
      tags.push({ text: "Approved", status: "success" });
      break;
    case NotificationEnum.NEW_JOB_MATCH:
    case NotificationEnum.LOW_APPLICATIONS:
      tags.push({ text: "Low Engagement", status: "warning" });
      break;
    case NotificationEnum.USER_REPORTED:
    case NotificationEnum.JOB_REPORTED:
    case NotificationEnum.JOB_AUTO_FLAGGED:
      tags.push({ text: "Flagged", status: "error" });
      break;
    case NotificationEnum.NEW_FEATURE:
      tags.push({ text: "New Feature", status: "info" });
      break;
  }

  // Add urgency tag for expiring notifications
  // if (
  //   notification.expiresAt &&
  //   new Date(notification.expiresAt) <
  //     new Date(Date.now() + 24 * 60 * 60 * 1000)
  // ) {
  //   tags.push({ text: "Expires Soon", status: "warning" });
  // }

  // Truncate tags to maxTags and ensure unique texts
  const uniqueTags = [];
  const seenTexts = new Set();
  for (const tag of tags) {
    if (!seenTexts.has(tag.text) && uniqueTags.length < maxTags) {
      uniqueTags.push(tag);
      seenTexts.add(tag.text);
    }
  }

  return uniqueTags;
};

export const getIconForType = (type: NotificationEnum) => {
  switch (type) {
    // ✅ Job Seeker Notifications
    case NotificationEnum.NEW_JOB_MATCH:
      return <Briefcase className="h-4 w-4" />;
    case NotificationEnum.APPLICATION_SUBMITTED:
      return <Clipboard className="h-4 w-4" />;
    case NotificationEnum.APPLICATION_VIEWED:
    case NotificationEnum.APPLICATION_SHORTLISTED:
      return <ClipboardCheck className="h-4 w-4" />;
    // case NotificationEnum.APPLICATION_REJECTED:
    case NotificationEnum.APPLICATION_WITHDRAWN:
      return <ClipboardX className="h-4 w-4" />;
    // case NotificationEnum.HIRED:
    //   return <UserCheck className="h-4 w-4" />;
    case NotificationEnum.NEW_MESSAGE:
      return <MessageCircle className="h-4 w-4" />;
    case NotificationEnum.PROFILE_INCOMPLETE:
    case NotificationEnum.PROFILE_REJECTED:
      return <UserX className="h-4 w-4" />;
    case NotificationEnum.PROFILE_APPROVED:
      return <UserCheck className="h-4 w-4" />;
    case NotificationEnum.ACCOUNT_SUSPENSION_WARNING:
    case NotificationEnum.ACCOUNT_SUSPENDED:
      return <ShieldAlert className="h-4 w-4" />;
    case NotificationEnum.PASSWORD_RESET:
      return <Lock className="h-4 w-4" />;
    case NotificationEnum.NOTIFICATION_PREFERENCES_UPDATED:
      return <Bell className="h-4 w-4" />;
    case NotificationEnum.PLATFORM_MAINTENANCE:
      return <RefreshCw className="h-4 w-4" />;
    case NotificationEnum.NEW_FEATURE:
      return <Zap className="h-4 w-4" />;
    case NotificationEnum.POLICY_UPDATE:
      return <FileWarning className="h-4 w-4" />;

    // ✅ Employer Notifications
    case NotificationEnum.JOB_SUBMITTED:
    case NotificationEnum.JOB_APPROVED:
      return <ClipboardCheck className="h-4 w-4" />;
    case NotificationEnum.JOB_REJECTED:
    case NotificationEnum.JOB_FLAGGED:
    case NotificationEnum.JOB_DRAFT:
      return <AlertCircle className="h-4 w-4" />;
    case NotificationEnum.LOW_APPLICATIONS:
      return <TrendingDown className="h-4 w-4" />;
    case NotificationEnum.NEW_APPLICATION:
    case NotificationEnum.RECOMMENDED_LIST_ADDED:
      return <Users className="h-4 w-4" />;
    case NotificationEnum.ACCOUNT_MANAGER_ASSIGNED:
      return <User className="h-4 w-4" />;
    case NotificationEnum.PAYMENT_ISSUE:
      return <Ban className="h-4 w-4" />;

    // ✅ Admin Notifications
    case NotificationEnum.USER_REPORTED:
    case NotificationEnum.ACCOUNT_SUSPENSION_REQUEST:
    case NotificationEnum.JOB_REPORTED:
    case NotificationEnum.JOB_AUTO_FLAGGED:
      return <ShieldAlert className="h-4 w-4" />;
    case NotificationEnum.BULK_ACTION_COMPLETED:
      return <Send className="h-4 w-4" />;
    case NotificationEnum.JOB_PENDING_APPROVAL:
      return <Clipboard className="h-4 w-4" />;
    case NotificationEnum.PLATFORM_ISSUE:
      return <AlertTriangle className="h-4 w-4" />;
    case NotificationEnum.HIGH_USER_ACTIVITY:
    case NotificationEnum.LOW_ENGAGEMENT:
      return <LineChart className="h-4 w-4" />;
    case NotificationEnum.ANALYTICS_REPORT:
      return <Info className="h-4 w-4" />;
    case NotificationEnum.BROADCAST_SENT:
    case NotificationEnum.TARGETED_NOTIFICATION_SENT:
      return <Megaphone className="h-4 w-4" />;
    case NotificationEnum.FEEDBACK_RECEIVED:
      return <MessageCircle className="h-4 w-4" />;

    default:
      return <Info className="h-4 w-4" />;
  }
};

export const getPlaceholderImage = (
  notification: Notification,
): { image?: string | null; url?: string } => {
  // Fallback to type-based placeholder images since imageUrl is not in the interface
  switch (notification.type) {
    // Job Seeker Notifications
    case NotificationEnum.NEW_JOB_MATCH:
    case NotificationEnum.APPLICATION_SUBMITTED:
    case NotificationEnum.APPLICATION_VIEWED:
    case NotificationEnum.APPLICATION_SHORTLISTED:
    case NotificationEnum.APPLICATION_WITHDRAWN:
      return {
        image: notification.metaData.company?.image,
        url: `/co/${notification.metaData.company?.username}`,
      };
    case NotificationEnum.NEW_MESSAGE:
      return {};
    case NotificationEnum.PROFILE_INCOMPLETE:
    case NotificationEnum.PROFILE_APPROVED:
    case NotificationEnum.PROFILE_REJECTED:
      return {};
    case NotificationEnum.ACCOUNT_SUSPENSION_WARNING:
    case NotificationEnum.ACCOUNT_SUSPENDED:
    case NotificationEnum.PASSWORD_RESET:
      return {};
    case NotificationEnum.NOTIFICATION_PREFERENCES_UPDATED:
    case NotificationEnum.PLATFORM_MAINTENANCE:
    case NotificationEnum.NEW_FEATURE:
    case NotificationEnum.POLICY_UPDATE:
      return {};

    // Employer Notifications
    case NotificationEnum.JOB_SUBMITTED:
    case NotificationEnum.JOB_APPROVED:
    case NotificationEnum.JOB_REJECTED:
    case NotificationEnum.JOB_FLAGGED:
    case NotificationEnum.JOB_DRAFT:
    case NotificationEnum.LOW_APPLICATIONS:
    case NotificationEnum.NEW_APPLICATION:
    case NotificationEnum.RECOMMENDED_LIST_ADDED:
      return {};
    case NotificationEnum.ACCOUNT_MANAGER_ASSIGNED:
      return {};
    case NotificationEnum.PAYMENT_ISSUE:
      return {};

    // Admin Notifications
    case NotificationEnum.USER_REPORTED:
    case NotificationEnum.ACCOUNT_SUSPENSION_REQUEST:
    case NotificationEnum.BULK_ACTION_COMPLETED:
    case NotificationEnum.JOB_PENDING_APPROVAL:
    case NotificationEnum.JOB_REPORTED:
    case NotificationEnum.JOB_AUTO_FLAGGED:
      return {};
    case NotificationEnum.PLATFORM_ISSUE:
    case NotificationEnum.HIGH_USER_ACTIVITY:
    case NotificationEnum.LOW_ENGAGEMENT:
    case NotificationEnum.ANALYTICS_REPORT:
    case NotificationEnum.BROADCAST_SENT:
    case NotificationEnum.TARGETED_NOTIFICATION_SENT:
    case NotificationEnum.FEEDBACK_RECEIVED:
      return {};

    default:
      return {};
  }
};

export const getTextColorForType = (type: NotificationEnum) => {
  switch (type) {
    // case NotificationEnum.APPLICATION_REJECTED:
    case NotificationEnum.APPLICATION_WITHDRAWN:
    case NotificationEnum.JOB_REJECTED:
    case NotificationEnum.JOB_FLAGGED:
    case NotificationEnum.PROFILE_REJECTED:
    case NotificationEnum.ACCOUNT_SUSPENSION_WARNING:
    case NotificationEnum.ACCOUNT_SUSPENDED:
    case NotificationEnum.PAYMENT_ISSUE:
    case NotificationEnum.PLATFORM_ISSUE:
    case NotificationEnum.JOB_AUTO_FLAGGED:
    case NotificationEnum.JOB_REPORTED:
    case NotificationEnum.ACCOUNT_SUSPENSION_REQUEST:
      return "bg-red-500";

    case NotificationEnum.APPLICATION_VIEWED:
    case NotificationEnum.APPLICATION_SHORTLISTED:
    case NotificationEnum.APPLICATION_SUBMITTED:
    case NotificationEnum.JOB_APPROVED:
    case NotificationEnum.JOB_SUBMITTED:
    case NotificationEnum.PROFILE_APPROVED:
    case NotificationEnum.NEW_APPLICATION:
    case NotificationEnum.RECOMMENDED_LIST_ADDED:
    case NotificationEnum.NEW_JOB_MATCH:
      return "bg-green-500";

    case NotificationEnum.PASSWORD_RESET:
    case NotificationEnum.NOTIFICATION_PREFERENCES_UPDATED:
    case NotificationEnum.NEW_FEATURE:
    case NotificationEnum.POLICY_UPDATE:
    case NotificationEnum.ANALYTICS_REPORT:
    case NotificationEnum.BROADCAST_SENT:
    case NotificationEnum.TARGETED_NOTIFICATION_SENT:
    case NotificationEnum.FEEDBACK_RECEIVED:
    case NotificationEnum.NEW_MESSAGE:
    case NotificationEnum.USER_REPORTED:
      return "bg-primary";

    case NotificationEnum.JOB_DRAFT:
    case NotificationEnum.HIGH_USER_ACTIVITY:
    case NotificationEnum.LOW_ENGAGEMENT:
    case NotificationEnum.PLATFORM_MAINTENANCE:
    case NotificationEnum.BULK_ACTION_COMPLETED:
    case NotificationEnum.JOB_PENDING_APPROVAL:
      return "bg-yellow-500";

    default:
      return "bg-gray-500";
  }
};

export const filterNotificationsByTab = (
  activeTab: string,
  notifications: Notification[],
): Notification[] => {
  const tabMap: Record<string, NotificationEnum[]> = {
    all: [],
    admin: [
      NotificationEnum.USER_REPORTED,
      NotificationEnum.ACCOUNT_SUSPENSION_REQUEST,
      NotificationEnum.BULK_ACTION_COMPLETED,
      NotificationEnum.JOB_PENDING_APPROVAL,
      NotificationEnum.JOB_REPORTED,
      NotificationEnum.JOB_AUTO_FLAGGED,
      NotificationEnum.LOW_APPLICATIONS,
      NotificationEnum.PLATFORM_ISSUE,
      NotificationEnum.HIGH_USER_ACTIVITY,
      NotificationEnum.LOW_ENGAGEMENT,
      NotificationEnum.ANALYTICS_REPORT,
      NotificationEnum.BROADCAST_SENT,
      NotificationEnum.TARGETED_NOTIFICATION_SENT,
      NotificationEnum.FEEDBACK_RECEIVED,
    ],
    seeker: [
      NotificationEnum.NEW_JOB_MATCH,
      NotificationEnum.PROFILE_INCOMPLETE,
      NotificationEnum.APPLICATION_SUBMITTED,
      NotificationEnum.APPLICATION_VIEWED,
      NotificationEnum.APPLICATION_SHORTLISTED,
      NotificationEnum.APPLICATION_WITHDRAWN,
      NotificationEnum.PROFILE_APPROVED,
      NotificationEnum.PROFILE_REJECTED,
      NotificationEnum.ACCOUNT_SUSPENSION_WARNING,
      NotificationEnum.ACCOUNT_SUSPENDED,
    ],
    employer: [
      NotificationEnum.JOB_SUBMITTED,
      NotificationEnum.JOB_APPROVED,
      NotificationEnum.JOB_REJECTED,
      NotificationEnum.JOB_FLAGGED,
      NotificationEnum.JOB_DRAFT,
      NotificationEnum.PROFILE_INCOMPLETE,
      NotificationEnum.PROFILE_APPROVED,
      NotificationEnum.PROFILE_REJECTED,
      NotificationEnum.NEW_APPLICATION,
      NotificationEnum.ACCOUNT_MANAGER_ASSIGNED,
      NotificationEnum.RECOMMENDED_LIST_ADDED,
      NotificationEnum.PAYMENT_ISSUE,
    ],
    job: [
      NotificationEnum.NEW_JOB_MATCH,
      NotificationEnum.JOB_SUBMITTED,
      NotificationEnum.JOB_APPROVED,
      NotificationEnum.JOB_REJECTED,
      NotificationEnum.JOB_FLAGGED,
      NotificationEnum.JOB_DRAFT,
      NotificationEnum.LOW_APPLICATIONS,
      NotificationEnum.JOB_PENDING_APPROVAL,
      NotificationEnum.JOB_REPORTED,
      NotificationEnum.JOB_AUTO_FLAGGED,
    ],
    applications: [
      NotificationEnum.APPLICATION_SUBMITTED,
      NotificationEnum.APPLICATION_VIEWED,
      NotificationEnum.APPLICATION_SHORTLISTED,
      NotificationEnum.APPLICATION_WITHDRAWN,
      NotificationEnum.NEW_APPLICATION,
    ],
    messages: [
      NotificationEnum.NEW_MESSAGE,
      NotificationEnum.FEEDBACK_RECEIVED,
    ],
    reminder: [
      NotificationEnum.PASSWORD_RESET,
      NotificationEnum.NOTIFICATION_PREFERENCES_UPDATED,
      NotificationEnum.PLATFORM_MAINTENANCE,
      NotificationEnum.NEW_FEATURE,
      NotificationEnum.POLICY_UPDATE,
      NotificationEnum.ACCOUNT_SUSPENSION_WARNING,
    ],
    archive: [], // Implement your own logic for archived notifications if needed
  };

  if (activeTab === "all") return notifications;

  const validTypes = tabMap[activeTab] || [];
  return notifications.filter((n) => validTypes.includes(n.type));
};
