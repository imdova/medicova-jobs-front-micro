import { FlagOutlined, LocationOn, Verified } from "@mui/icons-material";
import Avatar from "@/components/UI/Avatar";
import {
  calculateAge,
  getExperienceDetail,
  getOptionLabel,
} from "@/util/general";
import { formatName } from "@/util";
import { nationalitiesOptions } from "@/constants";
import { UserProfile } from "@/types/seeker";

const SeekerPublicHeader: React.FC<{
  user: UserProfile;
}> = ({ user }) => {
  const age = user.birthDate ? calculateAge(new Date(user.birthDate)) : "";
  const nationality = getOptionLabel(nationalitiesOptions, user.nationality);
  const title = getExperienceDetail(user.title || "");
  return (
    <div className="overflow-hidden rounded-[12px] bg-[url('/images/search-background.jpg')] bg-cover bg-center">
      <div className="flex h-fit min-h-[160px] w-full flex-col items-center gap-8 bg-gradient-to-b from-secondary/80 to-primary/70 p-5 shadow-soft lg:flex-row">
        <Avatar
          src={user.avatar}
          alt={user.firstName + " " + user.lastName + " user image"}
          size={96}
          className="border-4 border-white shadow-soft"
        />
        <div className="flex w-full">
          <div className="mr-5 flex-1">
            <h5 className="text-xl font-bold text-white">
              {formatName(user, true)}
              {/* {user.isPublic && (
                <Verified color="primary" className="ml-1 h-6 w-6" />
              )} */}
            </h5>
            <p className="text-sm text-white">{title}</p>
            <div>
              <p className="text-sm text-gray-100">
                {age ? `${age} years old` : ""}{" "}
                {nationality ? `- ${nationality}` : ""}{" "}
                {user.maritalStatus ? `- ${user.maritalStatus}` : ""}{" "}
                {user.speciality ? `- ${user.speciality}` : ""}{" "}
                {/* TODO: Years of experience {user.careerLevel ? `- Ex ${user.careerLevel} years` : ""}{" "} */}
              </p>
              {(user.country?.name || user.state?.name || user.city) && (
                <div className="mr-3 flex items-center gap-1">
                  <LocationOn className="text-gray-100" />
                  <p className="text-sm text-gray-100">
                    {(user.country?.name || "") +
                      (user.state?.name ? `, ${user.state.name}` : "") +
                      (user.city ? `, ${user.city}` : "")}
                  </p>
                </div>
              )}
              {user.isPublic && (
                <p className="font-medium text-white">
                  <FlagOutlined className="mr-1 font-medium text-white" />
                  Open For Opportunities
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerPublicHeader;
