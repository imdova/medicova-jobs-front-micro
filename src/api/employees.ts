// Admin Profiles
import { API_URL } from ".";
export const API_ADMIN_BASE = API_URL + "/api/v1.0.0/admin";

export const ADMIN_PROFILES = API_ADMIN_BASE + "/admin-profiles";
export const API_GET_ADMIN_PROFILES = ADMIN_PROFILES; // GET
export const API_UPDATE_ADMIN_PROFILE = ADMIN_PROFILES; // PATCH
export const API_GET_ADMIN_PROFILE_BY_ID = ADMIN_PROFILES + "/{id}"; // GET + [id]
export const API_GET_ASSIGNED_COMPANIES =
  ADMIN_PROFILES + "/{adminId}/companies?actorId="; // GET
export const API_GET_ASSIGNED_USERS = ADMIN_PROFILES + "/{adminId}/users?actorId="; // GET
export const API_ASSIGN_COMPANIES = ADMIN_PROFILES + "/assign/companies"; // POST
export const API_DEASSIGN_COMPANIES = ADMIN_PROFILES + "/deassign/companies"; // POST
export const API_ASSIGN_ACCOUNTS = ADMIN_PROFILES + "/assign/accounts"; // POST
export const API_DEASSIGN_ACCOUNTS = ADMIN_PROFILES + "/deassign/accounts"; // POST
