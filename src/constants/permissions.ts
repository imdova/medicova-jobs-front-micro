import { Permission_Keys } from "./enums/Permission_Keys.enum";

export const permissions: Permission_Keys[] = [
  // Employer Permissions
  Permission_Keys.Employer_ManageJobs,
  Permission_Keys.Employer_ManageJobApplications,
  Permission_Keys.Employer_InteractWithJobSeekers,
  Permission_Keys.Employer_ManageJobSeekerFolders,
  Permission_Keys.Employer_ManageCompanySettings,
  Permission_Keys.Employer_ManagePayments,

  // Admin Permissions - Jobs
  Permission_Keys.Admin_Jobs_AddJob,
  Permission_Keys.Admin_Jobs_ViewJob,
  Permission_Keys.Admin_Jobs_EditJob,
  Permission_Keys.Admin_Jobs_DeleteJob,
  Permission_Keys.Admin_Jobs_ApproveJob,
  Permission_Keys.Admin_Jobs_ViewJobAnalytics,

  // Admin Permissions - Applicants
  Permission_Keys.Admin_Applicants_ViewApplicants,
  Permission_Keys.Admin_Applicants_ShortlistApplicants,
  Permission_Keys.Admin_Applicants_ChatWithApplicants,

  // Admin Permissions - Job Seekers
  Permission_Keys.Admin_JobSeekers_EditJobSeeker,
  Permission_Keys.Admin_JobSeekers_DeleteJobSeeker,
  Permission_Keys.Admin_JobSeekers_ViewJobSeekerFullProfile,
  Permission_Keys.Admin_JobSeekers_ViewJobSeekerProfile,
  Permission_Keys.Admin_JobSeekers_SearchJobSeekers,
  Permission_Keys.Admin_JobSeekers_InviteJobSeekerToApply,
  Permission_Keys.Admin_JobSeekers_ShortlistJobSeekers,
  Permission_Keys.Admin_JobSeekers_ManageJobSeekerFolders,
  Permission_Keys.Admin_JobSeekers_ChatWithJobSeekers,
  Permission_Keys.Admin_JobSeekers_UnlockJobSeekers,

  // Admin Permissions - Recommendations
  Permission_Keys.Admin_Recommendations_AddJobSeekerToRecommended,
  Permission_Keys.Admin_Recommendations_RemoveJobSeekerFromRecommended,
  Permission_Keys.Admin_Recommendations_ViewRecommendedJobSeekers,

  // Admin Permissions - Employers - Account Management
  Permission_Keys.Admin_Employers_AccountManagement_AddEmployer,
  Permission_Keys.Admin_Employers_AccountManagement_EditEmployer,
  Permission_Keys.Admin_Employers_AccountManagement_ViewEmployerFullProfile,
  Permission_Keys.Admin_Employers_AccountManagement_ViewEmployerProfile,
  Permission_Keys.Admin_Employers_AccountManagement_DeleteEmployer,
  Permission_Keys.Admin_Employers_AccountManagement_ApproveEmployer,
  Permission_Keys.Admin_Employers_AccountManagement_AssignEmployerToAccountManager,
  Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,

  // Admin Permissions - Employers - Employee Management
  Permission_Keys.Admin_Employers_EmployeeManagement_AddEmployerEmployee,
  Permission_Keys.Admin_Employers_EmployeeManagement_EditEmployerEmployee,
  Permission_Keys.Admin_Employers_EmployeeManagement_DeleteEmployerEmployee,

  // Admin Permissions - Employers - Billing
  Permission_Keys.Admin_Employers_Billing_ViewEmployerBilling,
  Permission_Keys.Admin_Employers_Billing_AssignEmployerToPlan,
  Permission_Keys.Admin_Employers_Billing_UnlockJobSeekerForEmployer,

  // Admin Permissions - Employers - Folders
  Permission_Keys.Admin_Employers_Folders_ManageEmployerFolders,

  // Admin Permissions - Employers - Roles
  Permission_Keys.Admin_Employers_Roles_AddEmployerRole,
  Permission_Keys.Admin_Employers_Roles_EditEmployerRole,
  Permission_Keys.Admin_Employers_Roles_DeleteEmployerRole,

  // Admin Permissions - Admin Roles
  Permission_Keys.Admin_AdminRoles_AddAdminRole,
  Permission_Keys.Admin_AdminRoles_EditAdminRole,
  Permission_Keys.Admin_AdminRoles_DeleteAdminRole,

  // Admin Permissions - Finance
  Permission_Keys.Admin_Finance_CreatePlan,
  Permission_Keys.Admin_Finance_EditPlan,
  Permission_Keys.Admin_Finance_DeletePlan,
  Permission_Keys.Admin_Finance_ViewPaymentHistory,
  Permission_Keys.Admin_Finance_AddInvoice,
  Permission_Keys.Admin_Finance_EditInvoice,
  Permission_Keys.Admin_Finance_DeleteInvoice,
  Permission_Keys.Admin_Finance_ManageBilling,
  Permission_Keys.Admin_Finance_ViewFinanceOverview,
  Permission_Keys.Admin_Finance_ViewTransactionHistory,

  // Admin Permissions - Blogs - Categories
  Permission_Keys.Admin_Blogs_Categories_AddBlogCategory,
  Permission_Keys.Admin_Blogs_Categories_EditBlogCategory,
  Permission_Keys.Admin_Blogs_Categories_DeleteBlogCategory,
  Permission_Keys.Admin_Blogs_Categories_ViewBlogCategory,

  // Admin Permissions - Blogs - Articles
  Permission_Keys.Admin_Blogs_Articles_AddBlogArticle,
  Permission_Keys.Admin_Blogs_Articles_EditBlogArticle,
  Permission_Keys.Admin_Blogs_Articles_DeleteBlogArticle,
  Permission_Keys.Admin_Blogs_Articles_ViewBlogArticle,

  // Admin Permissions - Blogs - Authors
  Permission_Keys.Admin_Blogs_Authors_AddBlogAuthor,
  Permission_Keys.Admin_Blogs_Authors_EditBlogAuthor,
  Permission_Keys.Admin_Blogs_Authors_DeleteBlogAuthor,
  Permission_Keys.Admin_Blogs_Authors_ViewBlogAuthor,

  // Admin Permissions - Employees
  Permission_Keys.Admin_Employees_AddEmployee,
  Permission_Keys.Admin_Employees_EditEmployee,
  Permission_Keys.Admin_Employees_DeleteEmployee,

  // Admin Permissions - Medicova Team
  Permission_Keys.Admin_MedicovaTeam_AddMedicovaTeamMember,
  Permission_Keys.Admin_MedicovaTeam_EditMedicovaTeamMember,
  Permission_Keys.Admin_MedicovaTeam_DeleteMedicovaTeamMember,

  // Admin Permissions - Settings
  Permission_Keys.Admin_Settings_AddPlatformSetting,
  Permission_Keys.Admin_Settings_EditPlatformSetting,
  Permission_Keys.Admin_Settings_DeletePlatformSetting,
  Permission_Keys.Admin_Settings_ManageUserPermissions,
  Permission_Keys.Admin_Settings_ConfigurePlatformFeatures,
  Permission_Keys.Admin_Settings_ManageSecuritySettings,
  Permission_Keys.Admin_Settings_ManageAPIIntegrations,

  // Admin Permissions - Communications
  Permission_Keys.Admin_Communications_SendNotifications,
  Permission_Keys.Admin_Communications_ManageEmailTemplates,
  Permission_Keys.Admin_Communications_ManageSMSTemplates,
  Permission_Keys.Admin_Communications_ConfigureCommunicationSettings,
  Permission_Keys.Admin_Communications_ViewCommunicationLogs,
];

