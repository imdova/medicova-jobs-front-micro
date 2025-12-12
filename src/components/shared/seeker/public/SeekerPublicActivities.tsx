import Image from "next/image";
import education from "@/components/icons/education.png";
import { getActivity } from "@/lib/actions/users.actions";
import { ActivityData, UserProfile } from "@/types/seeker";
import { formatDate } from "@/util";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/Collapsible";

interface ActivitySectionProps {
  user: UserProfile;
}
const INITIAL_VISIBLE_ITEMS = 2;

const SeekerPublicActivitiesSection = async ({
  user,
}: ActivitySectionProps) => {
  const result = await getActivity(user.id);
  const activities = result.data || [];

  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">
          Activity & Achievements
        </h3>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2">
        {activities.slice(0, INITIAL_VISIBLE_ITEMS).map((activity, index) => (
          <ActivityItem key={activity.id} item={activity} />
        ))}
        {INITIAL_VISIBLE_ITEMS < activities.length && (
          <Collapsible className="col-span-2">
            <CollapsibleContent className="CollapsibleContent">
              {activities
                .slice(INITIAL_VISIBLE_ITEMS)
                .map((activity, index) => (
                  <ActivityItem key={activity.id} item={activity} />
                ))}
            </CollapsibleContent>
            <CollapsibleTrigger className="group mt-2 w-full text-center text-sm text-muted-foreground hover:text-main">
              Show
              <span className="text-sm group-aria-expanded:hidden">
                {" "}
                {activities.length - INITIAL_VISIBLE_ITEMS} more{" "}
              </span>
              <span className="hidden text-sm group-aria-expanded:inline">
                {" "}
                less{" "}
              </span>
              Activities
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default SeekerPublicActivitiesSection;

const ActivityItem: React.FC<{ item: ActivityData }> = ({ item }) => {
  return (
    <div className="flex items-start gap-3 rounded-base border p-2">
      <Image
        src={education}
        alt="Experience"
        width={70}
        height={70}
        className=""
      />
      <div className="flex-1">
        <h6 className="text-lg font-semibold text-main">{item.title}</h6>
        <p className="text-sm text-muted-foreground">{item.provider}</p>
        <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
      </div>
    </div>
  );
};
