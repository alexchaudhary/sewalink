import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body || {},
      query: req.query || {},
      params: req.params || {},
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues?.map((issue) => ({
        field: Array.isArray(issue.path) && issue.path.length > 0 ? issue.path.join(".") : "field",
        message: issue.message || "Invalid input",
      })) || [];

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: formattedErrors,
      });
    }
    return next(error);
  }
};