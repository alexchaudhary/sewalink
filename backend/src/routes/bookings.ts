import { Router } from "express";
import { createBooking, getBookings, updateBookingStatus } from "../controllers/bookingController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, createBooking);
router.get("/", requireAuth, getBookings);
router.patch("/:id/status", requireAuth, updateBookingStatus);

export default router;
