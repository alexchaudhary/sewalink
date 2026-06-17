import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header." });
  }

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token." });
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden." });
    }
    next();
  };
};
