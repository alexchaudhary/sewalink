import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createBooking = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required to create a booking." });
  }

  const { providerId, scheduledAt, type, totalPrice, location, notes, paymentMethod } = req.body;
  if (!providerId || !location || !totalPrice) {
    return res.status(400).json({ message: "providerId, location, and totalPrice are required." });
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: userId,
      providerId,
      type: type || "SCHEDULED",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      totalPrice: Number(totalPrice),
      location,
      notes,
      payment: paymentMethod
        ? {
            create: {
              gateway: paymentMethod,
              status: "PENDING",
              amount: Number(totalPrice),
            },
          }
        : undefined,
    },
  });

  res.status(201).json({ booking });
};

export const getBookings = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (user.role === "CUSTOMER") {
    const bookings = await prisma.booking.findMany({
      where: { customerId: user.id },
      include: { provider: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ bookings });
  }

  if (user.role === "PROVIDER") {
    const provider = await prisma.providerProfile.findUnique({ where: { userId: user.id } });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found." });
    }
    const bookings = await prisma.booking.findMany({
      where: { providerId: provider.id },
      include: { customer: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ bookings });
  }

  const bookings = await prisma.booking.findMany({
    include: { customer: true, provider: true, payment: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return res.json({ bookings });
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const { status } = req.body;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (user.role === "PROVIDER") {
    const provider = await prisma.providerProfile.findUnique({ where: { userId: user.id } });
    if (!provider || provider.id !== booking.providerId) {
      return res.status(403).json({ message: "Forbidden." });
    }
  }

  const updated = await prisma.booking.update({ where: { id }, data: { status } });
  res.json({ booking: updated });
};
