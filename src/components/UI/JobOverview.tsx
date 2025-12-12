import { Gender } from "@/constants/enums/gender.enum";
import {
  educationOptions,
  genderOptions,
  jobWorkPlaceOptions,
} from "@/constants/job";
import { JobData } from "@/types";
import { formatLocation } from "@/util/general";
import {
  AccessTimeOutlined,
  AccountBalanceWalletOutlined,
  FemaleOutlined,
  FmdGoodOutlined,
  LocalHospital,
  MaleOutlined,
  PaidOutlined,
  PersonOutlineOutlined,
  SchoolOutlined,
  StarsOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";

const JobOverview: React.FC<{ className: string; data: JobData }> = ({
  className,
  data,
}) => {
  const workPlace =
    jobWorkPlaceOptions.find((x) => x.id === data.jobWorkPlace)?.label || "";
  const gender = genderOptions.find((x) => x.id === data.gender)?.label || "";
  const education =
    educationOptions.find((x) => x.id === data.educationLevel)?.label || "";

  const location = formatLocation(data);

  return (
    <div className={className}>
      <h4 className="mb-4 text-lg font-semibold text-main">Job Overview</h4>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <PersonOutlineOutlined fontSize="medium" className="text-primary" />
          <div className="flex flex-col">
            <h5 className="font-semibold text-main"> Career Level </h5>
            <p className="text-muted-foreground"> {data.jobCareerLevel} </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AccessTimeOutlined fontSize="medium" className="text-primary" />
          <div className="flex flex-col">
            <h5 className="font-semibold text-main"> Job Type </h5>
            <p className="text-muted-foreground">
              {data.jobEmploymentType ? data.jobEmploymentType : ""}{" "}
              {workPlace ? `| ${workPlace}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <WorkOutlineOutlined fontSize="medium" className="text-primary" />
          <div className="flex flex-col">
            <h5 className="font-semibold text-main"> Category </h5>
            <p className="text-muted-foreground"> {data.jobCategory} </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LocalHospital fontSize="medium" className="text-primary" />
          <div className="flex flex-col">
            <h5 className="font-semibold text-main"> Speciality </h5>
            <p className="text-muted-foreground"> {data.jobSpeciality} </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StarsOutlined fontSize="medium" className="text-primary" />
          <div className="flex flex-col">
            <h5 className="font-semibold text-main"> Experience </h5>
            <p className="text-muted-foreground">
              {data.minExpYears === 0 && data.maxExpYears
                ? `(0 - ${data.maxExpYears}) years`
                : data.minExpYears && data.maxExpYears
                  ? `(${data.minExpYears} - ${data.maxExpYears}) years`
                  : data.minExpYears
                    ? `(${data.minExpYears}+) years`
                    : data.maxExpYears
                      ? `(${data.maxExpYears}-) years`
                      : null}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {data.gender === Gender.MALE ? (
            <MaleOutlined fontSize="medium" className="text-primary" />
          ) : (
            <FemaleOutlined fontSize="medium" className="text-primary" />
          )}
          <div className="flex flex-col">
            <h5 className="font-semibold text-main"> Gender </h5>
            <p className="text-muted-foreground"> {gender} </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SchoolOutlined fontSize="medium" className="text-primary" />
          <div className="flex flex-col">
            <h5 className="font-semibold text-main"> Degree </h5>
            <p className="text-muted-foreground"> {education} </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AccountBalanceWalletOutlined
            fontSize="medium"
            className="text-primary"
          />
          <div className="flex flex-col">
            <h5 className="font-semibold text-main"> Required Age </h5>
            <p className="text-muted-foreground">
              {" "}
              ({data.minAge}-{data.maxAge}) Years{" "}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PaidOutlined fontSize="medium" className="text-primary" />
          <div className="flex flex-col">
            <h5 className="font-semibold text-main"> Offered Salary </h5>
            <p className="text-muted-foreground">
              {" "}
              ${data.salaryRangeStart}-${data.salaryRangeEnd}{" "}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FmdGoodOutlined fontSize="medium" className="text-primary" />
          <div className="flex flex-col">
            <h5 className="font-semibold text-main"> Location </h5>
            <p className="text-muted-foreground">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOverview;
