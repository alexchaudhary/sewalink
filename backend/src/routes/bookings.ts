import { Router } from "express";
import { createBooking, getBookings, updateBookingStatus } from "../controllers/bookingController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createBookingSchema, updateBookingStatusSchema } from "../validations/bookingValidation";

const router = Router();

router.post("/", requireAuth, validate(createBookingSchema), createBooking);
router.get("/", requireAuth, getBookings);
router.patch("/:id/status", requireAuth, validate(updateBookingStatusSchema), updateBookingStatus);

export default router;