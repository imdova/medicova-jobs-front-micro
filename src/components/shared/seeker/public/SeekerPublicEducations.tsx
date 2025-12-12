import Image from "next/image";
import { getEducations } from "@/lib/actions/users.actions";
import education from "@/components/icons/education.png";
import { EducationData, UserProfile } from "@/types/seeker";
import { formatLocation } from "@/util/general";
import { educationOptions } from "@/constants/job";
import { LocationOnOutlined } from "@mui/icons-material";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/Collapsible";

interface EducationsSectionProps {
  user: UserProfile;
}
const INITIAL_VISIBLE_ITEMS = 2;

const SeekerPublicEducations = async ({ user }: EducationsSectionProps) => {
  const result = await getEducations(user.id);

  if (!(result.success && result.data && result.data.length > 0)) {
    return null;
  }
  const educations = result.data || [];

  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">Educations</h3>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {educations.slice(0, INITIAL_VISIBLE_ITEMS).map((education, index) => (
          <EducationItem key={education.id} item={education} />
        ))}
        {INITIAL_VISIBLE_ITEMS < educations.length && (
          <Collapsible className="col-span-2">
            <CollapsibleContent className="CollapsibleContent">
              {educations
                .slice(INITIAL_VISIBLE_ITEMS)
                .map((education, index) => (
                  <EducationItem key={education.id} item={education} />
                ))}
            </CollapsibleContent>
            <CollapsibleTrigger className="group mt-2 w-full text-center text-sm text-muted-foreground hover:text-main">
              Show
              <span className="text-sm group-aria-expanded:hidden">
                {" "}
                {educations.length - INITIAL_VISIBLE_ITEMS} more{" "}
              </span>
              <span className="hidden text-sm group-aria-expanded:inline">
                {" "}
                less{" "}
              </span>
              educations
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default SeekerPublicEducations;

const EducationItem: React.FC<{ item: EducationData }> = ({ item }) => {
  const duration = item.endYear - item.startYear;
  const location = formatLocation(item);
  const degree =
    educationOptions.find((x) => x.id === item.degree)?.label || "";
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
        <h6 className="text-lg font-semibold text-main">{item.inistitute}</h6>
        <p className="text-sm text-muted-foreground">
          {degree} in {item.program} - {item.grade}
        </p>
        <p className="text-sm text-muted-foreground">
          {item.startYear} -{item.endYear}{" "}
          {duration > 0 ? `(${duration} y)` : null}
        </p>
        <div className="flex text-sm text-muted-foreground">
          <LocationOnOutlined className="-ml-1 text-base" />
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
  );
};
