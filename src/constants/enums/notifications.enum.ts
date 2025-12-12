export enum NotificationEnum {
  // Job Seeker Notifications
  NEW_JOB_MATCH = "NEW_JOB_MATCH",
  APPLICATION_SUBMITTED = "APPLICATION_SUBMITTED",
  APPLICATION_VIEWED = "APPLICATION_VIEWED",
  APPLICATION_SHORTLISTED = "APPLICATION_SHORTLISTED",
  //   APPLICATION_REJECTED = "APPLICATION_REJECTED",
  APPLICATION_WITHDRAWN = "APPLICATION_WITHDRAWN",
  //       HIRED = "HIRED",

  // Employer Notifications
  JOB_SUBMITTED = "JOB_SUBMITTED",
  JOB_APPROVED = "JOB_APPROVED",
  JOB_REJECTED = "JOB_REJECTED",
  JOB_FLAGGED = "JOB_FLAGGED",
  JOB_DRAFT = "JOB_DRAFT",
  PROFILE_APPROVED = "PROFILE_APPROVED",
  PROFILE_REJECTED = "PROFILE_REJECTED",
  NEW_APPLICATION = "NEW_APPLICATION",
  RECOMMENDED_LIST_ADDED = "RECOMMENDED_LIST_ADDED",
  ACCOUNT_MANAGER_ASSIGNED = "ACCOUNT_MANAGER_ASSIGNED",
  PAYMENT_ISSUE = "PAYMENT_ISSUE",

  // general
  NEW_MESSAGE = "NEW_MESSAGE",
  PROFILE_INCOMPLETE = "PROFILE_INCOMPLETE",
  ACCOUNT_SUSPENSION_WARNING = "ACCOUNT_SUSPENSION_WARNING",
  ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED",
  PASSWORD_RESET = "PASSWORD_RESET",
  NOTIFICATION_PREFERENCES_UPDATED = "NOTIFICATION_PREFERENCES_UPDATED",
  PLATFORM_MAINTENANCE = "PLATFORM_MAINTENANCE",
  NEW_FEATURE = "NEW_FEATURE",
  POLICY_UPDATE = "POLICY_UPDATE",

  // Admin Notifications
  USER_REPORTED = "USER_REPORTED",
  ACCOUNT_SUSPENSION_REQUEST = "ACCOUNT_SUSPENSION_REQUEST",
  BULK_ACTION_COMPLETED = "BULK_ACTION_COMPLETED",
  JOB_PENDING_APPROVAL = "JOB_PENDING_APPROVAL",
  JOB_REPORTED = "JOB_REPORTED",
  EMPLOYER_PAYMENT_ISSUE = "EMPLOYER_PAYMENT_ISSUE",
  LOW_APPLICATIONS = "LOW_APPLICATIONS",
  JOB_AUTO_FLAGGED = "JOB_AUTO_FLAGGED",
  PLATFORM_ISSUE = "PLATFORM_ISSUE",
  HIGH_USER_ACTIVITY = "HIGH_USER_ACTIVITY",
  LOW_ENGAGEMENT = "LOW_ENGAGEMENT",
  ANALYTICS_REPORT = "ANALYTICS_REPORT",
  BROADCAST_SENT = "BROADCAST_SENT",
  TARGETED_NOTIFICATION_SENT = "TARGETED_NOTIFICATION_SENT",
  FEEDBACK_RECEIVED = "FEEDBACK_RECEIVED",
}

export enum Seeker_Notifications_Enum {
  // New job posted that matches seeker’s profile
  // MetaData: Job (title, id), company (name , username , image)
  NEW_JOB_MATCH = "NEW_JOB_MATCH",

  // Job application submitted by Me as seeker
  // MetaData: Job (title, id), company (name , username , image)
  APPLICATION_SUBMITTED = "APPLICATION_SUBMITTED",

  // Employer viewed the seeker’s application at update with status = viewed
  // MetaData: Job (title, id), company (name , username , image)
  APPLICATION_VIEWED = "APPLICATION_VIEWED",

  // Seeker’s application shortlisted by employer at update with status = shortlisted
  // MetaData: Job (title, id), company (name , username , image)
  APPLICATION_SHORTLISTED = "APPLICATION_SHORTLISTED",

  // Seeker withdrew their application at update with status = withdrew
  // MetaData: Job (title, id), company (name , username , image)
  APPLICATION_WITHDRAWN = "APPLICATION_WITHDRAWN",

  // New message received by seeker
  // MetaData: Sender’s name, message preview
  NEW_MESSAGE = "NEW_MESSAGE",

