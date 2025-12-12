"use client";
import { IconButton, Divider } from "@mui/material";
import { Edit, Email, PhoneIphone } from "@mui/icons-material";
import { UserProfile } from "@/types/seeker";
import Link from "next/link";

const SeekerContactInfoCard: React.FC<{
  user: UserProfile;
}> = ({ user }) => {
  return (
    <div className="rounded-base border border-gray-200 bg-white p-4 shadow-soft md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-xl font-semibold text-main">Contact Info</h3>
        <IconButton
          component={Link}
          href="/job-seeker/setting"
          className="rounded border border-solid border-gray-200 p-2"
        >
          <Edit className="h-5 w-5" />
        </IconButton>
      </div>

      {/* Email Section */}
      <div>
        {user.email && (
          <p className="my-2 text-muted-foreground">
            <Email className="mr-2 inline-block" color="primary" />
            <span className="font-semibold text-main">Email :</span>{" "}
            {user.email}
          </p>
        )}
        {/* Phone Section */}
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
export default SeekerContactInfoCard;
