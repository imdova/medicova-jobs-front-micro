"use client";

import PhoneNumberInput from "@/components/UI/phoneNumber";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";


interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: FormData) => {
    console.log(data);
    setSubmitted(true);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="flex gap-4">
          <TextField
            type="text"
            {...register("firstName", {
              required: "First name is required",
            })}
            fullWidth
            label="First Name"
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
            placeholder="First Name"
          />
          <TextField
            type="text"
            {...register("lastName", { required: "Last name is required" })}
            fullWidth
            label="Last Name"
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
            placeholder="Last Name"
          />
        </div>
        <div>
          <TextField
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            fullWidth
            label="Email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            placeholder="You@Company.com"
          />
        </div>
        <div>
          <PhoneNumberInput
            {...register("phone", {
              required: "Phone number is required",
            })}
            fullWidth
            type="tel"
            label="Phone Number"
            error={Boolean(errors.phone)}
            helperText={errors.phone?.message}
            placeholder="123456789"
          />
        </div>
        <div>
          <TextField
            type="text"
            fullWidth
            multiline
            sx={{
              "& .MuiOutlinedInput-root": {
                p: 0,
                borderRadius: "10px",
                height: "auto",
              },
            }}
            minRows={4}
            maxRows={14}
            {...register("message", { required: "Message is required" })}
            label="Message"
            error={Boolean(errors.message)}
            helperText={errors.message?.message}
            placeholder="Leave us a message..."
          />
        </div>
        <Button
          // loading={isSubmitting}
          type="submit"
          className="w-full h-[50]"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
