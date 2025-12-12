import { UserProfile } from "@/types/seeker";
import { checkIsUnlocked } from "@/lib/actions/employer.actions";
import UnlockSeekerCard from "./UnlockSeekerCard";
import SeekerPublicResumeCard from "./SeekerPublicResumeCard";
import SeekerPublicContactInfo from "./SeekerPublicContactInfo";
import SeekerPublicSocial from "./SeekerPublicSocial";

const ProtectedSection = async ({
  user,
  companyId,
}: {
  user: UserProfile;
  companyId?: string | null;
}) => {
  if (!companyId) {
    return (
      <div className="rounded-base border border-gray-200 bg-white p-4 shadow-soft md:p-5">
        <div className="flex items-center justify-between">
          <h3 className="mb-2 text-xl font-semibold text-main">Contact Info</h3>
        </div>
        <p className="my-2 text-sm text-muted-foreground">
          this information is Private
        </p>
      </div>
    );
  }

  const { data } = await checkIsUnlocked(user.id, companyId);
  const isLocked = !data?.isUnlocked; // true means locked

  if (isLocked) {
    return <UnlockSeekerCard user={user} companyId={companyId} />;
  }

  return (
    <>
      <SeekerPublicResumeCard user={user} />
      <SeekerPublicContactInfo user={user} />
      <SeekerPublicSocial user={user} />
    </>
  );
};
export default ProtectedSection;
