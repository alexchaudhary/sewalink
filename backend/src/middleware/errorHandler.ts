import { Request, Response, NextFunction } from "express";

import { sendError } from "../utils/apiResponse";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 APP ERROR LOG:", err);

  const statusCode =
    typeof err?.statusCode === "number"
      ? err.statusCode
      : 500;

  const message =
    err?.message || "Internal Server Error";

  const errors =
    err?.errors || null;

  return sendError(
    res,
    message,
    statusCode,
    errors
  );
};