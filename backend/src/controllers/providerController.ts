import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getProviderList = async (req: Request, res: Response) => {
  const { q, city, district, minPrice, maxPrice, rating } = req.query;
  const filters: any = {
    AND: [],
  };

  if (city) {
    filters.AND.push({ city: { contains: String(city), mode: "insensitive" } });
  }

  if (district) {
    filters.AND.push({ district: { contains: String(district), mode: "insensitive" } });
  }

  if (rating) {
    const value = Number(rating);
    if (!Number.isNaN(value)) {
      filters.AND.push({ rating: { gte: value } });
    }
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

  const providers = await prisma.providerProfile.findMany({
    where: filters.AND.length ? filters : {},
    include: {
      user: true,
      skills: true,
      portfolioImages: true,
      categories: { include: { category: true } },
      serviceAreas: true,
    },
    orderBy: { rating: "desc" },
    take: 50,
  });

  res.json({ providers });
};

export const getProviderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: true,
      skills: true,
      portfolioImages: true,
      categories: { include: { category: true } },
      serviceAreas: true,
      bookings: true,
      reviews: true,
    },
  });

  if (!provider) {
    return res.status(404).json({ message: "Provider not found." });
  }

  res.json({ provider });
};

export const updateProviderProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const provider = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!provider) {
    return res.status(404).json({ message: "Provider profile not found." });
  }

  const { displayName, headline, bio, address, city, district, country, hourlyRate, skills, serviceAreas, portfolioImages } = req.body;

  const updateData: any = {
    displayName,
    headline,
    bio,
    address,
    city,
    district,
    country,
    hourlyRate: hourlyRate !== undefined ? Number(hourlyRate) : undefined,
  };

  const updated = await prisma.providerProfile.update({
    where: { id: provider.id },
    data: updateData,
  });

  if (Array.isArray(skills) && skills.length) {
    await prisma.providerSkill.deleteMany({ where: { providerId: provider.id } });
    await prisma.providerSkill.createMany({
      data: skills.map((skill: any) => ({
        providerId: provider.id,
        name: String(skill.name),
        experienceYears: Number(skill.experienceYears || 0),
        hourlyRate: Number(skill.hourlyRate || 0),
      })),
    });
  }

  if (Array.isArray(serviceAreas) && serviceAreas.length) {
    await prisma.serviceArea.deleteMany({ where: { providerId: provider.id } });
    await prisma.serviceArea.createMany({
      data: serviceAreas.map((area: any) => ({
        providerId: provider.id,
        district: String(area.district),
        city: String(area.city),
        radiusKm: Number(area.radiusKm || 10),
      })),
    });
  }

  if (Array.isArray(portfolioImages) && portfolioImages.length) {
    await prisma.portfolioImage.deleteMany({ where: { providerId: provider.id } });
    await prisma.portfolioImage.createMany({
      data: portfolioImages.map((image: any) => ({
        providerId: provider.id,
        url: String(image.url),
        label: image.label ? String(image.label) : undefined,
      })),
    });
  }

  res.json({ message: "Provider profile updated.", provider: updated });
};
