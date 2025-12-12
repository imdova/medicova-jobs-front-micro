import { Company } from "@/types";
import { AdminProfile, EmployeeProfile, UserResponse } from "@/types/next-auth";
import { UserProfile } from "@/types/seeker";
import { User } from "next-auth";

export const getFileNameFromUrl = (url?: string | null): string => {
  if (!url) return "";
  const urlSplit = url.split("/");
  return urlSplit[urlSplit.length - 1];
};
export function getSeekerProfile(user?: UserResponse): UserProfile | null {
  if (!user) return null;
  return user.type === "seeker" ? (user.profile as UserProfile) : null;
}
export function getEmployerProfile(
  user?: UserResponse | null,
): EmployeeProfile | null {
  if (!user) return null;
  return user.type === "employer" ? (user.profile as EmployeeProfile) : null;
}
export function getAdminProfile(user?: UserResponse): AdminProfile | null {
  if (!user) return null;
  return user.type === "admin" ? (user.profile as AdminProfile) : null;
}

export function getUserSharedData(user: User, company?: Company | null) {
  let userName = "";
  let image = "";
  let name = "";
  let profileUrl = "";
  let email = "";
  switch (user.type) {
    case "seeker":
      userName = user.userName || "";
      image = user.image || "";
      name = user.firstName ?? "";
      email = user.email ?? "";
      profileUrl = `/me/${user.userName}`;
      break;
    case "employer":
      userName = company?.username || "";
      image = company?.avatar || "";
      name = company?.name || "";
      email = company?.email || "";
      profileUrl = `/co/${company?.username}`;
      break;
    case "admin":
      userName = "Admin";
      image = user?.image || "";
      name = user?.firstName ?? "";
      email = user?.email ?? "";
      profileUrl = `/admin/dashboard`;
      break;
    default:
      break;
  }

  return { userName, image, name, profileUrl, email };
}

export function checkOwnerOrAuthorized(
  user: User | null,
  profile: UserProfile,
  isPublic = false,
): boolean {
  if (isPublic) return false; // Public mode disables owner privileges
  if (!user) return false; // Must be logged in
  const isOwner = profile.id === user?.id;
  const isAuthorized = user.type === "admin"; // Add more roles if needed
  return isOwner || isAuthorized;
}

export function areMainFieldsEqual<T extends object>(
  mainObj: T,
  fullObj: Partial<T> & Record<string, any>,
): boolean {
  return Object.keys(mainObj).every((key) => {
    return (
      fullObj.hasOwnProperty(key) &&
      mainObj[key as keyof T] === fullObj[key as keyof T]
    );
  });
}

export function UserProfileToUser(user: Partial<UserProfile>): Partial<User> {
  const prevUser: Partial<User> = {
    email: user.email,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.avatar,
  };
  return prevUser;
}