export const employerPermissions: Permission_Keys[] = [
  // Employer Permissions
  Permission_Keys.Employer_ManageJobs,
  Permission_Keys.Employer_ManageJobApplications,
  Permission_Keys.Employer_InteractWithJobSeekers,
  Permission_Keys.Employer_ManageJobSeekerFolders,
  Permission_Keys.Employer_ManageCompanySettings,
  Permission_Keys.Employer_ManagePayments,
];
export type CrudPermission = {
  id: string | number;
  name: string;
  create: Permission_Keys | null;
  edit: Permission_Keys | null;
  delete: Permission_Keys | null;
  read: Permission_Keys | null;
};

export type PermissionGroup = {
  id: string;
  name: string;
  core: {
    create?: string | null;
    edit?: string | null;
    delete?: string | null;
    read?: string | null;
  };
  extras?: Record<string, string | null>;
};
export const All_Permissions_Categorized: PermissionGroup[] = [
  {
    id: "jobs",
    name: "Jobs",
    core: {
      create: Permission_Keys.Admin_Jobs_AddJob,
      edit: Permission_Keys.Admin_Jobs_EditJob,
      delete: Permission_Keys.Admin_Jobs_DeleteJob,
      read: Permission_Keys.Admin_Jobs_ViewJob,
    },
    extras: {
      approve: Permission_Keys.Admin_Jobs_ApproveJob,
      analytics: Permission_Keys.Admin_Jobs_ViewJobAnalytics,
    },
  },
  {
    id: "employers-accounts",
    name: "Employers - Accounts",
    core: {
      create: Permission_Keys.Admin_Employers_AccountManagement_AddEmployer,
      edit: Permission_Keys.Admin_Employers_AccountManagement_EditEmployer,
      delete: Permission_Keys.Admin_Employers_AccountManagement_DeleteEmployer,
      read: Permission_Keys.Admin_Employers_AccountManagement_ViewEmployerProfile,
    },
    extras: {
      approve:
        Permission_Keys.Admin_Employers_AccountManagement_ApproveEmployer,
      assign:
        Permission_Keys.Admin_Employers_AccountManagement_AssignEmployerToAccountManager,
      chat: Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
      fullProfile:
        Permission_Keys.Admin_Employers_AccountManagement_ViewEmployerFullProfile,
    },
  },
  {
    id: "employers-employees",
    name: "Employers - Employees",
    core: {
      create:
        Permission_Keys.Admin_Employers_EmployeeManagement_AddEmployerEmployee,
      edit: Permission_Keys.Admin_Employers_EmployeeManagement_EditEmployerEmployee,
      delete:
        Permission_Keys.Admin_Employers_EmployeeManagement_DeleteEmployerEmployee,
      read: null,
    },
  },
  {
    id: "employers-roles",
    name: "Employers - Roles",
    core: {
      create: Permission_Keys.Admin_Employers_Roles_AddEmployerRole,
      edit: Permission_Keys.Admin_Employers_Roles_EditEmployerRole,
      delete: Permission_Keys.Admin_Employers_Roles_DeleteEmployerRole,
      read: null,
    },
  },
  {
    id: "admin-roles",
    name: "Admin Roles",
    core: {
      create: Permission_Keys.Admin_AdminRoles_AddAdminRole,
      edit: Permission_Keys.Admin_AdminRoles_EditAdminRole,
      delete: Permission_Keys.Admin_AdminRoles_DeleteAdminRole,
      read: null,
    },
  },
  {
    id: "finance-plans",
    name: "Finance - Plans",
    core: {
      create: Permission_Keys.Admin_Finance_CreatePlan,
      edit: Permission_Keys.Admin_Finance_EditPlan,
      delete: Permission_Keys.Admin_Finance_DeletePlan,
      read: null,
    },
  },
  {
    id: "finance-invoices",
    name: "Finance - Invoices",
    core: {
      create: Permission_Keys.Admin_Finance_AddInvoice,
      edit: Permission_Keys.Admin_Finance_EditInvoice,
      delete: Permission_Keys.Admin_Finance_DeleteInvoice,
      read: null,
    },
  },
  {
    id: "blogs-categories",
    name: "Blogs - Categories",
    core: {
      create: Permission_Keys.Admin_Blogs_Categories_AddBlogCategory,
      edit: Permission_Keys.Admin_Blogs_Categories_EditBlogCategory,
      delete: Permission_Keys.Admin_Blogs_Categories_DeleteBlogCategory,
      read: Permission_Keys.Admin_Blogs_Categories_ViewBlogCategory,
    },
  },
  {
    id: "blogs-articles",
    name: "Blogs - Articles",
    core: {
      create: Permission_Keys.Admin_Blogs_Articles_AddBlogArticle,
      edit: Permission_Keys.Admin_Blogs_Articles_EditBlogArticle,
      delete: Permission_Keys.Admin_Blogs_Articles_DeleteBlogArticle,
      read: Permission_Keys.Admin_Blogs_Articles_ViewBlogArticle,
    },
  },
  {
    id: "blogs-authors",
    name: "Blogs - Authors",
    core: {
      create: Permission_Keys.Admin_Blogs_Authors_AddBlogAuthor,
      edit: Permission_Keys.Admin_Blogs_Authors_EditBlogAuthor,
      delete: Permission_Keys.Admin_Blogs_Authors_DeleteBlogAuthor,
      read: Permission_Keys.Admin_Blogs_Authors_ViewBlogAuthor,
    },
  },
  {
    id: "employees",
    name: "Employees",
    core: {
      create: Permission_Keys.Admin_Employees_AddEmployee,
      edit: Permission_Keys.Admin_Employees_EditEmployee,
      delete: Permission_Keys.Admin_Employees_DeleteEmployee,
      read: null,
    },
  },
  {
    id: "team",
    name: "Medicova Team",
    core: {
      create: Permission_Keys.Admin_MedicovaTeam_AddMedicovaTeamMember,
      edit: Permission_Keys.Admin_MedicovaTeam_EditMedicovaTeamMember,
      delete: Permission_Keys.Admin_MedicovaTeam_DeleteMedicovaTeamMember,
      read: null,
    },
  },
  {
    id: "settings",
    name: "Settings",
    core: {
      create: Permission_Keys.Admin_Settings_AddPlatformSetting,
      edit: Permission_Keys.Admin_Settings_EditPlatformSetting,
      delete: Permission_Keys.Admin_Settings_DeletePlatformSetting,
      read: null,
    },
    extras: {
      users: Permission_Keys.Admin_Settings_ManageUserPermissions,
      features: Permission_Keys.Admin_Settings_ConfigurePlatformFeatures,
      security: Permission_Keys.Admin_Settings_ManageSecuritySettings,
      apis: Permission_Keys.Admin_Settings_ManageAPIIntegrations,
    },
  },
  {
    id: "employers-billing",
    name: "Employers - Billing",
    core: {
      create: null,
      edit: null,
      delete: null,
      read: null,
    },
    extras: {
      billing: Permission_Keys.Admin_Employers_Billing_ViewEmployerBilling,
      assignPlan: Permission_Keys.Admin_Employers_Billing_AssignEmployerToPlan,
      unlock:
        Permission_Keys.Admin_Employers_Billing_UnlockJobSeekerForEmployer,
    },
  },
  {
    id: "employers-folders",
    name: "Employers - Folders",
    core: {
      create: null,
      edit: null,
      delete: null,
      read: null,
    },
    extras: {
      folders: Permission_Keys.Admin_Employers_Folders_ManageEmployerFolders,
    },
  },
  {
    id: "finance",
    name: "Finance",
    core: {
      create: null,
      edit: null,
      delete: null,
      read: null,
    },
    extras: {
      payments: Permission_Keys.Admin_Finance_ViewPaymentHistory,
      billing: Permission_Keys.Admin_Finance_ManageBilling,
      overview: Permission_Keys.Admin_Finance_ViewFinanceOverview,
      transactions: Permission_Keys.Admin_Finance_ViewTransactionHistory,
    },
  },
  {
    id: "applicants",
    name: "Applicants",
    core: {
      create: null,
      edit: null,
      delete: null,
      read: null,
    },
    extras: {
      view: Permission_Keys.Admin_Applicants_ViewApplicants,
      shortlist: Permission_Keys.Admin_Applicants_ShortlistApplicants,
      chat: Permission_Keys.Admin_Applicants_ChatWithApplicants,
    },
  },
  {
    id: "job-seekers",
    name: "Job Seekers",
    core: {
      create: null,
      edit: null,
      delete: null,
      read: null,
    },
    extras: {
      fullProfile: Permission_Keys.Admin_JobSeekers_ViewJobSeekerFullProfile,
      profile: Permission_Keys.Admin_JobSeekers_ViewJobSeekerProfile,
      search: Permission_Keys.Admin_JobSeekers_SearchJobSeekers,
      invite: Permission_Keys.Admin_JobSeekers_InviteJobSeekerToApply,
      shortlist: Permission_Keys.Admin_JobSeekers_ShortlistJobSeekers,
      folders: Permission_Keys.Admin_JobSeekers_ManageJobSeekerFolders,
      chat: Permission_Keys.Admin_JobSeekers_ChatWithJobSeekers,
      unlock: Permission_Keys.Admin_JobSeekers_UnlockJobSeekers,
    },
  },
  {
    id: "recommendations",
    name: "Recommendations",
    core: {
      create: null,
      edit: null,
      delete: null,
      read: null,
    },
    extras: {
      add: Permission_Keys.Admin_Recommendations_AddJobSeekerToRecommended,
      remove:
        Permission_Keys.Admin_Recommendations_RemoveJobSeekerFromRecommended,
      view: Permission_Keys.Admin_Recommendations_ViewRecommendedJobSeekers,
    },
  },
  {
    id: "communications",
    name: "Communications",
    core: {
      create: null,
      edit: null,
      delete: null,
      read: null,
    },
    extras: {
      notify: Permission_Keys.Admin_Communications_SendNotifications,
      email: Permission_Keys.Admin_Communications_ManageEmailTemplates,
      sms: Permission_Keys.Admin_Communications_ManageSMSTemplates,
      settings:
        Permission_Keys.Admin_Communications_ConfigureCommunicationSettings,
      logs: Permission_Keys.Admin_Communications_ViewCommunicationLogs,
    },
  },
];

