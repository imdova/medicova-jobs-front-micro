"use client";
import { Button } from "@mui/material";
import { KeyOutlined } from "@mui/icons-material";
import useUpdateApi from "@/hooks/useUpdateApi";
import { UNLOCKED_SEEKERS } from "@/api/employer";
import { TAGS } from "@/api";
import { UserProfile } from "@/types/seeker";

const UnlockSeekerCard: React.FC<{
  user: UserProfile;
  companyId: string;
}> = ({ user, companyId }) => {
  const { isLoading, update } = useUpdateApi();

  const unlockHandler = () => {
    update(
      UNLOCKED_SEEKERS,
      { method: "POST", body: { companyId, seekerId: user.id } },
      TAGS.applicants,
      {
        error: {
          title: "Error",
          description: "Something went wrong",
        },
        success: {
          title: "Success",
          description: "Seeker unlocked successfully",
        },
      },
    );
  };

  return (
    <div className="rounded-base border border-gray-200 bg-white p-4 shadow-soft md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-xl font-semibold text-main">Contact Info</h3>
      </div>
      <div>
        <p className="my-2 text-sm text-muted-foreground">
          you are unable to see my contact information you should unlock me to
          see my contact information{" "}
        </p>
        <Button
          startIcon={<KeyOutlined />}
          variant="outlined"
          className="text-nowrap"
          onClick={unlockHandler}
        >
          {isLoading ? "..loading" : "Unlock Now"}
        </Button>
      </div>
    </div>
  );
};
export default UnlockSeekerCard;
