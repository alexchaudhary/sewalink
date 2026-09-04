import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createCheckoutSession,
  handleWebhook,
} from "../controllers/paymentController";

const router = Router();

// Stripe webhook does NOT use JWT authentication
router.post("/webhook", handleWebhook as any);

// Customer payment requires authentication
router.post(
  "/process",
  authMiddleware as any,
  createCheckoutSession as any
);

export default router;