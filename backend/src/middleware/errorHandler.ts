import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/apiResponse";

/**
 * Senior Production-Grade Centralized Global Error Handler Middleware
 * Intercepts unhandled controller errors and dispatches unified JSON responses via internal API utils.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Log the absolute failure trace directly to the development console matrix
  console.error("🔥 APP ERROR LOG:", err);

  // 2. Safely parse incoming status codes or default to standard server runtime faults
  const statusCode = typeof err?.statusCode === "number" ? err.statusCode : 500;

  // 3. Normalize internal error strings while hiding deep stack details during public deployment
  const isProduction = process.env.NODE_ENV === "production";
  const message = err?.message || "Internal Server Error";
  
  // 4. Extract attached dynamic array validations or validation dictionary sub-faults
  const errors = err?.errors || null;

  // 5. Append structural debugging traces only if running within localized testing nodes
  const metadata = isProduction ? errors : { errors, stack: err?.stack };

  // 6. Deliver the formalized response payload downstream using the central utility engine
  return sendError(
    res,
    message,
    statusCode,
    metadata
  );
};
