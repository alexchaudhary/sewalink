import { z } from "zod";

export const updateProviderSchema = z.object({
  body: z.object({
    displayName: z.string().min(2, "Display name must be at least 2 characters").optional(),
    headline: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    country: z.string().optional(),
    hourlyRate: z.number().min(0, "Hourly rate cannot be negative").optional(),
    skills: z.array(
      z.object({
        name: z.string().min(1, "Skill name required"),
        experienceYears: z.number().default(0),
        hourlyRate: z.number().default(0),
      })
    ).optional(),
    serviceAreas: z.array(
      z.object({
        district: z.string(),
        city: z.string(),
        radiusKm: z.number().default(10),
      })
    ).optional(),
    portfolioImages: z.array(
      z.object({
        url: z.string().url("Invalid image URL"),
        label: z.string().optional(),
      })
    ).optional(),
  }),
});

export const getProvidersQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    rating: z.string().optional(),
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
  }),
});