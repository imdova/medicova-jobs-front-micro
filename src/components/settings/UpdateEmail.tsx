import { TAGS } from "@/api";
import useUpdateApi from "@/hooks/useUpdateApi";
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import VerifyToken from "../UI/verifyToken";
import FormModal from "../form/FormModal/FormModal";
import { User } from "next-auth";
import { API_REQUEST_MAIL_CHANGE_COMPANY } from "@/api/employer";
import { API_REQUEST_CHANGE_EMAIL } from "@/api/users";

interface UpdateEmailProps {
  user?: User;
  isCompany?: boolean;
}

const UpdateEmail: React.FC<UpdateEmailProps> = ({
  user,
  isCompany = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const openVerify = () => setIsOpen(true);
  const closeVerify = () => setIsOpen(false);
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      // TODO Look closely here
      newMail: user?.email,
    },
  });

  const { isLoading, error, update } = useUpdateApi<User>();

  const handleUpdate = async (data: { newMail?: string | null }) => {
    if (!user?.id && !user?.companyId) return;

    const apiEndpoint = isCompany
      ? API_REQUEST_MAIL_CHANGE_COMPANY
      : API_REQUEST_CHANGE_EMAIL;
    const tag = isCompany ? TAGS.company : TAGS.profile;
    const id = isCompany ? user?.companyId : user?.id;

    await update(
      apiEndpoint,
      {
        method: "POST",
        body: { ...data, id },
      },
      tag,
    );

    if (data.newMail) {
      openVerify();
    }
  };

  return (
    <>
      <FormModal
        open={isOpen}
        onClose={closeVerify}
        onSubmit={closeVerify}
        submitButtonText={"Ok"}
        cancelButtonText={"Close"}
      >
        <div className="flex w-full items-center justify-center">
          <VerifyToken
            title="Verification sent"
            description="We have sent a verification link to your email. Please check your email and click on the link to verify your email."
            className="space-y-3 border-none px-4 pb-6 pt-0 shadow-none"
          />
        </div>
      </FormModal>

      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="mb-2 rounded-base border border-gray-200 bg-white p-4 shadow-soft"
      >
        <div className="p-4">
          <h6 className="mb-1 text-xl font-bold text-main">
            {isCompany ? "Company Contact Information" : "Basic Information"}
          </h6>
          <p className="mb-2 text-muted-foreground">
            This is {isCompany ? "company contact" : "login"} information that
            you can update anytime.
          </p>
        </div>
        <Divider sx={{ my: 2, width: "90%", mx: "auto" }} />
        <div className="p-4">
          <div className="flex flex-wrap items-start justify-start gap-6">
            {/* Left Section */}
            <div className="flex-1">
              <h6 className="mb-1 text-lg font-bold text-main">Update Email</h6>
              <p className="mb-2 text-muted-foreground">
                Update your {isCompany ? "company" : ""} email address to make
                sure it is safe
              </p>
            </div>

            {/* Right Section */}
            <div className="min-[250px] flex flex-1 flex-col">
              {error && (
                <Alert severity="error" className="my-1 !w-full">
                  <p className="text-sm">{error?.message}</p>
                </Alert>
              )}
              <Controller
                name="newMail"
                control={control}
                rules={{
                  required: "Your Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Enter a valid email address",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    className="w-full"
                    type="email"
                    placeholder="Enter your email address"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isLoading || !isDirty || !isValid}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  {isLoading ? "Updating..." : "Update Email"}
                </Button>
                {isDirty && <Button onClick={() => reset()}>Reset</Button>}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UpdateEmail;
