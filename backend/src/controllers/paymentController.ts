import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2024-06-20" as any });

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "Authentication required for checkout.", 401);
    }

    const { bookingId, currency = "usd" } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return sendError(res, "Booking not found.", 404);
    }

    if (booking.customerId !== userId) {
      return sendError(res, "Forbidden: You are not authorized to pay for this booking.", 403);
    }

    // Secure Pricing: Use actual price recorded in DB to prevent price tampering
    const unitAmount = Math.round(booking.totalPrice * 100);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: `Hamro Service - Booking #${booking.id.slice(0, 8)}` },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId: booking.id },
      success_url: `${frontendUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/booking/cancel`,
    });

    return sendSuccess(res, "Checkout session initialized.", {
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers["stripe-signature"] as string | undefined;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return sendError(res, "Missing Stripe webhook signature or webhook secret.", 400);
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error: any) {
      return sendError(res, `Webhook verification failed: ${error.message}`, 400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId as string | undefined;

      if (bookingId) {
        await prisma.$transaction([
          prisma.payment.updateMany({
            where: { bookingId },
            data: {
              status: "SUCCEEDED",
              transactionId: session.payment_intent as string,
            },
          }),
          prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
          }),
        ]);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};