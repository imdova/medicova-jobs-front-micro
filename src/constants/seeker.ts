import { Option } from "@/types";
import { ProfileTabs } from "@/types/seeker";


export const tabs: Option<Record<ProfileTabs, string>>[] = [
  { label: "Personal Info", value: "personal-info" },
  { label: "Professional Info", value: "professional" },
  { label: "Career preference", value: "career-preference" },
];