export const CRUD_Categorized_Permissions: CrudPermission[] = [
  {
    id: "jobs",
    name: "Jobs",
    create: Permission_Keys.Admin_Jobs_AddJob,
    edit: Permission_Keys.Admin_Jobs_EditJob,
    delete: Permission_Keys.Admin_Jobs_DeleteJob,
    read: Permission_Keys.Admin_Jobs_ViewJob,
  },
  {
    id: "employers-account-management",
    name: "Employers - Account Management",
    create: Permission_Keys.Admin_Employers_AccountManagement_AddEmployer,
    edit: Permission_Keys.Admin_Employers_AccountManagement_EditEmployer,
    delete: Permission_Keys.Admin_Employers_AccountManagement_DeleteEmployer,
    read: Permission_Keys.Admin_Employers_AccountManagement_ViewEmployerProfile,
  },
  {
    id: "employers-employee-management",
    name: "Employers - Employee Management",
    create:
      Permission_Keys.Admin_Employers_EmployeeManagement_AddEmployerEmployee,
    edit: Permission_Keys.Admin_Employers_EmployeeManagement_EditEmployerEmployee,
    delete:
      Permission_Keys.Admin_Employers_EmployeeManagement_DeleteEmployerEmployee,
    read: null,
  },
  {
    id: "employers-roles",
    name: "Employers - Roles",
    create: Permission_Keys.Admin_Employers_Roles_AddEmployerRole,
    edit: Permission_Keys.Admin_Employers_Roles_EditEmployerRole,
    delete: Permission_Keys.Admin_Employers_Roles_DeleteEmployerRole,
    read: null,
  },
  {
    id: "admin-roles",
    name: "Admin Roles",
    create: Permission_Keys.Admin_AdminRoles_AddAdminRole,
    edit: Permission_Keys.Admin_AdminRoles_EditAdminRole,
    delete: Permission_Keys.Admin_AdminRoles_DeleteAdminRole,
    read: null,
  },
  {
    id: "finance-plans",
    name: "Finance - Plans",
    create: Permission_Keys.Admin_Finance_CreatePlan,
    edit: Permission_Keys.Admin_Finance_EditPlan,
    delete: Permission_Keys.Admin_Finance_DeletePlan,
    read: null,
  },
  {
    id: "finance-invoices",
    name: "Finance - Invoices",
    create: Permission_Keys.Admin_Finance_AddInvoice,
    edit: Permission_Keys.Admin_Finance_EditInvoice,
    delete: Permission_Keys.Admin_Finance_DeleteInvoice,
    read: null,
  },
  {
    id: "blogs-categories",
    name: "Blogs - Categories",
    create: Permission_Keys.Admin_Blogs_Categories_AddBlogCategory,
    edit: Permission_Keys.Admin_Blogs_Categories_EditBlogCategory,
    delete: Permission_Keys.Admin_Blogs_Categories_DeleteBlogCategory,
    read: Permission_Keys.Admin_Blogs_Categories_ViewBlogCategory,
  },
  {
    id: "blogs-articles",
    name: "Blogs - Articles",
    create: Permission_Keys.Admin_Blogs_Articles_AddBlogArticle,
    edit: Permission_Keys.Admin_Blogs_Articles_EditBlogArticle,
    delete: Permission_Keys.Admin_Blogs_Articles_DeleteBlogArticle,
    read: Permission_Keys.Admin_Blogs_Articles_ViewBlogArticle,
  },
  {
    id: "blogs-authors",
    name: "Blogs - Authors",
    create: Permission_Keys.Admin_Blogs_Authors_AddBlogAuthor,
    edit: Permission_Keys.Admin_Blogs_Authors_EditBlogAuthor,
    delete: Permission_Keys.Admin_Blogs_Authors_DeleteBlogAuthor,
    read: Permission_Keys.Admin_Blogs_Authors_ViewBlogAuthor,
  },
  {
    id: "employees",
    name: "Employees",
    create: Permission_Keys.Admin_Employees_AddEmployee,
    edit: Permission_Keys.Admin_Employees_EditEmployee,
    delete: Permission_Keys.Admin_Employees_DeleteEmployee,
    read: null,
  },
  {
    id: "medicova-team",
    name: "Medicova Team",
    create: Permission_Keys.Admin_MedicovaTeam_AddMedicovaTeamMember,
    edit: Permission_Keys.Admin_MedicovaTeam_EditMedicovaTeamMember,
    delete: Permission_Keys.Admin_MedicovaTeam_DeleteMedicovaTeamMember,
    read: null,
  },
  {
    id: "settings",
    name: "Settings",
    create: Permission_Keys.Admin_Settings_AddPlatformSetting,
    edit: Permission_Keys.Admin_Settings_EditPlatformSetting,
    delete: Permission_Keys.Admin_Settings_DeletePlatformSetting,
    read: null,
  },
];

