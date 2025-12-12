import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  changePasswordWithOTP,
  authenticateUser,
  authenticateToken,
  resetPassword,
} from "./utils";

export const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    authorization: {
      params: {
        prompt: "select_account", // to force google to ask for account each time he tries login
      },
    },
  }),
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
  }),
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: authenticateUser,
  }),
  CredentialsProvider({
    id: "OTP-Credentials",
    name: "OTP Credentials",
    credentials: {
      email: { type: "email" },
      password: { type: "password" },
      otp: { type: "text" },
    },
    authorize: changePasswordWithOTP,
  }),
  CredentialsProvider({
    id: "validate-credentials",
    name: "validate credentials",
    credentials: {
      token: { type: "text" },
      email: { type: "email" },
      password: { type: "password" },
    },
    authorize: authenticateToken,
  }),
  CredentialsProvider({
    id: "reset-password",
    name: "reset password",
    credentials: {
      token: { type: "text" },
      newPassword: { type: "password" },
    },
    authorize: resetPassword,
  }),
];
