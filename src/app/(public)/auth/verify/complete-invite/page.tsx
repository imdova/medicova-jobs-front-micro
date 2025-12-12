"use client";

import { useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { passwordRules } from "@/constants";

export default function CompleteInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const validateForm = () => {
    // Custom validation logic
    const { password, confirmPassword } = getValues();
    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords must match");
      return false;
    }
    setError("");
    return true;
  };

  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    if (validateForm()) {
      setLoading(true);
      try {
        const result = await signIn("validate-credentials", {
          email,
          token,
          password: data.password,
          redirect: false,
        });
        if (result?.error) {
          setError("Failed to reset password");
        } else {
          if (typeof window !== "undefined") {
            window.location.replace("/me");
          }
        }
      } catch (error) {
        setError("Failed to Setup your profile");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!token) {
    return notFound();
  }

  return (
    <div>
      <div className="absolute inset-0 z-[-1] bg-[url('/images/background.png')] bg-cover bg-center opacity-20"></div>
      {/* Main Content */}
      <div className="m-auto flex h-screen flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center rounded-base border border-gray-50 bg-[#f8faff]/80 p-5 shadow-xl">
          {/* Lock Icon */}
          <Image
            src="/images/set-password.jpg"
            width={150}
            height={120}
            alt="set password"
            className="mt-5 object-contain mix-blend-multiply"
          />

          {/* Title */}
          <h4 className="mb-1 text-center text-3xl font-semibold text-main">
            Complete Your Invitation
          </h4>
          {/* Subtitle */}
          <p className="mb-4 text-center text-muted-foreground">
            Set your password to complete your account setup
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex w-full flex-col items-center justify-center p-4"
          >
            <div className="w-full space-y-2 md:w-[400px]">
              <FormField
                field={{
                  name: "password",
                  type: "password",
                  label: "Password",
                  textFieldProps: {
                    placeholder: "Enter password",
                  },
                  rules: passwordRules,
                }}
                control={control}
              />
              <FormField
                field={{
                  name: "confirmPassword",
                  type: "password",
                  label: "Confirm Password",
                  textFieldProps: {
                    placeholder: "Enter confirm password",
                  },
                  rules: passwordRules,
                }}
                control={control}
              />
              {/* Error message */}
              {error && <p className="my-1 text-red-500">{error}</p>}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Set Password"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
