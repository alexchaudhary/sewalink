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

    const token = authHeader.split(" ")[1];

    // Use environment variable secret with fallback to maintain code safety
    const jwtSecret = process.env.JWT_SECRET || "kamdarnepal_clean_architecture_key_2026";
    const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string; role: string };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch (error: any) {
    // 🔥 LOG THE REAL ERROR TO THE TERMINAL SO WE CAN SEE WHAT'S WRONG
    console.error("JWT Verification Error:", error.message); 
    
    return sendError(res, "Authentication mapping rejected. Invalid token payload signature.", 401);
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        "Forbidden access. Required role not granted.",
        403
      );
    }

    return next();
  };
};