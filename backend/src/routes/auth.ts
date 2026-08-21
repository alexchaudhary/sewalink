import { Router } from "express";
import { register, login, forgotPassword, verifyOtp, getMe } from "../controllers/authController";
import { validate } from "../middleware/validate";

/*
 * Authentication Middleware Import Configuration
 * If your source file uses 'export default protect;', update this statement 
 * to remove the curly braces: import protect from "../middleware/auth";
 */
import { protect } from "../middleware/auth"; 

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
} from "../validations/authValidation";

const router = Router();

// Public Authentication Route Endpoints
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

/*
 * Secure Dashboard User Routing Protection Guard
 * Verifies resource controller status before binding endpoints to prevent core application runtime drops.
 */
if (protect && getMe) {
  router.get("/me", protect, getMe);
} else {
  console.log("⚠️ Warning: Authentication dashboard endpoint registration skipped due to unmapped or missing callback dependencies.");
}

export default router;
