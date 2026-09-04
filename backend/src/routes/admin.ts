import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth";
import { sendSuccess, sendError } from "../utils/apiResponse";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();

// Secure all admin ecosystem endpoints with unified authMiddleware guard
router.use(authMiddleware as any);

// Senior Role Gating Layer: Explicitly block anyone who isn't a verified ADMIN
const verifyAdminRole = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return sendError(res, "Forbidden access. Administrative clearance required.", 403);
  }
  return next();
};

/**
 * Enterprise Administration Network Control Center Index
 */
router.get("/metrics", verifyAdminRole as any, (req: Request, res: Response) => {
  return sendSuccess(res, "Administrative ecosystem metrics synchronized successfully.", {
    activeConnections: 1,
    gatewayStatus: "HEALTHY"
  });
});

export default router;
