import { UserProfile } from "@/types/seeker";
import { getSkills } from "@/lib/actions/users.actions";

interface SkillsSectionProps {
  user: UserProfile;
}
const SeekerPublicSkillsSection = async ({ user }: SkillsSectionProps) => {
  const result = await getSkills(user.id);
  const skills = result.data || [];
  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <h3 className="text-xl font-semibold text-main">Skills</h3>
      </div>

      {/* Display Keywords */}
      <div className="mt-2 flex flex-wrap">
        {skills.map((item) => (
          <div
            key={item.id + item.name}
            className="mb-2 mr-2 rounded-full border bg-primary/10 px-4 py-2 text-main"
          >
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeekerPublicSkillsSection;
