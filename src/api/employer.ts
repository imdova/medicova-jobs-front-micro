import { API_URL } from ".";

export const API_EMPLOYER_BASE = API_URL + "/api/v1.0.0/employer";
export const API_EMPLOYERS_SOCKET = API_URL + "/employer-socket";

// Companies
export const COMPANIES = API_EMPLOYER_BASE + "/companies";

export const API_REQUEST_PHONE_CHANGE_COMPANY = COMPANIES + "/request-phone-change"; // POST id , phone
export const API_PHONE_CHANGE_COMPANY = COMPANIES + "/phone-change"; // POST id , otp
export const API_REQUEST_MAIL_CHANGE_COMPANY = COMPANIES + "/request-mail-change"; // POST id, newMail
export const API_MAIL_CHANGE_COMPANY = COMPANIES + "/mail-change"; // POST newMail, token

export const API_GET_COMPANIES = COMPANIES; // GET
export const API_SEARCH_COMPANIES = COMPANIES + "/search"; //GET ?q=Grand%20&companyTypeId=314a19ed-9ed1-4a1c-8f61-1c557352b8b1&countryCode=EG
export const API_GET_COMPANY_BY_USER_NAME = COMPANIES + "/username/"; // GET
export const API_GET_COMPANY_BY_ID = COMPANIES + "/"; // GET + [companyID]

export const API_UPDATE_COMPANY_USER_NAME = COMPANIES + "/username"; // PATCH change the user name of thee company
export const API_UPDATE_COMPANY = COMPANIES + "/"; // PATCH + [companyID] , change the data of the company

// Jobs
export const JOBS = API_EMPLOYER_BASE + "/jobs";
export const API_CREATE_JOB = JOBS; // POST
export const API_GET_JOBS = JOBS; // GET
export const API_SEARCH_JOBS = JOBS + "/search"; // GET ?q=ahmed&categoryId=9669773b-f883-4946-95ed-9da81caf6e0b&countryCode=EG
export const API_FILTER_SEARCH_JOBS = JOBS + "/filters"; // GET ?q=ahmed&categoryId=9669773b-f883-4946-95ed-9da81caf6e0b&countryCode=EG
export const API_GET_JOB_BY_ID = JOBS + "/"; // GET + [jobID]
export const API_GET_JOBS_BY_COMPANY_ID = JOBS + "/company/"; // GET + [companyID]
export const API_UPDATE_JOB = JOBS  // PATCH make sure id is in the body
export const API_DELETE_JOB = JOBS + "/"; // DELETE + [jobID]

// Job Applications
export const JOB_APPLICATIONS = API_EMPLOYER_BASE + "/applications";
export const API_CREATE_JOB_APPLICATION = JOB_APPLICATIONS; // POST
export const API_UPDATE_JOB_APPLICATION = JOB_APPLICATIONS; // PATCH + [jobApplicationID]
export const API_DELETE_JOB_APPLICATION = JOB_APPLICATIONS + "/"; // DELETE + id
export const API_GET_JOB_APPLICATIONS = JOB_APPLICATIONS; // GET ?page=1&limit=10&jobId={id}&seekerId={id}&companyId={id}&startDate={date}
export const API_GET_JOB_APPLICATION_BY_ID = JOB_APPLICATIONS + "/"; // GET + [jobApplicationID]
export const API_GET_JOB_APPLICATION_STATUS_COUNT_FOR_SEEKER =
  JOB_APPLICATIONS + "/seeker/"; // GET + [seekerID] + "/status-count"

// unlocked lists
export const UNLOCKED_SEEKERS = API_EMPLOYER_BASE + "/unlocked-seekers";
export const API_UNLOCK_SEEKER = UNLOCKED_SEEKERS; // POST "{companyId , seekerId}"
export const API_GET_UNLOCKED_SEEKERS = UNLOCKED_SEEKERS; // GET ?id={id}
export const API_CHECK_UNLOCKED_SEEKER = UNLOCKED_SEEKERS + "/company/"; // GET + {companyId}/seeker/{seekerId}
export const API_DELETE_UNLOCKED_SEEKER = UNLOCKED_SEEKERS + "/company/"; // DELETE + {companyId}/seeker/{seekerId}


// Employees
export const EMPLOYEES = API_EMPLOYER_BASE + "/employees";
export const API_GET_COMPANY_EMPLOYEES = EMPLOYEES + "/company/"; // GET + [companyId]
export const API_UPDATE_EMPLOYEE = EMPLOYEES; // PATCH



// Employer Notifications
export const EMPLOYER_NOTIFICATIONS = API_EMPLOYER_BASE + "/notifications";
export const API_GET_EMPLOYER_NOTIFICATIONS = EMPLOYER_NOTIFICATIONS; // GET - Get paginated/filtered notifications for an employer
export const API_DELETE_EMPLOYER_NOTIFICATIONS = EMPLOYER_NOTIFICATIONS; // DELETE - Delete notifications by their IDs
export const API_MARK_EMPLOYER_NOTIFICATIONS_READ =
  EMPLOYER_NOTIFICATIONS + "/mark-read"; // PATCH - Mark notifications as read by their IDs "ids": []
export const API_MARK_EMPLOYER_NOTIFICATIONS_UNREAD =
  EMPLOYER_NOTIFICATIONS + "/mark-unread"; // PATCH - Mark notifications as unread by their IDs
export const API_MARK_ALL_EMPLOYER_NOTIFICATIONS_READ =
  EMPLOYER_NOTIFICATIONS + "/"; // PATCH + {id}/mark-all-read - Mark all notifications as read for an employer
export const API_MARK_ALL_EMPLOYER_NOTIFICATIONS_UNREAD =
  EMPLOYER_NOTIFICATIONS + "/"; // PATCH + {id}/mark-all-unread - Mark all notifications as unread for an employer
export const API_DELETE_ALL_EMPLOYER_NOTIFICATIONS = EMPLOYER_NOTIFICATIONS + "/"; // DELETE + {id} - Delete all notifications for an employer
