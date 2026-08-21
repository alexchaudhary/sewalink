import { Router } from "express";
import { createBooking, updateBookingStatus, getUserBookings } from "../controllers/bookingController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Secure all booking infrastructure routes using the unified authentication guard
router.use(requireAuth);

router.post("/", createBooking);
router.get("/my-bookings", getUserBookings);
router.patch("/:id/status", updateBookingStatus);

export default router;
