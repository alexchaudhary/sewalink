import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

const USER_SAFE_SELECT = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    avatarUrl: true,
  },
};

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "Authentication required to create a booking.", 401);
    }

    const { providerId, scheduledAt, type, totalPrice, location, notes, paymentMethod } = req.body;

    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return sendError(res, "Target service provider not found.", 404);
    }

    if (provider.userId === userId) {
      return sendError(res, "You cannot create a service booking for yourself.", 400);
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
      include: {
        provider: true,
        payment: true,
      },
    });

    return sendSuccess(res, "Booking created successfully.", { booking }, 201);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return sendError(res, "Unauthorized.", 401);
    }

    if (user.role === "CUSTOMER") {
      const bookings = await prisma.booking.findMany({
        where: { customerId: user.id },
        include: { provider: true, payment: true },
        orderBy: { createdAt: "desc" },
      });
      return sendSuccess(res, "Customer bookings retrieved.", { bookings });
    }

    if (user.role === "PROVIDER") {
      const provider = await prisma.providerProfile.findUnique({ where: { userId: user.id } });
      if (!provider) {
        return sendError(res, "Provider profile not found.", 404);
      }

      const bookings = await prisma.booking.findMany({
        where: { providerId: provider.id },
        include: { customer: USER_SAFE_SELECT, payment: true },
        orderBy: { createdAt: "desc" },
      });
      return sendSuccess(res, "Provider bookings retrieved.", { bookings });
    }

    const bookings = await prisma.booking.findMany({
      include: { customer: USER_SAFE_SELECT, provider: true, payment: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return sendSuccess(res, "All system bookings fetched.", { bookings });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;

    if (!user) {
      return sendError(res, "Unauthorized.", 401);
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return sendError(res, "Booking record not found.", 404);
    }

    if (user.role === "PROVIDER") {
      const provider = await prisma.providerProfile.findUnique({ where: { userId: user.id } });
      if (!provider || provider.id !== booking.providerId) {
        return sendError(res, "Forbidden: You are not authorized to update this booking.", 403);
      }
    } else if (user.role === "CUSTOMER" && booking.customerId !== user.id) {
      return sendError(res, "Forbidden: You do not own this booking.", 403);
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { payment: true },
    });

    return sendSuccess(res, `Booking status updated to ${status}.`, { booking: updated });
  } catch (error) {
    next(error);
  }
};