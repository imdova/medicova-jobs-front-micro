import SettingsNavigation from "@/components/UI/SettingsNavigation";
import { Option } from "@/types";

const tabs: Option[] = [
  { label: "Login Details", value: "/job-seeker/setting" },
  { label: "Notifications", value: "/job-seeker/setting/notifications" },
];

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full space-y-2 px-4 md:px-5">
      <SettingsNavigation tabs={tabs} />
      {/* Tab Panels */}
      {children}
    </div>
  );
};

export default layout;
