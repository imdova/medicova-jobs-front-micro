import SettingsNavigation from "@/components/UI/SettingsNavigation";
import { Option } from "@/types";

const tabs: Option[] = [
  { label: "Content", value: "/admin/site-settings/content" },
  { label: "Branding", value: "/admin/site-settings/branding" },
  {
    label: "SEO",
    value: "/admin/site-settings/seo",
    pattern: "/admin/site-settings/seo/*",
  },
  { label: "snippets", value: "/admin/site-settings/snippets" },
  { label: "tools", value: "/admin/site-settings/tools" },
];

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full space-y-2 px-4 md:px-5 my-8">
      <SettingsNavigation tabs={tabs} />
      {/* Tab Panels */}
      {children}
    </div>
  );
};

export default layout;
