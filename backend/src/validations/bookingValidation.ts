import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    providerId: z.string().min(1, "Provider ID is required"),
    scheduledAt: z.string().optional(),
    type: z.enum(["INSTANT", "SCHEDULED"]).optional().default("SCHEDULED"),
    totalPrice: z.number().positive("Total price must be a positive number"),
    location: z.string().min(3, "Location details are required"),
    notes: z.string().optional(),
    paymentMethod: z.enum(["KHALTI", "CASH", "ESEWA"]).optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  }),
});