export const NonCRUD_Categorized_Permissions = [
  {
    name: "Jobs",
    permissions: [
      Permission_Keys.Admin_Jobs_ApproveJob,
      Permission_Keys.Admin_Jobs_ViewJobAnalytics,
    ],
  },
  {
    name: "Employers - Account Management",
    permissions: [
      Permission_Keys.Admin_Employers_AccountManagement_ApproveEmployer,
      Permission_Keys.Admin_Employers_AccountManagement_AssignEmployerToAccountManager,
      Permission_Keys.Admin_Employers_AccountManagement_CommunicateWithEmployers,
      Permission_Keys.Admin_Employers_AccountManagement_ViewEmployerFullProfile,
    ],
  },
  {
    name: "Employers - Billing",
    permissions: [
      Permission_Keys.Admin_Employers_Billing_ViewEmployerBilling,
      Permission_Keys.Admin_Employers_Billing_AssignEmployerToPlan,
      Permission_Keys.Admin_Employers_Billing_UnlockJobSeekerForEmployer,
    ],
  },
  {
    name: "Employers - Folders",
    permissions: [
      Permission_Keys.Admin_Employers_Folders_ManageEmployerFolders,
    ],
  },
  {
    name: "Finance",
    permissions: [
      Permission_Keys.Admin_Finance_ViewPaymentHistory,
      Permission_Keys.Admin_Finance_ManageBilling,
      Permission_Keys.Admin_Finance_ViewFinanceOverview,
      Permission_Keys.Admin_Finance_ViewTransactionHistory,
    ],
  },
  {
    name: "Applicants",
    permissions: [
      Permission_Keys.Admin_Applicants_ViewApplicants,
      Permission_Keys.Admin_Applicants_ShortlistApplicants,
      Permission_Keys.Admin_Applicants_ChatWithApplicants,
    ],
  },
  {
    name: "Job Seekers",
    permissions: [
      Permission_Keys.Admin_JobSeekers_ViewJobSeekerFullProfile,
      Permission_Keys.Admin_JobSeekers_ViewJobSeekerProfile,
      Permission_Keys.Admin_JobSeekers_SearchJobSeekers,
      Permission_Keys.Admin_JobSeekers_InviteJobSeekerToApply,
      Permission_Keys.Admin_JobSeekers_ShortlistJobSeekers,
      Permission_Keys.Admin_JobSeekers_ManageJobSeekerFolders,
      Permission_Keys.Admin_JobSeekers_ChatWithJobSeekers,
      Permission_Keys.Admin_JobSeekers_UnlockJobSeekers,
    ],
  },
  {
    name: "Recommendations",
    permissions: [
      Permission_Keys.Admin_Recommendations_AddJobSeekerToRecommended,
      Permission_Keys.Admin_Recommendations_RemoveJobSeekerFromRecommended,
      Permission_Keys.Admin_Recommendations_ViewRecommendedJobSeekers,
    ],
  },
  {
    name: "Settings",
    permissions: [
      Permission_Keys.Admin_Settings_ManageUserPermissions,
      Permission_Keys.Admin_Settings_ConfigurePlatformFeatures,
      Permission_Keys.Admin_Settings_ManageSecuritySettings,
      Permission_Keys.Admin_Settings_ManageAPIIntegrations,
    ],
  },
  {
    name: "Communications",
    permissions: [
      Permission_Keys.Admin_Communications_SendNotifications,
      Permission_Keys.Admin_Communications_ManageEmailTemplates,
      Permission_Keys.Admin_Communications_ManageSMSTemplates,
      Permission_Keys.Admin_Communications_ConfigureCommunicationSettings,
      Permission_Keys.Admin_Communications_ViewCommunicationLogs,
    ],
  },
];
