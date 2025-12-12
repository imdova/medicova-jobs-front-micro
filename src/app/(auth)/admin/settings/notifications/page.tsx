"use client";
import { API_GET_SEEKER_BY_ID } from "@/api/seeker";
import useFetch from "@/hooks/useFetch";
import useUpdateApi from "@/hooks/useUpdateApi";
import { NotificationSettings, UserProfile } from "@/types/seeker";
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { notFound } from "next/navigation";

const NotificationsSettingsForm: React.FC<{
  defaultValues: Partial<NotificationSettings>;
}> = ({ defaultValues }) => {
  const { error, update, reset } = useUpdateApi<NotificationSettings>();

  const handleUpdate = async (formData: Partial<NotificationSettings>) => {
    console.log("🚀 ~ submit ~ formData:", formData);
    // await update(API_UPDATE_SEEKER, { body });
  };
  return (
    <>
      <div className="rounded-base border border-gray-200 bg-white p-5 shadow-soft">
        <div>
          <h6 className="mb-1 text-xl font-semibold text-main">
            Basic Information
          </h6>
          <p className="text-muted-foreground">
            This is notifications preferences that you can update anytime
          </p>
        </div>
        <Divider className="my-6" />

        <div className="flex flex-col gap-4 md:flex-row">
          <div>
            <h6 className="text-xl font-semibold text-main">Notifications</h6>
            <p className="max-w-[300px] text-muted-foreground">
              Customize your preferred notifications settings
            </p>
          </div>
          <div>
            <FormGroup>
              <FormControlLabel
                control={<Switch color="primary" defaultChecked={defaultValues.reciveApplications} />}
                className="mb-4 flex max-w-[350px] items-start"
                onChange={(event, checked) => {
                  handleUpdate({ reciveApplications: checked });
                }}
                label={
                  <div>
                    <h6 className="text-xl font-semibold text-main">
                      Applications
                    </h6>
                    <p className="text-muted-foreground">
                      These are notifications for jobs that you have applied for
                    </p>
                  </div>
                }
              />
              <FormControlLabel
                control={<Switch color="primary" defaultChecked={defaultValues.reciveJobs} />}
                className="mb-4 flex max-w-[350px] items-start"
                onChange={(event, checked) => {
                  handleUpdate({ reciveJobs: checked });
                }}
                label={
                  <div>
                    <h6 className="text-xl font-semibold text-main">Jobs</h6>
                    <p className="text-muted-foreground">
                      These are notifications for job openings that suit your
                      profile
                    </p>
                  </div>
                }
              />
              <FormControlLabel
                control={<Switch color="primary"  defaultChecked={defaultValues.reciveRecommendations}  />}
                className="mb-4 flex max-w-[350px] items-start"
                onChange={(event, checked) => {
                  handleUpdate({ reciveRecommendations: checked });
                }}
                label={
                  <div>
                    <h6 className="text-xl font-semibold text-main">
                      Recommendations
                    </h6>
                    <p className="text-muted-foreground">
                      These are notifications for personalized recommendations
                      from our recruiters
                    </p>
                  </div>
                }
              />
            </FormGroup>
            <Button variant="contained" LinkComponent={Link} href="/job-seeker/setting/details" >Update Email</Button>
          </div>
        </div>
      </div>
    </>
  );
};

const NotificationsSettingsPage = () => {
  const { data: session, status } = useSession();
  const sessionUser = session?.user;
  const { data: user, loading } = useFetch<UserProfile>(
    sessionUser?.id ? API_GET_SEEKER_BY_ID + sessionUser.id : null,
    {
      defaultLoading: true,
    },
  );

  if (status === "loading" || loading)
    return (
      <div className="flex h-full min-h-[70vh] items-center justify-center">
        <CircularProgress />
        <h6 className="ml-4">Loading...</h6>
      </div>
    );
  if (status === "unauthenticated") return notFound();

  const defaultValues: Partial<NotificationSettings> = {
    reciveApplications: true,
    reciveJobs: false,
    reciveRecommendations: false,
  };

  return <NotificationsSettingsForm defaultValues={defaultValues} />;
};
export default NotificationsSettingsPage;
