import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || "";
// Establish connection to Stripe API pipeline with safe type casting triggers
const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2024-06-20" as any });

/**
 * Custom type definition mapping your authenticated user data payloads onto request streams.
 */
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Senior Production-Grade Checkout Session Initialization Controller
 * Configures secure multi-currency Stripe checkout parameters based on immutable database booking bounds.
 */
export const createCheckoutSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "Authentication required. Missing user identity context parameters.", 401);
    }

    const { bookingId, currency = "usd" } = req.body;
    if (!bookingId) {
      return sendError(res, "Missing parameters. Target booking identity reference required.", 400);
    }

    // 1. Query target record metrics via secure unique database index lookups
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return sendError(res, "Booking reference trace not located within database schemas.", 404);
    }

    // 2. Strict ownership validation to prevent unauthorized crossing data mutations
    if (booking.customerId !== userId) {
      return sendError(res, "Forbidden access. You do not hold ownership clearings to pay for this booking.", 403);
    }

    // 3. CRITICAL SCHEMA ALIGNMENT FIX: Use booking.budget directly to prevent undefined value multiplication crashes
    const unitAmount = Math.round(booking.budget * 100);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // 4. Provision secure payment session parameters with Stripe infrastructure
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: `SewaLink Marketplace - Booking #${booking.id.slice(0, 8).toUpperCase()}` },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId: booking.id },
      success_url: `${frontendUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/booking/cancel`,
    });

    return sendSuccess(res, "Stripe Checkout session token initialized successfully.", {
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Senior Production-Grade Cryptographically Verified Stripe Webhook Event Listener
 * Intercepts incoming payment gateway callback vectors to perform transactional operations atomically.
 */
export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers["stripe-signature"] as string | undefined;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return sendError(res, "Security breach: Missing signature or authorization tokens inside webhook header contexts.", 400);
    }

    let event: Stripe.Event;
    try {
      // 1. Cryptographically verify that the payload origin string parameters belong strictly to Stripe
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error: any) {
      return sendError(res, `Cryptographic validation signature match failed: ${error.message}`, 400);
    }

    // 2. Intercept checkout session completion milestones to settle billing balances
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId as string | undefined;

      if (bookingId) {
        // 3. Execute atomic transaction sequences across dependent tables to ensure data integrity
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
    return next(error);
  }
};
