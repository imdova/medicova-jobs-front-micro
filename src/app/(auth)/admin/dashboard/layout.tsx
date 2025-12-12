import SettingsNavigation from "@/components/UI/SettingsNavigation";
import { Option } from "@/types";
import { File, LayoutList } from "lucide-react";

const tabs: Option[] = [
  {
    label: "Over View",
    icon: <LayoutList className="h-5 w-5" />,
    value: "/admin/dashboard",
  },
  {
    label: "Reports",
    icon: <File className="h-5 w-5" />,
    value: "/admin/dashboard/reports",
  },
];

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full px-4 md:px-5 my-8">
      <SettingsNavigation tabs={tabs} />
      {/* Tab Panels */}
      {children}
    </div>
  );
};

export default layout;
