import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Creates a new booking linked directly to the valid ProviderProfile model.
 */
export const createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.id;
    const { providerId, providerProfileId, description, budget, date } = req.body;

    if (!customerId) {
      return sendError(res, "Authentication required. Missing user identity context.", 401);
    }

    const targetIdentifier = providerProfileId || providerId;

    if (!targetIdentifier || !description || !budget) {
      return sendError(res, "Missing parameters. Full booking constraints breached.", 400);
    }

    // 1. Resolve exact ProviderProfile instance
    let providerProfile = await prisma.providerProfile.findFirst({
      where: {
        OR: [
          { id: targetIdentifier },
          { userId: targetIdentifier }
        ]
      }
    });

    if (!providerProfile) {
      return sendError(res, "Target service professional profile record not found. Cannot create booking.", 404);
    }

    // 2. Connect using the exact ProviderProfile relation expected by Prisma Schema
    const newBooking = await prisma.booking.create({
      data: {
        customer: { connect: { id: customerId } },
        provider: { connect: { id: providerProfile.id } },
        type: "INSTANT" as any, 
        status: "PENDING" as any,
        scheduledAt: date ? new Date(date) : new Date(), 
        totalPrice: Number(budget), 
        location: providerProfile.city || "Kathmandu",
        notes: String(description).trim()
      },
    });

    return sendSuccess(res, "Service request booking dispatched successfully to provider network.", { booking: newBooking }, 201);
  } catch (error) {
    return next(error);
  }
};

/**
 * Updates booking status correctly checking provider ownership through ProviderProfile.
 */
export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role?.toUpperCase();
    const { id } = req.params;
    const { status } = req.body;

    if (!userId || !userRole) {
      return sendError(res, "Authentication required. Profile context missing.", 401);
    }
    if (!status) {
      return sendError(res, "Missing status parameter criteria block.", 400);
    }

    const normalizedStatus = status.toUpperCase();
    if (!["PENDING", "CONFIRMED", "ACCEPTED", "COMPLETED", "REJECTED", "CANCELLED"].includes(normalizedStatus)) {
      return sendError(res, "Invalid state assignment. Booking status boundary not recognized.", 400);
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: { provider: true },
    });

    if (!existingBooking) {
      return sendError(res, "Target service booking log not found.", 404);
    }

    if (userRole === "PROVIDER" || userRole === "WORKER") {
      const isOwner = 
        existingBooking.provider?.userId === userId || 
        existingBooking.provider?.id === userId;

      if (!isOwner) {
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

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: normalizedStatus as any },
    });

    return sendSuccess(res, "Booking track lifecycle status updated successfully.", { booking: updatedBooking });
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves User Bookings based on ProviderProfile or Customer ID.
 */
export const getUserBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role?.toUpperCase(); 

    if (!userId || !userRole) {
      return sendError(res, "Authentication required. Missing session tokens.", 401);
    }

    let queryConditions: any = {};

    if (userRole === "PROVIDER" || userRole === "WORKER") {
      const providerProfile = await prisma.providerProfile.findFirst({
        where: {
          OR: [
            { userId },
            { id: userId }
          ]
        }
      });

      if (!providerProfile) {
        return res.status(200).json({
          success: true,
          message: "No provider profile registered for this account.",
          bookings: [],
          data: { bookings: [] }
        });
      }

      queryConditions = { provider: { id: providerProfile.id } };
    } else {
      queryConditions = { customerId: userId };
    }

    const bookingsList = await prisma.booking.findMany({
      where: queryConditions,
      include: {
        customer: {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            email: true, 
            phone: true 
          },
        },
        provider: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedBookings = bookingsList.map((b: any) => {
      const notesText = b.notes || "Emergency service request dispatched.";
      const dateString = b.scheduledAt 
        ? new Date(b.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
        : "";

      const customerFullName = b.customer 
        ? `${b.customer.firstName || ""} ${b.customer.lastName || ""}`.trim() || "Client"
        : "Client";

      const providerUser = b.provider?.user;
      const providerFullName = providerUser 
        ? `${providerUser.firstName || ""} ${providerUser.lastName || ""}`.trim() || "Expert"
        : "Expert";

      return {
        id: b.id,
        providerName: providerFullName,
        customerName: customerFullName,
        customerPhone: b.customer?.phone || "N/A",
        customerEmail: b.customer?.email || "N/A",
        profession: b.type || "INSTANT",
        description: notesText,
        date: dateString,
        status: b.status,
        budget: b.totalPrice || 500,
        city: b.provider?.city || b.location || "Kathmandu",
        location: b.location || notesText
      };
    });

    return res.status(200).json({
      success: true,
      message: "User relational booking registers retrieved successfully.",
      bookings: formattedBookings,
      data: { bookings: formattedBookings }
    });
  } catch (error) {
    return next(error);
  }
};