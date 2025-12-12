"use client";

import React, { useState } from "react";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { passwordRules } from "@/constants";

const SetForm: React.FC<{ token: string }> = ({ token }) => {
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
        const result = await signIn("reset-password", {
          token,
          newPassword: data.password,
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
        setError("Failed to reset password");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
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
            {loading ? "Loading..." : "Set New Password"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SetForm;
