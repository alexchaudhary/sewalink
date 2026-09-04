import { Request, Response } from "express";
import { PrismaClient, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new booking
// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id;
    const { providerId, description, budget, city, date, profession } = req.body;

    // Validate required authentication and booking fields
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Customer authentication is required.",
      });
    }

    if (!providerId) {
      return res.status(400).json({
        success: false,
        message: "Provider is required.",
      });
    }

    // Validate provider profile exists
    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found.",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId,
        providerId,
        notes: description || "Service booking request",
        totalPrice: Number(budget) || 0,
        city: city || "Kathmandu",
        scheduledAt: date ? new Date(date) : new Date(),
        profession: profession || "General Service",
        status: BookingStatus.PENDING,
      },
    });

    return res.status(201).json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error("Booking creation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/bookings - Scoped to the logged-in user's role/ID
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    // Find if the user has an associated provider profile
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    const providerProfileId = providerProfile?.id;

    // Fetch bookings where user is either the customer or the provider profile
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          ...(providerProfileId ? [{ providerId: providerProfileId }] : []),
          { customerId: userId }
        ]
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          }
        },
        provider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Map Prisma models into a flat layout expected by the frontend UI
    const formattedBookings = bookings.map((b: any) => ({
      id: b.id,
      customerId: b.customerId,
      providerId: b.providerId,
      customerName: b.customer ? `${b.customer.firstName} ${b.customer.lastName}`.trim() : "Anonymous",
      customerPhone: b.customer?.phone || "N/A",
      description: b.notes,          // Mapped back from schema field 'notes'
      budget: b.totalPrice,          // Mapped back from schema field 'totalPrice'
      city: b.city,
      date: b.scheduledAt,           // Mapped back from schema field 'scheduledAt'
      profession: b.profession,
      status: b.status,
      createdAt: b.createdAt,
    }));

    return res.status(200).json({ success: true, bookings: formattedBookings });
  } catch (error: any) {
    console.error("Get bookings error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/bookings/:id/status - Update job status
// PUT /api/bookings/:id/status - Update job status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    const { id } = req.params;
    const { status } = req.body;

    // Only PROVIDER can update booking status
    if (!userId || userRole !== "PROVIDER") {
      return res.status(403).json({
        success: false,
        message: "Forbidden access. Only providers can update booking status.",
      });
    }

    // Find the logged-in provider's profile
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      return res.status(403).json({
        success: false,
        message: "Provider profile not found.",
      });
    }

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Make sure this provider owns the booking
    if (booking.providerId !== providerProfile.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access. You cannot update this booking.",
      });
    }

    const upperStatus = status?.toUpperCase();

    // Map UI statuses to Prisma Enum safely
    let mappedStatus: BookingStatus = BookingStatus.PENDING;

    if (upperStatus === "CONFIRMED" || upperStatus === "ACCEPTED") {
      mappedStatus = BookingStatus.CONFIRMED;
    } else if (upperStatus === "REJECTED" || upperStatus === "CANCELLED") {
      mappedStatus = BookingStatus.REJECTED;
    } else if (upperStatus === "COMPLETED") {
      mappedStatus = BookingStatus.COMPLETED;
    } else if (upperStatus === "IN_PROGRESS") {
      mappedStatus = BookingStatus.IN_PROGRESS;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: mappedStatus },
    });

    return res.status(200).json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
