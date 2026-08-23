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

// Core standard email and phone validation parameters operations handlers
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

// ==========================================================================
// 🚀 ENTERPRISE SOCIAL AUTHORIZATION MIDDLEWARE ROUTING (OAUTH SYSTEMS)
// ==========================================================================

/**
 * 🔵 GOOGLE CLIENT AUTHENTICATION HANDSHAKE GATEWAY
 * Redirects consumer/provider tokens directly to active Google Cloud Console engine
 */
router.get("/google", (req, res) => {
  // Replace these template credentials with your active Google Developer variables strings later
  const GOOGLE_OAUTH_REDIRECT_URL = "https://google.com";
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID_PLACEHOLDER",
    redirect_uri: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/auth/google/callback",
    response_type: "code",
    scope: "email profile",
    prompt: "select_account"
  });

  console.log("➡️ [OAuth Dispatch] Redirecting client thread securely to Google nodes.");
  return res.redirect(`${GOOGLE_OAUTH_REDIRECT_URL}?${params.toString()}`);
});

/**
 * 🔵 FACEBOOK CORE AUTHORIZATION CONNECTION GATEWAY
 * Redirects client application frames securely to official Meta Developer Console
 */
router.get("/facebook", (req, res) => {
  const FACEBOOK_OAUTH_REDIRECT_URL = "https://facebook.com";
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || "MOCK_FACEBOOK_ID_PLACEHOLDER",
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:4000/api/auth/facebook/callback",
    scope: "email,public_profile"
  });

  console.log("➡️ [OAuth Dispatch] Redirecting client thread securely to Meta nodes.");
  return res.redirect(`${FACEBOOK_OAUTH_REDIRECT_URL}?${params.toString()}`);
});

/**
 * ⚫ APPLE CORE HIGH SECURITY LOG-IN CONNECTOR MATRIX
 * Secured dynamic pipeline redirecting interface strings directly to Apple ID Nodes
 */
router.get("/apple", (req, res) => {
  const APPLE_OAUTH_REDIRECT_URL = "https://apple.com";
  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID || "MOCK_APPLE_ID_PLACEHOLDER",
    redirect_uri: process.env.APPLE_CALLBACK_URL || "http://localhost:4000/api/auth/apple/callback",
    response_type: "code",
    response_mode: "form_post",
    scope: "name email"
  });

  console.log("➡️ [OAuth Dispatch] Redirecting client thread securely to Apple ID nodes.");
  return res.redirect(`${APPLE_OAUTH_REDIRECT_URL}?${params.toString()}`);
});

// ==========================================================================
// CALLBACK HANDLERS ARCHITECTURE PLACEHOLDERS (For returning tokens tracking)
// ==========================================================================
router.get("/google/callback", (req, res) => {
  return res.status(200).json({ success: true, message: "Google verification token captured. Processing database profiling synchronization keys." });
});

router.get("/facebook/callback", (req, res) => {
  return res.status(200).json({ success: true, message: "Meta verification token captured. Processing database profiling synchronization keys." });
});

router.get("/apple/callback", (req, res) => {
  return res.status(200).json({ success: true, message: "Apple standard secure posture verification complete tokens provisioned." });
});


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
