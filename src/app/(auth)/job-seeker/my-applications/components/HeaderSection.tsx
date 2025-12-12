import TimeRangePicker from "@/components/UI/TimeRangePicker.tsx";
import { CalendarToday } from "@mui/icons-material";


const HeaderSection = () => (
  <div>
    <h5 className="mb-2 text-2xl font-semibold text-main">Keep it up, Jake</h5>

    <div className="flex items-center justify-between">
      <div>
        <CalendarToday className="mr-2 inline h-4 w-4 text-muted-foreground" />
        <p className="inline text-muted-foreground">
          Here is job applications status from
        </p>
      </div>
      <div className="flex gap-8">
        <TimeRangePicker />
      </div>
    </div>
  </div>
);

export default HeaderSection;
