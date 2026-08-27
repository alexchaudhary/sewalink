import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
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

    if (city && city.trim() !== "") {
      conditions.push({
        OR: [
          { city: { contains: city.trim(), mode: "insensitive" } },
          { city: null },
          { city: "" }
        ]
      });
    }

    if (district && district.trim() !== "") {
      conditions.push({
        OR: [
          { district: { contains: district.trim(), mode: "insensitive" } },
          { district: null },
          { district: "" }
        ]
      });
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

    const total = await prisma.providerProfile.count({ where: whereClause });
    
    const providersList = await prisma.providerProfile.findMany({
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

    const formattedProviders = providersList.map((p: any) => {
      const finalName = p.displayName || 
                        (p.user ? `${p.user.firstName || "Expert"} ${p.user.lastName || ""}`.trim() : "Verified Specialist");
      
      const rawHeadline = p.headline || "Independent Maintenance Professional";
      
      return {
        id: p.id,
        displayName: finalName,
        headline: rawHeadline.toUpperCase().includes("SPECIALIST") ? rawHeadline : `${rawHeadline} Specialist`,
        hourlyRate: p.hourlyRate && p.hourlyRate > 0 ? p.hourlyRate : 650,
        rating: p.rating || 4.8,
        city: p.city || (city ? city.charAt(0).toUpperCase() + city.slice(1) : "Kathmandu"),
      };
    });

    return sendSuccess(res, "Providers fetched successfully.", {
      providers: formattedProviders,
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

    const { displayName, headline, bio, address, city, district, country, hourlyRate } = req.body;

    const updatedProfile = await prisma.providerProfile.upsert({
      where: { userId },
      update: {
        displayName,
        headline,
        bio,
        address,
        city,
        district,
        country,
        hourlyRate: hourlyRate !== undefined ? Number(hourlyRate) : undefined,
      },
      create: {
        userId,
        displayName: displayName || "Expert Worker",
        headline: headline || "Verified Specialist",
        bio: bio || "",
        address: address || "",
        city: city || "Kathmandu",
        district: district || "Nepal",
        country: country || "Nepal",
        hourlyRate: hourlyRate !== undefined ? Number(hourlyRate) : 150,
        rating: 4.8
      }
    });

    return sendSuccess(res, "Provider profile updated successfully.", { provider: updatedProfile });
  } catch (error) {
    return next(error);
  }
};

export const uploadProviderAvatar = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "Authentication context missing.", 401);
    }

    if (!req.file) {
      return sendError(res, "Missing payload parameters. No image file detected.", 400);
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "kamdarnepal",
      api_key: process.env.CLOUDINARY_API_KEY || "your_api_key",
      api_secret: process.env.CLOUDINARY_API_SECRET || "your_api_secret"
    });

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "kamdarnepal_avatars",
      resource_type: "image"
    });

    const updatedProfile = await prisma.providerProfile.update({
      where: { userId },
      data: { avatarUrl: uploadResponse.secure_url }
    });

    return sendSuccess(res, "Profile avatar asset uploaded and committed securely!", {
      avatarUrl: uploadResponse.secure_url,
      provider: updatedProfile
    });
  } catch (error) {
    return next(error);
  }
};