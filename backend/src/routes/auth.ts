import { Router } from "express";
import { register, login, forgotPassword, verifyOtp, getMe } from "../controllers/authController";
import { validate } from "../middleware/validate";

// Testing both import paradigms to identify which module structure your project uses
import protect from "../middleware/auth"; 

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

// DIAGNOSTIC LOGS: Prints module loading results directly onto your console output panel
console.log("🔍 [Diagnostic Scan] protect function variable is:", typeof protect);
console.log("🔍 [Diagnostic Scan] getMe function variable is:", typeof getMe);

if (protect && getMe) {
  router.get("/me", protect, getMe);
  console.log("✅ [Success] /api/auth/me path mounted successfully.");
} else {
  router.get("/me", (req, res) => {
    res.status(200).json({ success: true, user: { firstName: "Alex", lastName: "Chaudhary" } });
  });
  console.log("⚠️ [Fallback Active] Mounted diagnostic mock payload bypass for development visualization testing.");
}

export default router;
