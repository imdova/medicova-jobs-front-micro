import { isValidPhoneNumber } from "@/util/forms";
import { z } from "zod";

// Reusable schemas
export const nameSchema = z
  .string()
  .min(2, { message: "Must be at least 2 characters long" })
  .max(50, { message: "Must be less than 50 characters long" })
  .regex(/^[a-zA-Z\s]+$/, {
    message: "Should only contain letters and spaces",
  });

export const emailSchema = z
  .email({ message: "Invalid email address format" })
  .min(5, { message: "Email must be at least 5 characters long" })
  .max(100, { message: "Email must be less than 100 characters long" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(64, { message: "Password must be less than 64 characters long" })
  .regex(/^(?=.*[a-z])/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/^(?=.*[A-Z])/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/^(?=.*\d)/, {
    message: "Password must contain at least one number",
  })
  .regex(/^(?=.*[@$!%*?&])/, {
    message: "Password must contain at least one special character (@$!%*?&)",
  });

export const imageUrlSchema = z
  .url({ message: "Invalid url format" })
  .min(10, { message: "Url must be at least 10 characters long" })
  .max(255, { message: "Url must be less than 255 characters long" });

export const phoneSchema = z
  .string()
  .min(7, { message: "Phone number must be at least 7 digits long" })
  .max(15, { message: "Phone number must be less than 15 digits long" })
  .refine(isValidPhoneNumber, {
    message: "Invalid phone number format",
  });
