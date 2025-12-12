import { Divider } from "@mui/material";
import { Email, PhoneIphone } from "@mui/icons-material";
import { UserProfile } from "@/types/seeker";

const SeekerPublicContactInfo = async ({ user }: { user: UserProfile }) => {
  return (
    <div className="rounded-base border border-gray-200 bg-white p-4 shadow-soft md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-xl font-semibold text-main">Contact Info</h3>
      </div>
      <div>
        {user.email && (
          <p className="my-2 text-muted-foreground">
            <Email className="mr-2 inline-block" color="primary" />
            <span className="font-semibold text-main">Email :</span>{" "}
            {user.email}
          </p>
        )}
        {user.phone && (
          <>
            <Divider sx={{ marginY: 1 }} />
            <p className="my-2 text-muted-foreground">
              <PhoneIphone className="mr-2 inline-block" color="primary" />
              <span className="font-semibold text-main">Phone :</span>
              {user.phone}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
export default SeekerPublicContactInfo;
