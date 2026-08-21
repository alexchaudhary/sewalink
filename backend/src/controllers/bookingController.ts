import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

/**
 * Custom type definition mirroring your authenticated user token payload structure.
 */
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Senior Production-Grade Booking Creation Controller
 * Enables authenticated consumers to dispatch structural service requests to target providers.
 */
export const createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.id;
    const { providerProfileId, title, description, scheduledDate, budget } = req.body;

    // 1. Defensively guard core application criteria requirements
    if (!customerId) {
      return sendError(res, "Authentication required. Missing user identity context.", 401);
    }
    if (!providerProfileId || !title || !description || !scheduledDate || !budget) {
      return sendError(res, "Missing parameters. Full booking constraints breached.", 400);
    }

    // 2. Verify that the target service provider profile actually exists in the database
    const providerExists = await prisma.providerProfile.findUnique({
      where: { id: providerProfileId },
    });
    if (!providerExists) {
      return sendError(res, "Target service professional profile record not found.", 404);
    }

    // 3. Create a fresh booking record inside the database with a default 'PENDING' status state
    const newBooking = await prisma.booking.create({
      data: {
        customerId,
        providerProfileId,
        title: title.trim(),
        description: description.trim(),
        scheduledDate: new Date(scheduledDate),
        budget: Number(budget),
        status: "PENDING",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Service request booking dispatched successfully.",
      data: { booking: newBooking },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Senior Production-Grade Booking Status Update Controller
 * Allows providers to update booking states (e.g., CONFIRMED, COMPLETED, REJECTED).
 */
export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id } = req.params;
    const { status } = req.body;

    if (!userId || !userRole) {
      return sendError(res, "Authentication required. Profile context missing.", 401);
    }
    if (!status) {
      return sendError(res, "Missing status parameter criteria block.", 400);
    }

    const normalizedStatus = status.toUpperCase();
    if (!["PENDING", "CONFIRMED", "COMPLETED", "REJECTED", "CANCELLED"].includes(normalizedStatus)) {
      return sendError(res, "Invalid state assignment. Booking status boundary not recognized.", 400);
    }

    // 1. Locate the existing booking entity along with its dependent structures
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: { providerProfile: true },
    });

    if (!existingBooking) {
      return sendError(res, "Target service booking log not found.", 404);
    }

    // 2. Strict Role Gating: Enforce business logic rules on who can alter specific statuses
    if (userRole === "PROVIDER") {
      if (existingBooking.providerProfile.userId !== userId) {
        return sendError(res, "Forbidden access. You do not own this service profile thread.", 403);
      }
    } else if (userRole === "CUSTOMER") {
      if (existingBooking.customerId !== userId) {
        return sendError(res, "Forbidden access. You do not own this customer profile thread.", 403);
      }
      if (!["CANCELLED"].includes(normalizedStatus)) {
        return sendError(res, "Forbidden action. Customers can only trigger CANCELLED status parameters.", 403);
      }
    }

    // 3. Execute the atomic update command
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: normalizedStatus },
    });

    return sendSuccess(res, "Booking track lifecycle status updated successfully.", { booking: updatedBooking });
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieve All Bookings Associated with the Authenticated User (Context-Aware)
 */
export const getUserBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return sendError(res, "Authentication required. Missing session tokens.", 401);
    }

    let queryConditions = {};

    // Context splitting based on multi-tenant roles
    if (userRole === "PROVIDER") {
      const providerProfile = await prisma.providerProfile.findUnique({ where: { userId } });
      if (!providerProfile) {
        return sendSuccess(res, "No active provider profile established yet.", { bookings: [] });
      }
      queryConditions = { providerProfileId: providerProfile.id };
    } else {
      queryConditions = { customerId: userId };
    }

    const bookingsList = await prisma.booking.findMany({
      where: queryConditions,
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        providerProfile: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, "User relational booking registers retrieved successfully.", { bookings: bookingsList });
  } catch (error) {
    return next(error);
  }
};
