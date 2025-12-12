"use client";
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { API_SEND_TOKEN_BY_EMAIL } from "@/api/users";

const ForgetForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const validateForm = () => {
    // Custom email validation can be added here if needed.
    if (!getValues("email")) {
      setError("Email is required");
      return false;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(getValues("email"))) {
      setError("Enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const onSubmit = async (data: { email: string }) => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch(
          API_SEND_TOKEN_BY_EMAIL + data.email.replace("@", "%40"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error(
            (response as any)?.message || `Update failed: ${response.status}`,
          );
        }
        router.push(`/auth/reset`);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message); // Safe now!
        } else {
          setError("Unknown error : Failed to send token");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full flex-col items-center justify-center"
    >
      <div className="w-full md:w-[400px]">
        <div className="mb-2">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Enter email address"
                label="Email Address"
                variant="outlined"
                id="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Enter a valid email address",
              },
            }}
          />
          {error && <p className="my-1 text-red-500">{error}</p>}
        </div>
        <Button
          variant="contained"
          className="h-[45px] w-full max-w-[400px] py-2 font-bold"
          disabled={loading}
          type="submit"
        >
          {loading ? "Loading..." : "Send"}
        </Button>
      </div>
    </form>
  );
};

export default ForgetForm;
