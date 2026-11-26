import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    phone: z.string().min(7, "Valid phone number is required"),
    role: z
      .enum(["CUSTOMER", "PROVIDER", "WORKER"])
      .optional()
      .default("CUSTOMER"),
    skill: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email address").optional(),
      phone: z.string().optional(),
      password: z.string().min(1, "Password is required"),
    })
    .refine((data) => data.email || data.phone, {
      message: "Either email or phone number must be provided",
      path: ["email"],
    }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
});

export const sendOtpSchema = z.object({
  body: z.object({
    phone: z.string().min(7, "Valid phone number is required"),
  }),
});

export const verifyOtpSchema = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email address").optional(),
      phone: z.string().min(7, "Valid phone number is required").optional(),
      otp: z.string().length(6, "OTP code must be exactly 6 digits"),
    })
    .refine((data) => data.email || data.phone, {
      message: "Either email or phone number must be provided",
      path: ["phone"],
    }),
});