  // Seeker’s profile is incomplete
  // MetaData: List of missing sections , percentage
  PROFILE_INCOMPLETE = "PROFILE_INCOMPLETE",

  // ---feature not done yet
  // Account at risk of suspension
  // MetaData: Warning reason, resolution deadline
  ACCOUNT_SUSPENSION_WARNING = "ACCOUNT_SUSPENSION_WARNING",

  // ---feature not done yet
  // Account suspended
  // MetaData: Suspension reason, support contact info
  ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED",

  // Password reset requested
  // MetaData: Reset link expiry time request to check his mail
  PASSWORD_RESET = "PASSWORD_RESET",

  // ---feature not done yet
  // Notification preferences updated
  // MetaData: Summary of updates
  NOTIFICATION_PREFERENCES_UPDATED = "NOTIFICATION_PREFERENCES_UPDATED",

  // ---feature not done yet
  // Platform scheduled maintenance
  // MetaData: Maintenance window, affected features
  PLATFORM_MAINTENANCE = "PLATFORM_MAINTENANCE",

  // ---feature not done yet
  // New features released
  // MetaData: Feature summary, key benefits
  NEW_FEATURE = "NEW_FEATURE",

  // ---feature not done yet
  // Platform policies updated
  // MetaData: Summary of changes
  POLICY_UPDATE = "POLICY_UPDATE",
}

export enum Employer_Notifications_Enum {
  // New job submitted by employer in the company
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image)
  JOB_SUBMITTED = "JOB_SUBMITTED",

  // Job approved by admin
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image)
  JOB_APPROVED = "JOB_APPROVED",

  // Job rejected by admin
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image)
  JOB_REJECTED = "JOB_REJECTED",

  // Job flagged for review = after submit we discoverd flagged words
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image)
  JOB_FLAGGED = "JOB_FLAGGED",

  // Job saved as draft
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image)
  JOB_DRAFT = "JOB_DRAFT",

  // ---feature not done yet
  // Company profile approved
  // MetaData: Approval date
  PROFILE_APPROVED = "PROFILE_APPROVED",

  // ---feature not done yet
  // Company profile rejected
  // MetaData: Rejection reason
  PROFILE_REJECTED = "PROFILE_REJECTED",

  // New application received
  // MetaData: Job (title, id), applicant (id, seekerId,first ,last, username , image)
  NEW_APPLICATION = "NEW_APPLICATION",

  // ---feature not done yet
  // Candidates added to shortlist
  // MetaData: Number of candidates, job title
  RECOMMENDED_LIST_ADDED = "RECOMMENDED_LIST_ADDED",

  // ---feature not done yet
  // Account manager assigned
  // MetaData: Manager first ,last name,email, image,id
  ACCOUNT_MANAGER_ASSIGNED = "ACCOUNT_MANAGER_ASSIGNED",

  // ---feature not done yet
  // Payment issue detected
  // MetaData: Issue details, due date , message , account manager id if there
  PAYMENT_ISSUE = "PAYMENT_ISSUE",

  // New message received
  // MetaData: Sender’s first, last, image, email, id, and message preview
  NEW_MESSAGE = "NEW_MESSAGE",

  // Company profile incomplete
  // MetaData: List of missing sections and percentage
  PROFILE_INCOMPLETE = "PROFILE_INCOMPLETE",

  // ---waiting for feature to be done
  // Account at risk of suspension
  // MetaData: Warning reason, resolution deadline
  ACCOUNT_SUSPENSION_WARNING = "ACCOUNT_SUSPENSION_WARNING",

  // ---waiting for feature to be done
  // Account suspended
  // MetaData: Suspension reason, support contact info
  ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED",

  // Password reset requested
  // MetaData: Reset link expiry time request to check his mail
  PASSWORD_RESET = "PASSWORD_RESET",

  // ---waiting for feature to be done
  // Notification preferences updated
  // MetaData: Summary of updates
  NOTIFICATION_PREFERENCES_UPDATED = "NOTIFICATION_PREFERENCES_UPDATED",

  // ---waiting for feature to be done
  // Platform scheduled maintenance
  // MetaData: Maintenance window, affected features
  PLATFORM_MAINTENANCE = "PLATFORM_MAINTENANCE",

  // ---waiting for feature to be done
  // New features released
  // MetaData: Feature summary, key benefits
  NEW_FEATURE = "NEW_FEATURE",

  // ---waiting for feature to be done
  // Platform policies updated
  // MetaData: Summary of changes
  POLICY_UPDATE = "POLICY_UPDATE",
}

