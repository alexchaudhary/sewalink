import express, { Router } from "express";
import { createCheckoutSession, handleWebhook } from "../controllers/paymentController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { checkoutSessionSchema } from "../validations/paymentValidation";

const router = Router();

router.post(
  "/checkout",
  requireAuth,
  validate(checkoutSessionSchema),
  createCheckoutSession
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;