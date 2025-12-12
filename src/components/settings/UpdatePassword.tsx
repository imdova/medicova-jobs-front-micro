import { TAGS } from "@/api";
import { API_CHANGE_PASSWORD } from "@/api/users";
import { TextFieldComponent } from "@/components/form/FormModal/fields/TextFieldComponent";
import { passwordRules } from "@/constants";
import useUpdateApi from "@/hooks/useUpdateApi";
import { NotificationType } from "@/types";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import { User } from "next-auth";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type ResetPasswordFormData = {
  oldPassword: string;
  newPassword: string;
};

const UpdatePassword: React.FC<{ user?: User }> = ({ user }) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: { oldPassword: "", newPassword: "" },
  });
  const { isLoading, error, update } = useUpdateApi<ResetPasswordFormData>();
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );

  const handleUpdate = async (formData: ResetPasswordFormData) => {
    await update(
      API_CHANGE_PASSWORD,
      {
        method: "POST",
        body: { ...formData, id: user?.id },
      },
      user?.type === "employer" ? TAGS.company : TAGS.profile,
    );
    reset({ oldPassword: "", newPassword: "" });
    setNotification({
      message: "Password updated successfully",
      severity: "success",
    });
  };

  return (
    <>
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification(null)}
          severity={notification?.severity}
          sx={{ width: "100%" }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="mb-2 rounded-base border border-gray-200 bg-white p-4 shadow-soft"
      >
        <div className="p-4">
          <div className="flex flex-wrap items-start justify-start gap-6">
            {/* Left Section */}
            <div className="flex-1">
              <h6 className="mb-1 text-lg font-bold text-main">New Password</h6>
              <p className="mb-2 text-muted-foreground">
                Manage your password to make sure it is safe
              </p>
            </div>

            {/* Right Section */}
            <div className="min-[250px] flex flex-1 flex-col gap-3">
              {error && (
                <Alert severity="error" className="my-1 !w-full">
                  <p className="text-sm">{error?.message}</p>
                </Alert>
              )}
              <Controller
                control={control}
                name="oldPassword"
                render={({ field: controllerField, fieldState: { error } }) => (
                  <TextFieldComponent
                    field={{
                      name: "oldPassword",
                      label: "Old Password",
                      type: "password",
                    }}
                    controllerField={controllerField}
                    error={error}
                  />
                )}
                rules={passwordRules}
              />
              <Controller
                control={control}
                name="newPassword"
                render={({ field: controllerField, fieldState: { error } }) => (
                  <TextFieldComponent
                    field={{
                      name: "newPassword",
                      label: "New Password",
                      type: "password",
                    }}
                    controllerField={controllerField}
                    error={error}
                  />
                )}
                rules={passwordRules}
              />
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading || !isDirty || !isValid}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                className="w-fit"
              >
                {isLoading ? "Loading..." : "Change Password"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default UpdatePassword;
