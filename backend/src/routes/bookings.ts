import { Router } from "express";
import { createBooking, updateBookingStatus, getUserBookings } from "../controllers/bookingController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Secure all transaction routes with our verified corporate authMiddleware guard
router.use(authMiddleware as any);

/**
 * Enterprise Procurement Service Pipeline Routes Mapping Index
 * Handled via named exports from bookingController
 */
router.post("/", createBooking as any);
router.get("/", getUserBookings as any);
router.put("/:id/status", updateBookingStatus as any);

export default router;
