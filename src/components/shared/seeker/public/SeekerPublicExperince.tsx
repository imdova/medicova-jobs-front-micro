import { getExperience } from "@/lib/actions/users.actions";
import experiencesImage from "@/components/icons/briefcase.png";
import { ExperienceData, UserProfile } from "@/types/seeker";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/Collapsible";
import { formatLocation } from "@/util/general";
import { formatDate, getDuration } from "@/util";
import Image from "next/image";
import { LocationOnOutlined } from "@mui/icons-material";

interface ExperienceSectionProps {
  user: UserProfile;
}
const INITIAL_VISIBLE_ITEMS = 2;
const SeekerPublicExperiences = async ({ user }: ExperienceSectionProps) => {
  const result = await getExperience(user.id);
  const experiences = result.data || [];
  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">Experience</h3>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        {experiences
          .slice(0, INITIAL_VISIBLE_ITEMS)
          .map((experience, index) => (
            <ExperienceItem
              key={experience.id}
              item={experience}
              index={index}
              length={experiences.length}
            />
          ))}
        {INITIAL_VISIBLE_ITEMS < experiences.length && (
          <Collapsible className="col-span-2">
            <CollapsibleContent className="CollapsibleContent">
              {experiences
                .slice(INITIAL_VISIBLE_ITEMS)
                .map((experience, index) => (
                  <ExperienceItem
                    key={experience.id}
                    item={experience}
                    index={index}
                    length={experiences.length}
                  />
                ))}
            </CollapsibleContent>
            <CollapsibleTrigger className="group mt-2 w-full text-center text-sm text-muted-foreground hover:text-main">
              Show
              <span className="text-sm group-aria-expanded:hidden">
                {" "}
                {experiences.length - INITIAL_VISIBLE_ITEMS} more{" "}
              </span>
              <span className="hidden text-sm group-aria-expanded:inline">
                {" "}
                less{" "}
              </span>
              experiences
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default SeekerPublicExperiences;

const ExperienceItem: React.FC<{
  item: ExperienceData;
  index: number;
  length: number;
}> = ({ item, index, length }) => {
  const isLastItem = index === length - 1;
  const isOddLength = length % 2 !== 0;
  const spanTwoCols = isOddLength && isLastItem;

  const location = formatLocation(item);
  const duration = getDuration({
    startDate: item.startDate,
    endDate: item.isPresent ? undefined : item.endDate,
  });
  return (
    <div
      className={`${spanTwoCols ? "col-span-2" : "col-span-1"} flex items-start gap-3 rounded-base border border-gray-200 p-2`}
    >
      <Image src={experiencesImage} alt="Experience" width={60} height={60} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold leading-tight text-main">{item.name}</h6>
        </div>
        <p className="text-sm text-muted-foreground">{item.title}</p>
        <p className="text-sm text-muted-foreground">
          {formatDate(item.startDate, { year: true, month: true, day: false })}{" "}
          -{" "}
          {item.isPresent
            ? "Now"
            : formatDate(item.endDate, {
                year: true,
                month: true,
                day: false,
              })}{" "}
          {duration}
        </p>
        <div className="flex text-sm text-muted-foreground">
          <LocationOnOutlined className="-ml-1 text-base" />
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
  );
};
