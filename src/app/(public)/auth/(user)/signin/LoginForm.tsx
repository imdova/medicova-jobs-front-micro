"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { NextAuthProvider } from "@/NextAuthProvider";
import GoogleButton from "@/components/auth/googleButton";
import FacebookButton from "@/components/auth/facebookButton";
import { signIn } from "next-auth/react";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { deleteCookies } from "@/lib/cookies";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC<{ error?: string }> = ({ error: initialError }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await deleteCookies("user-error");
    try {
      const result = await signIn("credentials", {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : "An error occurred during sign in",
        );
      } else {
        if (typeof window !== "undefined") {
          window.location.replace("/me");
        }
      }
    } catch (error) {
      setError("Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[500px] flex-1 flex-col items-center justify-center p-4">
      <h4 className="my-2 text-3xl font-bold text-main">
        Welcome Back, in{" "}
        <span className="my-2 text-3xl font-bold text-secondary">
          Medicova
        </span>
      </h4>
      <div className="flex w-full flex-col justify-center gap-2 md:flex-row">
        <NextAuthProvider>
          <GoogleButton>Login with Google</GoogleButton>
          <FacebookButton>Login with Facebook</FacebookButton>
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
          Or login with email
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <form
        className="w-full space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Email Field */}
        <div>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email Address"
                variant="outlined"
                id="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </div>

        {/* Password Field */}
        <div>
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                type={showPassword ? "text" : "password"}
                fullWidth
                label="Password"
                variant="outlined"
                id="password"
                error={!!errors.password}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  ),
                }}
                helperText={errors.password?.message}
              />
            )}
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex w-full items-center justify-between">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    sx={{
                      "&.Mui-checked": {
                        color: "var(--primary)",
                      },
                    }}
                  />
                }
                label={<p className="text-muted-foreground">Remember me</p>}
              />
            )}
          />
          <Link
            href="/auth/forget"
            className="font-semibold text-muted-foreground hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        {error && <p className="my-1 text-red-500">{error}</p>}

        {/* Submit Button */}
        <Button
          className="mb-1 h-[42px] w-full text-lg font-semibold capitalize"
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </Button>

        {/* Sign Up Link */}
        <p className="mt-1 text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="inline text-lg font-semibold text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
