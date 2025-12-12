export enum Permission_Keys {
  // Employer Permissions: General permissions for employer users
  Employer_ManageJobs = "Manage Jobs", // Create, edit, and delete job postings.
  Employer_ManageJobApplications = "Manage Job Applications", // View and manage job applications (review).
  Employer_InteractWithJobSeekers = "Interact with Job Seekers", // Unlock job seeker profiles / invite .
  Employer_ManageJobSeekerFolders = "Manage Job Seeker Folders", // Organize job seekers into folders for recruitment tracking.
  Employer_ManageCompanySettings = "Manage Company Settings", // Update company profile.
  Employer_ManagePayments = "Manage Payments", // Manage payment methods.
  Employer_Communications = "Manage Communications", // Manage payment methods.

  // Admin Permissions: Jobs category
  Admin_Jobs_AddJob = "Add Job", // Create new job postings.
  Admin_Jobs_ViewJob = "View Job", // View job postings and their details.
  Admin_Jobs_EditJob = "Edit Job", // Modify existing job postings.
  Admin_Jobs_DeleteJob = "Delete Job", // Remove job postings.
  Admin_Jobs_ApproveJob = "Approve Job", // Approve job postings before they go live.
  Admin_Jobs_ViewJobAnalytics = "View Job Analytics", // Access analytics for job postings (e.g., views, applications).

  // Admin Permissions: Applicants category
  Admin_Applicants_ViewApplicants = "View Applicants", // View and search applicant profiles for specific jobs.
  Admin_Applicants_ShortlistApplicants = "Shortlist Applicants", // Mark applicants as shortlisted.
  Admin_Applicants_ChatWithApplicants = "Chat with Applicants", // Communicate with applicants via chat.

  // Admin Permissions: Job Seekers category
  Admin_JobSeekers_EditJobSeeker = "Edit Job Seeker", // Modify job seeker profiles.
  Admin_JobSeekers_DeleteJobSeeker = "Delete Job Seeker", // Remove job seeker profiles.
  Admin_JobSeekers_ViewJobSeekerFullProfile = "View Job Seeker Full Profile", // Access full job seeker profiles.
  Admin_JobSeekers_ViewJobSeekerProfile = "View Job Seeker Profile", // View basic job seeker profile details.
  Admin_JobSeekers_SearchJobSeekers = "Search Job Seekers", // Search for job seekers based on criteria.
  Admin_JobSeekers_InviteJobSeekerToApply = "Invite Job Seeker to Apply", // Invite job seekers to apply for jobs.
  Admin_JobSeekers_ShortlistJobSeekers = "Shortlist Job Seekers", // Mark job seekers as shortlisted.
  Admin_JobSeekers_ManageJobSeekerFolders = "Admin Manage Job Seeker Folders", // Create, edit, and organize job seeker folders.
  Admin_JobSeekers_ChatWithJobSeekers = "Chat with Job Seekers", // Communicate with job seekers via chat.
  Admin_JobSeekers_UnlockJobSeekers = "Unlock Job Seekers", // Access locked job seeker profiles.

  // Admin Permissions: Recommendations category
  Admin_Recommendations_AddJobSeekerToRecommended = "Add Job Seeker to Recommended", // Mark job seekers as recommended for roles.
  Admin_Recommendations_RemoveJobSeekerFromRecommended = "Remove Job Seeker from Recommended", // Remove job seekers from recommended lists.
  Admin_Recommendations_ViewRecommendedJobSeekers = "View Recommended Job Seekers", // View lists of recommended job seekers.

  // Admin Permissions: Employers - Account Management category
  Admin_Employers_AccountManagement_AddEmployer = "Add Employer", // Create new employer accounts.
  Admin_Employers_AccountManagement_EditEmployer = "Edit Employer", // Modify employer account details.
  Admin_Employers_AccountManagement_ViewEmployerFullProfile = "View Employer Full Profile", // Access full employer profiles.
  Admin_Employers_AccountManagement_ViewEmployerProfile = "View Employer Profile", // View basic employer profile details.
  Admin_Employers_AccountManagement_DeleteEmployer = "Delete Employer", // Remove employer accounts.
  Admin_Employers_AccountManagement_ApproveEmployer = "Approve Employer", // Approve employer accounts for platform access.
  Admin_Employers_AccountManagement_AssignEmployerToAccountManager = "Assign Employer to Account Manager", // Assign an account manager to an employer.
  Admin_Employers_AccountManagement_CommunicateWithEmployers = "Communicate with Employers", // Send emails, messages, or other communications to employers.

  // Admin Permissions: Employers - Employee Management category
  Admin_Employers_EmployeeManagement_AddEmployerEmployee = "Add Employer Employee", // Add team members to an employer’s account.
  Admin_Employers_EmployeeManagement_EditEmployerEmployee = "Edit Employer Employee", // Modify employer team member details.
  Admin_Employers_EmployeeManagement_DeleteEmployerEmployee = "Delete Employer Employee", // Remove employer team members.

  // Admin Permissions: Employers - Billing category
  Admin_Employers_Billing_ViewEmployerBilling = "View Employer Billing", // Access employer billing and subscription details.
  Admin_Employers_Billing_AssignEmployerToPlan = "Assign Employer to Plan", // Enroll employers in subscription plans.
  Admin_Employers_Billing_UnlockJobSeekerForEmployer = "Unlock Job Seeker for Employer", // Unlock job seeker profiles for an employer.

  // Admin Permissions: Employers - Folders category
  Admin_Employers_Folders_ManageEmployerFolders = "Manage Employer Folders", // Create, edit, and organize folders for employers to manage job seekers.

  // Admin Permissions: Employers - Roles category
  Admin_Employers_Roles_AddEmployerRole = "Add Employer Role", // Create new roles for employer team members.
  Admin_Employers_Roles_EditEmployerRole = "Edit Employer Role", // Modify existing employer roles.
  Admin_Employers_Roles_DeleteEmployerRole = "Delete Employer Role", // Remove employer roles.

  // Admin Permissions: Admin Roles category
  Admin_AdminRoles_AddAdminRole = "Add Admin Role", // Create new roles for platform admins.
  Admin_AdminRoles_EditAdminRole = "Edit Admin Role", // Modify existing admin roles.
  Admin_AdminRoles_DeleteAdminRole = "Delete Admin Role", // Remove admin roles.

  // Admin Permissions: Finance category
  Admin_Finance_CreatePlan = "Create Plan", // Create new subscription or payment plans.
  Admin_Finance_EditPlan = "Edit Plan", // Modify existing plans.
  Admin_Finance_DeletePlan = "Delete Plan", // Remove plans.
  Admin_Finance_ViewPaymentHistory = "View Payment History", // Access transaction and payment history.
  Admin_Finance_AddInvoice = "Add Invoice", // Create new invoices.
  Admin_Finance_EditInvoice = "Edit Invoice", // Modify existing invoices.
  Admin_Finance_DeleteInvoice = "Delete Invoice", // Remove invoices.
  Admin_Finance_ManageBilling = "Manage Billing", // Handle billing-related tasks such as refunds, adjustments, and payment disputes.
  Admin_Finance_ViewFinanceOverview = "View Finance Overview", // Access financial summaries and reports.
  Admin_Finance_ViewTransactionHistory = "View Transaction History", // View detailed transaction logs.

  // Admin Permissions: Blogs - Categories category
  Admin_Blogs_Categories_AddBlogCategory = "Add Blog Category", // Create new blog categories.
  Admin_Blogs_Categories_EditBlogCategory = "Edit Blog Category", // Modify existing blog categories.
  Admin_Blogs_Categories_DeleteBlogCategory = "Delete Blog Category", // Remove blog categories.
  Admin_Blogs_Categories_ViewBlogCategory = "View Blog Category", // View blog category details.

  // Admin Permissions: Blogs - Articles category
  Admin_Blogs_Articles_AddBlogArticle = "Add Blog Article", // Create new blog articles.
  Admin_Blogs_Articles_EditBlogArticle = "Edit Blog Article", // Modify existing blog articles.
  Admin_Blogs_Articles_DeleteBlogArticle = "Delete Blog Article", // Remove blog articles.
  Admin_Blogs_Articles_ViewBlogArticle = "View Blog Article", // View blog article details.

  // Admin Permissions: Blogs - Authors category
  Admin_Blogs_Authors_AddBlogAuthor = "Add Blog Author", // Add new blog authors.
  Admin_Blogs_Authors_EditBlogAuthor = "Edit Blog Author", // Modify blog author details.
  Admin_Blogs_Authors_DeleteBlogAuthor = "Delete Blog Author", // Remove blog authors.
  Admin_Blogs_Authors_ViewBlogAuthor = "View Blog Author", // View blog author details.

  // Admin Permissions: Employees category
  Admin_Employees_AddEmployee = "Add Employee", // Create new employee accounts for the platform.
  Admin_Employees_EditEmployee = "Edit Employee", // Modify employee account details.
  Admin_Employees_DeleteEmployee = "Delete Employee", // Remove employee accounts.

  // Admin Permissions: Medicova Team category
  Admin_MedicovaTeam_AddMedicovaTeamMember = "Add Medicova Team Member", // Add new team members to the Medicova team.
  Admin_MedicovaTeam_EditMedicovaTeamMember = "Edit Medicova Team Member", // Modify Medicova team member details.
  Admin_MedicovaTeam_DeleteMedicovaTeamMember = "Delete Medicova Team Member", // Remove Medicova team members.

  // Admin Permissions: Settings category
  Admin_Settings_AddPlatformSetting = "Add Platform Setting", // Create new platform settings (e.g., feature toggles).
  Admin_Settings_EditPlatformSetting = "Edit Platform Setting", // Modify existing platform settings.
  Admin_Settings_DeletePlatformSetting = "Delete Platform Setting", // Remove platform settings.
  Admin_Settings_ManageUserPermissions = "Manage User Permissions", // Assign or modify user permissions and roles.
  Admin_Settings_ConfigurePlatformFeatures = "Configure Platform Features", // Enable or disable platform features (e.g., job recommendations, chat).
  Admin_Settings_ManageSecuritySettings = "Manage Security Settings", // Configure security settings (e.g., two-factor authentication, password policies).
  Admin_Settings_ManageAPIIntegrations = "Manage API Integrations", // Set up and manage third-party API integrations.

  // Admin Permissions: Communications category
  Admin_Communications_SendNotifications = "Send Notifications", // Send notifications to users (e.g., employers, job seekers).
  Admin_Communications_ManageEmailTemplates = "Manage Email Templates", // Create and edit email templates for communications.
  Admin_Communications_ManageSMSTemplates = "Manage SMS Templates", // Create and edit SMS templates for communications.
  Admin_Communications_ConfigureCommunicationSettings = "Configure Communication Settings", // Manage settings for communication channels (e.g., email, SMS, push notifications).
  Admin_Communications_ViewCommunicationLogs = "View Communication Logs", // Access logs of sent communications (e.g., email, notifications).
}
