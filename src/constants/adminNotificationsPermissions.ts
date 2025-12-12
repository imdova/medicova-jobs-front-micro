import { PermissionsNotifications } from "@/types/permissions";
import { NotificationEnum } from "./enums/notifications.enum";
import { Permission_Keys } from "./enums/Permission_Keys.enum";



export const adminNotificationsPermissions: PermissionsNotifications[] = [
  {
    type: NotificationEnum.JOB_SUBMITTED,
    permissions: [
      Permission_Keys.Admin_Jobs_AddJob,
      Permission_Keys.Admin_Jobs_ViewJob,
      Permission_Keys.Admin_Jobs_EditJob,
      Permission_Keys.Admin_Jobs_DeleteJob,
      Permission_Keys.Admin_Jobs_ApproveJob,
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.JOB_APPROVED,
    permissions: [
      Permission_Keys.Admin_Jobs_AddJob,
      Permission_Keys.Admin_Jobs_ViewJob,
      Permission_Keys.Admin_Jobs_EditJob,
      Permission_Keys.Admin_Jobs_DeleteJob,
      Permission_Keys.Admin_Jobs_ApproveJob,
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.JOB_REJECTED,
    permissions: [
      Permission_Keys.Admin_Jobs_AddJob,
      Permission_Keys.Admin_Jobs_ViewJob,
      Permission_Keys.Admin_Jobs_EditJob,
      Permission_Keys.Admin_Jobs_DeleteJob,
      Permission_Keys.Admin_Jobs_ApproveJob,
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.JOB_FLAGGED,
    permissions: [
      Permission_Keys.Admin_Jobs_AddJob,
      Permission_Keys.Admin_Jobs_ViewJob,
      Permission_Keys.Admin_Jobs_EditJob,
      Permission_Keys.Admin_Jobs_DeleteJob,
      Permission_Keys.Admin_Jobs_ApproveJob,
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.JOB_DRAFT,
    permissions: [
      Permission_Keys.Admin_Jobs_AddJob,
      Permission_Keys.Admin_Jobs_ViewJob,
      Permission_Keys.Admin_Jobs_EditJob,
      Permission_Keys.Admin_Jobs_DeleteJob,
      Permission_Keys.Admin_Jobs_ApproveJob,
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.PROFILE_APPROVED,
    permissions: [
      Permission_Keys.Admin_Employers_AccountManagement_AddEmployer,
      Permission_Keys.Admin_Employers_AccountManagement_EditEmployer,
      Permission_Keys.Admin_Employers_AccountManagement_ViewEmployerFullProfile,
      Permission_Keys.Admin_Employers_AccountManagement_ViewEmployerProfile,
      Permission_Keys.Admin_Employers_AccountManagement_DeleteEmployer,
      Permission_Keys.Admin_Employers_AccountManagement_ApproveEmployer,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.PROFILE_REJECTED,
    permissions: [
      Permission_Keys.Admin_Employers_AccountManagement_AddEmployer,
      Permission_Keys.Admin_Employers_AccountManagement_EditEmployer,
      Permission_Keys.Admin_Employers_AccountManagement_ViewEmployerFullProfile,
      Permission_Keys.Admin_Employers_AccountManagement_ViewEmployerProfile,
      Permission_Keys.Admin_Employers_AccountManagement_DeleteEmployer,
      Permission_Keys.Admin_Employers_AccountManagement_ApproveEmployer,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.NEW_APPLICATION,
    permissions: [
      Permission_Keys.Admin_Jobs_ViewJob,
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
      Permission_Keys.Admin_Applicants_ViewApplicants,
      Permission_Keys.Admin_Applicants_ShortlistApplicants,
      Permission_Keys.Admin_Applicants_ChatWithApplicants,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.RECOMMENDED_LIST_ADDED,
    permissions: [
      Permission_Keys.Admin_Recommendations_AddJobSeekerToRecommended,
      Permission_Keys.Admin_Recommendations_RemoveJobSeekerFromRecommended,
      Permission_Keys.Admin_Recommendations_ViewRecommendedJobSeekers,
      Permission_Keys.Admin_Employers_Folders_ManageEmployerFolders,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.EMPLOYER_PAYMENT_ISSUE,
    permissions: [
      Permission_Keys.Admin_Finance_ManageBilling,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.NEW_MESSAGE,
    permissions: [
      Permission_Keys.Admin_JobSeekers_ChatWithJobSeekers,
      Permission_Keys.Admin_Applicants_ChatWithApplicants,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.PASSWORD_RESET,
    permissions: [], //  tp all
  },
  {
    type: NotificationEnum.USER_REPORTED,
    permissions: [
      Permission_Keys.Admin_Settings_ManageSecuritySettings,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.ACCOUNT_SUSPENSION_REQUEST,
    permissions: [
      Permission_Keys.Admin_Settings_ManageSecuritySettings,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.BULK_ACTION_COMPLETED,
    permissions: [
      Permission_Keys.Admin_Applicants_ViewApplicants,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.JOB_PENDING_APPROVAL,
    permissions: [
      Permission_Keys.Admin_Jobs_ApproveJob,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.JOB_REPORTED,
    permissions: [
      Permission_Keys.Admin_Jobs_ViewJob,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.LOW_APPLICATIONS,
    permissions: [
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.JOB_AUTO_FLAGGED,
    permissions: [
      Permission_Keys.Admin_Jobs_ViewJob,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.PLATFORM_ISSUE,
    permissions: [],
  },
  {
    type: NotificationEnum.HIGH_USER_ACTIVITY,
    permissions: [
      Permission_Keys.Admin_Settings_ManageSecuritySettings,
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.LOW_ENGAGEMENT,
    permissions: [
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.ANALYTICS_REPORT,
    permissions: [
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.BROADCAST_SENT,
    permissions: [
      Permission_Keys.Admin_Communications_SendNotifications,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.TARGETED_NOTIFICATION_SENT,
    permissions: [
      Permission_Keys.Admin_Communications_SendNotifications,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
  {
    type: NotificationEnum.FEEDBACK_RECEIVED,
    permissions: [
      Permission_Keys.Admin_Communications_ViewCommunicationLogs,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
    ],
  },
];
