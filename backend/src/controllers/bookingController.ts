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
 * Enables authenticated consumers to dispatch structural service requests to target providers.
 */
export const createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.id;
    
    // Frontend payload mapping layer: Accepting fields sent from providers.tsx
    const { providerId, providerProfileId, description, budget, date } = req.body;

    if (!customerId) {
      return sendError(res, "Authentication required. Missing user identity context.", 401);
    }

    // Resolve structural id context (Supporting both direct providerId and profile relational link)
    let targetProfileId = providerProfileId || providerId;

    // Defensively guard core application criteria requirements
    if (!targetProfileId || !description || !budget) {
      return sendError(res, "Missing parameters. Full booking constraints breached.", 400);
    }

    // Dynamic verification layer: Check if it's a raw User ID and resolve its profile
    let providerExists = await prisma.providerProfile.findUnique({
      where: { id: targetProfileId },
    });

    if (!providerExists) {
      // Look up via relational User ID if profile id wasn't matched directly
      providerExists = await prisma.providerProfile.findUnique({
        where: { userId: targetProfileId },
      });
    }

    if (!providerExists) {
      return sendError(res, "Target service professional profile record not found.", 404);
    }

    // Create a fresh booking record utilizing strict Prisma relational connect mapping structures matching your exact schema
    const newBooking = await prisma.booking.create({
      data: {
        customer: {
          connect: { id: customerId }
        },
        // Mapped exactly to 'provider' relation field name from your prisma schema
        provider: {
          connect: { id: providerExists.id }
        },
        // Senior Prisma Enum Fix: Utilizing the absolute matching 'INSTANT' token from your schema enum
        type: "INSTANT" as any, 
        status: "PENDING" as any,
        scheduledAt: date ? new Date(date) : new Date(), 
        totalPrice: Number(budget), 
        location: providerExists.city || "Lalitpur",
        notes: description.trim() // Mapping job summary safely into the optional notes field context
      },
    });

    return res.status(201).json({
      success: true,
      message: "Service request booking dispatched successfully to provider network.",
      data: { booking: newBooking },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Mutates lifecycle states for specified service booking nodes (Accept / Reject Pipeline).
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
    if (!["PENDING", "CONFIRMED", "ACCEPTED", "COMPLETED", "REJECTED", "CANCELLED"].includes(normalizedStatus)) {
      return sendError(res, "Invalid state assignment. Booking status boundary not recognized.", 400);
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: { providerProfile: true },
    });

    if (!existingBooking) {
      return sendError(res, "Target service booking log not found.", 404);
    }

    // Strict Role Gating: Enforce business logic rules on who can alter specific statuses
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
 * Retrieve All Bookings Associated with the Authenticated User (Context-Aware Multi-Tenant Query Hub)
 */
export const getUserBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return sendError(res, "Authentication required. Missing session tokens.", 401);
    }

    let queryConditions = {};

    // Context splitting based on multi-tenant roles mapping parameters
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

    // Remap dataset safely into unified payload structures for high fidelity UI grid cards matching frontend expectation
    const formattedBookings = bookingsList.map((b: any) => ({
      id: b.id,
      providerName: `${b.providerProfile?.user?.firstName || "Expert"} ${b.providerProfile?.user?.lastName || ""}`.trim(),
      customerName: `${b.customer?.firstName || "Client"} ${b.customer?.lastName || ""}`.trim(),
      profession: b.type || "INSTANT", // Aligned layout mapping token layer
      
      // Absolute Sync Fix: Binding directly to your real schema columns (notes and totalPrice) instead of missing fields context
      description: b.notes || "Emergency service request dispatched.", 
      status: b.status,
      budget: b.totalPrice || 500, 
      
      city: b.providerProfile?.city || b.location || "Nepal",
      location: (b.notes || "Local Node").substring(0, 20) + "..."
    }));

    return sendSuccess(res, "User relational booking registers retrieved successfully.", { bookings: formattedBookings });
  } catch (error) {
    return next(error);
  }
};
