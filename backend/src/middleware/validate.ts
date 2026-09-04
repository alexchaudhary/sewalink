import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Global request validation middleware.
 *
 * Supports validation/transformation of:
 * - body
 * - query
 * - params
 *
 * Compatible with Zod 4.
 */
export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = {
        body: req.body || {},
        query: req.query || {},
        params: req.params || {},
      };

      // ZodSchema's default output type can be unknown in Zod 4,
      // so explicitly describe the structure expected by this middleware.
      const parsedResult = (await schema.parseAsync(input)) as {
        body?: Request["body"];
        query?: Request["query"];
        params?: Request["params"];
      };

      // Write validated/transformed values back to Express.
      if (parsedResult.body !== undefined) {
        req.body = parsedResult.body;
      }

      if (parsedResult.query !== undefined) {
        req.query = parsedResult.query;
      }

      if (parsedResult.params !== undefined) {
        req.params = parsedResult.params;
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field:
            Array.isArray(issue.path) && issue.path.length > 0
              ? issue.path.join(".")
              : "field",
          message: issue.message || "Invalid input",
        }));

        return res.status(400).json({
          success: false,
          message: "Data validation constraints breached.",
          errors: formattedErrors,
        });
      }

      return next(error);
    }
  };