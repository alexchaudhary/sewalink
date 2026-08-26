import { Router } from "express";
import { getProviderList, getProviderById, updateProviderProfile } from "../controllers/providerController";
// Mapped the correct file name 'auth' here, which will immediately resolve the error
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * Enterprise Provider Management System Routes Index
 */

// 1. Public Discovery Routes (Marketplace listing pull)
router.get("/", getProviderList as any);
router.get("/:id", getProviderById as any);

// 2. Secured Resource Modifications Guard (Profile update pipeline)
router.put("/", authMiddleware as any, updateProviderProfile as any);

export default router;