import { StartDateType } from "@/constants/enums/start-type.enum";

interface StartDateBadgeProps {
  startDateType: StartDateType | "" | null;
}

const getStartDateTypeConfig = (startDateType: StartDateType) => {
  switch (startDateType) {
    case StartDateType.IMMEDIATE:
      return {
        text: "Urgently hiring",
        badgeClasses: "bg-red-100/60 text-red-600",
        dotClasses: "bg-muted-foreground",
      };

    default:
      return {
        text: "Flexible start date",
        badgeClasses: "bg-primary/10 text-primary",
        dotClasses: "bg-primary",
      };
  }
};

const StartDateBadge: React.FC<StartDateBadgeProps> = ({ startDateType }) => {
  if (!startDateType) return null;
  const { text, badgeClasses, dotClasses } =
    getStartDateTypeConfig(startDateType);

  return (
    <div className="mr-2 mt-2 flex items-center gap-1">
      <span className={`h-[4px] w-[4px] rounded-full ${dotClasses}`}></span>
      <span className={`rounded-base px-2 py-1 text-xs ${badgeClasses}`}>
        {text}
      </span>
    </div>
  );
};

export default StartDateBadge;
