import { Router } from "express";
import { register, login, forgotPassword, verifyOtp, getMe } from "../controllers/authController"; // Added getMe controller handler
import { validate } from "../middleware/validate";
import { protect } from "../middleware/authMiddleware"; // Ensure your token verification middleware is imported here
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
} from "../validations/authValidation";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

// CRITICAL FIX: Secure GET endpoint to resolve logged-in user profile details for frontend dashboards
router.get("/me", protect, getMe);

export default router;
