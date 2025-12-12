import { API_URL } from ".";

export const API_ADMIN_BASE = API_URL + "/api/v1.0.0/admin";
export const API_ADMIN_SYS_CONFIGURATIONS =
  API_ADMIN_BASE + "/sys-configurations";
export const API_ADMIN_SOCKET = API_URL + "/admins-socket";

// Admin Departments
export const ADMIN_DEPARTMENTS = API_ADMIN_SYS_CONFIGURATIONS + "/admin-department";
export const API_CREATE_ADMIN_DEPARTMENT = ADMIN_DEPARTMENTS; // POST
export const API_GET_ADMIN_DEPARTMENTS = ADMIN_DEPARTMENTS; // GET
export const API_GET_ADMIN_DEPARTMENT_BY_ID = ADMIN_DEPARTMENTS + "/"; // GET + [id]
export const API_UPDATE_ADMIN_DEPARTMENT = ADMIN_DEPARTMENTS; // PATCH
export const API_DELETE_ADMIN_DEPARTMENT = ADMIN_DEPARTMENTS + "?id="; // DELETE

// Company Sectors
export const COMPANY_SECTORS = API_ADMIN_SYS_CONFIGURATIONS + "/company-sector";
export const API_CREATE_COMPANY_SECTOR = COMPANY_SECTORS; // POST
export const API_GET_COMPANY_SECTORS = COMPANY_SECTORS; // GET
export const API_GET_COMPANY_SECTOR_BY_ID = COMPANY_SECTORS + "/"; // GET + [id]
export const API_UPDATE_COMPANY_SECTOR = COMPANY_SECTORS; // PATCH
export const API_DELETE_COMPANY_SECTOR = COMPANY_SECTORS + "?id="; // DELETE

// Company Types
export const COMPANY_TYPES = API_ADMIN_SYS_CONFIGURATIONS + "/company-type";
export const API_CREATE_COMPANY_TYPE = COMPANY_TYPES; // POST
export const API_GET_COMPANY_TYPES = COMPANY_TYPES + "?limit=200"; // GET
export const API_GET_COMPANY_TYPES_BY_SECTOR =
  COMPANY_TYPES + "/sector?limit=200&id="; // GET
export const API_GET_COMPANY_TYPE_BY_ID = COMPANY_TYPES + "/"; // GET + [id]
export const API_UPDATE_COMPANY_TYPE = COMPANY_TYPES; // PATCH
export const API_DELETE_COMPANY_TYPE = COMPANY_TYPES + "?id="; // DELETE

// Career Levels
export const CAREER_LEVELS = API_ADMIN_SYS_CONFIGURATIONS + "/career-level";
export const API_CREATE_CAREER_LEVEL = CAREER_LEVELS; // POST
export const API_GET_CAREER_LEVELS = CAREER_LEVELS + "?limit=200"; // GET
export const API_GET_CAREER_LEVELS_BY_CATEGORY = CAREER_LEVELS + "/categories"; // GET + ?ids=ID&ids=ID
export const API_GET_CAREER_LEVEL_BY_ID = CAREER_LEVELS + "/"; // GET + [id]
export const API_UPDATE_CAREER_LEVEL = CAREER_LEVELS; // PATCH
export const API_DELETE_CAREER_LEVEL = CAREER_LEVELS + "?id="; // DELETE

// Categories
export const CATEGORIES = API_ADMIN_SYS_CONFIGURATIONS + "/category";
export const API_CREATE_CATEGORY = CATEGORIES; // POST
export const API_GET_CATEGORIES = CATEGORIES + "?limit=200"; // GET
export const API_GET_CATEGORY_BY_ID = CATEGORIES + "/"; // GET + [id]
export const API_UPDATE_CATEGORY = CATEGORIES; // PATCH
export const API_DELETE_CATEGORY = CATEGORIES + "?id="; // DELETE
export const API_GET_CATEGORIES_BY_INDUSTRY =
  CATEGORIES + "/industries?limit=200&ids="; // GET +

// Employment Typesid
export const EMPLOYMENT_TYPES =
  API_ADMIN_SYS_CONFIGURATIONS + "/employment-type";
export const API_CREATE_EMPLOYMENT_TYPE = EMPLOYMENT_TYPES; // POST
export const API_GET_EMPLOYMENT_TYPES = EMPLOYMENT_TYPES; // GET
export const API_GET_EMPLOYMENT_TYPE_BY_ID = EMPLOYMENT_TYPES + "/"; // GET + [id]
export const API_UPDATE_EMPLOYMENT_TYPE = EMPLOYMENT_TYPES; // PATCH
export const API_DELETE_EMPLOYMENT_TYPE = EMPLOYMENT_TYPES + "?id="; // DELETE

// Industries
export const INDUSTRIES = API_ADMIN_SYS_CONFIGURATIONS + "/industry";
export const API_CREATE_INDUSTRY = INDUSTRIES; // POST
export const API_GET_INDUSTRIES = INDUSTRIES; // GET
export const API_GET_INDUSTRY_BY_ID = INDUSTRIES + "/"; // GET + [id]
export const API_UPDATE_INDUSTRY = INDUSTRIES; // PATCH
export const API_DELETE_INDUSTRY = INDUSTRIES + "?id="; // DELETE
export const API_GET_INDUSTRIES_BY_IDS = INDUSTRIES + "/ids"; // GET

// Specialities
export const SPECIALITIES = API_ADMIN_SYS_CONFIGURATIONS + "/speciality";
export const API_CREATE_SPECIALITY = SPECIALITIES; // POST
export const API_GET_SPECIALITIES = SPECIALITIES + "?limit=200"; // GET
export const API_GET_SPECIALITIES_BY_CATEGORY =
  SPECIALITIES + "/category?limit=200&id="; // GET + id
export const API_GET_SPECIALITY_BY_ID = SPECIALITIES + "/"; // GET + [id]
export const API_UPDATE_SPECIALITY = SPECIALITIES; // PATCH
export const API_DELETE_SPECIALITY = SPECIALITIES + "?id="; // DELETE

// Admin Notifications
export const ADMIN_NOTIFICATIONS = API_ADMIN_BASE + "/notifications";
export const API_GET_ADMIN_NOTIFICATIONS = ADMIN_NOTIFICATIONS; // GET - Get paginated/filtered notifications for an admin
export const API_DELETE_ADMIN_NOTIFICATIONS = ADMIN_NOTIFICATIONS; // DELETE - Delete notifications by their IDs
export const API_MARK_ADMIN_NOTIFICATIONS_READ =
  ADMIN_NOTIFICATIONS + "/mark-read"; // PATCH - Mark notifications as read by their IDs "ids": []
export const API_MARK_ADMIN_NOTIFICATIONS_UNREAD =
  ADMIN_NOTIFICATIONS + "/mark-unread"; // PATCH - Mark notifications as unread by their IDs
export const API_MARK_ALL_ADMIN_NOTIFICATIONS_READ = ADMIN_NOTIFICATIONS + "/"; // PATCH + {id}/mark-all-read - Mark all notifications as read for an admin
export const API_MARK_ALL_ADMIN_NOTIFICATIONS_UNREAD =
  ADMIN_NOTIFICATIONS + "/"; // PATCH + {id}/mark-all-unread - Mark all notifications as unread for an admin
export const API_DELETE_ALL_ADMIN_NOTIFICATIONS = ADMIN_NOTIFICATIONS + "/"; // DELETE + {id} - Delete all notifications for an admin
