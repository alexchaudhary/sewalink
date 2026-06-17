import express from "express";
import { Router } from "express";
import { createCheckoutSession, handleWebhook } from "../controllers/paymentController";

const router = Router();

router.post("/checkout", createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default router;
