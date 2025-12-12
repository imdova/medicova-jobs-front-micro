"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { NextAuthProvider } from "@/NextAuthProvider";
import { useForm, Controller } from "react-hook-form";
import GoogleButton from "@/components/auth/googleButton";
import FacebookButton from "@/components/auth/facebookButton";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { registerData } from "@/types";
import { RoleState } from "@/types/next-auth";
import { passwordRules } from "@/constants";
import { API_REGISTER_USER } from "@/api/users";
import { useRouter } from "next/navigation";
import { RegisterCategory } from "@/constants/enums/register-category.enum";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<RoleState>("seeker");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {} as registerData,
  });

  const onSubmit = async (formData: registerData) => {
    setLoading(true);
    setError("");
    try {
      const body: registerData = {
        ...formData,
        type: userType,
        rolesIds: [],
        category:
          userType === "employer" ? RegisterCategory.COMPANY_ADMIN : undefined,
      };
      const response = await fetch(API_REGISTER_USER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
      router.push("/auth/verify-email");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error : Failed to Create Account");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "500px",
        width: "100%",
        mx: "auto",
        padding: 2,
      }}
    >
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setUserType("seeker")}
          className={`${userType === "seeker" ? "bg-primary/10 text-primary" : "text-gray-300"} rounded-md px-5 py-3 duration-200`}
        >
          Job Seeker
        </button>
        <button
          onClick={() => setUserType("employer")}
          className={`${userType === "employer" ? "bg-primary/10 text-primary" : "text-gray-300"} rounded-md px-5 py-3 duration-200`}
        >
          Employer
        </button>
      </div>

      <h4 className="my-2 text-[30px] font-bold text-main">
        Signup as a {userType === "seeker" ? "Job Seeker" : "Recruiter"} on{" "}
        <span className="my-2 text-[30px] font-bold text-secondary">
          Medicova
        </span>
      </h4>
      <div className="flex w-full justify-center gap-2">
        <NextAuthProvider>
          <GoogleButton userType={userType}>SignUp with Google</GoogleButton>
          {userType === "seeker" && (
            <FacebookButton>Sign Up with Facebook</FacebookButton>
          )}
        </NextAuthProvider>
      </div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          marginY: 2,
        }}
      >
        <Divider sx={{ flex: 1 }} />
        <Typography
          sx={{
            marginX: 2,
            fontWeight: "medium",
            color: "gray",
          }}
        >
          Or Registration with email
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <form
        className="w-full space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex gap-2">
          {/* First Name */}
          <div className="flex-1">
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Enter first name"
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  id="firstName"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
              rules={{
                required: "First name is required",
                minLength: {
                  value: 3,
                  message: "First name must be at least 3 characters",
                },
              }}
            />
          </div>
          {/* Last Name */}
          <div className="flex-1">
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Enter last name"
                  label="Last Name"
                  variant="outlined"
                  id="last-name"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
              rules={{
                required: "Last name is required",
                minLength: {
                  value: 3,
                  message: "Last name must be at least 3 characters",
                },
              }}
            />
          </div>
        </div>

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

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              fullWidth
              label="Password"
              variant="outlined"
              id="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? (
                      <VisibilityOffOutlined
                        sx={{ color: errors.password ? "red" : "gray" }}
                      />
                    ) : (
                      <VisibilityOutlined
                        sx={{ color: errors.password ? "red" : "gray" }}
                      />
                    )}
                  </IconButton>
                ),
              }}
            />
          )}
          rules={passwordRules}
        />
        <p className="text-sm text-red-500">{error}</p>
        <Button
          className="mb-1 h-[42px] w-full text-lg font-semibold capitalize"
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </Button>
        <p className="mt-1 text-muted-foreground">
          Aleardy on MEDICOVA ?{" "}
          <Link
            href="/auth/signin"
            className="inline text-lg font-semibold text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </Box>
  );
};

export default RegisterForm;
