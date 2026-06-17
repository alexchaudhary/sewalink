import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../config/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test", { apiVersion: "2024-08-01" });

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { bookingId, amount, currency = "usd" } = req.body;
  if (!bookingId || !amount) {
    return res.status(400).json({ message: "bookingId and amount are required." });
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: "SewaLink booking payment" },
          unit_amount: Math.round(Number(amount) * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId },
    success_url: `${process.env.FRONTEND_URL}/booking/success`,
    cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
  });

  res.json({ sessionId: session.id, url: session.url });
};

export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return res.status(400).json({ message: "Missing Stripe webhook signature or webhook secret." });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    return res.status(400).json({ message: `Webhook verification failed: ${error.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId as string | undefined;
    if (bookingId) {
      await prisma.payment.updateMany({
        where: { bookingId },
        data: { status: "SUCCEEDED", transactionId: session.payment_intent as string },
      });
      await prisma.booking.update({ where: { id: bookingId }, data: { status: "CONFIRMED" } });
    }
  }

  res.status(200).json({ received: true });
};
