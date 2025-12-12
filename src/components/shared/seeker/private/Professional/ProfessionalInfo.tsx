import { UserProfile } from "@/types/seeker";
import SeekerAboutCard from "./AboutCard";
import SeekerExperienceCard from "./ExperienceCard";
import SeekerEducationCard from "./EducationCard";
import SeekerCoursesCard from "./CoursesCard";
import SeekerSkillsCard from "./SkillsCard";
import SeekerActivitiesCard from "./ActivitiesCard";

const ProfessionalInfo: React.FC<{
  user: UserProfile;
}> = ({ user }) => (
  <>
    <SeekerAboutCard user={user} />
    <SeekerExperienceCard user={user} />
    <SeekerEducationCard user={user} />
    <SeekerCoursesCard user={user} />
    <SeekerSkillsCard user={user} />
    <SeekerActivitiesCard user={user} />
  </>
);

export default ProfessionalInfo;