export enum Admin_Notifications_Enum {
  // New job submitted by employer in the company - to account managers
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image) ,  company (name , username , image)
  JOB_SUBMITTED = "JOB_SUBMITTED",

  // Job approved by admin - to account managers
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image) , company (name , username , image)
  JOB_APPROVED = "JOB_APPROVED",

  // Job rejected by admin - to account managers
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image) , company (name , username , image)
  JOB_REJECTED = "JOB_REJECTED",

  // Job flagged for review = after submit we discoverd flagged words - to account managers
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image) , company (name , username , image)
  JOB_FLAGGED = "JOB_FLAGGED",

  // Job saved as draft - to account managers
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image) , company (name , username , image)
  JOB_DRAFT = "JOB_DRAFT",

  // ---feature not done yet
  // Company profile approved by admin - to account managers
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image) , company (name , username , image)
  PROFILE_APPROVED = "PROFILE_APPROVED",

  // ---feature not done yet
  // Company profile rejected - to account managers
  // MetaData: Job (title, id), employer who posted (first , last name ,email , image) , company (name , username , image) , Rejection reason
  PROFILE_REJECTED = "PROFILE_REJECTED",

  // New application received - to account managers
  // MetaData: Job (title, id) , company (name , username , image) , applicant (id, seekerId,first ,last, username , image)
  NEW_APPLICATION = "NEW_APPLICATION",

  // ---feature not done yet
  // Candidates added to shortlist - to account managers
  // MetaData: Number of candidates, job title
  RECOMMENDED_LIST_ADDED = "RECOMMENDED_LIST_ADDED",

  // ---feature not done yet
  // Payment issue detected for employer - - to account managers
  // MetaData: Issue details, due date , message , account manager id if there + company data ,
  EMPLOYER_PAYMENT_ISSUE = "EMPLOYER_PAYMENT_ISSUE",

  // New message received
  // MetaData: Sender’s name, message preview
  NEW_MESSAGE = "NEW_MESSAGE",

  // Password reset requested
  // MetaData: User type, request time
  PASSWORD_RESET = "PASSWORD_RESET",

  // ---feature not done yet
  // User reported
  // MetaData: Reported user, reason, reporter
  USER_REPORTED = "USER_REPORTED",

  // ---feature not done yet
  // Account suspension requested
  // MetaData: User info, suspension reason
  ACCOUNT_SUSPENSION_REQUEST = "ACCOUNT_SUSPENSION_REQUEST",

  // ---feature not done yet
  // Bulk action completed
  // MetaData: Action type, item count
  BULK_ACTION_COMPLETED = "BULK_ACTION_COMPLETED",

  // ---feature not done yet
  // Job pending approval
  // MetaData: Job title, company name, submission date
  JOB_PENDING_APPROVAL = "JOB_PENDING_APPROVAL",

  // ---feature not done yet
  // Job reported
  // MetaData: Job title, company name, report reason and reporter details
  JOB_REPORTED = "JOB_REPORTED",

  // ---feature not done yet
  // Job has low applications - to account managers
  // MetaData: Job title, company name, application count
  LOW_APPLICATIONS = "LOW_APPLICATIONS",

  // ---feature not done yet
  // Job auto-flagged for review - to account managers
  // MetaData: Job title, company name
  JOB_AUTO_FLAGGED = "JOB_AUTO_FLAGGED",

  // ---feature not done yet
  // Platform-wide issue detected
  // MetaData: Issue summary
  PLATFORM_ISSUE = "PLATFORM_ISSUE",

  // ---feature not done yet
  // High user activity detected
  // MetaData: Activity summary
  HIGH_USER_ACTIVITY = "HIGH_USER_ACTIVITY",

  // ---feature not done yet
  // Low user engagement detected
  // MetaData: Engagement data
  LOW_ENGAGEMENT = "LOW_ENGAGEMENT",

  // Analytics report generated
  // MetaData: Report type, generated date
  ANALYTICS_REPORT = "ANALYTICS_REPORT",

  // ---feature not done yet
  // Broadcast message sent
  // MetaData: Message summary
  BROADCAST_SENT = "BROADCAST_SENT",

  // ---feature not done yet
  // Targeted notification sent
  // MetaData: Notification summary
  TARGETED_NOTIFICATION_SENT = "TARGETED_NOTIFICATION_SENT",

  // ---feature not done yet
  // User feedback received
  // MetaData: Feedback type, user details
  FEEDBACK_RECEIVED = "FEEDBACK_RECEIVED",
}
