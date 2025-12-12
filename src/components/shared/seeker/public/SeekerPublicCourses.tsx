import { getCourses } from "@/lib/actions/users.actions";
import { CertificationData, UserProfile } from "@/types/seeker";
import Image from "next/image";
import { formatDate } from "@/util";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/Collapsible";

interface CoursesSectionProps {
  user: UserProfile;
}
const INITIAL_VISIBLE_ITEMS = 2;
const SeekerPublicCoursesSection = async ({ user }: CoursesSectionProps) => {
  const result = await getCourses(user.id);
  const courses = result.data || [];

  return (
    <div className="mt-5 rounded-base border border-gray-200 bg-white p-3 shadow-soft md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">
          Courses and Certificates
        </h3>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {courses.slice(0, INITIAL_VISIBLE_ITEMS).map((course, index) => (
          <CourseItem key={course.id} item={course} />
        ))}
        {INITIAL_VISIBLE_ITEMS < courses.length && (
          <Collapsible className="col-span-2">
            <CollapsibleContent className="CollapsibleContent">
              {courses.slice(INITIAL_VISIBLE_ITEMS).map((course, index) => (
                <CourseItem key={course.id} item={course} />
              ))}
            </CollapsibleContent>
            <CollapsibleTrigger className="group mt-2 w-full text-center text-sm text-muted-foreground hover:text-main">
              Show
              <span className="text-sm group-aria-expanded:hidden">
                {" "}
                {courses.length - INITIAL_VISIBLE_ITEMS} more{" "}
              </span>
              <span className="hidden text-sm group-aria-expanded:inline">
                {" "}
                less{" "}
              </span>
              Courses
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default SeekerPublicCoursesSection;

const CourseItem: React.FC<{ item: CertificationData }> = ({ item }) => {
  return (
    <div className="flex items-start gap-3 rounded-base border p-2">
      <Image
        src={"/images/certificate.svg"}
        alt="Experience"
        width={60}
        height={60}
        className="rounded-full"
      />
      <div className="flex-1">
        <h6 className="text-lg font-semibold text-main">{item.title}</h6>
        <p className="text-sm text-muted-foreground">{item.provider} </p>
        <p className="text-sm text-muted-foreground">{formatDate(item.issueDate)}</p>
        {item.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {" "}
            <strong className="text-sm text-main">Description:- </strong>{" "}
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};
