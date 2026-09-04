import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || "";

// Establish connection to Stripe API pipeline with safe type casting
const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: "2024-06-20" as any,
});

/**
 * Custom type definition mapping authenticated user data
 * onto the Express request.
 */
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Stripe Checkout Session Initialization
 *
 * Security rules:
 * - User must be authenticated.
 * - Booking must exist.
 * - Only the booking customer can make the payment.
 * - Successfully paid bookings cannot be paid again.
 * - Pending payments can create a new Checkout session.
 */
export const createCheckoutSession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // --------------------------------------------------
    // 1. Authentication
    // --------------------------------------------------
    const userId = req.user?.id;

    if (!userId) {
      return sendError(
        res,
        "Authentication required. Missing user identity context parameters.",
        401
      );
    }

    // --------------------------------------------------
    // 2. Validate request body
    // --------------------------------------------------
    const { bookingId, currency = "usd" } = req.body;

    if (!bookingId) {
      return sendError(
        res,
        "Missing parameters. Target booking identity reference required.",
        400
      );
    }

    // --------------------------------------------------
    // 3. Find booking
    // --------------------------------------------------
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return sendError(
        res,
        "Booking reference trace not located within database schemas.",
        404
      );
    }

    // --------------------------------------------------
    // 4. Ownership validation
    // --------------------------------------------------
    if (booking.customerId !== userId) {
      return sendError(
        res,
        "Forbidden access. You do not hold ownership clearings to pay for this booking.",
        403
      );
    }

    // --------------------------------------------------
    // 5. Check existing payment
    // --------------------------------------------------
    const existingPayment = await prisma.payment.findUnique({
      where: {
        bookingId: booking.id,
      },
    });

    // --------------------------------------------------
    // 6. Prevent duplicate payment
    // --------------------------------------------------
    if (existingPayment?.status === "SUCCEEDED") {
      return sendError(
        res,
        "Payment has already been completed for this booking.",
        409
      );
    }

    // --------------------------------------------------
    // 7. Validate booking amount
    // --------------------------------------------------
    const unitAmount = Math.round(
      Number(booking.totalPrice) * 100
    );

    if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
      return sendError(
        res,
        "Invalid payment amount. Booking total must be greater than zero.",
        400
      );
    }

    // --------------------------------------------------
    // 8. Frontend URL
    // --------------------------------------------------
    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:3000";

    // --------------------------------------------------
    // 9. Create/update pending payment
    //
    // A SUCCEEDED payment is already blocked above.
    // Therefore this update cannot reset a completed payment.
    // --------------------------------------------------
    const payment = await prisma.payment.upsert({
      where: {
        bookingId: booking.id,
      },
      update: {
        amount: booking.totalPrice,
        status: "PENDING",
      },
      create: {
        bookingId: booking.id,
        gateway: "STRIPE",
        status: "PENDING",
        amount: booking.totalPrice,
      },
    });

    // --------------------------------------------------
    // 10. Create Stripe Checkout Session
    // --------------------------------------------------
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: String(currency).toLowerCase(),

            product_data: {
              name: `Kamdar Nepal Marketplace - Booking #${booking.id
                .slice(0, 8)
                .toUpperCase()}`,
            },

            unit_amount: unitAmount,
          },

          quantity: 1,
        },
      ],

      metadata: {
        bookingId: booking.id,
        paymentId: payment.id,
      },

      success_url: `${frontendUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${frontendUrl}/booking/cancel`,
    });

    // --------------------------------------------------
    // 11. Return Checkout Session
    // --------------------------------------------------
    return sendSuccess(
      res,
      "Stripe Checkout session token initialized successfully.",
      {
        sessionId: session.id,
        url: session.url,
      }
    );
  } catch (error) {
    console.error("Create Checkout Session Error:", error);

    return next(error);
  }
};

/**
 * Stripe Webhook Handler
 *
 * Verifies Stripe's signature and updates payment/booking
 * status after a successful Checkout session.
 */
export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // --------------------------------------------------
    // 1. Get Stripe webhook signature
    // --------------------------------------------------
    const signature = req.headers["stripe-signature"] as
      | string
      | undefined;

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return sendError(
        res,
        "Security breach: Missing signature or authorization tokens inside webhook header contexts.",
        400
      );
    }

    // --------------------------------------------------
    // 2. Verify Stripe webhook signature
    // --------------------------------------------------
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (error: any) {
      console.error(
        "Stripe webhook signature verification failed:",
        error.message
      );

      return sendError(
        res,
        `Cryptographic validation signature match failed: ${error.message}`,
        400
      );
    }

    // --------------------------------------------------
    // 3. Handle completed Checkout session
    // --------------------------------------------------
    if (event.type === "checkout.session.completed") {
      const session =
        event.data.object as Stripe.Checkout.Session;

      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        console.warn(
          "Stripe checkout.session.completed received without bookingId."
        );

        return res.status(200).json({
          received: true,
        });
      }

      // ------------------------------------------------
      // 4. Verify booking exists
      // ------------------------------------------------
      const booking = await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
      });

      if (!booking) {
        console.warn(
          `Stripe webhook received for unknown booking: ${bookingId}`
        );

        return res.status(200).json({
          received: true,
        });
      }

      // ------------------------------------------------
      // 5. Atomically update payment and booking
      // ------------------------------------------------
      await prisma.$transaction([
        prisma.payment.updateMany({
          where: {
            bookingId,
          },
          data: {
            status: "SUCCEEDED",
            transactionId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          },
        }),

        prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            status: "CONFIRMED",
          },
        }),
      ]);

      console.log(
        `Stripe payment successfully confirmed for booking ${bookingId}`
      );
    }

    // --------------------------------------------------
    // 6. Acknowledge webhook
    // --------------------------------------------------
    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe Webhook Error:", error);

    return next(error);
  }
};