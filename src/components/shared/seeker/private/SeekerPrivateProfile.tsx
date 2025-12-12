"use client";
import { useState } from "react";
import Loading from "@/components/loading/loading";
import { Tab, Tabs } from "@mui/material";
import { Option } from "@/types";
import { useUserData } from "@/hooks/useUserData";
import SeekerHeader from "./SeekerHeader";
import { ProfileInfoForm } from "./info/ProfileInfoForm";
import ProfessionalInfo from "./Professional/ProfessionalInfo";
import { ProfileTabs } from "@/types/seeker";
import SeekerCompetenceCard from "./rightSection/CompetenceCard";
import ProfileConfigQuickEditor from "./rightSection/ProfileConfigQuickEditor";
import SeekerResumeUploadCard from "./rightSection/ResumeUploadCard";
import SeekerContactInfoCard from "./rightSection/ContactInfoCard";
import SeekerSocialMediaCard from "./rightSection/SocialMediaCard";
import SeekerLanguageCard from "./rightSection/LanguageCard";
import CareerPreferenceTab from "./careerPreference/CareerPreferenceTab";

export const tabs: Option<Record<ProfileTabs, string>>[] = [
  { label: "Personal Info", value: "personal-info" },
  { label: "Professional Info", value: "professional" },
  { label: "Career preference", value: "career-preference" },
];

const SeekerPrivateProfile = () => {
  const { user, loading } = useUserData();
  const [activeTab, setActiveTab] = useState("personal-info");

  const onTabChange = (event: React.SyntheticEvent, tab: string) => {
    setActiveTab(tab);
  };

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <div className="w-full px-4 md:px-5">
      <div className="flex gap-5">
        <div className="flex-1 space-y-2">
          <SeekerHeader user={user} />
          <div className="body-container overflow-hidden rounded-base border border-gray-200 bg-white shadow-soft">
            <Tabs
              value={activeTab}
              onChange={onTabChange}
              variant="scrollable"
              scrollButtons={false}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  value={tab.value}
                  className="font-semibold normal-case"
                />
              ))}
            </Tabs>
          </div>
          {activeTab === "personal-info" && <ProfileInfoForm user={user} />}
          {activeTab === "professional" && <ProfessionalInfo user={user} />}
          {activeTab === "career-preference" && (
            <CareerPreferenceTab user={user} />
          )}
        </div>
        {/* Right Sections */}
        <div className="hidden min-w-80 max-w-80 space-y-2 md:block">
          {/* Public user Section */}

          <SeekerCompetenceCard percentage={user?.completeness || 0} />
          {/* Public user Section */}
          <ProfileConfigQuickEditor user={user} />

          {/* Resume Section */}
          <SeekerResumeUploadCard user={user} />
          {/* Contact Info Section */}
          <SeekerContactInfoCard user={user} />
          {/* Socialmedia Section */}
          <SeekerSocialMediaCard user={user} />
          {/* Language Section */}
          <SeekerLanguageCard user={user} />
        </div>
      </div>
    </div>
  );
};

export default SeekerPrivateProfile;
