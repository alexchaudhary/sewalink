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

export const getProviderList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q ? String(req.query.q) : undefined;
    const city = req.query.city ? String(req.query.city) : undefined;
    const district = req.query.district ? String(req.query.district) : undefined;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const rating = req.query.rating ? Number(req.query.rating) : undefined;

    const pageNum = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "10"), 10) || 10));
    const skip = (pageNum - 1) * take;

    const conditions: any[] = [];

    if (city) {
      conditions.push({ city: { contains: city, mode: "insensitive" } });
    }

    if (district) {
      conditions.push({ district: { contains: district, mode: "insensitive" } });
    }

    if (rating !== undefined && !Number.isNaN(rating)) {
      conditions.push({ rating: { gte: rating } });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      conditions.push({
        hourlyRate: {
          gte: minPrice ?? 0,
          lte: maxPrice ?? 999999,
        },
      });
    }

    if (q) {
      conditions.push({
        OR: [
          { displayName: { contains: q, mode: "insensitive" } },
          { headline: { contains: q, mode: "insensitive" } },
        ],
      });
    }

    const whereClause = conditions.length > 0 ? { AND: conditions } : {};

    // 1. Decoupled Count Query to guard transaction speed boundaries
    const total = await prisma.providerProfile.count({ where: whereClause });
    
    // 2. Fetch matched datasets matching absolute Prisma schemas
    const providers = await prisma.providerProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            // CRITICAL FIX: Non-existent avatarUrl field removed to prevent client select exceptions
          },
        },
        skills: true,
        portfolioImages: true,
        categories: { 
          include: { 
            category: true 
          } 
        },
        serviceAreas: true,
      },
      orderBy: { rating: "desc" },
      take,
      skip,
    });

    return sendSuccess(res, "Providers fetched successfully.", {
      providers,
      pagination: {
        total,
        page: pageNum,
        limit: take,
        totalPages: Math.ceil(total / take) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const provider = await prisma.providerProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            // CRITICAL FIX: Non-existent avatarUrl field removed to prevent single lookup exceptions
          },
        },
        skills: true,
        portfolioImages: true,
        categories: { include: { category: true } },
        serviceAreas: true,
      },
    });

    if (!provider) {
      return sendError(res, "Provider profile not found.", 404);
    }

    return sendSuccess(res, "Provider details retrieved.", { provider });
  } catch (error) {
    next(error);
  }
};

export const updateProviderProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "Authentication required.", 401);
    }

    const provider = await prisma.providerProfile.findUnique({ where: { userId } });
    if (!provider) {
      return sendError(res, "Provider profile record not found.", 404);
    }

    const { displayName, headline, bio, address, city, district, country, hourlyRate } = req.body;

    const updatedProfile = await prisma.providerProfile.update({
      where: { id: provider.id },
      data: {
        displayName,
        headline,
        bio,
        address,
        city,
        district,
        country,
        hourlyRate: hourlyRate !== undefined ? Number(hourlyRate) : undefined,
      },
    });

    return sendSuccess(res, "Provider profile updated successfully.", { provider: updatedProfile });
  } catch (error) {
    next(error);
  }
};
