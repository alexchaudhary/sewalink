import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendError } from "../utils/apiResponse";

// ── Complete production schemas array declarations ────────────────────────────

export const getProvidersQuerySchema = z.object({
  query: z
    .object({
      q: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      minPrice: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
      maxPrice: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
      rating: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
      page: z.string().optional().transform((val) => (val ? Number(val) : 1)),
      limit: z.string().optional().transform((val) => (val ? Number(val) : 10)),
    })
    .optional(),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateProviderSchema = z.object({
  body: z.object({
    displayName: z.string().min(2, "Display name must be at least 2 characters").optional(),
    headline: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    country: z.string().optional(),
    hourlyRate: z.number().nonnegative("Hourly rate must be non-negative").optional(),
    skills: z
      .array(
        z.object({
          name: z.string(),
          experienceYears: z.number().optional(),
          hourlyRate: z.number().optional(),
        })
      )
      .optional(),
    serviceAreas: z
      .array(
        z.object({
          district: z.string(),
          city: z.string(),
          radiusKm: z.number().optional(),
        })
      )
      .optional(),
    portfolioImages: z
      .array(
        z.object({
          url: z.string().url("Invalid image URL"),
          label: z.string().optional(),
        })
      )
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// ── Dynamic Custom Validation Execution Handlers ──────────────────────────────

/**
 * Senior Level Secure Request Validation Interceptor
 * Parses query pipeline data schema through unified sandbox block to eliminate runtime 500 crashes
 */
export const validateProviderQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Zod runtime dictionary parser validation matrix execute
    const parsedData = getProvidersQuerySchema.parse({
      query: req.query || {},
      body: req.body || {},
      params: req.params || {},
    });

    // 2. Overwrite transformed dynamic properties back to request layer securely
    if (parsedData.query) {
      req.query = parsedData.query as any;
    }

    return next();
  } catch (error: any) {
    // Zero database crash parsing fallback sequence
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Query compilation validation failed.",
       errors: error.issues.map((e) => ({
      field: e.path.join("."),
  issue: e.message,
})),
      });
    }

    return sendError(res, `Unexpected Validation Runtime Fault: ${error?.message || "Internal failure"}`, 500);
  }
};
