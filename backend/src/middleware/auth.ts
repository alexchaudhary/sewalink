import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Access denied. Missing or malformed authorization token context.", 401);
    }

    // Corrected the array index syntax for [1] here, 100% fixed
        // Corrected the array index syntax for [1] here, 100% fixed
    const token = authHeader.split(" ")[1];

    // Enterprise Fixed Secret Configuration - No .env dependencies allowed for fallback verification
    const fixedSecret = "kamdarnepal_clean_architecture_key_2026";

    const decoded = jwt.verify(token, fixedSecret) as { id: string; email: string; role: string };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch (error: any) {
    return sendError(res, "Authentication mapping rejected. Invalid token payload signature.", 401);
  }
};