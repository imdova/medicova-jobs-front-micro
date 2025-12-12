import { PermissionsNotifications } from "@/types/permissions";
import { NotificationEnum } from "./enums/notifications.enum";
import { Permission_Keys } from "./enums/Permission_Keys.enum";

export const employerNotificationsPermissions: PermissionsNotifications[] = [
  {
    type: NotificationEnum.JOB_SUBMITTED,
    permissions: [], // to all
  },
  {
    type: NotificationEnum.JOB_APPROVED,
    permissions: [], // to all
  },
  {
    type: NotificationEnum.JOB_REJECTED,
    permissions: [
      Permission_Keys.Employer_ManageJobs,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.JOB_FLAGGED,
    permissions: [
      Permission_Keys.Employer_ManageJobs,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.JOB_DRAFT,
    permissions: [
      Permission_Keys.Employer_ManageJobs,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.PROFILE_APPROVED,
    permissions: [
      Permission_Keys.Employer_ManageCompanySettings,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.PROFILE_REJECTED,
    permissions: [
      Permission_Keys.Employer_ManageCompanySettings,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.NEW_APPLICATION,
    permissions: [
      Permission_Keys.Employer_ManageJobApplications,
      Permission_Keys.Employer_InteractWithJobSeekers,
      Permission_Keys.Employer_ManageJobSeekerFolders,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.RECOMMENDED_LIST_ADDED,
    permissions: [
      Permission_Keys.Employer_ManageJobApplications,
      Permission_Keys.Employer_InteractWithJobSeekers,
      Permission_Keys.Employer_ManageJobSeekerFolders,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.ACCOUNT_MANAGER_ASSIGNED,
    permissions: [
      Permission_Keys.Employer_ManageJobs,
      Permission_Keys.Employer_ManageJobApplications,
      Permission_Keys.Employer_InteractWithJobSeekers,
      Permission_Keys.Employer_ManageJobSeekerFolders,
      Permission_Keys.Employer_ManageCompanySettings,
      Permission_Keys.Employer_ManagePayments,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.PAYMENT_ISSUE,
    permissions: [
      Permission_Keys.Employer_ManagePayments,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.NEW_MESSAGE,
    permissions: [Permission_Keys.Employer_Communications],
  },
  {
    type: NotificationEnum.PROFILE_INCOMPLETE,
    permissions: [
      Permission_Keys.Employer_ManageCompanySettings,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.ACCOUNT_SUSPENSION_WARNING,
    permissions: [
      Permission_Keys.Employer_ManageCompanySettings,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.ACCOUNT_SUSPENDED,
    permissions: [], // to all
  },
  {
    type: NotificationEnum.PASSWORD_RESET,
    permissions: [], // to all
  },
  {
    type: NotificationEnum.NOTIFICATION_PREFERENCES_UPDATED,
    permissions: [
      Permission_Keys.Employer_ManageCompanySettings,
      Permission_Keys.Employer_Communications,
    ],
  },
  {
    type: NotificationEnum.PLATFORM_MAINTENANCE,
    permissions: [], // to all
  },
  {
    type: NotificationEnum.NEW_FEATURE,
    permissions: [], // to all
  },
  {
    type: NotificationEnum.POLICY_UPDATE,
    permissions: [], // to all
  },
];
