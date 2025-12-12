import ExperienceSkeleton from "@/components/loading/skeleton-experince";
import SeekerPublicAbout from "./SeekerPublicAbout";
import { Suspense } from "react";
import ExperienceSection from "./SeekerPublicExperince";
import SeekerPublicHeader from "./SeekerPublicHeader";
import { getUser } from "@/lib/actions/users.actions";
import { notFound } from "next/navigation";
import SeekerPublicEducations from "./SeekerPublicEducations";
import SeekerPublicCoursesSection from "./SeekerPublicCourses";
import SeekerPublicSkillsSection from "./SeekerPublicSkills";
import SeekerPublicActivitiesSection from "./SeekerPublicActivities";
import ProtectedSection from "./ProtectedSection";
import SeekerPublicLanguages from "./SeekerPublicLanguages";

const SeekerPublicProfile = async ({
  userId,
  companyId,
}: {
  userId: string;
  companyId?: string | null;
}) => {
  const { success, data: user } = await getUser(userId);
  if (!success || !user) return notFound();
  return (
    <div className="w-full px-4 md:px-5">
      <div className="flex gap-5">
        {/* Left + Center Sections */}
        <div className="flex-1 space-y-2">
          <SeekerPublicHeader user={user} />
          <SeekerPublicAbout user={user} />
          <Suspense fallback={<ExperienceSkeleton />}>
            <ExperienceSection user={user} />
          </Suspense>
          <Suspense fallback={null}>
            <SeekerPublicEducations user={user} />
          </Suspense>
          <Suspense fallback={null}>
            <SeekerPublicCoursesSection user={user} />
          </Suspense>
          <Suspense fallback={null}>
            <SeekerPublicSkillsSection user={user} />
          </Suspense>
          <Suspense fallback={null}>
            <SeekerPublicActivitiesSection user={user} />
          </Suspense>
        </div>
        {/* Right Sections */}
        <div className="hidden min-w-80 max-w-80 space-y-2 md:block">
          <ProtectedSection user={user} companyId={companyId} />
          <SeekerPublicLanguages user={user} />
        </div>
      </div>
    </div>
  );
};

export default SeekerPublicProfile;
