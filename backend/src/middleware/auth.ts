import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Authentication token required.", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, "Invalid or expired token.", 401);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, "Forbidden: Insufficient permissions.", 403);
    }
    next();
  };
};

export const authenticate = requireAuth;
export const authorize = requireRole;