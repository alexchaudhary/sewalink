import { z } from "zod";

export const checkoutSessionSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
    currency: z.string().optional().default("usd"),
  }),
});