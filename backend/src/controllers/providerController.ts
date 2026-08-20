import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

// Common User Select Config to prevent Password Hashing Leaks
const USER_SAFE_SELECT = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    role: true,
    avatarUrl: true,
  },
};

export const getProviderList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, city, district, minPrice, maxPrice, rating, page = "1", limit = "10" } = req.query;

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(String(limit), 10) || 10));
    const skip = (pageNum - 1) * take;

    const filters: any = { AND: [] };

    if (city) {
      filters.AND.push({ city: { contains: String(city), mode: "insensitive" } });
    }

    if (district) {
      filters.AND.push({ district: { contains: String(district), mode: "insensitive" } });
    }

    if (rating) {
      const val = Number(rating);
      if (!Number.isNaN(val)) filters.AND.push({ rating: { gte: val } });
    }

    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || 999999;
      filters.AND.push({ hourlyRate: { gte: min, lte: max } });
    }

    if (q) {
      filters.AND.push({
        OR: [
          { displayName: { contains: String(q), mode: "insensitive" } },
          { headline: { contains: String(q), mode: "insensitive" } },
          { skills: { some: { name: { contains: String(q), mode: "insensitive" } } } },
          { categories: { some: { category: { name: { contains: String(q), mode: "insensitive" } } } } },
        ],
      });
    }

    const whereClause = filters.AND.length > 0 ? filters : {};

    const [total, providers] = await prisma.$transaction([
      prisma.providerProfile.count({ where: whereClause }),
      prisma.providerProfile.findMany({
        where: whereClause,
        include: {
          user: USER_SAFE_SELECT,
          skills: true,
          portfolioImages: true,
          categories: { include: { category: true } },
          serviceAreas: true,
        },
        orderBy: { rating: "desc" },
        take,
        skip,
      }),
    ]);

    return sendSuccess(res, "Providers fetched successfully.", {
      providers,
      pagination: {
        total,
        page: pageNum,
        limit: take,
        totalPages: Math.ceil(total / take),
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
        user: USER_SAFE_SELECT,
        skills: true,
        portfolioImages: true,
        categories: { include: { category: true } },
        serviceAreas: true,
        reviews: {
          include: {
            customer: USER_SAFE_SELECT,
          },
        },
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

export const updateProviderProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "Authentication required.", 401);
    }

    const provider = await prisma.providerProfile.findUnique({ where: { userId } });
    if (!provider) {
      return sendError(res, "Provider profile record not found.", 404);
    }

    const {
      displayName,
      headline,
      bio,
      address,
      city,
      district,
      country,
      hourlyRate,
      skills,
      serviceAreas,
      portfolioImages,
    } = req.body;

    // Atomic Database Transaction for Related Profile Operations
    const updatedProfile = await prisma.$transaction(async (tx) => {
      const updated = await tx.providerProfile.update({
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

      if (Array.isArray(skills)) {
        await tx.providerSkill.deleteMany({ where: { providerId: provider.id } });
        if (skills.length > 0) {
          await tx.providerSkill.createMany({
            data: skills.map((skill: any) => ({
              providerId: provider.id,
              name: String(skill.name),
              experienceYears: Number(skill.experienceYears || 0),
              hourlyRate: Number(skill.hourlyRate || 0),
            })),
          });
        }
      }

      if (Array.isArray(serviceAreas)) {
        await tx.serviceArea.deleteMany({ where: { providerId: provider.id } });
        if (serviceAreas.length > 0) {
          await tx.serviceArea.createMany({
            data: serviceAreas.map((area: any) => ({
              providerId: provider.id,
              district: String(area.district),
              city: String(area.city),
              radiusKm: Number(area.radiusKm || 10),
            })),
          });
        }
      }

      if (Array.isArray(portfolioImages)) {
        await tx.portfolioImage.deleteMany({ where: { providerId: provider.id } });
        if (portfolioImages.length > 0) {
          await tx.portfolioImage.createMany({
            data: portfolioImages.map((img: any) => ({
              providerId: provider.id,
              url: String(img.url),
              label: img.label ? String(img.label) : undefined,
            })),
          });
        }
      }

      return updated;
    });

    return sendSuccess(res, "Provider profile updated successfully.", { provider: updatedProfile });
  } catch (error) {
    next(error);
  }
};