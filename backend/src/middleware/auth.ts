import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse";

/**
 * Standard data shape embedded inside the JWT token signature.
 */
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Senior Production-Grade Authentication Guard Middleware.
 * Extracts, decodes, and verifies Bearer tokens from incoming HTTP request streams.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // 1. Extract the raw authorization signature from the header dictionary
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Access denied. Missing or malformed authorization token context.", 401);
  }

  // 2. Isolate the pure token signature from the Bearer token prefix
  const token = authHeader.split(" ")[1];
  if (!token) {
    return sendError(res, "Authentication failed. Token data extraction resulted in blank fields.", 401);
  }

  try {
    // 3. Authenticate and cryptographically verify the signature using secret key constraints
    const secretKey = process.env.JWT_SECRET || "fallback_secret";
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    
    // 4. Bind the validated data payload directly back to the active request pipeline context
    req.user = decoded;
    return next();
  } catch (error: any) {
    // 5. Gracefully catch explicit expiration parameters without leaking core stack boundaries
    if (error.name === "TokenExpiredError") {
      return sendError(res, "Authentication signature has expired. Please log in again.", 401);
    }
    return sendError(res, "Authentication mapping rejected. Invalid token payload signature.", 401);
  }
};

/**
 * Senior Multi-Tenant Role Verification Interceptor.
 * Implements strict role-gating layers across protected platform resources.
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Defensively protect against empty upstream token structures
    if (!req.user || !req.user.role) {
      return sendError(res, "Access authorization denied. Missing valid authentication profile context.", 403);
    }

    // 2. Evaluate if the validated profile contains the required clearance scopes
    if (!roles.includes(req.user.role)) {
      return sendError(res, `Forbidden access. Your assigned role profile lacks sufficient clearance parameters.`, 403);
    }

    return next();
  };
};

// ── Shared Compatibility Aliases ──────────────────────────────────────────────
export const authenticate = requireAuth;
export const authorize = requireRole;
