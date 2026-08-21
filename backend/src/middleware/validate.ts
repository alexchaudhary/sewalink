import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Senior Production-Grade Global Request Validation Middleware
 * Safely executes asynchronous Zod schemas and synchronizes transformed outputs back to Express request streams.
 */
export const validate = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Run the Zod parse pipeline to catch and capture real-time transformed data payloads
    const parsedResult = await schema.parseAsync({
      body: req.body || {},
      query: req.query || {},
      params: req.params || {},
    });

    // 2. CRITICAL FIX: Explicitly write back transformed, validated data into the Express request context stream
    if (parsedResult.body) req.body = parsedResult.body;
    if (parsedResult.query) req.query = parsedResult.query;
    if (parsedResult.params) req.params = parsedResult.params;

    return next();
  } catch (error) {
    // Zero runtime server crash boundary handling
    if (error instanceof ZodError) {
      const formattedErrors = error.issues?.map((issue) => ({
        // Safely convert Zod path arrays into string paths (e.g., "query.minPrice")
        field: Array.isArray(issue.path) && issue.path.length > 0 ? issue.path.join(".") : "field",
        message: issue.message || "Invalid payload input constraints",
      })) || [];

      return res.status(400).json({
        success: false,
        message: "Data validation constraints breached.",
        errors: formattedErrors,
      });
    }
    
    return next(error);
  }
};
